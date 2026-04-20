<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Modelo/Entidad/MeseroEntidad.php';

class MeseroRepositorio {
  private $pdo;

  public function __construct(PDO $pdo) {
    $this->pdo = $pdo;
  }

  public function obtenerPorNombre(string $nombre): ?array {
    $stmt = $this->pdo->prepare("SELECT id, id_empresa, nombre, contrasena FROM Mesero WHERE nombre = :nombre");
    $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $meseros = [];

    foreach ($rows as $data) {
      $meseros[] = new Mesero(
        $data['id'],
        $data['id_empresa'],
        $data['nombre'],
        $data['abreviatura_nombre'],
        $data['usuario'],
        $data['contrasena']
      );
    }
    return $meseros;
  }
  
  public function crear(int $id_empresa, string $nombre, string $abreviaturaNombre, string $contrasena = ''): bool{
    try {
      if(!empty($contrasena)) {
        $contrasenaHasheada = password_hash($contrasena, PASSWORD_DEFAULT);
      }
      
      $stmt = $this->pdo->prepare(
        "INSERT INTO Mesero (id_empresa, nombre, abreviaturaNombre, contrasena)
          VALUES (:id_empresa, :nombre, :abreviaturaNombre, :contrasena)");
      $stmt->bindParam(':id_empresa', $id_empresa, PDO::PARAM_INT);
      $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
      $stmt->bindParam(':abreviaturaNombre', $abreviaturaNombre, PDO::PARAM_STR);
      $stmt->bindParam(':contrasena', $contrasenaHasheada, PDO::PARAM_STR);

      if ($stmt->execute()) {
        return true;
      }
    } catch (PDOException $e) {
      error_log("Error al guardar nuevo mesero: " . $e->getMessage());
      return false;
    }
    return false;
  }

  public function cargar(array $meseros, int $id_empresa): bool {
    if (empty($meseros)) return false;

    $values = [];
    $params = [];

    foreach ($meseros as $i => $m) {

      if (!isset($m['codigo'], $m['nombre'])) {
        error_log("Mesero inválido en índice $i: " . json_encode($m));
        continue;
      }

      $values[] = "(:codigo$i, :nombre$i, :abreviaturaNombre$i, :contrasena$i, :id_empresa$i)";

      $params[":codigo$i"] = $m['codigo'];
      $params[":nombre$i"] = $m['nombre'];
      $params[":abreviaturaNombre$i"] = $m['abreviaturaNombre'] ?? null;
      $params[":contrasena$i"] = $m['contrasena'] ?? null;
      $params[":id_empresa$i"] = $id_empresa;
    }

    if (empty($values)) {
      error_log("No hay valores válidos para insertar");
      return false;
    }

    $sqlInsert = "INSERT INTO Mesero (codigo, nombre, abreviaturaNombre, contrasena, id_empresa)
                  VALUES " . implode(', ', $values);

    try {
      $this->pdo->beginTransaction();

      // 1. DELETE
      $stmtDelete = $this->pdo->prepare("DELETE FROM Mesero WHERE id_empresa = :id_empresa");
      $stmtDelete->bindValue(":id_empresa", $id_empresa);
      $stmtDelete->execute();

      // 2. INSERT
      $stmtInsert = $this->pdo->prepare($sqlInsert);

      foreach ($params as $k => $v) {
        $stmtInsert->bindValue($k, $v);
      }

      $stmtInsert->execute();

      $this->pdo->commit();

      error_log("Meseros reemplazados: " . count($meseros));

      return true;

    } catch (PDOException $e) {

      $this->pdo->rollBack();

      error_log("SQL ERROR: " . $e->getMessage());
      error_log("SQL INSERT: " . $sqlInsert);
      error_log("PARAMS: " . json_encode($params));

      return false;
    }
  }
  
  public function modificar($id, $nombre, $abreviaturaNombre, $contrasena): array {
    try {
      $contrasenaHasheada = password_hash($contrasena, PASSWORD_DEFAULT);
      $stmt = $this->pdo->prepare(
        "UPDATE Mesero
          SET nombre = :nombre,
          abreviaturaNombre = :abreviaturaNombre,
          contrasena = :contrasena
          WHERE id = :id;");
      $stmt->bindParam(':id', $id, PDO::PARAM_INT);
      $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
      $stmt->bindParam(':abreviaturaNombre', $abreviaturaNombre, PDO::PARAM_STR); 
      $stmt->bindParam(':contrasena', $contrasenaHasheada, PDO::PARAM_STR);

      if ($stmt->execute()) {
        return $mesero =[$id, $nombre, $abreviaturaNombre, $contrasena];
      }
        
    } catch (PDOException $e) {
      error_log("Error al modificar Mesero: " . $e->getMessage());
    }
    return [];
  }
  
  public function modificarSinContrasena($id, $nombre, $abreviaturaNombre): array {
    try {
      $stmt = $this->pdo->prepare(
        "UPDATE Mesero
          SET nombre = :nombre, abreviaturaNombre = :abreviaturaNombre
          WHERE id = :id;");
      $stmt->bindParam(':id', $id, PDO::PARAM_INT);
      $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
      $stmt->bindParam(':abreviaturaNombre', $abreviaturaNombre, PDO::PARAM_STR);

      if ($stmt->execute()) {
        return $mesero =[$id, $nombre, $abreviaturaNombre];
      }
        
    } catch (PDOException $e) {
      error_log("Error al modificar Mesero: " . $e->getMessage());
    }
    return [];
  }
  
  public function cambiarContrasena(int $id, string $contrasena): bool {
    try {
      $contrasenaHasheada = password_hash($contrasena, PASSWORD_DEFAULT);
      $sql = $this->pdo->prepare(
        "UPDATE Mesero
          SET contrasena = :contrasena
          WHERE id = :id;");
      $sql->bindParam(':id', $id, PDO::PARAM_INT);
      $sql->bindParam(':contrasena', $contrasenaHasheada, PDO::PARAM_STR);

      if ($sql->execute()) {
        return true ;
      }
        
    } catch (PDOException $error) {
      error_log("Error al cambiar contrasena de Mesero: " . $error->getMessage());
    }
    return false;
  }
  
  public function eliminar(int $id):bool {
    try {
      $sql = $this->pdo->prepare(
        "DELETE FROM Mesero WHERE id = :id;");   
      $sql->bindParam(':id', $id, PDO::PARAM_INT);

      if ($sql->execute()) {
        return true;
      }
      
    } catch (PDOException $error) {
      error_log("Error al borrar mesero: " . $error->getMessage());
    }

    return false;
  }
  
  public function verificarContrasena(int $id, string $contrasenaString) {
    try{
      $sql = $this->pdo->prepare(
        "SELECT contrasena FROM Mesero WHERE id = :id;");
    
      $sql->bindParam(':id', $id, PDO::PARAM_INT);
      
      if($sql->execute()) {
        $mesero = $sql->fetch(PDO::FETCH_ASSOC);
        $contrasenaHasheada = $mesero['contrasena'];
        return password_verify($contrasenaString, $contrasenaHasheada);
      }

      return false;

    }catch (PDOException $error) {
      error_log("Error al verificar la contrasena del mesero: " . $error->getMessage());
    }

    return false;
  }
  
  public function mostrar(int $id_empresa) {
    try{
      $sql = $this->pdo->prepare(
        "SELECT * FROM Mesero WHERE id_empresa = :id_empresa;");
      $sql->bindParam(':id_empresa', $id_empresa, PDO::PARAM_INT);
      $sql->execute();
      $data = $sql->fetchAll(PDO::FETCH_ASSOC);
      if ($data) {
        return array_map(function($row) {
          return [
            'id' => $row['id'],
            'nombre' => $row['nombre'],
            'abreviaturaNombre' => $row['abreviaturaNombre'],
            'codigo' => $row['codigo'],
          ];
        }, $data);
      }
      return null;

    }catch (PDOException $error) {
      error_log("Error al obtener el mesero: " . $error->getMessage());
    }

    return null;
  }
  
  public function obtenerLogoEmpresa(int $id_empresa){
    try{
      $sql = $this->pdo->prepare(
        "SELECT logo_url FROM Empresa WHERE id = :id_empresa;");
      $sql->bindParam(':id_empresa', $id_empresa, PDO::PARAM_INT);
      $sql->execute();
      $empresa = $sql->fetch(PDO::FETCH_ASSOC);

      return $empresa = [$empresa['logo_url']];

    }catch (PDOException $error) {
      error_log("Error al verificar la empresa del mesero: " . $error->getMessage());
    }

    return null;
  }
  
  public function IniciarSesion(string $nombre, string $contrasenaTextoPlano, int $id_empresa) {
    $meseros = $this->obtenerPorNombre($nombre);

    foreach ($meseros as $mesero) {
      if ($mesero->getIdEmpresa() == $id_empresa && password_verify($contrasenaTextoPlano, $mesero->getContrasena())) {
        return true;
      }
    };

    return false;
  }

  public function hayMeserosRegistrados(int $id_empresa): bool {
    $sql = $this->pdo->prepare(
      "SELECT EXISTS (
        SELECT 1 
        FROM Mesero 
        WHERE id_empresa = :id_empresa
      ) AS existe"
    );

    $sql->bindParam(':id_empresa', $id_empresa, PDO::PARAM_INT);
    $sql->execute();

    $resultado = $sql->fetch(PDO::FETCH_ASSOC);

    return (bool) $resultado['existe'];
  }
}