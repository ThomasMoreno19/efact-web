<?php
// Scripts/Administrador/Modelo/Repositorio/EmpresaRepositorio.php

require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Modelo/Entidad/EmpresaEntidad.php';

class EmpresaRepositorio {
    private $pdo;


    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }
    
    
    public function obtenerRubros(int $id): array{
        $rubros = [];
        try{
            $stmt = $this->pdo->prepare(
                "SELECT * FROM Rubro WHERE id_empresa = :id ORDER BY nombre ASC");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            while ($data= $stmt->fetch(PDO::FETCH_ASSOC)){
                $rubros[] = [$data['id'],
                    $data['nombre'],
                    $data['id_empresa'],
                    $data['logo_url'],
                    $data['aparece_en_csv'],
                    $data['creado_en_pagina']];
            }
        } catch (PDOException $e) {
            error_log("Error al obtener rubros para la empresa con ID " . $id . ": " . $e->getMessage());
        }
        return $rubros; 
    }
    
    public function obtenerPorId(int $id): ?array {
        $stmt = $this->pdo->prepare("SELECT * FROM Empresa WHERE id = :id;");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        if($data){
            return $empresa= [
                'id' => $data['id'],
                'nombre' => $data['nombre'],
                'logo_url' => $data['logo_url'],
                'telefono' => $data['telefono'],
                'ubicacion' => $data['ubicacion'],
                'fecha_creacion' => $data['fecha_creacion'],
                ];
        }
        return null;
    }
    
    
    public function obtenerTodas(): array {
        $empresas = [];
        try {
            $stmt = $this->pdo->query("
                SELECT
                    id,
                    nombre,
                    telefono,
                    ubicacion,
                    logo_url,
                    fecha_creacion
                FROM Empresa
                ORDER BY nombre ASC;
                ");
            while ($data = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $empresas[] = [
                'id' => $data['id'],
                'nombre' => $data['nombre'],
                'logo_url' => $data['logo_url'],
                'telefono' => $data['telefono'],
                'ubicacion' => $data['ubicacion'],
                'fecha_creacion' => $data['fecha_creacion'],
                ];
            }
        } catch (PDOException $e) {
            error_log("Error al obtener todas las empresas: " . $e->getMessage());
        }
        return $empresas;
    }
    
    
    public function modificar(int $id, string $nombre, string $ubicacion, string $telefono): bool {
        try {
            $stmt = $this->pdo->prepare(
                "UPDATE Empresa
                 SET nombre = :nombre,
                 telefono = :telefono,
                 ubicacion = :ubicacion
                 WHERE id = :id;");
                    
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
            $stmt->bindParam(':telefono', $telefono, PDO::PARAM_STR);
            $stmt->bindParam(':ubicacion', $ubicacion, PDO::PARAM_STR);

            return $stmt->execute();
            
        } catch (PDOException $e) {
            error_log("Error al modificar el nombre de la empresa: " . $e->getMessage());
        }
        return null;
    }
    
    public function modificarLogo(int $id, string $logo_url): ?array {
        try {
            $stmt = $this->pdo->prepare(
                "UPDATE Empresa
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

    
    public function crear(string $nombre, string $logo_url, string $telefono, string $ubicacion): array {
        try {
            $fecha_actual= date('Y-m-d');
            $stmt = $this->pdo->prepare(
                "INSERT INTO Empresa (nombre, fecha_creacion, logo_url, telefono, ubicacion) VALUES (:nombre, :fecha_actual, :logo_url, :telefono, :ubicacion)"
            );
            $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
            $stmt->bindParam(':logo_url', $logo_url, PDO::PARAM_STR);
            $stmt->bindParam(':telefono', $telefono, PDO::PARAM_STR);
            $stmt->bindParam(':ubicacion', $ubicacion, PDO::PARAM_STR);
            $stmt->bindParam(':fecha_actual', $fecha_actual, PDO::PARAM_STR);
            $stmt->execute();
            
            $id = $this->pdo->lastInsertId();
            $stmt = $this->pdo->prepare("SELECT * FROM Empresa WHERE id = :id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            
            $data = $stmt->fetch(PDO::FETCH_ASSOC);

            
            if ($data) {
                return $data;
            }
        } catch (PDOException $e) {
            error_log("Error al guardar nueva empresa: " . $e->getMessage());
        }
        return null;
    }
    
    
    public function sosAtributo(string $atributo) {
        $atributosPermitidos = ['nombre', 'fecha_creacion'];
        return in_array($atributo, $atributosPermitidos);
    }
}