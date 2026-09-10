<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Servicio/ServicioImagen.php';

class GestorImagen
{
  public function __construct(private PDO $pdo, private ServicioImagen $servicioImagen)
  {
  }

  public function derivarURL(string $porcionURL): void
  {
    header('Content-Type: application/json');
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
      http_response_code(405);
      echo json_encode(['error' => 'Método no permitido.']);
      return;
    }

    try {
      switch (strtolower(trim($porcionURL, '/'))) {
        case 'existentes':
          $this->existentes();
          break;
        case 'cargar-lote':
          $this->cargarLote();
          break;
        default:
          http_response_code(404);
          echo json_encode(['error' => 'Acción de imagen no encontrada.']);
      }
    } catch (InvalidArgumentException $e) {
      http_response_code(400);
      echo json_encode(['error' => $e->getMessage()]);
    } catch (Throwable $e) {
      error_log('Error en importación de imágenes: ' . $e->getMessage());
      http_response_code(500);
      echo json_encode(['error' => 'No se pudo procesar la importación de imágenes.']);
    }
  }

  private function existentes(): void
  {
    $datos = $this->obtenerJson();
    $idEmpresa = (int)($datos['id_empresa'] ?? 0);
    $tipo = (string)($datos['tipo'] ?? '');
    $hashes = $datos['hashes'] ?? [];
    if (!is_array($hashes)) {
      throw new InvalidArgumentException('hashes debe ser un arreglo.');
    }
    if (!$this->servicioImagen->empresaExiste($idEmpresa)) {
      throw new InvalidArgumentException('La empresa indicada no existe.');
    }

    echo json_encode([
      'success' => true,
      'hashes' => $this->servicioImagen->obtenerExistentes($idEmpresa, $tipo, $hashes),
    ]);
  }

  private function cargarLote(): void
  {
    $idEmpresa = (int)($_POST['id_empresa'] ?? 0);
    $tipo = $this->servicioImagen->validarTipo((string)($_POST['tipo'] ?? ''));
    $registros = json_decode($_POST['registros'] ?? '[]', true);
    if ($idEmpresa <= 0 || !is_array($registros) || count($registros) > 2000) {
      throw new InvalidArgumentException('El lote debe tener una empresa válida y hasta 2000 registros.');
    }
    if (!$this->servicioImagen->empresaExiste($idEmpresa)) {
      throw new InvalidArgumentException('La empresa indicada no existe.');
    }

    $errores = [];
    $validosPorHash = [];
    foreach ($registros as $registro) {
      $fila = (int)($registro['fila_excel'] ?? 0);
      $archivo = (string)($registro['nombre_original'] ?? '');
      $hash = strtolower((string)($registro['sha256'] ?? ''));
      $id = (int)($registro['id_registro'] ?? 0);
      if ($fila <= 0 || $id <= 0 || !$this->nombreArchivoValido($archivo) || !preg_match('/^[a-f0-9]{64}$/', $hash)) {
        $errores[] = $this->errorRegistro($fila, $archivo, 'Registro de imagen inválido.');
        continue;
      }
      if (!$this->servicioImagen->registroPerteneceEmpresa($tipo, $id, $idEmpresa)) {
        continue;
      }
      $validosPorHash[$hash][] = ['id' => $id, 'fila_excel' => $fila, 'archivo' => $archivo];
    }

    $subidas = 0;
    $reutilizadas = 0;
    foreach ($validosPorHash as $hash => $registrosHash) {
      $urlPublica = $this->servicioImagen->obtenerUrlExistente($idEmpresa, $tipo, $hash);
      $fueSubida = false;
      if ($urlPublica === null) {
        $archivoSubido = $this->archivoPorHash($hash);
        if ($archivoSubido === null) {
          foreach ($registrosHash as $registro) {
            $errores[] = $this->errorRegistro($registro['fila_excel'], $registro['archivo'], 'El archivo no fue recibido.');
          }
          continue;
        }
        try {
          $resultado = $this->servicioImagen->guardarArchivo($idEmpresa, $tipo, $archivoSubido, $hash);
          $urlPublica = $resultado['url'];
          $fueSubida = $resultado['subida'];
        } catch (RuntimeException $e) {
          foreach ($registrosHash as $registro) {
            $errores[] = $this->errorRegistro($registro['fila_excel'], $registro['archivo'], $e->getMessage());
          }
          continue;
        }
      }

      foreach ($registrosHash as $indice => $registro) {
        try {
          $actualizado = $this->servicioImagen->actualizarLogo($tipo, $registro['id'], $idEmpresa, $urlPublica);
        } catch (Throwable $e) {
          $actualizado = false;
        }
        if (!$actualizado) {
          $errores[] = $this->errorRegistro($registro['fila_excel'], $registro['archivo'], 'No se pudo actualizar logo_url.');
          continue;
        }
        if ($fueSubida && $indice === 0) {
          $subidas++;
        } else {
          $reutilizadas++;
        }
      }
    }

    if ($subidas > 0 || $reutilizadas > 0) {
      $this->servicioImagen->invalidarCacheEmpresa($idEmpresa);
    }
    echo json_encode(['success' => true, 'subidas' => $subidas, 'reutilizadas' => $reutilizadas, 'errores' => $errores]);
  }

  private function archivoPorHash(string $hash): ?array
  {
    if (!isset($_FILES['archivos']['tmp_name'][$hash])) {
      return null;
    }
    return [
      'name' => $_FILES['archivos']['name'][$hash] ?? '',
      'type' => $_FILES['archivos']['type'][$hash] ?? '',
      'tmp_name' => $_FILES['archivos']['tmp_name'][$hash] ?? '',
      'error' => $_FILES['archivos']['error'][$hash] ?? UPLOAD_ERR_NO_FILE,
      'size' => $_FILES['archivos']['size'][$hash] ?? 0,
    ];
  }

  private function obtenerJson(): array
  {
    $datos = json_decode(file_get_contents('php://input'), true);
    if (!is_array($datos)) {
      throw new InvalidArgumentException('El cuerpo JSON es inválido.');
    }
    return $datos;
  }

  private function nombreArchivoValido(string $archivo): bool
  {
    $extension = strtolower(pathinfo($archivo, PATHINFO_EXTENSION));
    return $archivo !== ''
      && basename($archivo) === $archivo
      && !str_contains($archivo, '..')
      && in_array($extension, ['jpg', 'jpeg', 'png', 'webp'], true);
  }

  private function errorRegistro(int $fila, string $archivo, string $error): array
  {
    return ['fila_excel' => $fila, 'archivo' => $archivo, 'error' => $error];
  }
}
