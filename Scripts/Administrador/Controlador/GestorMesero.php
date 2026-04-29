<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Modelo/Repositorio/MeseroRepositorio.php';

class GestorMesero
{
  private PDO $pdo;
  private MeseroRepositorio $meseroRepositorio;

  public function __construct(PDO $pdo)
  {
    $this->pdo = $pdo;
    $this->meseroRepositorio = new MeseroRepositorio($pdo);
  }


  public function derivarURL(string $porcionURL): void
  {
    $url_segmentada = explode('/', $porcionURL);
    $primer_segmento = $url_segmentada[0];
    if (is_numeric($url_segmentada[0])) {
      if (!isset($_SESSION['mesero_logueado'])) {
        require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Cliente/Vista/Html/FormIniciarSesionMesero.php';
        exit;
      }

      if ($_SESSION['id_mesero'] != (int)$primer_segmento) {
        require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Cliente/Vista/Html/FormIniciarSesionMesero.php';
        exit;
      }

      require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Vista/Html/PantallaMesero.php';
      exit;
    }

    header('Content-Type: application/json');
    switch (strtolower($primer_segmento)) {
      case 'modificar':
        $this->modificar();
        break;

      case 'crear':
        $this->crear();
        break;

      case 'cargar':
        $this->cargar();
        break;

      case 'eliminar':
        $this->eliminar();
        break;

      case 'login':
        $this->iniciarSesion();
        break;

      case 'mostrar':
        $this->mostrar();
        break;

      case 'hay-meseros-registrados':
        $this->hayMeserosRegistrados();
        break;

      case 'validar-sesion':
        $this->validarSesionMesero();
        break;

      default:
        http_response_code(404);
        echo json_encode([
          'url completa' => $porcionURL,
          'url  $url_segmentada[0]' => is_numeric($url_segmentada[0]),
        ]);
        break;
    }
  }

  private function crear(): void
  {
    $datos = json_decode(file_get_contents('php://input'), true);

    $id_empresa = $datos['id_empresa'];
    $nombre = $datos['nombre'];
    $abreviaturaNombre = $datos['abreviaturaNombre'];
    $contrasena = $this->normalizarContrasena($datos['contrasena']);

    if (is_null($id_empresa) || empty($nombre)) {
      http_response_code(400);
      echo json_encode([
        'error' => 'Faltan datos para crear el mesero.',
        'debug' => ['id_empresa' => $id_empresa, 'nombre' => $nombre]
      ]);
    }

    try {
      $exitosa = $this->meseroRepositorio->crear($id_empresa, $nombre, $abreviaturaNombre, $contrasena);
      echo json_encode($exitosa);
    } catch (Exception $e) {
      http_response_code(500);
      echo json_encode(['error' => 'Error al crear el mesero: ' . $e->getMessage()]);
    }
  }

  private function cargar(): void
  {
    $input = file_get_contents('php://input');
    $datos = json_decode($input, true);

    if ($datos === null) {
      http_response_code(400);
      echo json_encode(['error' => 'JSON inválido', 'raw' => $input]);
      return;
    }

    $meseros = $datos['meseros'] ?? [];
    $id_empresa = $datos['id_empresa'] ?? null;

    if (is_null($id_empresa)) {
      http_response_code(400);
      echo json_encode(['error' => 'Falta id_empresa']);
      return;
    }

    if (empty($meseros)) {
      http_response_code(400);
      echo json_encode(['error' => 'Lista de meseros vacía']);
      return;
    }

    $errores = [];
    $procesados = [];

    try {
      foreach ($meseros as $index => $mesero) {

        // Validación mínima
        if (!isset($mesero['codigo'], $mesero['nombre'])) {
          $errores[] = [
            'fila' => $index,
            'error' => 'Faltan campos obligatorios',
            'data' => $mesero
          ];
          continue;
        }


        $mesero['contrasena'] = $this->descifrarContrasena($this->normalizarContrasena($mesero['contrasena'] ?? ''));

        $procesados[] = $mesero;
      }

      if (empty($procesados)) {
        http_response_code(400);
        echo json_encode([
          'error' => 'No hay meseros válidos para insertar',
          'errores' => $errores
        ]);
        return;
      }
      $ok = $this->meseroRepositorio->cargar($procesados, $id_empresa);

      echo json_encode([
        'ok' => $ok,
        'insertados' => count($procesados),
        'errores' => $errores
      ]);
    } catch (Exception $e) {
      http_response_code(500);
      echo json_encode([
        'error' => 'Error interno',
        'detalle' => $e->getMessage()
      ]);
    }
  }

  private function descifrarContrasena(string $contrasena): string
  {
    $resultado = '';

    for ($i = 0; $i < strlen($contrasena); $i++) {
      $resultado .= chr(ord($contrasena[$i]) - 3);
    }

    // 🔐 Hasheo seguro
    return password_hash($resultado, PASSWORD_BCRYPT);
  }

