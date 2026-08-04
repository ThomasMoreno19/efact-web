<?php
class RubroRepositorio
{
  private PDO $pdo;


  public function __construct(PDO $pdo)
  {
    $this->pdo = $pdo;
  }


  public function obtenerTodos(int $id_empresa): array
  {
    $rubro = [];
    try {
      $stmt = $this->pdo->prepare("
                SELECT * FROM rubro
                WHERE id_empresa= :id_empresa
                ORDER BY nombre ASC;
                ");
      $stmt->bindParam(':id_empresa', $id_empresa, PDO::PARAM_INT);
      $stmt->execute();
      while ($data = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $rubro[] = [
          'id' => $data['id'],
          'nombre' => $data['nombre'],
          'id_empresa' => $data['id_empresa'],
          'logo_url' => $data['logo_url'],
        ];
      }
    } catch (PDOException $e) {
      error_log("Error al obtener todas las rubros: " . $e->getMessage());
    }
    return $rubro;
  }

  public function obtenerPorEmpresa(int $id_empresa): array
  {
    $rubros = [];
    try {
      $stmt = $this->pdo->prepare(
        "SELECT id, nombre, abreviatura, logo_url FROM rubro WHERE id_empresa = :id_empresa ORDER BY nombre ASC;"
      );
      $stmt->bindParam(':id_empresa', $id_empresa, PDO::PARAM_INT);
      $stmt->execute();
      while ($data = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $rubros[] = [
          'id'        => $data['id'],
          'nombre'    => $data['nombre'],
          'abreviatura' => $data['abreviatura'],
          'logo_url' => $data['logo_url'],
          'cantidad' => 0
        ];
      }
    } catch (PDOException $e) {
      error_log("Error al obtener rubros: " . $e->getMessage());
    }
    return $rubros;
  }

  public function crearListaCsv(array $rubros, int $id_empresa): bool
  {
    $unicos = [];
    $bajas = [];

    foreach ($rubros as $a) {
      if (empty($a['id_rubro'])) continue;

      if (!empty($a['baja'])) {
        $bajas[] = $a['id_rubro'];
        continue;
      }

      $unicos[$a['id_rubro']] = [
        'id' => $a['id_rubro'],
        'nombre' => $a['nombre_rubro'],
        'abreviatura' => $a['abreviatura_rubro'],
        'id_empresa' => $id_empresa
      ];
    }

    // Borrar las marcadas como baja (si existen)
    if (!empty($bajas)) {
      $placeholders = implode(',', array_fill(0, count($bajas), '?'));
      $stmtDelete = $this->pdo->prepare(
        "DELETE FROM rubro WHERE id_empresa = ? AND id IN ($placeholders)"
      );
      $stmtDelete->execute(array_merge([$id_empresa], $bajas));
    }

    if (empty($unicos)) return true;

    $values = [];
    $params = [];
    $i = 0;
    foreach ($unicos as $r) {
      $values[] = "(:id$i, :id_empresa$i, :nombre$i, :abreviatura$i, 1)";
      $params[":id$i"] = $r['id'];
      $params[":id_empresa$i"] = $id_empresa;
      $params[":nombre$i"] = $r['nombre'];
      $params[":abreviatura$i"] = $r['abreviatura'];
      $i++;
    }

    $sql = "INSERT INTO rubro (id, id_empresa, nombre, abreviatura, aparece_en_csv)
          VALUES " . implode(', ', $values) . "
          ON DUPLICATE KEY UPDATE
              nombre = VALUES(nombre),
              abreviatura = VALUES(abreviatura),
              id_empresa = VALUES(id_empresa),
              aparece_en_csv = 1;";

    try {
      $stmt = $this->pdo->prepare($sql);
      foreach ($params as $k => $v) {
        $stmt->bindValue($k, $v);
      }
      return $stmt->execute();
    } catch (PDOException $e) {
      throw $e;
    }
  }

  public function actualizarCatalogo(array $rubros, int $id_empresa): void
  {
    if (empty($rubros)) {
      return;
    }

    $rubrosAlta = [];
    $idsBaja = [];

    foreach ($rubros as $rubro) {

      if (!empty($rubro['baja'])) {
        $idsBaja[] = $rubro['id_rubro'];
      } else {
        $rubrosAlta[] = $rubro;
      }
    }

    // Eliminar rubros
    if (!empty($idsBaja)) {

      $placeholders = implode(',', array_fill(0, count($idsBaja), '?'));

      $sql = "
            DELETE FROM rubro
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
    if (!empty($rubrosAlta)) {
      $this->crearListaCsv($rubrosAlta, $id_empresa);
    }
  }

  public function modificar(int $id, int $id_empresa, string $nombre, string $logo_url): bool
  {
    try {
      $stmt = $this->pdo->prepare(
        "UPDATE rubro
                 SET nombre = :nombre,
                 logo_url = :logo_url
                 WHERE id = :id AND id_empresa = :id_empresa;"
      );

      $stmt->bindParam(':id', $id, PDO::PARAM_INT);
      $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
      $stmt->bindParam(':id_empresa', $id_empresa, PDO::PARAM_INT);
      $stmt->bindParam(':logo_url', $logo_url, PDO::PARAM_STR);

      if ($stmt->execute()) {
        return true;
      }
    } catch (PDOException $e) {
      error_log("Error al guardar nuevo rubro: " . $e->getMessage());
    }
    return false;
  }

  public function obtenerPorNombreEIdEmpresa(int $id_empresa, string $nombre): ?int
  {
    try {
      $stmt = $this->pdo->prepare("
                SELECT id FROM rubro
                WHERE nombre = :nombre AND id_empresa = :id_empresa
                LIMIT 1;");
      $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
      $stmt->bindParam(':id_empresa', $id_empresa, PDO::PARAM_INT);
      $stmt->execute();
      $data = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($data) {
        $stmt = $this->pdo->prepare(
          "UPDATE rubro
                     SET aparece_en_csv = 1
                     WHERE nombre = :nombre AND id_empresa = :id_empresa;"
        );
        $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
        $stmt->bindParam(':id_empresa', $id_empresa, PDO::PARAM_INT);
        $stmt->execute();
        return $data['id'];
      }
    } catch (PDOException $e) {
      error_log("Error al buscar rubro por nombre y empresa: " . $e->getMessage());
      throw new RuntimeException("Error interno al verificar existencia de rubro.", 0, $e);
    }
    return null;
  }

  public function eliminarNoUtilizados(int $id_empresa): bool
  {
    try {
      $stmt = $this->pdo->prepare(
        "DELETE FROM rubro 
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
      error_log("Error al eliminar rubro (PDOException): " . $e->getMessage());
      return false;
    }
  }

  public function setearCSVEn0(int $id_empresa): bool
  {
    try {
      $stmt = $this->pdo->prepare(
        "UPDATE rubro
                 SET aparece_en_csv = 0
                 WHERE id_empresa = :id_empresa;"
      );
      $stmt->bindParam(':id_empresa', $id_empresa, PDO::PARAM_INT);

      return $stmt->execute();
    } catch (PDOException $e) {
      error_log("Error al setear rubro a 0: " . $e->getMessage());
      return false;
    }
  }
}
