<?php
// Scripts/Gestores/GestorAdministrador.php

require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Modelo/Repositorio/UsuarioRepositorio.php';


class GestorAdministrador {
    private PDO $pdo;
    private usuarioRepositorio $usuarioRepositorio;
    
    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
        $this->usuarioRepositorio = new UsuarioRepositorio($pdo);
    }
    
    public function derivarURL(string $porcionURL): void {
        $url_segmentada = explode('/', $porcionURL);
        $primer_segmento = $url_segmentada[0]; //mostrar || modificar || crear
        switch (strtolower($primer_segmento)) {
            
            case 'panel':
                if (!isset($_SESSION['admin_logueado'])) {
                    require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Vista/Html/FormIniciarSesionAdmin.php';
                    
                    exit;
                }
                require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Vista/Html/PantallaAdministrador.php';
                break;
            
            case 'login':
                $booleanoLogIn = $this->usuarioRepositorio->IniciarSesion($url_segmentada[1],$url_segmentada[2]);
                if ($booleanoLogIn) {
                    $_SESSION['admin_logueado'] = true;
                }

                // Devuelve la respuesta booleana en formato JSON
                header('Content-Type: application/json');
                echo json_encode($booleanoLogIn);
                break;
            
            default:
                if (!isset($_SESSION['admin_logueado']) || $_SESSION['admin_logueado'] !== true) {
                    require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Vista/Html/FormIniciarSesionAdmin.php';
                    
                    exit;
                } else{
                    require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Vista/Html/PantallaAdministrador.php';
                    exit;
                }
                break;
            
            
        }
    }
}