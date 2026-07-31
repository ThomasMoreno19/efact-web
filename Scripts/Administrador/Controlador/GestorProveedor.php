<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Modelo/Repositorio/ProveedorRepositorio.php';

class GestorProveedor
{
  private PDO $pdo;
  private ProveedorRepositorio $proveedorRepositorio;

  public function __construct(PDO $pdo)
  {
    $this->pdo = $pdo;
    $this->proveedorRepositorio = new ProveedorRepositorio($pdo);
  }

  public function derivarURL(string $porcionURL): void
  {
    header('Content-Type: application/json');
    $url_segmentada = explode('/', $porcionURL);
    $primer_segmento = $url_segmentada[0];

    switch (strtolower($primer_segmento)) {
      case 'mostrar':
        $this->mostrarPorEmpresa();
        break;

      case 'crear':
        $this->crear();
        break;

      case 'modificar':
        $this->modificar();
        break;

      case 'subir-logo':
        $this->subirLogo();
        break;

      default:
        http_response_code(404);
        echo json_encode(['error' => 'Acción no encontrada para Proveedor.']);
        break;
    }
  }

  private function mostrarPorEmpresa(): void
  {
    $datos = json_decode(file_get_contents('php://input'), true);

    $id_empresa = (int)($datos['id_empresa'] ?? 0);
    if ($id_empresa <= 0) {
      http_response_code(400);
      echo json_encode(['error' => 'Falta id_empresa para mostrar los proveedores.']);
      return;
    }

    try {
      $lista = $this->proveedorRepositorio->obtenerPorEmpresa($id_empresa);
      http_response_code(200);
      echo json_encode($lista);
    } catch (Exception $e) {
      http_response_code(500);
      echo json_encode(['error' => 'Error al mostrar proveedores: ' . $e->getMessage()]);
    }
  }

  private function crear(): void
  {
    $datos = json_decode(file_get_contents('php://input'), true);

    $id         = (int)($datos['id'] ?? 0);
    $id_empresa = (int)($datos['id_empresa'] ?? 0);
    $nombre     = trim($datos['nombre'] ?? '');

    if ($id <= 0 || $id_empresa <= 0 || $nombre === '') {
      http_response_code(400);
      echo json_encode(['error' => 'Faltan campos requeridos: id, id_empresa, nombre.']);
      return;
    }

    try {
      $resultado = $this->proveedorRepositorio->crear($id, $id_empresa, $nombre);
      if ($resultado) {
        http_response_code(201);
        echo json_encode(['mensaje' => 'Proveedor creado correctamente.']);
      } else {
        http_response_code(500);
        echo json_encode(['error' => 'No se pudo crear el proveedor.']);
      }
    } catch (Exception $e) {
      http_response_code(500);
      echo json_encode(['error' => 'Error al crear proveedor: ' . $e->getMessage()]);
    }
  }


  public function cargarLista(array $lista, int $id_empresa): bool
  {
    if (empty($lista)) return true;

    try {
      $this->proveedorRepositorio->crearListaCsv($lista, $id_empresa);

      if ($id_empresa) {
        $this->borrarCacheTodos($id_empresa);
      }

      return true;
    } catch (Exception $e) {
      // Lanzamos la excepción para que la capture el gestorArticulo principal
      throw $e;
    }
  }

  public function actualizarCatalogo(array $proveedores, int $id_empresa): bool
  {
    if (empty($proveedores)) {
      return true;
    }

    $tamLote = 2000;

    foreach (array_chunk($proveedores, $tamLote) as $lote) {
      $this->proveedorRepositorio->actualizarCatalogo(
        $lote,
        $id_empresa
      );
    }

    return true;
  }

  private function borrarCacheTodos(int $id_empresa): void
  {
    $cacheDir = $_SERVER['DOCUMENT_ROOT'] . "/Scripts/Cache/";
    $pattern = $cacheDir . "catalogos_empresa_{$id_empresa}.json";

    $archivos = glob($pattern);
    if ($archivos) {
      foreach ($archivos as $archivo) {
        if (file_exists($archivo)) {
          @unlink($archivo);
        }
      }
    }

    $cacheEmpresa = $cacheDir . "catalogos_empresa_{$id_empresa}.json";
    $cacheCliente = $cacheDir . "catalogos_empresa_{$id_empresa}_cliente.json";
    if (file_exists($cacheEmpresa)) {
      @unlink($cacheEmpresa);
    }
    if (file_exists($cacheCliente)) {
      @unlink($cacheCliente);
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
      $proveedorModificado = $this->proveedorRepositorio->modificar($id, $id_empresa, $nombre, $logo_url);
      $this->borrarCacheTodos($id_empresa);
      echo json_encode($proveedorModificado);
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
    $directorioBase = $_SERVER['DOCUMENT_ROOT'] . '/Archivos/Logos/Proveedor/';

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
      $url = '/Archivos/Logos/Proveedor/' . $id_empresa . '/' . $nombreArchivo;

      echo json_encode([
        'url' => $url
      ]);
    } else {
      http_response_code(500);
      echo json_encode(['error' => 'Error al mover el archivo subido.']);
    }
  }
}
