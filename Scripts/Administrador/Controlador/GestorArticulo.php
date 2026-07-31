<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Modelo/Repositorio/ArticuloRepositorio.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Controlador/GestorRubro.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Controlador/GestorMarca.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Controlador/GestorProveedor.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Incluye/Config.php';

class GestorArticulo
{
  private PDO $pdo;
  private ArticuloRepositorio $articuloRepositorio;
  private GestorRubro $gestorRubro;
  private GestorProveedor $gestorProveedor;
  private GestorMarca $gestorMarca;

  public function __construct(PDO $pdo)
  {
    $this->pdo = $pdo;
    $this->articuloRepositorio = new ArticuloRepositorio($pdo);

    $this->gestorRubro = new GestorRubro($pdo);
    $this->gestorProveedor = new GestorProveedor($pdo);
    $this->gestorMarca = new GestorMarca($pdo);
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

      case 'actualizar-catalogo':
        $this->actualizarCatalogo();
        break;

      case 'subir-logo':
        $this->subirLogo();
        break;

      case 'subir-video':
        $this->subirVideo();
        break;

      case 'eliminar-video':
        $this->eliminarVideo();
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

    $id_empresa   = $datos['id_empresa'] ?? null;
    $articulos    = $datos['articulos'] ?? [];
    $proveedores  = $datos['proveedores'] ?? [];
    $rubros       = $datos['rubros'] ?? [];
    $marcas       = $datos['marcas'] ?? [];

    if (empty($id_empresa) || empty($articulos)) {
      http_response_code(400);
      echo json_encode([
        'error' => 'Datos incompletos (id_empresa o artículos).'
      ]);
      return;
    }

    try {

      // Cargar primero las tablas dependientes
      $rubrosOk = $this->gestorRubro->cargarLista($rubros, $id_empresa);
      $marcasOk = $this->gestorMarca->cargarLista($marcas, $id_empresa);
      $proveedoresOk = $this->gestorProveedor->cargarLista($proveedores, $id_empresa);

      if (!$rubrosOk || !$marcasOk || !$proveedoresOk) {
        http_response_code(500);
        echo json_encode([
          'error' => 'No se pudieron cargar rubros, marcas o proveedores.'
        ]);
        return;
      }

      // Cargar artículos por lotes
      $tamLote = 2000;

      foreach (array_chunk($articulos, $tamLote) as $lote) {
        $this->articuloRepositorio->crearListaCsv($lote, $id_empresa);
      }

      $this->borrarCacheTodos($id_empresa);

      echo json_encode([
        'success' => true
      ]);
    } catch (Exception $e) {
      http_response_code(500);
      echo json_encode([
        'error' => $e->getMessage()
      ]);
    }
  }

  private function actualizarCatalogo(): void
  {
    $datos = json_decode(file_get_contents('php://input'), true);

    $id_empresa = $datos['id_empresa'] ?? null;

    if (empty($id_empresa)) {
      http_response_code(400);
      echo json_encode([
        'error' => 'Debe indicar la empresa.'
      ]);
      return;
    }

    try {

      if (isset($datos['rubros'])) {
        $this->gestorRubro->actualizarCatalogo(
          $datos['rubros'],
          $id_empresa
        );
      }

      if (isset($datos['marcas'])) {
        $this->gestorMarca->actualizarCatalogo(
          $datos['marcas'],
          $id_empresa
        );
      }

      if (isset($datos['proveedores'])) {
        $this->gestorProveedor->actualizarCatalogo(
          $datos['proveedores'],
          $id_empresa
        );
      }

      if (isset($datos['articulos'])) {

        $tamLote = 2000;

        foreach (array_chunk($datos['articulos'], $tamLote) as $lote) {

          $this->articuloRepositorio->actualizarCatalogo(
            $lote,
            $id_empresa
          );
        }
      }

      $this->borrarCacheTodos($id_empresa);

      echo json_encode([
        'success' => true
      ]);
    } catch (Exception $e) {

      http_response_code(500);

      echo json_encode([
        'error' => $e->getMessage()
      ]);
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
    $directorioBase = $_SERVER['DOCUMENT_ROOT'] . '/Archivos/Logos/Articulo/';

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
      $url = '/Archivos/Logos/Articulo/' . $id_empresa . '/' . $nombreArchivo;

      echo json_encode([
        'url' => $url
      ]);
    } else {
      http_response_code(500);
      echo json_encode(['error' => 'Error al mover el archivo subido.']);
    }
  }

