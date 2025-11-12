<?php
// Habilita el registro de errores
ini_set('log_errors', 1);

// Especifica la ruta completa al archivo de log
ini_set('error_log', '/home/u919042836/domains/teal-antelope-193268.hostingersite.com/logs/php_error.log');

// Muestra los errores en la página (solo para desarrollo, desactiva en producción)
ini_set('display_errors', 1);

// Reporta todos los errores posibles
error_reporting(E_ALL);