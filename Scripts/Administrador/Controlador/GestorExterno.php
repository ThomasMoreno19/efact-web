<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Modelo/Repositorio/ExternoRepositorio.php';

class GestorExterno
{
  private PDO $pdo;
  private RepositorioExterno $repositorio;

  public function __construct(PDO $pdo)
  {
    $this->pdo = $pdo;
    $this->repositorio = new RepositorioExterno($pdo);
  }

  public function derivarURL(string $porcionURL): void
  {
    $partes = explode('/', trim($porcionURL, '/'));
    $accion = strtolower($partes[0] ?? '');

    switch ($accion) {

      case 'login':
        $this->login();
        break;

      case 'vaciar-contrasena':
        $this->vaciarContrasena();
        break;

      default:
        http_response_code(404);

        echo json_encode([
          'ok' => false,
          'mensaje' => 'Acción inexistente.'
        ]);
    }
  }

  private function login(): void
  {
    header('Content-Type: application/json');

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
      http_response_code(405);

      echo json_encode([
        'ok' => false,
        'mensaje' => 'Método no permitido.'
      ]);
      return;
    }

    $datos = json_decode(file_get_contents("php://input"), true);

    $idEmpresa = (int)($datos['id_empresa'] ?? 0);
    $password = $datos['password'] ?? '';

    if ($idEmpresa <= 0) {
      http_response_code(400);

      echo json_encode([
        'ok' => false,
        'mensaje' => 'Empresa inválida.'
      ]);
      return;
    }

    if (!isset($_SESSION['loginExterno'][$idEmpresa])) {
      $_SESSION['loginExterno'][$idEmpresa] = [
        'intentos' => 0,
        'bloqueadoHasta' => null
      ];
    }

    $estado = &$_SESSION['loginExterno'][$idEmpresa];

    if (
      $estado['bloqueadoHasta'] !== null &&
      time() < $estado['bloqueadoHasta']
    ) {

      echo json_encode([
        'ok' => false,
        'bloqueado' => true,
        'mensaje' => 'Demasiados intentos. Intente nuevamente más tarde.'
      ]);

      return;
    }

    $externo = $this->repositorio->obtenerPorEmpresa($idEmpresa);

    if (!$externo) {

      echo json_encode([
        'ok' => false,
        'mensaje' => 'Empresa inexistente.'
      ]);

      return;
    }

    if (!password_verify($password, $externo['contrasena'])) {

      $estado['intentos']++;

      if ($estado['intentos'] >= 5) {

        $estado['bloqueadoHasta'] = time() + (20 * 60);

        echo json_encode([
          'ok' => false,
          'bloqueado' => true,
          'mensaje' => 'Se alcanzó el máximo de intentos. Intente nuevamente en 20 minutos.'
        ]);

        return;
      }

      echo json_encode([
        'ok' => false,
        'mensaje' => 'Contraseña incorrecta.',
        'intentosRestantes' => 5 - $estado['intentos']
      ]);

      return;
    }

    // Login correcto

    $_SESSION['externo'][$idEmpresa] = true;

    $estado = [
      'intentos' => 0,
      'bloqueadoHasta' => null
    ];

    echo json_encode([
      'ok' => true
    ]);
  }

  public function crear(int $idEmpresa, string $password): array
  {
    return $this->repositorio->crear($idEmpresa, $password);
  }

  public function modificar(int $id, string $password): bool
  {
    return $this->repositorio->modificar($id, $password);
  }

  private function vaciarContrasena()
  {
    $datos = json_decode(file_get_contents('php://input'), true);

    $id_empresa = (int)($datos['id_empresa'] ?? 0);

    echo json_encode($this->repositorio->vaciarContrasena($id_empresa));
  }
}
