<?php

class RepositorioInterno
{
  private PDO $pdo;

  public function __construct(PDO $pdo)
  {
    $this->pdo = $pdo;
  }

  public function obtenerPorEmpresa(int $idEmpresa): ?array
  {
    $sql = "
            SELECT
                id,
                contrasena,
                id_empresa
            FROM interno
            WHERE id_empresa = :idEmpresa
            LIMIT 1
        ";

    $stmt = $this->pdo->prepare($sql);

    $stmt->bindValue(':idEmpresa', $idEmpresa, PDO::PARAM_INT);

    $stmt->execute();

    $interno = $stmt->fetch(PDO::FETCH_ASSOC);

    return $interno ?: null;
  }

  public function crear(int $idEmpresa, string $password): array
  {
    $HashPassword = password_hash($password, PASSWORD_DEFAULT);

    $sql = "
        INSERT INTO interno (
            contrasena,
            id_empresa
        )
        VALUES (
            :contrasena,
            :id_empresa
        )
    ";

    $stmt = $this->pdo->prepare($sql);

    $stmt->bindValue(':contrasena', $HashPassword, PDO::PARAM_STR);
    $stmt->bindValue(':id_empresa', $idEmpresa, PDO::PARAM_INT);

    $stmt->execute();

    return [
      'id' => $this->pdo->lastInsertId(),
      'id_empresa' => $idEmpresa
    ];
  }

  public function modificar(int $id, string $password): bool
  {
    if (empty($password)) return false;
    $HashPassword = password_hash($password, PASSWORD_DEFAULT);

    $sql = "
        UPDATE interno
        SET contrasena = :contrasena
        WHERE id_empresa = :id
    ";

    $stmt = $this->pdo->prepare($sql);

    $stmt->bindValue(':contrasena', $HashPassword, PDO::PARAM_STR);
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);

    return $stmt->execute();
  }

  public function vaciarContrasena(int $id_empresa): bool
  {
    $contrasena = password_hash('', PASSWORD_DEFAULT);
    $sql = "
        UPDATE interno
        SET contrasena = :contrasena
        WHERE id_empresa = :id_empresa
    ";

    $stmt = $this->pdo->prepare($sql);

    $stmt->bindValue(':id_empresa', $id_empresa, PDO::PARAM_INT);
    $stmt->bindValue(':contrasena', $contrasena, PDO::PARAM_STR);

    return $stmt->execute();
  }
}
