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

  private function borrarCacheTodos(int $id_empresa): void
  {
    $cacheDir = $_SERVER['DOCUMENT_ROOT'] . "/Scripts/Cache/";
    $pattern = $cacheDir . "proveedores_empresa_{$id_empresa}.json";

    $archivos = glob($pattern);
    if ($archivos) {
      foreach ($archivos as $archivo) {
        if (file_exists($archivo)) {
          @unlink($archivo);
        }
      }
    }

    $cacheEmpresa = $cacheDir . "proveedores_empresa_{$id_empresa}.json";
    $cacheCliente = $cacheDir . "proveedores_empresa_{$id_empresa}_cliente.json";
    if (file_exists($cacheEmpresa)) {
      @unlink($cacheEmpresa);
    }
    if (file_exists($cacheCliente)) {
      @unlink($cacheCliente);
    }
  }
}
