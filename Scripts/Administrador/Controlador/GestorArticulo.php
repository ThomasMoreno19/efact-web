<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Modelo/Repositorio/ArticuloRepositorio.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Modelo/Repositorio/RubroRepositorio.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Incluye/Config.php';

class GestorArticulo
{
  private PDO $pdo;
  private ArticuloRepositorio $articuloRepositorio;
  private RubroRepositorio $rubroRepositorio;

  public function __construct(PDO $pdo)
  {
    $this->pdo = $pdo;
    $this->articuloRepositorio = new ArticuloRepositorio($pdo);
    $this->rubroRepositorio = new RubroRepositorio($pdo);
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

          case 'empresa':
            $this->mostrarTodosPorEmpresa();
            break;

          case 'para-cliente':
            $this->mostrarParaCliente();
            break;
        }
        break;

      case 'modificar':
        $this->modificar();
        break;

      case 'cargar-lista':
        $this->cargarLista();
        break;

      default:
        http_response_code(404);
        echo json_encode(['error' => 'Acción no encontrada para Articulo.']);
        break;
    }
  }


  private function mostrarTodos(): void
  {
    $datos = json_decode(file_get_contents('php://input'), true);

    $id_rubro = $datos['id_rubro'];
    $id_empresa = $datos['id_empresa'];

    // === CACHE EN ARCHIVO ===
    $cacheFile = $_SERVER['DOCUMENT_ROOT'] . "/Scripts/Cache/articulos_rubro_{$id_rubro}_empresa_{$id_empresa}.json";

    if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < CACHE_TIME) {
      http_response_code(200);
      echo file_get_contents($cacheFile);
      return;
    }

    try {
      $listaArticulos = $this->articuloRepositorio->obtenerTodos($id_rubro);

      // ¡AHORA SÍ! Usa el nombre del campo
      foreach ($listaArticulos as &$articulo) {
        $articulo['precio1'] = number_format((float)$articulo['precio1'], 0, '', '.');
        $articulo['precio2'] = number_format((float)$articulo['precio2'], 0, '', '.');
        $articulo['precio3'] = number_format((float)$articulo['precio3'], 0, '', '.');
      }
      unset($articulo); // buena práctica

      $json = json_encode($listaArticulos);
      file_put_contents($cacheFile, $json);

      http_response_code(200);
      echo $json;
    } catch (Exception $e) {
      http_response_code(500);
      echo json_encode(['error' => 'Error: ' . $e->getMessage()]);
    }
  }

  private function mostrarTodosPorEmpresa(): void
  {
    $datos = json_decode(file_get_contents('php://input'), true);

    $id_empresa = (int)($datos['id_empresa'] ?? 0);
    if ($id_empresa <= 0) {
      http_response_code(400);
      echo json_encode(['error' => 'Falta id_empresa para mostrar los artículos.']);
      return;
    }

    $cacheFile = $_SERVER['DOCUMENT_ROOT'] . "/Scripts/Cache/articulos_empresa_{$id_empresa}.json";

    if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < CACHE_TIME) {
      http_response_code(200);
      echo file_get_contents($cacheFile);
      return;
    }

    try {
      $listaArticulos = $this->articuloRepositorio->obtenerTodosPorEmpresa($id_empresa);

      foreach ($listaArticulos as &$articulo) {
        $articulo['precio1'] = number_format((float)$articulo['precio1'], 0, '', '.');
        $articulo['precio2'] = number_format((float)$articulo['precio2'], 0, '', '.');
        $articulo['precio3'] = number_format((float)$articulo['precio3'], 0, '', '.');
      }
      unset($articulo);

      $json = json_encode($listaArticulos);
      file_put_contents($cacheFile, $json);

      http_response_code(200);
      echo $json;
    } catch (Exception $e) {
      http_response_code(500);
      echo json_encode(['error' => 'Error al mostrar artículos por empresa: ' . $e->getMessage()]);
    }
  }

  private function mostrarParaCliente(): void
  {
    $datos = json_decode(file_get_contents('php://input'), true);

    $id_empresa = (int)($datos['id_empresa'] ?? 0);
    if ($id_empresa <= 0) {
      http_response_code(400);
      echo json_encode(['error' => 'Falta id_empresa para mostrar los artículos.']);
      return;
    }

    $cacheFile = $_SERVER['DOCUMENT_ROOT'] . "/Scripts/Cache/articulos_empresa_{$id_empresa}_cliente.json";

    if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < CACHE_TIME) {
      http_response_code(200);
      echo file_get_contents($cacheFile);
      return;
    }

    try {
      $listaArticulos = $this->articuloRepositorio->obtenerParaCliente($id_empresa);

      foreach ($listaArticulos as &$articulo) {
        $articulo['precio1'] = number_format((float)$articulo['precio1'], 0, '', '.');
        $articulo['precio2'] = number_format((float)$articulo['precio2'], 0, '', '.');
        $articulo['precio3'] = number_format((float)$articulo['precio3'], 0, '', '.');
      }
      unset($articulo);

      $json = json_encode($listaArticulos);
      file_put_contents($cacheFile, $json);

      http_response_code(200);
      echo $json;
    } catch (Exception $e) {
      http_response_code(500);
      echo json_encode(['error' => 'Error al mostrar artículos por empresa: ' . $e->getMessage()]);
    }
  }

  private function cargarLista(): void
  {
    $datos = json_decode(file_get_contents('php://input'), true);
    $listaArticulos = $datos['lista'] ?? [];
    $id_empresa = $datos['id_empresa'];

    if (empty($listaArticulos)) {
      http_response_code(400);
      echo json_encode(['error' => 'No se recibieron artículos.']);
      return;
    }

    if (empty($id_empresa)) {
      http_response_code(400);
      echo json_encode(['error' => 'No se recibió id_empresa.']);
      return;
    }

    // Preparamos los artículos para enviarlos al repositorio
    $articulosParaRepo = [];
    foreach ($listaArticulos as $articulo) {
      $articulosParaRepo[] = [
        'id' => $articulo['id_articulo'],
        'id_rubro' => $articulo['nombre_rubro'],
        'id_empresa' => $id_empresa,
        'nombre' => $articulo['nombre_articulo'],
        'descripcion' => $articulo['descripcion'] ?? '',
        'precio1' => $articulo['precio1'],
        'precio2' => $articulo['precio2'],
        'precio3' => $articulo['precio3'],
        'codigo_carta' => $articulo['codigo_carta_articulo'] ?? '',
        'solo_mesero' => $articulo['publica_art'] ?? 0
      ];
    }

    try {
      // Llamamos al nuevo método del repositorio que recibe todos los artículos
      $resultado = $this->articuloRepositorio->crearListaCsv($articulosParaRepo);
      $this->borrarCacheTodos($id_empresa);
      echo json_encode($resultado);
    } catch (Exception $e) {
      http_response_code(500);
      echo json_encode(['error' => 'Error al crear los artículos: ' . $e->getMessage()]);
    }
  }

  private function borrarCacheTodos(int $id_empresa): void
  {
    $cacheDir = $_SERVER['DOCUMENT_ROOT'] . "/Scripts/Cache/";
    $pattern = $cacheDir . "articulos_rubro_*_empresa_{$id_empresa}.json";

    $archivos = glob($pattern);
    if ($archivos) {
      foreach ($archivos as $archivo) {
        if (file_exists($archivo)) {
          @unlink($archivo); // el @ evita warnings si ya fue borrado
        }
      }
    }

    $cacheEmpresa = $cacheDir . "articulos_empresa_{$id_empresa}.json";
    $cacheCliente = $cacheDir . "articulos_empresa_{$id_empresa}_cliente.json";
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
    $id_rubro = $datos['id_rubro'];
    $id_empresa = $datos['id_empresa'];
    $nombre = $datos['nombre'];
    $descripcion = $datos['descripcion'];
    $precio1 = $datos['precio1'];
    $precio2 = $datos['precio2'];
    $precio3 = $datos['precio3'];
    $codigo_carta = $datos['codigo_carta'];


    $cacheFile = $_SERVER['DOCUMENT_ROOT'] . "/cache/articulos_empresa_{$id_empresa}.json";
    if (file_exists($cacheFile)) {
      unlink($cacheFile); // Borra cache
    }

    if (empty($nombre) || empty($id) || empty($id_rubro) || empty($precio1) || empty($precio2) || empty($precio3)) {
      http_response_code(400);
      echo json_encode(['error' => 'Faltan datos válidos para modificar el articulo con el id recibido']);
      return;
    }

    try {
      $articuloModificado = $this->articuloRepositorio->modificar($id, $id_rubro, $nombre, $descripcion, $precio1, $precio2, $precio3, $codigo_carta);
      $this->borrarCacheTodos($id_empresa);
      echo json_encode($articuloModificado);
    } catch (Exception $e) {
      http_response_code(500);
      echo json_encode(['error' => 'Error al modificar el articulo: ' . $e->getMessage()]);
    }
  }
}
