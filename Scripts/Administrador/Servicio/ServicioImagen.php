<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Modelo/Repositorio/ArticuloRepositorio.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Modelo/Repositorio/MarcaRepositorio.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Modelo/Repositorio/RubroRepositorio.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Modelo/Repositorio/ProveedorRepositorio.php';

class ServicioImagen
{
  private const URL_IMAGEN_VACIA = '/Archivos/Logos/Vacio.png';

  private const TIPOS = [
    'Articulo' => ['tabla' => 'articulo', 'id' => 'id'],
    'Marca' => ['tabla' => 'marca', 'id' => 'id'],
    'Rubro' => ['tabla' => 'rubro', 'id' => 'id'],
    'Proveedor' => ['tabla' => 'proveedor', 'id' => 'id'],
  ];
  private const MIME_EXTENSIONES = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
  ];
  private const EXTENSIONES_PERMITIDAS = ['jpg', 'jpeg', 'png', 'webp'];
  private const TAMANO_MAXIMO = 10485760;

  public function __construct(private PDO $pdo)
  {
  }

  public function validarTipo(string $tipo): string
  {
    foreach (array_keys(self::TIPOS) as $tipoValido) {
      if (strcasecmp($tipo, $tipoValido) === 0) {
        return $tipoValido;
      }
    }

    throw new InvalidArgumentException('Tipo de entidad de imagen inválido.');
  }

  public function obtenerExistentes(int $idEmpresa, string $tipo, array $hashes): array
  {
    $tipo = $this->validarTipo($tipo);
    if ($idEmpresa <= 0 || count($hashes) > 2000) {
      throw new InvalidArgumentException('La consulta de imágenes debe tener una empresa válida y hasta 2000 hashes.');
    }

    $existentes = [];
    foreach (array_unique($hashes) as $hash) {
      if (!is_string($hash) || !preg_match('/^[a-f0-9]{64}$/', $hash)) {
        continue;
      }
      if ($this->obtenerUrlPorHash($idEmpresa, $tipo, $hash) !== null) {
        $existentes[] = $hash;
      }
    }

    return $existentes;
  }

  public function empresaExiste(int $idEmpresa): bool
  {
    if ($idEmpresa <= 0) {
      return false;
    }
    $stmt = $this->pdo->prepare('SELECT 1 FROM empresa WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => $idEmpresa]);
    return (bool)$stmt->fetchColumn();
  }

  public function obtenerUrlExistente(int $idEmpresa, string $tipo, string $hash): ?string
  {
    $tipo = $this->validarTipo($tipo);
    if ($idEmpresa <= 0 || !preg_match('/^[a-f0-9]{64}$/', $hash)) {
      return null;
    }
    return $this->obtenerUrlPorHash($idEmpresa, $tipo, $hash);
  }

  public function guardarArchivo(int $idEmpresa, string $tipo, array $archivo, ?string $hashEsperado = null): array
  {
    $tipo = $this->validarTipo($tipo);
    if ($idEmpresa <= 0) {
      throw new InvalidArgumentException('El id_empresa es inválido.');
    }

    $codigoError = (int)($archivo['error'] ?? UPLOAD_ERR_NO_FILE);
    $temporal = $archivo['tmp_name'] ?? '';
    $nombreOriginal = (string)($archivo['name'] ?? '');
    $tamano = (int)($archivo['size'] ?? 0);

    if ($codigoError !== UPLOAD_ERR_OK || !is_string($temporal) || $temporal === '' || !is_uploaded_file($temporal)) {
      throw new RuntimeException('No se recibió un archivo válido.');
    }
    if ($tamano <= 0 || $tamano > self::TAMANO_MAXIMO) {
      throw new RuntimeException('La imagen supera el tamaño máximo permitido de 10 MB.');
    }

    $extensionOriginal = strtolower(pathinfo($nombreOriginal, PATHINFO_EXTENSION));
    if (!in_array($extensionOriginal, self::EXTENSIONES_PERMITIDAS, true)) {
      throw new RuntimeException('La extensión de la imagen no está permitida.');
    }

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($temporal);
    if (!isset(self::MIME_EXTENSIONES[$mime])) {
      throw new RuntimeException('El contenido del archivo no es una imagen permitida.');
    }

    $hashCalculado = hash_file('sha256', $temporal);
    if ($hashCalculado === false) {
      throw new RuntimeException('No se pudo calcular el hash de la imagen.');
    }
    if ($hashEsperado !== null && (!preg_match('/^[a-f0-9]{64}$/', $hashEsperado) || !hash_equals($hashEsperado, $hashCalculado))) {
      throw new RuntimeException('El hash de la imagen no coincide con el archivo recibido.');
    }

    $existente = $this->obtenerUrlPorHash($idEmpresa, $tipo, $hashCalculado);
    if ($existente !== null) {
      return ['url' => $existente, 'hash' => $hashCalculado, 'subida' => false];
    }

    $directorio = $this->directorioEmpresa($idEmpresa, $tipo);
    if (!is_dir($directorio) && !mkdir($directorio, 0755, true) && !is_dir($directorio)) {
      throw new RuntimeException('No se pudo crear el directorio de imágenes de la empresa.');
    }

    $extension = self::MIME_EXTENSIONES[$mime];
    $rutaDestino = $directorio . $hashCalculado . '.' . $extension;
    $bloqueo = fopen($rutaDestino . '.lock', 'c');
    if ($bloqueo === false) {
      throw new RuntimeException('No se pudo bloquear el archivo de imagen.');
    }

    try {
      if (!flock($bloqueo, LOCK_EX)) {
        throw new RuntimeException('No se pudo bloquear el archivo de imagen.');
      }

      $existente = $this->obtenerUrlPorHash($idEmpresa, $tipo, $hashCalculado);
      if ($existente !== null) {
        return ['url' => $existente, 'hash' => $hashCalculado, 'subida' => false];
      }
      if (!move_uploaded_file($temporal, $rutaDestino)) {
        throw new RuntimeException('No se pudo guardar la imagen en el servidor.');
      }
    } finally {
      flock($bloqueo, LOCK_UN);
      fclose($bloqueo);
    }

    return [
      'url' => $this->urlPorArchivo($idEmpresa, $tipo, basename($rutaDestino)),
      'hash' => $hashCalculado,
      'subida' => true,
    ];
  }

  public function registroPerteneceEmpresa(string $tipo, int $id, int $idEmpresa): bool
  {
    if ($id <= 0 || $idEmpresa <= 0) {
      return false;
    }

    $tipo = $this->validarTipo($tipo);
    return match ($tipo) {
      'Articulo' => (new ArticuloRepositorio($this->pdo))->existeParaEmpresa($id, $idEmpresa),
      'Marca' => (new MarcaRepositorio($this->pdo))->existeParaEmpresa($id, $idEmpresa),
      'Rubro' => (new RubroRepositorio($this->pdo))->existeParaEmpresa($id, $idEmpresa),
      'Proveedor' => (new ProveedorRepositorio($this->pdo))->existeParaEmpresa($id, $idEmpresa),
    };
  }

  public function actualizarLogo(string $tipo, int $id, int $idEmpresa, string $url): bool
  {
    $tipo = $this->validarTipo($tipo);
    return match ($tipo) {
      'Articulo' => (new ArticuloRepositorio($this->pdo))->actualizarLogo($id, $idEmpresa, $url),
      'Marca' => (new MarcaRepositorio($this->pdo))->actualizarLogo($id, $idEmpresa, $url),
      'Rubro' => (new RubroRepositorio($this->pdo))->actualizarLogo($id, $idEmpresa, $url),
      'Proveedor' => (new ProveedorRepositorio($this->pdo))->actualizarLogo($id, $idEmpresa, $url),
    };
  }

  public function borrarLote(int $idEmpresa, array $registros): int
  {
    $validos = [];
    $claves = [];

    foreach ($registros as $registro) {
      if (!is_array($registro)) {
        throw new InvalidArgumentException('Registro de borrado de imagen inválido.');
      }

      $tipo = $this->validarTipo((string)($registro['tipo'] ?? ''));
      $id = (int)($registro['id_registro'] ?? 0);
      $fila = (int)($registro['fila_excel'] ?? 0);
      if ($id <= 0 || $fila <= 0) {
        throw new InvalidArgumentException(
          "Fila del Excel: {$fila} | El registro marcado para borrar tiene datos inválidos."
        );
      }
      if (!$this->registroPerteneceEmpresa($tipo, $id, $idEmpresa)) {
        throw new InvalidArgumentException(
          "Fila del Excel: {$fila} | El registro {$id} de {$tipo} no existe para la empresa indicada."
        );
      }

      $clave = $tipo . ':' . $id;
      if (isset($claves[$clave])) {
        continue;
      }
      $claves[$clave] = true;
      $validos[] = ['tipo' => $tipo, 'id' => $id];
    }

    if (empty($validos)) {
      return 0;
    }

    $imagenesParaLimpiar = [];
    $this->pdo->beginTransaction();
    try {
      foreach ($validos as $registro) {
        $configuracion = self::TIPOS[$registro['tipo']];
        $tabla = $configuracion['tabla'];
        $idColumna = $configuracion['id'];

        $stmt = $this->pdo->prepare(
          "SELECT logo_url FROM {$tabla} WHERE {$idColumna} = :id AND id_empresa = :id_empresa FOR UPDATE"
        );
        $stmt->execute([
          ':id' => $registro['id'],
          ':id_empresa' => $idEmpresa,
        ]);
        $logoUrl = $stmt->fetchColumn();
        if ($logoUrl === false) {
          throw new RuntimeException(
            "El registro {$registro['id']} de {$registro['tipo']} ya no existe para la empresa indicada."
          );
        }

        $stmt = $this->pdo->prepare(
          "UPDATE {$tabla}
           SET logo_url = :logo_url
           WHERE {$idColumna} = :id AND id_empresa = :id_empresa"
        );
        $stmt->execute([
          ':logo_url' => self::URL_IMAGEN_VACIA,
          ':id' => $registro['id'],
          ':id_empresa' => $idEmpresa,
        ]);

        $ruta = $this->rutaImagenLocal($registro['tipo'], $idEmpresa, (string)$logoUrl);
        if ($ruta !== null) {
          $imagenesParaLimpiar[$ruta] = [
            'tipo' => $registro['tipo'],
            'url' => (string)$logoUrl,
          ];
        }
      }
      $this->pdo->commit();
    } catch (Throwable $e) {
      if ($this->pdo->inTransaction()) {
        $this->pdo->rollBack();
      }
      throw $e;
    }

    foreach ($imagenesParaLimpiar as $ruta => $imagen) {
      if ($this->imagenTieneReferencias($imagen['tipo'], $idEmpresa, $imagen['url'])) {
        continue;
      }
      if (is_file($ruta) && !unlink($ruta)) {
        throw new RuntimeException('No se pudo eliminar un archivo de imagen sin referencias.');
      }
    }

    $this->invalidarCacheEmpresa($idEmpresa);
    return count($validos);
  }

  public function invalidarCacheEmpresa(int $idEmpresa): void
  {
    $cacheDir = $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Cache/';
    $patrones = [
      "catalogos_empresa_{$idEmpresa}.json",
      "articulos_empresa_{$idEmpresa}.json",
      "articulos_rubro_*_empresa_{$idEmpresa}.json",
      "rubros_empresa_{$idEmpresa}.json",
      "grupos_empresa_{$idEmpresa}.json",
    ];
    foreach ($patrones as $patron) {
      foreach (glob($cacheDir . $patron) ?: [] as $archivo) {
        if (is_file($archivo)) {
          @unlink($archivo);
        }
      }
    }
  }

  private function directorioEmpresa(int $idEmpresa, string $tipo): string
  {
    return $_SERVER['DOCUMENT_ROOT'] . '/Archivos/Logos/' . $tipo . '/' . $idEmpresa . '/';
  }

  private function rutaImagenLocal(string $tipo, int $idEmpresa, string $url): ?string
  {
    $prefijo = '/Archivos/Logos/' . $tipo . '/' . $idEmpresa . '/';
    if (!str_starts_with($url, $prefijo)) {
      return null;
    }

    $archivo = substr($url, strlen($prefijo));
    if ($archivo === '' || basename($archivo) !== $archivo || str_contains($archivo, '..')) {
      return null;
    }

    return $this->directorioEmpresa($idEmpresa, $tipo) . $archivo;
  }

  private function imagenTieneReferencias(string $tipo, int $idEmpresa, string $url): bool
  {
    $configuracion = self::TIPOS[$tipo];
    $stmt = $this->pdo->prepare(
      "SELECT 1 FROM {$configuracion['tabla']}
       WHERE id_empresa = :id_empresa AND logo_url = :logo_url
       LIMIT 1"
    );
    $stmt->execute([
      ':id_empresa' => $idEmpresa,
      ':logo_url' => $url,
    ]);
    return $stmt->fetchColumn() !== false;
  }

  private function obtenerUrlPorHash(int $idEmpresa, string $tipo, string $hash): ?string
  {
    $directorio = $this->directorioEmpresa($idEmpresa, $tipo);
    foreach (glob($directorio . $hash . '.*') ?: [] as $ruta) {
      $extension = strtolower(pathinfo($ruta, PATHINFO_EXTENSION));
      if (in_array($extension, ['jpg', 'png', 'webp'], true) && is_file($ruta)) {
        return $this->urlPorArchivo($idEmpresa, $tipo, basename($ruta));
      }
    }
    return null;
  }

  private function urlPorArchivo(int $idEmpresa, string $tipo, string $archivo): string
  {
    return '/Archivos/Logos/' . $tipo . '/' . $idEmpresa . '/' . $archivo;
  }
}
