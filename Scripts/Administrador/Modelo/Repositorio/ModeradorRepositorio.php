<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Modelo/Entidad/ModeradorEntidad.php';

class ModeradorRepositorio
{
  private $pdo;


  public function __construct(PDO $pdo)
  {
    $this->pdo = $pdo;
  }


  public function obtenerPorValor(string $atributo, mixed $valor_min, mixed $valor_max): array
  {
    if ($this->sosAtributo($atributo)) {
      $stmt = $this->pdo->prepare("
            SELECT * FROM moderador 
            WHERE (" . $atributo . " BETWEEN :valor_min AND :valor_max)");
      $stmt->bindParam(':valor_min', $valor_min, PDO::PARAM_STR);
      $stmt->bindParam(':valor_max', $valor_max, PDO::PARAM_STR);
      $stmt->execute();
      $moderadores = [];
      while ($data = $stmt->fetch(PDO::FETCH_ASSOC))
        $moderadores[] = [
          $data['id'],
          $data['id_empresa'],
          $data['nombre'],
          $data['contrasena']
        ];
      return $moderadores;
    }
    throw new InvalidArgumentException("Atributo de búsqueda no permitido: " . $atributo);
  }


  public function obtenerTodos(): array
  {
    $moderadores = [];
    try {
      $stmt = $this->pdo->prepare("
                SELECT id, id_empresa, nombre FROM moderador
                ORDER BY nombre ASC;");
      $stmt->execute();

      while ($data = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $moderadores[] = [
          'id' => $data['id'],
          'nombre' => $data['nombre'],
          'id_empresa' => $data['id_empresa']
        ];
      }
    } catch (PDOException $e) {
      error_log("Error al obtener todos las moderadores: " . $e->getMessage());
    }
    return $moderadores;
  }

  public function obtenerPorNombre(string $nombre): ?array
  {
    $stmt = $this->pdo->prepare("SELECT id, id_empresa, nombre, contrasena FROM moderador WHERE nombre = :nombre");
    $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $moderadores = [];

    foreach ($rows as $data) {
      $moderadores[] = new Moderador(
        $data['id'],
        $data['id_empresa'],
        $data['nombre'],
        $data['contrasena']
      );
    }
    return $moderadores;
  }

  public function crear(int $id_empresa, string $nombre, string $contrasena): array
  {
    try {
      $contrasenaHasheada = password_hash($contrasena, PASSWORD_DEFAULT);

      $stmt = $this->pdo->prepare(
        "INSERT INTO moderador (id_empresa, nombre, contrasena)
                VALUES (:id_empresa, :nombre, :contrasena)"
      );

      $stmt->bindParam(':id_empresa', $id_empresa, PDO::PARAM_INT);
      $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
      $stmt->bindParam(':contrasena', $contrasenaHasheada, PDO::PARAM_STR);

      if ($stmt->execute()) {
        $id = $this->pdo->lastInsertId();
        return $moderador = [
          'id' => $id,
          'id_empresa' => $id_empresa,
          'nombre' => $nombre,
          'contrasena' => $contrasena
        ];
      }
    } catch (PDOException $e) {
      error_log("Error al guardar nuevo moderador: " . $e->getMessage());
    }
    return [];
  }

  public function modificar($id, $nombre, $contrasena): array
  {
    try {
      $contrasenaHasheada = password_hash($contrasena, PASSWORD_DEFAULT);
      $stmt = $this->pdo->prepare(
        "UPDATE moderador
                 SET nombre = :nombre,
                 contrasena = :contrasena
                 WHERE id = :id;"
      );

      $stmt->bindParam(':id', $id, PDO::PARAM_INT);
      $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
      $stmt->bindParam(':contrasena', $contrasenaHasheada, PDO::PARAM_STR);

      if ($stmt->execute()) {
        return $moderador = [$id, $nombre, $contrasena];
      }
    } catch (PDOException $e) {
      error_log("Error al modificar moderador: " . $e->getMessage());
    }
    return [];
  }

  public function modificarSinContrasena($id, $nombre): array
  {
    try {
      $stmt = $this->pdo->prepare(
        "UPDATE moderador
                 SET nombre = :nombre
                 WHERE id = :id;"
      );

      $stmt->bindParam(':id', $id, PDO::PARAM_INT);
      $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);

      if ($stmt->execute()) {
        return $moderador = [$id, $nombre];
      }
    } catch (PDOException $e) {
      error_log("Error al modificar moderador: " . $e->getMessage());
    }
    return [];
  }

  public function cambiarContrasena(int $id, string $contrasena): bool
  {
    try {
      $contrasenaHasheada = password_hash($contrasena, PASSWORD_DEFAULT);
      $sql = $this->pdo->prepare(
        "UPDATE moderador
                 SET contrasena = :contrasena
                 WHERE id = :id;"
      );

      $sql->bindParam(':id', $id, PDO::PARAM_INT);
      $sql->bindParam(':contrasena', $contrasenaHasheada, PDO::PARAM_STR);

      if ($sql->execute()) {
        return true;
      }
    } catch (PDOException $error) {
      error_log("Error al cambiar contrasena de moderador: " . $error->getMessage());
    }
    return false;
  }

  public function eliminar(int $id): bool
  {
    try {
      $sql = $this->pdo->prepare(
        "DELETE FROM moderador WHERE id = :id;"
      );

      $sql->bindParam(':id', $id, PDO::PARAM_INT);

      if ($sql->execute()) {
        return true;
      }
    } catch (PDOException $error) {
      error_log("Error al borrar moderador: " . $error->getMessage());
    }
    return false;
  }

  public function verificarContrasena(int $id, string $contrasenaString)
  {
    try {
      $sql = $this->pdo->prepare(
        "SELECT contrasena FROM moderador WHERE id = :id;"
      );

      $sql->bindParam(':id', $id, PDO::PARAM_INT);

      if ($sql->execute()) {
        $moderador = $sql->fetch(PDO::FETCH_ASSOC);
        $contrasenaHasheada = $moderador['contrasena'];
        return password_verify($contrasenaString, $contrasenaHasheada);
      }
      return false;
    } catch (PDOException $error) {
      error_log("Error al verificar la contrasena del moderador: " . $error->getMessage());
    }
    return false;
  }

  public function sosAtributo(string $atributo)
  {
    $atributosPermitidos = ['id_empresa', 'nombre'];
    return in_array($atributo, $atributosPermitidos);
  }

  public function obtenerPorEmpresa(int $id_empresa)
  {
    try {
      $sql = $this->pdo->prepare(
        "SELECT * FROM moderador WHERE id_empresa = :id_empresa;"
      );
      $sql->bindParam(':id_empresa', $id_empresa, PDO::PARAM_INT);
      $sql->execute();
      $data = $sql->fetch(PDO::FETCH_ASSOC);
      if ($data) {
        return [
          'id' => $data['id'],
          'nombre' => $data['nombre'],
          'contrasena' => $data['contrasena'],
        ];
      }
      return null;
    } catch (PDOException $error) {
      error_log("Error al obtener el moderador: " . $error->getMessage());
    }
    return null;
  }

  public function obtenerLogoEmpresa(int $id_empresa)
  {
    try {
      $sql = $this->pdo->prepare(
        "SELECT logo_url FROM Empresa WHERE id = :id_empresa;"
      );
      $sql->bindParam(':id_empresa', $id_empresa, PDO::PARAM_INT);
      $sql->execute();
      $empresa = $sql->fetch(PDO::FETCH_ASSOC);
      return $empresa = [$empresa['logo_url']];
    } catch (PDOException $error) {
      error_log("Error al verificar la empresa del moderador: " . $error->getMessage());
    }
    return null;
  }

  public function IniciarSesion(string $nombre, string $contrasenaTextoPlano, int $id_empresa)
  {
    $moderadores = $this->obtenerPorNombre($nombre);

    foreach ($moderadores as $moderador) {
      if ($moderador->getIdEmpresa() == $id_empresa && password_verify($contrasenaTextoPlano, $moderador->getContrasena())) {
        return true;
      }
    };
    return false;
  }
}
