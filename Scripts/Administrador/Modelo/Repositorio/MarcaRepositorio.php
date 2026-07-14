<?php

class MarcaRepositorio
{
  private $pdo;
  public function __construct(PDO $pdo)
  {
    $this->pdo = $pdo;
  }

  public function obtenerPorEmpresa(int $id_empresa): array
  {
    $marcas = [];
    try {
      $stmt = $this->pdo->prepare(
        "SELECT id, nombre, abreviatura, logo_url FROM marca WHERE id_empresa = :id_empresa ORDER BY nombre ASC;"
      );
      $stmt->bindParam(':id_empresa', $id_empresa, PDO::PARAM_INT);
      $stmt->execute();
      while ($data = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $marcas[] = [
          'id'        => $data['id'],
          'nombre'    => $data['nombre'],
          'abreviatura' => $data['abreviatura'],
          'logo_url' => $data['logo_url'],
        ];
      }
    } catch (PDOException $e) {
      error_log("Error al obtener marcas: " . $e->getMessage());
    }
    return $marcas;
  }

  public function crear(int $id, int $id_empresa, string $nombre): bool
  {
    try {
      $stmt = $this->pdo->prepare(
        "INSERT INTO marca (id, id_empresa, nombre) VALUES (:id, :id_empresa, :nombre);"
      );
      $stmt->bindParam(':id',        $id,        PDO::PARAM_INT);
      $stmt->bindParam(':id_empresa', $id_empresa, PDO::PARAM_INT);
      $stmt->bindParam(':nombre',    $nombre,    PDO::PARAM_STR);
      return $stmt->execute();
    } catch (PDOException $e) {
      error_log("Error al crear marca: " . $e->getMessage());
      return false;
    }
  }

  public function crearListaCsv(array $articulos, int $id_empresa): bool
  {
    $unicos = [];
    foreach ($articulos as $a) {
      if (empty($a['id_marca'])) continue;

      // Al usar el id_marca como key, evitamos duplicados en el lote SQL
      $unicos[$a['id_marca']] = [
        'id' => $a['id_marca'],
        'nombre' => $a['nombre_marca'],
        'abreviatura' => $a['abreviatura_marca'],
        'id_empresa' => $id_empresa
      ];
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

    $sql = "INSERT INTO Marca (id, id_empresa, nombre, abreviatura, aparece_en_csv)
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

  public function setearCSVEn0(int $id_empresa): bool
  {
    try {
      $stmt = $this->pdo->prepare(
        "UPDATE Marca
                 SET aparece_en_csv = 0
                 WHERE id_empresa = :id_empresa;"
      );
      $stmt->bindParam(':id_empresa', $id_empresa, PDO::PARAM_INT);

      return $stmt->execute();
    } catch (PDOException $e) {
      error_log("Error al setear marca a 0: " . $e->getMessage());
      return false;
    }
  }

  public function eliminarNoUtilizados(int $id_empresa): bool
  {
    try {
      $stmt = $this->pdo->prepare(
        "DELETE FROM Marca 
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
      error_log("Error al eliminar marca (PDOException): " . $e->getMessage());
      return false;
    }
  }

  public function modificar(int $id, int $id_empresa, string $nombre, string $logo_url): bool
  {
    try {
      $stmt = $this->pdo->prepare(
        "UPDATE Marca
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
      error_log("Error al guardar nuevo marca: " . $e->getMessage());
    }
    return false;
  }
}