  private function modificar(): void
  {
    $datos = json_decode(file_get_contents('php://input'), true);

    $id = $datos['id'];
    $nombre = $datos['nombre'];
    $abreviaturaNombre = $datos['abreviaturaNombre'];
    $contrasena = $datos['contrasena'];

    if (is_null($nombre)) {
      http_response_code(400);
      echo json_encode(['error' => 'Faltan datos válidos para modificar el mesero']);
      return;
    }

    try {
      if (is_null($contrasena)) {
        $mesero = $this->meseroRepositorio->modificarSinContrasena($id, $nombre, $abreviaturaNombre);
        echo json_encode(['mensaje' => $mesero]);
      }
      $contrasena = $this->normalizarContrasena($contrasena);
      $mesero = $this->meseroRepositorio->modificar($id, $nombre, $abreviaturaNombre, $contrasena);
      echo json_encode(['mensaje' => $mesero]);
    } catch (Exception $e) {
      http_response_code(500);
      echo json_encode(['error' => 'Error al modificar el mesero: ' . $e->getMessage()]);
    }
  }

  private function normalizarContrasena(?string $contrasena): ?string
  {
    // lowercase + descifrado + hash
    $lower = strtolower($contrasena);

    return $lower;
  }

  private function eliminar(): void
  {
    $datos = json_decode(file_get_contents('php://input'), true);

    $id = $datos['id'];

    if (is_null($id)) {
      http_response_code(400);
      echo json_encode(['error' => 'Faltan datos válidos para eliminar el mesero']);
      return;
    }

    try {
      $estaEliminado = $this->meseroRepositorio->eliminar($id);
      echo json_encode($estaEliminado);
    } catch (Exception $e) {
      http_response_code(500);
      echo json_encode(['error' => 'Error al eliminar el mesero: ' . $e->getMessage()]);
    }
  }

  private function mostrar(): void
  {
    $datos = json_decode(file_get_contents('php://input'), true);

    $id_empresa = $datos['id_empresa'];

    if (is_null($id_empresa)) {
      http_response_code(400);
      echo json_encode(['error' => 'Faltan datos válidos para mostrar los meseros de la empresa']);
      return;
    }

    try {
      $meseros = $this->meseroRepositorio->mostrar($id_empresa);
      echo json_encode($meseros);
    } catch (Exception $e) {
      http_response_code(500);
      echo json_encode(['error' => 'Error al obtener el mesero: ' . $e->getMessage()]);
    }
  }

  private function iniciarSesion(): void
  {
    $datos = json_decode(file_get_contents('php://input'), true);

    $nombre = $datos['nombre'];
    $contrasena = $this->normalizarContrasena($datos['contrasena']);
    $id_empresa = (int)$datos['id_empresa'];

    if (is_null($nombre) || is_null($contrasena)) {
      http_response_code(400);
      echo json_encode(['error' => 'Faltan datos válidos para ingresar sesion de mesero']);
    }

    try {
      $response = $this->meseroRepositorio->iniciarSesion($nombre, $contrasena, $id_empresa);
      if ($response) {
        $_SESSION['mesero_logueado'] = true;
        $_SESSION['mesero'][$id_empresa] = [
          'logueado' => true,
          'expira' => time() + 86400 * 2
        ];
        $_SESSION['expira'] = time() + 86400 * 2;
        echo json_encode(true);
      } else {
        echo json_encode(false);
      }
    } catch (Exception $e) {
      http_response_code(500);
      echo json_encode(['error' => 'Error al cambiar la contraseña del mesero: ' . $e->getMessage()]);
    }
  }

  private function validarSesionMesero(): void
  {
    $datos = json_decode(file_get_contents('php://input'), true);
    $id_empresa = (int)$datos['id_empresa'];

    if (
      !isset($_SESSION['mesero_logueado']) ||
      $_SESSION['mesero_logueado'] !== true
    ) {
      http_response_code(401);
      echo json_encode(false);
      exit;
    }

    if (isset($_SESSION['expira']) && time() > $_SESSION['expira']) {
      session_destroy();
      http_response_code(401);
      echo json_encode(false);
      exit;
    }

    if (
      !isset($_SESSION['mesero'][$id_empresa]['logueado']) ||
      $_SESSION['mesero'][$id_empresa]['logueado'] !== true
    ) {
      echo json_encode(false);
      exit;
    }

    // ✅ caso correcto
    echo json_encode(true);
  }

  private function hayMeserosRegistrados(): void
  {
    $datos = json_decode(file_get_contents('php://input'), true);

    $id_empresa = (int)$datos['id_empresa'];

    if (is_null($id_empresa)) {
      http_response_code(400);
      echo json_encode(['error' => 'Faltan datos válidos para validar meseros registrados']);
    }

    try {
      $response = $this->meseroRepositorio->hayMeserosRegistrados($id_empresa);
      echo json_encode($response);
    } catch (Exception $e) {
      http_response_code(500);
      echo json_encode(['error' => 'Error al validar registros de meseros: ' . $e->getMessage()]);
    }
  }
}
