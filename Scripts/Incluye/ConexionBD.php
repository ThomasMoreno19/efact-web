<?php
// public_html/Scripts/Incluye/conexionBD.php

function conectarBD() {
    static $pdo = null; // Se reutiliza la conexión dentro del mismo request

    if ($pdo === null) {
        $host = 'srv720.hstgr.io';
        $dbname = 'u919042836_Cafe_Bar';
        $user = 'u919042836_iteracion5900T';
        $password = 'Garibaldi264-';

        try {
            $pdo = new PDO(
                "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
                $user,
                $password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::ATTR_PERSISTENT => true, // 👈 habilita conexión persistente
                ]
            );
        } catch (PDOException $e) {
            error_log("Error de conexión a la base de datos: " . $e->getMessage());
            die("Se superó el exceso de consultas a la base de datos.");
        }
    }

    return $pdo;
}
