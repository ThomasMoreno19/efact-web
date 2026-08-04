<?php
//Scripts/Administrador/Modelo/Repositorio/ArticuloRepositorio.php


class ArticuloRepositorio
{
  private $pdo;

  public function __construct(PDO $pdo)
  {
    $this->pdo = $pdo;
  }

  public function obtenerTodos(int $id_rubro): array
  {
    $articulos = [];
    try {
      $stmt = $this->pdo->prepare("
                SELECT 
                    id, 
                    id_rubro,
                    id_marca,
                    id_proveedor,
                    nombre, 
                    precio1, 
                    precio2, 
                    precio3,
                    video_url,
                    ubicacion,
                    logo_url
                FROM articulo
                WHERE id_rubro = :id_rubro
                ORDER BY nombre ASC
            ");
      $stmt->bindParam(':id_rubro', $id_rubro, PDO::PARAM_INT);
      $stmt->execute();

      // ¡Devuelve directamente el array asociativo!
      $articulos = $stmt->fetchAll(PDO::FETCH_ASSOC);

      return $articulos;
    } catch (PDOException $e) {
      error_log("Error al obtener todos los artículos: " . $e->getMessage());
      return [];
    }
  }

  public function obtenerTodosPorEmpresa(int $id_empresa): array
  {
    try {
      $stmt = $this->pdo->prepare("
                SELECT
                    id,
                    id_rubro,
                    id_marca,
                    id_proveedor,
                    codigo_interno,
                    nombre,
                    precio1,
                    precio2,
                    precio3,
                    no_procesado,
                    oferta,
                    ubicacion,
                    video_url,
                    logo_url
                FROM articulo
                WHERE id_empresa = :id_empresa
                ORDER BY id_rubro ASC, nombre ASC
            ");

      $stmt->bindParam(':id_empresa', $id_empresa, PDO::PARAM_INT);
      $stmt->execute();

      return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
      error_log("Error al obtener artículos por empresa: " . $e->getMessage());
      return [];
    }
  }

  public function obtenerParaCliente(int $id_empresa): array
  {
    try {
      $stmt = $this->pdo->prepare("
            SELECT
                a.id,
                a.id_rubro,
                a.id_marca,
                m.nombre AS nombre_marca,
                a.id_proveedor,
                p.nombre AS nombre_proveedor,
                a.codigo_proveedor,
                a.existencia,
                a.codigo_interno,
                a.nombre,
                a.precio1,
                a.precio2,
                a.precio3,
                a.no_procesado,
                a.oferta,
                a.ubicacion,
                a.video_url,
                a.logo_url
            FROM articulo a
            LEFT JOIN marca m
                ON a.id_marca = m.id
                AND a.id_empresa = m.id_empresa
            LEFT JOIN proveedor p
                ON a.id_proveedor = p.id
                AND a.id_empresa = p.id_empresa
            WHERE a.id_empresa = :id_empresa
            ORDER BY a.id_rubro ASC, a.nombre ASC
        ");

      $stmt->bindParam(':id_empresa', $id_empresa, PDO::PARAM_INT);
      $stmt->execute();

      return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
      error_log("Error al obtener artículos por empresa: " . $e->getMessage());
      return [];
    }
  }

  public function crearListaCsv(array $articulos, int $id_empresa): array
  {
    if (empty($articulos)) {
      return [];
    }

    $unicos = [];
    $bajas = [];

    foreach ($articulos as $a) {
      if (empty($a['id_articulo'])) continue;

      if (!empty($a['baja'])) {
        $bajas[] = $a['id_articulo'];
        continue;
      }

      $unicos[] = $a;
    }

    // Borrar los artículos dados de baja (si existen)
    if (!empty($bajas)) {
      $placeholders = implode(',', array_fill(0, count($bajas), '?'));
      $stmtDelete = $this->pdo->prepare(
        "DELETE FROM articulo WHERE id_empresa = ? AND id IN ($placeholders)"
      );
      $stmtDelete->execute(array_merge([$id_empresa], $bajas));
    }

    if (empty($unicos)) {
      return [];
    }

    $values = [];
    $params = [];

    foreach ($unicos as $i => $a) {

      $values[] = "(
            :id$i,
            :id_rubro$i,
            :id_marca$i,
            :id_proveedor$i,
            :id_empresa$i,
            :nombre$i,
            :precio1$i,
            :precio2$i,
            :precio3$i,
            :existencia$i,
            :no_procesado$i,
            :oferta$i,
            :codigo_interno$i,
            :codigo_barra$i,
            :codigo_proveedor$i,
            1,
            :abreviatura$i,
            :ubicacion$i,
            :logo_url$i,
            :video_url$i
        )";

      $params[":id$i"] = $a['id_articulo'];
      $params[":id_rubro$i"] = $a['id_rubro'] ?: null;
      $params[":id_marca$i"] = $a['id_marca'] ?: null;
      $params[":id_proveedor$i"] = $a['id_proveedor'] ?: null;
      $params[":id_empresa$i"] = $id_empresa;

      $params[":nombre$i"] = $a['nombre_articulo'];

      $params[":precio1$i"] = (string) $a['precio1'];
      $params[":precio2$i"] = (string) $a['precio2'];
      $params[":precio3$i"] = (string) $a['precio3'];

      $params[":existencia$i"] = (string) $a['existencia'];
      $params[":no_procesado$i"] = !empty($a['no_procesado']) ? 1 : 0;
      $params[":oferta$i"] = !empty($a['oferta']) ? 1 : 0;

      $params[":abreviatura$i"] = $a['abreviatura'] ?: null;
      $params[":ubicacion$i"] = $a['ubicacion'] ?: null;

      $params[":codigo_interno$i"] = $a['codigo_interno'];
      $params[":codigo_barra$i"] = $a['codigo_barra'] ?: null;
      $params[":codigo_proveedor$i"] = $a['codigo_proveedor'] ?: null;

      $params[":logo_url$i"] = 'Archivos/Logos/Vacio.png';
      $params[":video_url$i"] = '';
    }

    $sql = "
        INSERT INTO articulo (
            id,
            id_rubro,
            id_marca,
            id_proveedor,
            id_empresa,
            nombre,
            precio1,
            precio2,
            precio3,
            existencia,
            no_procesado,
            oferta,
            codigo_interno,
            codigo_barra,
            codigo_proveedor,
            aparece_en_csv,
            abreviatura,
            ubicacion,
            logo_url,
            video_url
        )
        VALUES " . implode(',', $values) . "
        ON DUPLICATE KEY UPDATE
            id_rubro = VALUES(id_rubro),
            id_marca = VALUES(id_marca),
            id_proveedor = VALUES(id_proveedor),
            nombre = VALUES(nombre),
            precio1 = VALUES(precio1),
            precio2 = VALUES(precio2),
            precio3 = VALUES(precio3),
            existencia = VALUES(existencia),
            no_procesado = VALUES(no_procesado),
            oferta = VALUES(oferta),
            abreviatura = VALUES(abreviatura),
            ubicacion = VALUES(ubicacion),
            codigo_interno = VALUES(codigo_interno),
            codigo_barra = VALUES(codigo_barra),
            codigo_proveedor = VALUES(codigo_proveedor),
            aparece_en_csv = 1;
    ";

    try {
      $stmt = $this->pdo->prepare($sql);

      foreach ($params as $clave => $valor) {
        $stmt->bindValue($clave, $valor);
      }

      $stmt->execute();

      return $unicos;
    } catch (PDOException $e) {
      throw $e;
    }
  }

  public function actualizarCatalogo(array $articulos, int $id_empresa): void
  {
    if (empty($articulos)) {
      return;
    }

    $articulosAlta = [];
    $idsBaja = [];

    foreach ($articulos as $articulo) {

      if (!empty($articulo['baja'])) {
        $idsBaja[] = $articulo['id_articulo'];
      } else {
        $articulosAlta[] = $articulo;
      }
    }

    // Eliminar artículos
    if (!empty($idsBaja)) {

      $placeholders = implode(',', array_fill(0, count($idsBaja), '?'));

      $sql = "
            DELETE FROM articulo
            WHERE id_empresa = ?
              AND id IN ($placeholders)
        ";

      $stmt = $this->pdo->prepare($sql);

      $stmt->bindValue(1, $id_empresa, PDO::PARAM_INT);

      foreach ($idsBaja as $i => $id) {
        $stmt->bindValue($i + 2, $id);
      }

      $stmt->execute();
    }

    // Insertar / Actualizar
    if (!empty($articulosAlta)) {
      $this->crearListaCsv($articulosAlta, $id_empresa);
    }
  }

  public function modificar(int $id, int $id_empresa, string $nombre, string $precio1, string $precio2, string $precio3, string $logo_url): bool
  {
    try {
      $stmt = $this->pdo->prepare(
        "UPDATE articulo
                 SET nombre = :nombre,
                    precio1 = :precio1,
                    precio2 = :precio2,
                    precio3 = :precio3,
                    logo_url = :logo_url
                 WHERE id = :id AND id_empresa = :id_empresa"
      );

      $stmt->bindParam(':id', $id, PDO::PARAM_INT);
      $stmt->bindParam(':id_empresa', $id_empresa, PDO::PARAM_INT);
      $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
      $stmt->bindParam(':precio1', $precio1, PDO::PARAM_STR);
      $stmt->bindParam(':precio2', $precio2, PDO::PARAM_STR);
      $stmt->bindParam(':precio3', $precio3, PDO::PARAM_STR);
      $stmt->bindParam(':logo_url', $logo_url, PDO::PARAM_STR);

      if ($stmt->execute()) {
        return true;
      }
    } catch (PDOException $e) {
      error_log("Error al guardar nueva articulo: " . $e->getMessage());
    }
    return false;
  }

  public function eliminarNoUtilizados(int $id_empresa): bool
  {
    try {
      $stmt = $this->pdo->prepare(
        "DELETE FROM articulo 
            WHERE aparece_en_csv = 0 AND id_empresa = :id_empresa;"
      );
      $stmt->bindParam(':id_empresa', $id_empresa, PDO::PARAM_INT);

      $exito = $stmt->execute();

      if ($exito) {
        $filas_afectadas = $stmt->rowCount();
        if ($filas_afectadas > 0) {
          return true;
        } else {
          return false;
        }
      } else {
        // Esto solo se ejecuta si execute() devuelve false, lo cual es raro con PDO.
        error_log("La ejecución del DELETE falló. Puede que el statement no sea válido.");
        return false;
      }
    } catch (PDOException $e) {
      // Esto captura la mayoría de los errores, como problemas de conexión o permisos.
      error_log("Error al eliminar articulo (PDOException): " . $e->getMessage());
      return false;
    }
  }

  public function setearCSVEn0(int $id_empresa): bool
  {
    try {
      $stmt = $this->pdo->prepare(
        "UPDATE articulo
                 SET aparece_en_csv = 0
                 WHERE id_empresa = :id_empresa;"
      );
      $stmt->bindParam(':id_empresa', $id_empresa, PDO::PARAM_INT);

      return $stmt->execute();
    } catch (PDOException $e) {
      error_log("Error al setear el articulo a 0: " . $e->getMessage());
      return false;
    }
  }

  public function agregarUrlVideo(int $id, int $id_empresa, string $video_url): bool
  {
    try {
      $stmt = $this->pdo->prepare(
        "UPDATE articulo
             SET video_url = :video_url
             WHERE id = :id AND id_empresa = :id_empresa;"
      );

      $stmt->bindParam(':id', $id, PDO::PARAM_INT);
      $stmt->bindParam(':id_empresa', $id_empresa, PDO::PARAM_INT);
      $stmt->bindParam(':video_url', $video_url, PDO::PARAM_STR);

      if ($stmt->execute()) {
        return true;
      }
    } catch (PDOException $e) {
      error_log("Error al agregar URL de video al artículo: " . $e->getMessage());
    }
    return false;
  }

  public function eliminarUrlVideo(int $id, int $id_empresa): bool
  {
    try {
      $stmt = $this->pdo->prepare(
        "UPDATE articulo
             SET video_url = ''
             WHERE id = :id AND id_empresa = :id_empresa;"
      );

      $stmt->bindParam(':id', $id, PDO::PARAM_INT);
      $stmt->bindParam(':id_empresa', $id_empresa, PDO::PARAM_INT);

      if ($stmt->execute()) {
        return true;
      }
    } catch (PDOException $e) {
      error_log("Error al eliminar URL de video del artículo: " . $e->getMessage());
    }
    return false;
  }
}
