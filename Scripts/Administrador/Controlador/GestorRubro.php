<?php
// Scripts/Administrador/Controlador/GestorRubro.php

require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Modelo/Repositorio/RubroRepositorio.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Modelo/Repositorio/ArticuloRepositorio.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Modelo/Repositorio/ProveedorRepositorio.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Modelo/Repositorio/MarcaRepositorio.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Incluye/Config.php';

class GestorRubro
{
  private PDO $pdo;
  private rubroRepositorio $rubroRepositorio;
  private articuloRepositorio $articuloRepositorio;
  private proveedorRepositorio $proveedorRepositorio;
  private marcaRepositorio $marcaRepositorio;

  public function __construct(PDO $pdo)
  {
    $this->pdo = $pdo;
    $this->rubroRepositorio = new RubroRepositorio($pdo);
    $this->articuloRepositorio = new ArticuloRepositorio($pdo);
    $this->proveedorRepositorio = new ProveedorRepositorio($pdo);
    $this->marcaRepositorio = new MarcaRepositorio($pdo);
  }

  public function derivarURL(string $porcionURL): void
  {
    header('Content-Type: application/json');
    $url_segmentada = explode('/', $porcionURL);
    $primer_segmento = $url_segmentada[0]; //mostrar || modificar || crear

    switch (strtolower($primer_segmento)) {

      case 'mostrar':

        switch (strtolower($url_segmentada[1] ?? '')) {

          case '':
            $this->mostrarTodos();
            break;

          case 'para-cliente':
            $this->mostrarParaCliente();
            break;
        }
        break;

      case 'modificar':
        $this->modificar();
        break;

      case 'subir-logo':
        $this->subirLogo();
        break;

      case 'setear-en-0':
        $this->setearEn0();
        break;

      case 'eliminar-no-utilizados':
        $this->eliminarNoUtilizados();
        break;

      default:
        http_response_code(404);
        echo json_encode(['error' => 'Acción no encontrada para Rubro.']);
        break;
    }
  }


  private function mostrarTodos(): void
  {
    $datos = json_decode(file_get_contents('php://input'), true);
    $id_empresa = $datos['id_empresa'] ?? 0;

    // === CACHE EN ARCHIVO ===
    $cacheFile = $_SERVER['DOCUMENT_ROOT'] . "/Scripts/Cache/rubros_empresa_{$id_empresa}.json";

    if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < CACHE_TIME) {
      http_response_code(200);
      echo file_get_contents($cacheFile);
      return;
    }

