<?php

class EmpresaRepositorio
{
  private $pdo;
  public function __construct(PDO $pdo)
  {
    $this->pdo = $pdo;
  }

  public function obtenerPorId(int $id): ?array
  {
    $stmt = $this->pdo->prepare("
      SELECT 
        *
      FROM empresa 
      WHERE id = :id
    ");

    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    $data = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($data) {
      return $empresa = [
        'id' => $data['id'],
        'nombre' => $data['nombre'],
        'logo_url' => $data['logo_url'],
        'telefono' => $data['telefono'],
        'ubicacion' => $data['ubicacion'],
        'tieneCarrito' => $data['tieneCarrito'],
        'deshabilitarExcel' => $data['deshabilitar_excel'],
        'fecha_creacion' => $data['fecha_creacion'],
        'imagenesEnArticulos' => $data['imagenesEnArticulos'],
        'incluirHorarios' => $data['incluirHorarios'],
        'incluirCodigoBarra' => $data['incluirCodigoBarra'],
      ];
    }

    return null;
  }

  public function obtenerTodas(): array
  {
    $empresas = [];
    try {
      $stmt = $this->pdo->query(
        "SELECT * FROM empresa ORDER BY nombre ASC;"
      );
      while ($data = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $empresas[] = [
          'id' => $data['id'],
          'nombre' => $data['nombre'],
          'telefono' => $data['telefono'],
          'ubicacion' => $data['ubicacion'],
          'tieneCarrito' => $data['tieneCarrito'],
          'deshabilitarExcel' => $data['deshabilitar_excel'],
          'logo_url' => $data['logo_url'],
          'fecha_creacion' => $data['fecha_creacion'],
          'imagenesEnArticulos' => $data['imagenesEnArticulos'],
          'incluirHorarios' => $data['incluirHorarios'],
          'incluirCodigoBarra' => $data['incluirCodigoBarra'],
        ];
      }
    } catch (PDOException $e) {
      error_log("Error al obtener todas las empresas: " . $e->getMessage());
    }
    return $empresas;
  }

  public function modificar(int $id, string $nombre, string $ubicacion, string $telefono, bool $tieneCarrito, bool $deshabilitar_excel, ?string $logo_url = null): bool
  {
    try {
      $sql = "UPDATE empresa
          SET nombre = :nombre,
          telefono = :telefono,
          ubicacion = :ubicacion,
          tieneCarrito = :tieneCarrito,
          deshabilitar_excel = :deshabilitar_excel";

      if ($logo_url !== null && $logo_url !== '') {
        $sql .= ", logo_url = :logo_url";
      }

      $sql .= " WHERE id = :id;";

      $stmt = $this->pdo->prepare($sql);

      $stmt->bindParam(':id', $id, PDO::PARAM_INT);
      $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
      $stmt->bindParam(':telefono', $telefono, PDO::PARAM_STR);
      $stmt->bindParam(':ubicacion', $ubicacion, PDO::PARAM_STR);
      $stmt->bindParam(':tieneCarrito', $tieneCarrito, PDO::PARAM_BOOL);
      $stmt->bindParam(':deshabilitar_excel', $deshabilitar_excel, PDO::PARAM_BOOL);

      if ($logo_url !== null && $logo_url !== '') {
        $stmt->bindParam(':logo_url', $logo_url, PDO::PARAM_STR);
      }

      return $stmt->execute();
    } catch (PDOException $e) {
      error_log("Error al modificar la empresa: " . $e->getMessage());
      return false;
    }
  }

  public function modificarParaModerador(int $id, string $nombre, string $ubicacion, string $telefono, bool $imagenesEnArticulos, bool $incluirHorarios, bool $incluirCodigoBarra): bool
  {
    try {
      $sql = "UPDATE empresa
          SET nombre = :nombre,
          telefono = :telefono,
          ubicacion = :ubicacion,
          imagenesEnArticulos = :imagenesEnArticulos,
          incluirHorarios = :incluirHorarios,
          incluirCodigoBarra = :incluirCodigoBarra";

      $sql .= " WHERE id = :id;";

      $stmt = $this->pdo->prepare($sql);

      $stmt->bindParam(':id', $id, PDO::PARAM_INT);
      $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
      $stmt->bindParam(':telefono', $telefono, PDO::PARAM_STR);
      $stmt->bindParam(':ubicacion', $ubicacion, PDO::PARAM_STR);
      $stmt->bindParam(':imagenesEnArticulos', $imagenesEnArticulos, PDO::PARAM_BOOL);
      $stmt->bindParam(':incluirHorarios', $incluirHorarios, PDO::PARAM_BOOL);
      $stmt->bindParam(':incluirCodigoBarra', $incluirCodigoBarra, PDO::PARAM_BOOL);
      return $stmt->execute();
    } catch (PDOException $e) {
      error_log("Error al modificar la empresa: " . $e->getMessage());
      return false;
    }
  }

  public function modificarLogo(int $id, string $logo_url): ?array
  {
    try {
      $stmt = $this->pdo->prepare(
        "UPDATE empresa
          SET logo_url = :logo_url
          WHERE id = :id;"
      );

      $stmt->bindParam(':id', $id, PDO::PARAM_INT);
      $stmt->bindParam(':logo_url', $logo_url, PDO::PARAM_STR);

      if ($stmt->execute()) {
        return [
          'id' => $id,
          'logo_url' => $logo_url
        ];
      } else {
        error_log("Falló la ejecución del UPDATE en modificarLogo().");
      }
    } catch (PDOException $e) {
      error_log("Error al modificar el logo de la empresa: " . $e->getMessage());
    }
    return null;
  }

  public function crear(string $nombre, string $logo_url, string $telefono, string $ubicacion, bool $tieneCarrito, bool $deshabilitar_excel): array
  {
    try {
      $fecha_actual = date('Y-m-d');
      $stmt = $this->pdo->prepare(
        "INSERT INTO empresa (nombre, fecha_creacion, logo_url, telefono, ubicacion, tieneCarrito, deshabilitar_excel) 
        VALUES (:nombre, :fecha_actual, :logo_url, :telefono, :ubicacion, :tieneCarrito, :deshabilitar_excel)"
      );
      $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
      $stmt->bindParam(':logo_url', $logo_url, PDO::PARAM_STR);
      $stmt->bindParam(':telefono', $telefono, PDO::PARAM_STR);
      $stmt->bindParam(':ubicacion', $ubicacion, PDO::PARAM_STR);
      $stmt->bindParam(':tieneCarrito', $tieneCarrito, PDO::PARAM_BOOL);
      $stmt->bindParam(':deshabilitar_excel', $deshabilitar_excel, PDO::PARAM_BOOL);
      $stmt->bindParam(':fecha_actual', $fecha_actual, PDO::PARAM_STR);
      $stmt->execute();


      $id = $this->pdo->lastInsertId();
      $stmt = $this->pdo->prepare("SELECT * FROM empresa WHERE id = :id");
      $stmt->bindParam(':id', $id, PDO::PARAM_INT);
      $stmt->execute();


      $data = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($data) {
        return [
          'id' => $data['id'],
          'nombre' => $data['nombre'],
          'fecha_creacion' => $data['fecha_creacion'],
          'logo_url' => $data['logo_url'],
          'telefono' => $data['telefono'],
          'ubicacion' => $data['ubicacion'],
          'tieneCarrito' => $data['tieneCarrito'],
          'deshabilitar_excel' => $data['deshabilitar_excel']
        ];
      }
    } catch (PDOException $e) {
      error_log("Error al guardar nueva empresa: " . $e->getMessage());
    }
    return [];
  }

  public function guardarHorarios(int $id_empresa, array $horarios): bool
  {
    try {
      $this->pdo->beginTransaction();

      // 1) Borrar horarios anteriores
      $stmtDelete = $this->pdo->prepare(
        "DELETE FROM horarios_empresa WHERE id_empresa = :id_empresa"
      );
      $stmtDelete->bindParam(':id_empresa', $id_empresa, PDO::PARAM_INT);
      $stmtDelete->execute();

      // 2) Preparar insert
      $stmtInsert = $this->pdo->prepare(
        "INSERT INTO horarios_empresa (id_empresa, dia_semana, hora_apertura, hora_cierre)
        VALUES (:id_empresa, :dia_semana, :hora_apertura, :hora_cierre)"
      );

      // 3) Recorrer tu payload agrupado
      foreach ($horarios as $diaObj) {

        if (!isset($diaObj['diaIndex'], $diaObj['rangos']) || !is_array($diaObj['rangos'])) {
          throw new Exception("Formato de horario inválido (día sin rangos).");
        }

        $dia_semana = (int)$diaObj['diaIndex'];

        if ($dia_semana < 0 || $dia_semana > 6) {
          throw new Exception("Día inválido: $dia_semana");
        }

        foreach ($diaObj['rangos'] as $rango) {

          if (!isset($rango['apertura'], $rango['cierre'])) {
            throw new Exception("Formato de rango inválido.");
          }

          $apertura = $rango['apertura'];
          $cierre = $rango['cierre'];

          $stmtInsert->bindParam(':id_empresa', $id_empresa, PDO::PARAM_INT);
          $stmtInsert->bindParam(':dia_semana', $dia_semana, PDO::PARAM_INT);
          $stmtInsert->bindParam(':hora_apertura', $apertura, PDO::PARAM_STR);
          $stmtInsert->bindParam(':hora_cierre', $cierre, PDO::PARAM_STR);

          $stmtInsert->execute();
        }
      }

      $this->pdo->commit();
      return true;
    } catch (Exception $e) {
      $this->pdo->rollBack();
      error_log("Error al guardar horarios (empresa $id_empresa): " . $e->getMessage());
      throw $e;
    }
  }

  public function obtenerHorarios(int $id_empresa): array
  {
    try {
      $stmt = $this->pdo->prepare(
        "SELECT dia_semana, hora_apertura, hora_cierre
         FROM horarios_empresa
         WHERE id_empresa = :id_empresa
         ORDER BY dia_semana ASC, hora_apertura ASC"
      );
      $stmt->bindParam(':id_empresa', $id_empresa, PDO::PARAM_INT);
      $stmt->execute();

      $porDia = [];

      while ($fila = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $diaIndex = (int)$fila['dia_semana'];

        if (!isset($porDia[$diaIndex])) {
          $porDia[$diaIndex] = [
            'diaIndex' => $diaIndex,
            'rangos' => []
          ];
        }

        $porDia[$diaIndex]['rangos'][] = [
          'apertura' => substr($fila['hora_apertura'], 0, 5),
          'cierre' => substr($fila['hora_cierre'], 0, 5),
        ];
      }

      ksort($porDia);

      return [
        'horarios' => array_values($porDia),
      ];
    } catch (PDOException $e) {
      error_log("Error al obtener horarios y no laborales (empresa $id_empresa): " . $e->getMessage());
      throw $e;
    }
  }

  public function eliminar(int $id): bool
  {
    try {
      // Una sola consulta multitabla
      $this->pdo->beginTransaction();

      $this->pdo->prepare("DELETE FROM articulo WHERE id_empresa = ?")->execute([$id]);
      $this->pdo->prepare("DELETE FROM horarios_empresa WHERE id_empresa = ?")->execute([$id]);
      $this->pdo->prepare("DELETE FROM interno WHERE id_empresa = ?")->execute([$id]);
      $this->pdo->prepare("DELETE FROM externo WHERE id_empresa = ?")->execute([$id]);
      $this->pdo->prepare("DELETE FROM moderador WHERE id_empresa = ?")->execute([$id]);
      $this->pdo->prepare("DELETE FROM rubro WHERE id_empresa = ?")->execute([$id]);
      $this->pdo->prepare("DELETE FROM proveedor WHERE id_empresa = ?")->execute([$id]);
      $this->pdo->prepare("DELETE FROM marca WHERE id_empresa = ?")->execute([$id]);

      $this->pdo->prepare("DELETE FROM empresa WHERE id = ?")->execute([$id]);

      $this->pdo->commit();

      return true;
    } catch (PDOException $e) {
      error_log("Error al eliminar empresa y relacionados en una consulta ($id): " . $e->getMessage());
      throw $e;
    }
  }
}
