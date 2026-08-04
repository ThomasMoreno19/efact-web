<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Incluye/env.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Incluye/ConexionBD.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Controlador/GestorEmpresa.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Controlador/GestorAdministrador.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Controlador/GestorModerador.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Controlador/GestorArticulo.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Controlador/GestorRubro.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Controlador/GestorMarca.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Controlador/GestorProveedor.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Controlador/GestorInterno.php';


$lifetime = 60 * 60 * 24; // 1 día

ini_set('session.gc_maxlifetime', $lifetime);

session_set_cookie_params([
  'lifetime' => $lifetime,
  'path' => '/',
  'httponly' => true,
  'samesite' => 'Lax',
]);
session_start();

$url = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'); // Tomar la url (Elimina barras iniciales/finales).

cargarEnv($_SERVER['DOCUMENT_ROOT'] . '/.env');
// Dividir la url en un array
$url_segmentada = explode('/', $url);
$url_principal = $url_segmentada[0]; //lo que va antes de la primer barra en el slug, si el slug es Empresa/mostrar/123, entonces url_principal es Empresa
$porcionURL = implode('/', array_slice($url_segmentada, 1)); // el resto de la url, si la url entera es Empresa/mostrar/123, entonces porcionURl será mostrar/123

$pdo = conectarBD();

// Distribuir, dependiendo del primer segmento
try {
  switch (strtolower($url_principal)) {
    case 'admin':
      $controlador = new GestorAdministrador($pdo);
      $controlador->derivarURL($porcionURL);
      break;

    case 'moderador':
      $controlador = new GestorModerador($pdo);
      $controlador->derivarURL($porcionURL);
      break;

    case 'empresa':
      $controlador = new GestorEmpresa($pdo);
      $controlador->derivarURL($porcionURL);
      break;

    case 'articulo':
      $controlador = new GestorArticulo($pdo);
      $controlador->derivarURL($porcionURL);
      break;

    case 'rubro':
      $controlador = new GestorRubro($pdo);
      $controlador->derivarURL($porcionURL);
      break;

    case 'marca':
      $controlador = new GestorMarca($pdo);
      $controlador->derivarURL($porcionURL);
      break;

    case 'proveedor':
      $controlador = new GestorProveedor($pdo);
      $controlador->derivarURL($porcionURL);
      break;

    case 'catalogo':

      $esInterno = isset($_GET['interno']);

      if ($esInterno) {

        // Obtener el número de empresa de la URL
        $segmentos = explode('/', trim($porcionURL, '/'));
        $idEmpresa = $segmentos[0] ?? null;

        // Si no existe la sesión correspondiente
        if (
          !$idEmpresa ||
          !isset($_SESSION['interno'][$idEmpresa]) ||
          $_SESSION['interno'][$idEmpresa] !== true
        ) {

          require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Cliente/Vista/Html/LoginInterno.php';
          exit;
        } else {
          require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Cliente/Vista/Html/PantallaCliente.php';
          exit;
        }
      } else {

        // Obtener el número de empresa de la URL
        $segmentos = explode('/', trim($porcionURL, '/'));
        $idEmpresa = $segmentos[0] ?? null;

        // Obtener el hash de la contraseña de externos
        $stmt = $pdo->prepare("
          SELECT contrasena
          FROM externo
          WHERE id_empresa = ?
        ");
        $stmt->execute([$idEmpresa]);
        $hash = $stmt->fetchColumn();

        // Si la contraseña configurada es la cadena vacía, ingresar directamente
        if ($hash !== false && password_verify('', $hash)) {
          require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Cliente/Vista/Html/PantallaCliente.php';
          exit;
        }

        // Si tiene contraseña, verificar la sesión
        if (
          !$idEmpresa ||
          !isset($_SESSION['externo'][$idEmpresa]) ||
          $_SESSION['externo'][$idEmpresa] !== true
        ) {
          require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Cliente/Vista/Html/LoginExterno.php';
          exit;
        } else {
          require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Cliente/Vista/Html/PantallaCliente.php';
          exit;
        }
      }

    case 'interno':
      $controlador = new GestorInterno($pdo);
      $controlador->derivarURL($porcionURL);
      break;

    case 'externo':
      $controlador = new GestorExterno($pdo);
      $controlador->derivarURL($porcionURL);
      break;

    default:
      http_response_code(404);
      echo "<h1>404 - Página no encontrada</h1>";
      break;
  }
} catch (Exception $e) {
  http_response_code(500); // Internal Server Error
  error_log("Error en el enrutador central para URI: " . $e->getMessage());
  echo "<h1>500 - Error Interno del Servidor</h1>";
}

exit;
