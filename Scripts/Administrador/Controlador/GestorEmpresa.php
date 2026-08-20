<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Modelo/Repositorio/EmpresaRepositorio.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Controlador/GestorInterno.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Controlador/GestorExterno.php';

class GestorEmpresa
{
  private PDO $pdo;
  private empresaRepositorio $empresaRepositorio;
  private GestorInterno $gestorInterno;
  private GestorExterno $gestorExterno;

  public function __construct(PDO $pdo)
  {
    $this->pdo = $pdo;
    $this->empresaRepositorio = new EmpresaRepositorio($pdo);
    $this->gestorInterno = new GestorInterno($pdo);
    $this->gestorExterno = new GestorExterno($pdo);
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
            echo json_encode($this->empresaRepositorio->obtenerTodas());
            break;


          case 'id':
            $this->mostrarPorId();
            break;
        }
        break;

      case 'modificar':
        $this->modificar();
        break;

      case 'modificar-para-moderador':
        $this->modificarParaModerador();
        break;

      case 'crear':
        $this->crear();
        break;

      case 'eliminar':
        $this->eliminarEmpresa();
        break;

      case 'modificar-logo':
        $this->modificarLogo();
        break;

      case 'guardar-horarios':
        $this->guardarHorarios();
        break;

      case 'mostrar-horarios':
        $this->mostrarHorarios();
        break;

