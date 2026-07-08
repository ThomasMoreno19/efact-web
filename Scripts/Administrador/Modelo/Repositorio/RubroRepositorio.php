<?php
//Scripts/Administrador/Modelo/Repositorio/RubroRepositorio.php

require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Modelo/Entidad/RubroEntidad.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/c.php';
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
                SELECT * FROM Rubro
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
          'video_url' => $data['video_url'],
        ];
      }
    } catch (PDOException $e) {
      error_log("Error al obtener todas las rubros: " . $e->getMessage());
    }
    return $rubro;
  }

  public function obtenerParaCliente(int $id_empresa): array
  {
    $rubro = [];
    try {
      $stmt = $this->pdo->prepare("
                SELECT
                    id,
                    id_empresa,
                    nombre,
                    logo_url,
                    video_url
                FROM Rubro
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
          'video_url' => $data['video_url']
        ];
      }
    } catch (PDOException $e) {
      error_log("Error al obtener todas las rubros: " . $e->getMessage());
    }
    return $rubro;
  }


  public function crearListaCsv(array $articulos, int $id_empresa): bool
  {
    $unicos = [];
    foreach ($articulos as $a) {
      if (empty($a['id_rubro'])) continue;

      // Al usar el id_rubro como key, evitamos duplicados en el lote SQL
      $unicos[$a['id_rubro']] = [
        'id' => $a['id_rubro'],
        'nombre' => $a['nombre_rubro'],
        'id_empresa' => $id_empresa
      ];
    }

    if (empty($unicos)) return true;

    $values = [];
    $params = [];
    $i = 0;
    foreach ($unicos as $r) {
      $values[] = "(:id$i, :id_empresa$i, :nombre$i, 1, :logo_url$i, :video_url$i)";
      $params[":id$i"] = $r['id'];
      $params[":id_empresa$i"] = $id_empresa;
      $params[":nombre$i"] = $r['nombre'];
      $params[":logo_url$i"] = 'Archivos/Logos/Vacio.png';
      $params[":video_url$i"] = '';
      $i++;
    }

    $sql = "INSERT INTO Rubro (id, id_empresa, nombre, aparece_en_csv, logo_url, video_url)
          VALUES " . implode(', ', $values) . "
          ON DUPLICATE KEY UPDATE
              nombre = VALUES(nombre),
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

  public function modificar(int $id, int $id_empresa, string $nombre, string $logo_url): bool
  {
    try {
      $stmt = $this->pdo->prepare(
        "UPDATE Rubro
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
                SELECT id FROM Rubro
                WHERE nombre = :nombre AND id_empresa = :id_empresa
                LIMIT 1;");
      $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
      $stmt->bindParam(':id_empresa', $id_empresa, PDO::PARAM_INT);
      $stmt->execute();
      $data = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($data) {
        $stmt = $this->pdo->prepare(
          "UPDATE Rubro
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
        "DELETE FROM Rubro 
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
        "UPDATE Rubro
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

  public function agregarUrlVideo(int $id, int $id_empresa, string $video_url): bool
  {
    try {
      $stmt = $this->pdo->prepare(
        "UPDATE Rubro
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
        "UPDATE Rubro
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