  private function subirVideo(): void
  {
    // Al usar FormData en JS, los campos de texto viajan en $_POST
    if (empty($_POST['id_articulo']) || empty($_POST['id_empresa']) || empty($_FILES['archivo']['tmp_name'])) {
      http_response_code(400);
      echo json_encode(['error' => 'Faltan datos obligatorios o el archivo de video.']);
      return;
    }

    $id_articulo = (int)$_POST['id_articulo'];
    $id_empresa = (int)$_POST['id_empresa'];

    // URL del video actual que viene desde el cliente para poder eliminarlo si existe
    $articulo_video_url = !empty($_POST['video_url']) ? $_POST['video_url'] : null;

    // 1. Configuración de ruta dinámica por empresa
    $directorioDestino = $_SERVER['DOCUMENT_ROOT'] . '/Archivos/Videos/' . $id_empresa . '/';

    if (!is_dir($directorioDestino)) {
      mkdir($directorioDestino, 0755, true);
    }

    // 2. Validación de límite de almacenamiento (1 GB por carpeta de empresa)
    $limiteMaximoBytes = 1 * 1024 * 1024 * 1024; // 1 GB en bytes
    $pesoCarpetaActual = $this->obtenerTamañoDirectorio($directorioDestino);
    $pesoNuevoArchivo = $_FILES['archivo']['size'];

    if (($pesoCarpetaActual + $pesoNuevoArchivo) > $limiteMaximoBytes) {
      http_response_code(400);
      echo json_encode(['error' => 'Se ha excedido el espacio máximo permitido de 1GB para esta empresa.']);
      return;
    }

    // Procesamiento del nombre del archivo
    $nombreOriginal = basename($_FILES['archivo']['name']);
    $nombreSinEspacios = str_replace(' ', '-', $nombreOriginal);

    $infoArchivo = pathinfo($nombreSinEspacios);
    $nombreBase = $infoArchivo['filename'];
    $extension = isset($infoArchivo['extension']) ? '.' . $infoArchivo['extension'] : '';

    $nombreArchivo = $nombreBase . "-articulo" . $id_articulo . "_empresa" . $id_empresa . $extension;
    $rutaDestino = $directorioDestino . $nombreArchivo;

    if (move_uploaded_file($_FILES['archivo']['tmp_name'], $rutaDestino)) {
      // Nueva URL relativa para almacenar en la BD
      $video_url = '/Archivos/Videos/' . $id_empresa . '/' . $nombreArchivo;

      // Guardar en la base de datos a través del repositorio
      $guardadoExitoso = $this->articuloRepositorio->agregarUrlVideo($id_articulo, $id_empresa, $video_url);

      if ($guardadoExitoso) {
        // 3. Si se guardó con éxito el nuevo, eliminamos el archivo físico anterior (si existía)
        if ($articulo_video_url) {
          $rutaVideoAnterior = $_SERVER['DOCUMENT_ROOT'] . $articulo_video_url;
          if (file_exists($rutaVideoAnterior) && is_file($rutaVideoAnterior)) {
            unlink($rutaVideoAnterior);
          }
        }

        http_response_code(200);
        $this->borrarCacheTodos($id_empresa);
        echo json_encode(['url' => $video_url, 'mensaje' => 'Video subido y registrado con éxito.']);
        return;
      } else {
        if (file_exists($rutaDestino)) {
          unlink($rutaDestino);
        }
        http_response_code(500);
        echo json_encode(['error' => 'Error al registrar la URL del video en la base de datos.']);
        return;
      }
    } else {
      http_response_code(500);
      echo json_encode(['error' => 'Error al mover el archivo de video al servidor.']);
      return;
    }
  }

  private function obtenerTamañoDirectorio(string $ruta): int
  {
    $totalBytes = 0;
    if (!is_dir($ruta)) return $totalBytes;

    $elementos = scandir($ruta);
    foreach ($elementos as $elemento) {
      if ($elemento !== '.' && $elemento !== '..') {
        $rutaCompleta = $ruta . $elemento;
        if (is_file($rutaCompleta)) {
          $totalBytes += filesize($rutaCompleta);
        }
      }
    }
    return $totalBytes;
  }

  private function eliminarVideo(): void
  {
    $datos = json_decode(file_get_contents('php://input'), true);

    $id_articulo = $datos['id_articulo'];
    $id_empresa = $datos['id_empresa'];
    $video_url = $datos['video_url'];

    if ($video_url) {
      $rutaVideo = $_SERVER['DOCUMENT_ROOT'] . $video_url;
      if (file_exists($rutaVideo) && is_file($rutaVideo)) {
        unlink($rutaVideo);
      }
    }


    $guardadoExitoso = $this->articuloRepositorio->eliminarUrlVideo($id_articulo, $id_empresa, $video_url);

    if ($guardadoExitoso) {
      http_response_code(200);
      $this->borrarCacheTodos($id_empresa);
      echo json_encode(['mensaje' => 'Video eliminado con éxito.']);
      return;
    } else {
      http_response_code(500);
      echo json_encode(['error' => 'Error al eliminar el video.']);
      return;
    }
  }

  private function modificar(): void
  {
    $datos = json_decode(file_get_contents('php://input'), true);

    $id = $datos['id'];
    $id_empresa = $datos['id_empresa'];
    $nombre = $datos['nombre'];
    $precio1 = $datos['precio1'];
    $precio2 = $datos['precio2'];
    $precio3 = $datos['precio3'];
    $logo_url = $datos['logo_url'] ?? null;


    $cacheFile = $_SERVER['DOCUMENT_ROOT'] . "/cache/articulos_empresa_{$id_empresa}.json";
    if (file_exists($cacheFile)) {
      unlink($cacheFile); // Borra cache
    }

    if (empty($nombre) || empty($id)) {
      http_response_code(400);
      echo json_encode(['error' => 'Faltan datos válidos para modificar el articulo con el id recibido']);
      return;
    }

    try {
      $articuloModificado = $this->articuloRepositorio->modificar($id, $id_empresa, $nombre, $precio1, $precio2, $precio3, $logo_url);
      $this->borrarCacheTodos($id_empresa);
      echo json_encode($articuloModificado);
    } catch (Exception $e) {
      http_response_code(500);
      echo json_encode(['error' => 'Error al modificar el articulo: ' . $e->getMessage()]);
    }
  }
}