      default:
        http_response_code(404);
        echo json_encode(['error' => 'Acción no encontrada para Empresa.']);
        break;
    }
  }

  private function mostrarPorId(): void
  {
    $datos = json_decode(file_get_contents('php://input'), true);

    $id_empresa = (int)$datos['id_empresa'];

    if (empty($id_empresa)) {
      http_response_code(400);
      echo json_encode(['error' => 'Faltan datos para mostrar la empresa.']);
      return;
    }

    // === CACHE EN ARCHIVO ===
    $cacheFile = $_SERVER['DOCUMENT_ROOT'] . "/Scripts/Cache/empresa_{$id_empresa}.json";

    // Si existe cache y no venció el tiempo definido en CACHE_TIME
    if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < CACHE_TIME) {
      http_response_code(200);
      echo file_get_contents($cacheFile);
      return;
    }

    try {
      $empresa = $this->empresaRepositorio->obtenerPorId($id_empresa);

      // Guardar en caché
      $json = json_encode($empresa);
      file_put_contents($cacheFile, $json);

      http_response_code(200);
      echo $json;
    } catch (Exception $e) {
      http_response_code(500);
      echo json_encode(['error' => 'Error al mostrar la empresa: ' . $e->getMessage()]);
    }
  }


  private function crear(): void
  {
    // 1️⃣ Verificar y decodificar JSON o multipart
    // Si el frontend manda FormData (con archivo), usamos $_POST y $_FILES
    $nombre = $_POST['nombre'];
    $telefono = $_POST['telefono'];
    $ubicacion = $_POST['ubicacion'];
    $tieneCarrito   = filter_var($_POST['tieneCarrito'], FILTER_VALIDATE_BOOLEAN);
    $deshabilitar_excel = filter_var($_POST['deshabilitarExcel'], FILTER_VALIDATE_BOOLEAN);
    $contrasenaInternos = $_POST['contrasenaInternos'] ?? '';
    $contrasenaExternos = $_POST['contrasenaExternos'] ?? '';
    $imagen = null;

    if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
      $imagen = $_FILES['imagen'];
    }

    // 2️⃣ Validaciones
    if (empty($nombre)) {
      http_response_code(400);
      echo json_encode(['error' => 'Falta el nombre de la empresa.']);
      return;
    }

    try {
      // 3️⃣ Si hay imagen, la subimos y obtenemos la URL
      $logo_url = '/Archivos/Logos/Vacio.png';

      // 4️⃣ Crear la empresa en la base de datos
      $empresa = $this->empresaRepositorio->crear($nombre, $logo_url, $telefono, $ubicacion, $tieneCarrito, $deshabilitar_excel);

      if ($imagen) {

        $logo_url = $this->subirLogo(
          $empresa['id'],
          $imagen
        );


        if ($logo_url) {
          $this->empresaRepositorio->modificarLogo(
            $empresa['id'],
            $logo_url
          );
        }
      }

      $this->gestorExterno->crear($empresa['id'], $contrasenaExternos);
      $this->gestorInterno->crear($empresa['id'], $contrasenaInternos);
      // 5️⃣ Devolver respuesta
      http_response_code(200);
      echo json_encode([
        'id' => $empresa['id'],
        'nombre' => $empresa['nombre'],
        'telefono' => $empresa['telefono'],
        'ubicacion' => $empresa['ubicacion'],
        'tieneCarrito' => $empresa['tieneCarrito'],
        'deshabilitar_excel' => $empresa['deshabilitar_excel'],
        'fecha_creacion' => $empresa['fecha_creacion'],
        'logo_url' => $empresa['logo_url'],
      ]);
    } catch (Exception $e) {
      http_response_code(500);
      echo json_encode(['error' => 'Error al crear la empresa: ' . $e->getMessage()]);
    }
  }



  private function modificar(): void
  {

    $id_empresa = (int)($_POST['id'] ?? 0);
    $nombre = $_POST['nombre'];
    $ubicacion = $_POST['ubicacion'] ?? '';
    $telefono = $_POST['telefono'] ?? '';
    $tieneCarrito = filter_var($_POST['tieneCarrito'] ?? false, FILTER_VALIDATE_BOOLEAN);
    $deshabilitar_excel = filter_var($_POST['deshabilitarExcel'] ?? false, FILTER_VALIDATE_BOOLEAN);
    $contrasenaInterno = $_POST['contrasenaInterno'] ?? null;
    $imagen = null;

    if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
      $imagen = $_FILES['imagen'];
    }



    if (empty($id_empresa) || empty($nombre)) {
      http_response_code(400);
      echo json_encode(['error' => 'Faltan datos para modificar la empresa.']);
      return;
    }


    try {
      // 3️⃣ Si hay imagen, la subimos y obtenemos la URL
      $logo_url = '';
      if ($imagen) {
        $logo_url = $this->subirLogo($id_empresa, $imagen);
      }

      $empresaModificada = $this->empresaRepositorio->modificar($id_empresa, $nombre, $ubicacion, $telefono, $tieneCarrito, $deshabilitar_excel, $logo_url);

      if ($contrasenaInterno !== null && $contrasenaInterno !== '') {
        $this->gestorInterno->modificar($id_empresa, $contrasenaInterno);
      }
      // 🔥 Borrar caché para esta empresa
      $this->borrarCacheEmpresa($id_empresa);

      http_response_code(200);
      echo json_encode($empresaModificada);
    } catch (Exception $e) {
      http_response_code(500);
      echo json_encode(['error' => 'Error al modificar la empresa: ' . $e->getMessage()]);
    }
  }

  private function modificarParaModerador(): void
  {
    $datos = json_decode(file_get_contents('php://input'), true);

    $id_empresa = (int)$datos['id'];
    $nombre = $datos['nombre'];
    $ubicacion = $datos['ubicacion'];
    $telefono = $datos['telefono'];
    $imagenesEnArticulos = $datos['imagenesEnArticulos'];
    $incluirHorarios = $datos['incluirHorarios'];
    $pedidosFueraHorario = $datos['pedidosFueraHorario'];
    $incluirCodigoBarra = $datos['incluirCodigoBarra'];
    $contrasenaInterno = $datos['contrasenaInterno'] ?? null;
    $contrasenaExterno = $datos['contrasenaExterno'] ?? null;

    if (empty($id_empresa) || empty($nombre)) {
      http_response_code(400);
      echo json_encode(['error' => 'Faltan datos para modificar la empresa.']);
      return;
    }


    try {
      $empresaModificada = $this->empresaRepositorio->modificarParaModerador($id_empresa, $nombre, $ubicacion, $telefono, $imagenesEnArticulos, $incluirHorarios, $pedidosFueraHorario, $incluirCodigoBarra);

      if ($contrasenaInterno !== null && $contrasenaInterno !== '') {
        $this->gestorInterno->modificar($id_empresa, $contrasenaInterno);
      }

      if ($contrasenaExterno !== null && $contrasenaExterno !== '') {
        $this->gestorExterno->modificar($id_empresa, $contrasenaExterno);
      }
      // 🔥 Borrar caché para esta empresa
      $this->borrarCacheEmpresa($id_empresa);

      http_response_code(200);
      echo json_encode($empresaModificada);
    } catch (Exception $e) {
      http_response_code(500);
      echo json_encode(['error' => 'Error al modificar la empresa: ' . $e->getMessage()]);
    }
  }


  private function modificarLogo(): void
  {
    $id = (int)$_POST['id_empresa'];

    if (!isset($_FILES['imagen'])) {
      http_response_code(400);
      echo json_encode([
        'error' => 'No se recibió imagen'
      ]);
      return;
    }


    $logo_url = $this->subirLogo(
      $id,
      $_FILES['imagen']
    );


    if (!$logo_url) {
      http_response_code(500);
      echo json_encode([
        'error' => 'No se pudo guardar la imagen'
      ]);
      return;
    }


    $empresaModificada = $this->empresaRepositorio
      ->modificarLogo($id, $logo_url);


    echo json_encode($empresaModificada);
  }

  private function subirLogo(int $id_empresa, array $imagen): ?string
  {
    if (!$id_empresa) {
      return null;
    }

    if (empty($imagen['tmp_name'])) {
      return null;
    }

    $directorioBase = $_SERVER['DOCUMENT_ROOT'] . '/Archivos/Logos/Empresa/';

    $directorioDestino = $directorioBase . $id_empresa . '/';

    if (!is_dir($directorioDestino)) {
      if (!mkdir($directorioDestino, 0755, true)) {
        return null;
      }
    }

    $nombreOriginal = basename($imagen['name']);
    $nombreSinEspacios = str_replace(' ', '-', $nombreOriginal);
    $nombreArchivo = uniqid() . '-' . $nombreSinEspacios;

    $rutaDestino = $directorioDestino . $nombreArchivo;

    if (!move_uploaded_file($imagen['tmp_name'], $rutaDestino)) {
      return null;
    }


    return '/Archivos/Logos/Empresa/' . $id_empresa . '/' . $nombreArchivo;
  }



  private function borrarCacheEmpresa(int $id_empresa): void
  {
    $cacheFile = $_SERVER['DOCUMENT_ROOT'] . "/Scripts/Cache/empresa_{$id_empresa}.json";

    if (file_exists($cacheFile)) {
      @unlink($cacheFile);
    }
  }

  private function guardarHorarios(): void
  {
    $datos = json_decode(file_get_contents('php://input'), true);

    $id_empresa = (int)$datos['id_empresa'];
    $horarios = $datos['horarios'];

    if (empty($id_empresa) || !is_array($horarios)) {
      http_response_code(400);
      echo json_encode(['error' => 'Faltan datos para guardar los horarios.']);
      return;
    }

    try {
      $this->empresaRepositorio->guardarHorarios($id_empresa, $horarios);
      $this->borrarCacheEmpresa($id_empresa);
      http_response_code(200);
      echo json_encode(true);
    } catch (Exception $e) {
      http_response_code(500);
      echo json_encode(['error' => 'Error al guardar los horarios: ' . $e->getMessage()]);
    }
  }
  private function mostrarHorarios(): void
  {
    $datos = json_decode(file_get_contents('php://input'), true);

    $id_empresa = (int)($datos['id_empresa'] ?? 0);

    if (empty($id_empresa)) {
      http_response_code(400);
      echo json_encode(['error' => 'Falta id_empresa para mostrar el horario de la empresa.']);
      return;
    }

    try {
      $diasNoLaborales = $this->empresaRepositorio->obtenerHorarios($id_empresa);
      http_response_code(200);
      echo json_encode($diasNoLaborales);
    } catch (Exception $e) {
      http_response_code(500);
      echo json_encode(['error' => 'Error al mostrar el horario: ' . $e->getMessage()]);
    }
  }

  private function eliminarEmpresa(): void
  {
    $datos = json_decode(file_get_contents('php://input'), true);

    $id_empresa = (int)($datos['id_empresa'] ?? 0);

    if (empty($id_empresa)) {
      http_response_code(400);
      echo json_encode([
        'error' => 'Falta id_empresa para eliminar la empresa.'
      ]);
      return;
    }

    try {

      // Primero eliminamos archivos físicos
      $this->eliminarArchivosEmpresa($id_empresa);

      // Después eliminamos la empresa de BD
      $this->empresaRepositorio->eliminar($id_empresa);

      // Eliminamos cache
      $this->borrarCacheEmpresa($id_empresa);


      http_response_code(200);
      echo json_encode([
        'message' => 'Empresa eliminada correctamente.'
      ]);
    } catch (Exception $e) {

      http_response_code(500);
      echo json_encode([
        'error' => 'Error al eliminar la empresa: ' . $e->getMessage()
      ]);
    }
  }

  private function eliminarArchivosEmpresa(int $id_empresa): void
  {
    $carpetas = [
      'Empresa',
      'Articulo',
      'Marca',
      'Proveedor',
      'Rubro'
    ];

    foreach ($carpetas as $carpeta) {

      $ruta = $_SERVER['DOCUMENT_ROOT'] .
        "/Archivos/Logos/{$carpeta}/{$id_empresa}/";

      if (is_dir($ruta)) {
        $this->eliminarDirectorio($ruta);
      }
    }
  }

  private function eliminarDirectorio(string $directorio): void
  {
    if (!is_dir($directorio)) {
      return;
    }

    $archivos = scandir($directorio);

    foreach ($archivos as $archivo) {

      if ($archivo === '.' || $archivo === '..') {
        continue;
      }

      $rutaArchivo = $directorio . DIRECTORY_SEPARATOR . $archivo;

      if (is_dir($rutaArchivo)) {
        $this->eliminarDirectorio($rutaArchivo);
      } else {
        unlink($rutaArchivo);
      }
    }

    rmdir($directorio);
  }
}
