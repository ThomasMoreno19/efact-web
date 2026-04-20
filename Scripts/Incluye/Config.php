<?php
$version = getenv('APP_ENV');

if ($version === 'local') {
  $version = time(); // timestamp dinámico
}

define('CACHE_TIME', 86400); // Cache de 1 día
define('APP_VERSION', $version); // Versión de la aplicación
define('ROLES', ['MODERADOR', 'ADMIN', 'MESERO']);