    try {
      $listaRubros = $this->rubroRepositorio->obtenerTodos($id_empresa);

      $json = json_encode($listaRubros);
      file_put_contents($cacheFile, $json); // Guarda cache

      http_response_code(200);
      echo $json;
    } catch (Exception $e) {
      http_response_code(500);
      echo json_encode(['error' => 'Error al mostrar los rubros entre los valores recibidos' . $e->getMessage()]);
    }
  }

  private function mostrarParaCliente(): void
  {
    $datos = json_decode(file_get_contents('php://input'), true);

    $id_empresa = (int)($datos['id_empresa'] ?? 0);

    if ($id_empresa <= 0) {
      http_response_code(400);
      echo json_encode([
        'error' => 'Falta id_empresa para mostrar los datos.'
      ]);
      return;
    }

    $cacheDir = $_SERVER['DOCUMENT_ROOT'] . "/Scripts/Cache";

    if (!is_dir($cacheDir)) {
      mkdir($cacheDir, 0777, true);
    }

    $cacheFile = "{$cacheDir}/catalogos_empresa_{$id_empresa}_cliente.json";

    // Cache válido
    if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < CACHE_TIME) {
      http_response_code(200);
      readfile($cacheFile);
      return;
    }

    try {

      $listas = [
        'rubros'       => $this->rubroRepositorio->obtenerPorEmpresa($id_empresa),
        'marcas'       => $this->marcaRepositorio->obtenerPorEmpresa($id_empresa),
        'proveedores'  => $this->proveedorRepositorio->obtenerPorEmpresa($id_empresa)
      ];

      $json = json_encode(
        $listas,
        JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR
      );

      file_put_contents($cacheFile, $json, LOCK_EX);

      http_response_code(200);
      echo $json;
    } catch (Throwable $e) {

      http_response_code(500);
      echo json_encode([
        'error' => 'Error al mostrar los catálogos.',
        'detalle' => $e->getMessage()
      ]);
    }
  }

  public function cargarLista(array $lista, int $id_empresa): bool
  {
    if (empty($lista)) return true;

    try {
      $this->rubroRepositorio->crearListaCsv($lista, $id_empresa);

      if ($id_empresa) {
        $this->borrarCacheTodos($id_empresa);
      }

      return true;
    } catch (Exception $e) {
      // Lanzamos la excepción para que la capture el gestorArticulo principal
      throw $e;
    }
  }

  public function actualizarCatalogo(array $rubros, int $id_empresa): bool
  {
    if (empty($rubros)) {
      return true;
    }

    $tamLote = 2000;

    foreach (array_chunk($rubros, $tamLote) as $lote) {
      $this->rubroRepositorio->actualizarCatalogo(
        $lote,
        $id_empresa
      );
    }

    return true;
  }

  private function borrarCacheTodos(int $id_empresa): bool
  {
    $cacheDir = $_SERVER['DOCUMENT_ROOT'] . "/Scripts/Cache/";
    $cacheFileCliente = $cacheDir . "catalogos_empresa_{$id_empresa}_cliente.json";
    if (file_exists($cacheFileCliente)) {
      unlink($cacheFileCliente);
    }
    $cacheFile = $cacheDir . "catalogos_empresa_{$id_empresa}.json";

    if (!file_exists($cacheFile)) {
      return false;
    }

    return unlink($cacheFile);
  }

  private function setearEn0(): void
  {
    $input = json_decode(file_get_contents('php://input'), true);
    $id_empresa = (int)$input['id_empresa'];
    try {
      // Llama al repositorio para crear el rubro, pasando el id_empresa extraído
      $this->rubroRepositorio->setearCSVEn0($id_empresa);
      $this->articuloRepositorio->setearCSVEn0($id_empresa);
      $this->proveedorRepositorio->setearCSVEn0($id_empresa);
      $this->marcaRepositorio->setearCSVEn0($id_empresa);
    } catch (Exception $e) {
      error_log("Hubo un error en setearEn0()");
    }
  }

  private function eliminarNoUtilizados(): void
  {
    $input = json_decode(file_get_contents('php://input'), true);
    $id_empresa = (int)$input['id_empresa'];
    try {
      // Llama al repositorio para crear el rubro, pasando el id_empresa extraído
      $this->articuloRepositorio->eliminarNoUtilizados($id_empresa);
      $this->rubroRepositorio->eliminarNoUtilizados($id_empresa);
      $this->marcaRepositorio->eliminarNoUtilizados($id_empresa);
      $this->proveedorRepositorio->eliminarNoUtilizados($id_empresa);
    } catch (Exception $e) {
      error_log("Hubo un error en eliminarRubrosYArtNoUtilizados() (GestorRubro)");
    }
  }

  private function modificar(): void
  {
    $datos = json_decode(file_get_contents('php://input'), true);

    $id = $datos['id'];
    $id_empresa = $datos['id_empresa'];
    $nombre = $datos['nombre'];
    $logo_url = $datos['logo_url'];

    if ((is_null($nombre) && is_null($id_empresa))) {
      http_response_code(400);
      echo json_encode(['error' => 'Faltan datos válidos para modificar la empresa con el id recibido']);
      return;
    }

    try {
      $rubroModificado = $this->rubroRepositorio->modificar($id, $id_empresa, $nombre, $logo_url);
      $this->borrarCacheTodos($id_empresa);
      echo json_encode($rubroModificado);
    } catch (Exception $e) {
      http_response_code(500);
      echo json_encode(['error' => 'Error al modificar la empresa: ' . $e->getMessage()]);
    }
  }

  private function subirLogo(): void
  {
    $id_empresa = $_POST['id_empresa'] ?? null;

    if (!$id_empresa) {
      http_response_code(400);
      echo json_encode(['error' => 'No se recibió el id_empresa.']);
      return;
    }

    if (empty($_FILES['imagen']['tmp_name'])) {
      http_response_code(400);
      echo json_encode(['error' => 'No se ha enviado ningún archivo.']);
      return;
    }

    // Carpeta base
    $directorioBase = $_SERVER['DOCUMENT_ROOT'] . '/Archivos/Logos/Rubro/';

    // Carpeta de la empresa
    $directorioDestino = $directorioBase . $id_empresa . '/';

    // Crear la carpeta si no existe
    if (!is_dir($directorioDestino)) {
      if (!mkdir($directorioDestino, 0755, true)) {
        http_response_code(500);
        echo json_encode(['error' => 'No se pudo crear el directorio de la empresa.']);
        return;
      }
    }

    $nombreOriginal = basename($_FILES['imagen']['name']);
    $nombreSinEspacios = str_replace(' ', '-', $nombreOriginal);
    $nombreArchivo = uniqid() . '-' . $nombreSinEspacios;

    $rutaDestino = $directorioDestino . $nombreArchivo;

    if (move_uploaded_file($_FILES['imagen']['tmp_name'], $rutaDestino)) {

      // Ruta que guardarás en la BD
      $url = '/Archivos/Logos/Rubro/' . $id_empresa . '/' . $nombreArchivo;

      echo json_encode([
        'url' => $url
      ]);
    } else {
      http_response_code(500);
      echo json_encode(['error' => 'Error al mover el archivo subido.']);
    }
  }
}
