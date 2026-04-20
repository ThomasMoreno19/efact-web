<?php

function cargarEnv($ruta) {
  if (!file_exists($ruta)) {
    die("No se encontró el archivo .env");
  }

  $lineas = file($ruta, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

  foreach ($lineas as $linea) {
    $linea = trim($linea);

    if ($linea === '' || str_starts_with($linea, '#')) continue;
    if (!str_contains($linea, '=')) continue;

    [$nombre, $valor] = explode('=', $linea, 2);

    $nombre = trim($nombre);
    $valor = trim($valor);

    putenv("$nombre=$valor");
    $_ENV[$nombre] = $valor;
  }
}