<?php
//Scripts/Administrador/Modelo/Repositorio/ArticuloRepositorio.php

require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Modelo/Entidad/ArticuloEntidad.php';


class ArticuloRepositorio
{
  private $pdo;

  public function __construct(PDO $pdo)
  {
    $this->pdo = $pdo;
  }


  public function obtenerPorId(int $id, int $id_rubro): ?Articulo
  {
    $stmt = $this->pdo->prepare("SELECT * FROM Articulo WHERE id = :id AND id_rubro = :id_rubro");
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->bindParam(':id_rubro', $id_rubro, PDO::PARAM_INT);
    $stmt->execute();
    $data = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($data) {
      return new Articulo(
        $data['id'],
        $data['id_rubro'],
        $data['id_empresa'],
        $data['nombre'],
        $data['precio1'],
        $data['precio2'],
        $data['precio3'],
        $data['aparece_en_csv'],
        $data['logo_url'],
        $data['video_url'],
      );
    }
    return null;
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
                FROM Articulo
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
                    ubicacion,
                    video_url,
                    logo_url
                FROM Articulo
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
                a.ubicacion,
                a.video_url,
                a.logo_url
            FROM Articulo a
            LEFT JOIN Marca m
                ON a.id_marca = m.id
                AND a.id_empresa = m.id_empresa
            LEFT JOIN Proveedor p
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

    $values = [];
    $params = [];

    foreach ($articulos as $i => $a) {

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
      $params[":no_procesado$i"] = $a['no_procesado'] ?? 0;

      $params[":abreviatura$i"] = $a['abreviatura'] ?: null;
      $params[":ubicacion$i"] = $a['ubicacion'] ?: null;

      $params[":codigo_interno$i"] = $a['codigo_interno'];
      $params[":codigo_barra$i"] = $a['codigo_barra'] ?: null;
      $params[":codigo_proveedor$i"] = $a['codigo_proveedor'] ?: null;

      $params[":logo_url$i"] = 'Archivos/Logos/Vacio.png';
      $params[":video_url$i"] = '';
    }

    $sql = "
        INSERT INTO Articulo (
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

      return $articulos;
    } catch (PDOException $e) {

      $errores = [];

      foreach ($articulos as $i => $a) {

        $sqlIndividual = "
            INSERT INTO Articulo (
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
                codigo_interno,
                codigo_barra,
                codigo_proveedor,
                aparece_en_csv,
                abreviatura,
                ubicacion,
                logo_url,
                video_url
            )
            VALUES (
                :id,
                :id_rubro,
                :id_marca,
                :id_proveedor,
                :id_empresa,
                :nombre,
                :precio1,
                :precio2,
                :precio3,
                :existencia,
                :no_procesado,
                :codigo_interno,
                :codigo_barra,
                :codigo_proveedor,
                1,
                :abreviatura,
                :ubicacion,
                :logo_url,
                :video_url
            )
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
                abreviatura = VALUES(abreviatura),
                ubicacion = VALUES(ubicacion),
                codigo_interno = VALUES(codigo_interno),
                codigo_barra = VALUES(codigo_barra),
                codigo_proveedor = VALUES(codigo_proveedor),
                aparece_en_csv = 1
        ";

        try {

          $stmt = $this->pdo->prepare($sqlIndividual);

          $stmt->execute([
            ':id' => $a['id_articulo'],
            ':id_rubro' => $a['id_rubro'] ?: null,
            ':id_marca' => $a['id_marca'] ?: null,
            ':id_proveedor' => $a['id_proveedor'] ?: null,
            ':id_empresa' => $id_empresa,
            ':nombre' => $a['nombre_articulo'],
            ':precio1' => (string)$a['precio1'],
            ':precio2' => (string)$a['precio2'],
            ':precio3' => (string)$a['precio3'],
            ':existencia' => (string)$a['existencia'],
            ':no_procesado' => $a['no_procesado'] ?? 0,
            ':codigo_interno' => $a['codigo_interno'],
            ':codigo_barra' => $a['codigo_barra'] ?: null,
            ':codigo_proveedor' => $a['codigo_proveedor'] ?: null,
            ':abreviatura' => $a['abreviatura'] ?: null,
            ':ubicacion' => $a['ubicacion'] ?: null,
            ':logo_url' => 'Archivos/Logos/Vacio.png',
            ':video_url' => '',
          ]);
        } catch (PDOException $ex) {

          $errores[] = [
            'indice_array' => $i,
            'id_articulo' => $a['id_articulo'] ?? null,
            'codigo_interno' => $a['codigo_interno'] ?? null,
            'nombre' => $a['nombre_articulo'] ?? null,
            'mensaje' => $ex->getMessage(),
          ];
        }
      }

      throw new Exception(
        "Falló el INSERT masivo.\n" .
          json_encode($errores, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
      );
    }
  }

  public function modificar(int $id, int $id_rubro, string $nombre, string $precio1, string $precio2, string $precio3, string $logo_url): bool
  {
    try {
      $stmt = $this->pdo->prepare(
        "UPDATE Articulo
                 SET nombre = :nombre,
                    precio1 = :precio1,
                    precio2 = :precio2,
                    precio3 = :precio3,
                    logo_url = :logo_url
                 WHERE id = :id AND id_rubro = :id_rubro;"
      );

      $stmt->bindParam(':id', $id, PDO::PARAM_INT);
      $stmt->bindParam(':id_rubro', $id_rubro, PDO::PARAM_INT);
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
        "DELETE FROM Articulo 
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
        "UPDATE Articulo
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
        "UPDATE Articulo
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
        "UPDATE Articulo
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
