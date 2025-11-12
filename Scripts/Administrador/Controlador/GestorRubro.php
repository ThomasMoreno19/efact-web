<?php
// Scripts/Administrador/Controlador/GestorRubro.php

require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Modelo/Repositorio/RubroRepositorio.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Administrador/Modelo/Repositorio/ArticuloRepositorio.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/Scripts/Incluye/Config.php';

class GestorRubro {
    private PDO $pdo;
    private rubroRepositorio $rubroRepositorio;
    private articuloRepositorio $articuloRepositorio;
    
    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
        $this->rubroRepositorio = new RubroRepositorio($pdo);
        $this->articuloRepositorio = new ArticuloRepositorio($pdo);
    }
    
    public function derivarURL(string $porcionURL): void {
        header('Content-Type: application/json');
        $url_segmentada = explode('/', $porcionURL);
        $primer_segmento = $url_segmentada[0]; //mostrar || modificar || crear
        
        switch (strtolower($primer_segmento)) {
            
            
            case 'mostrar':
                
                switch (strtolower($url_segmentada[1] ?? '')) {
                    
                    case '':
                        $this->mostrarTodos();
                        break;
                    
                    case 'entre':
                        $this->mostrarEntre();
                        break;

                    case 'rubros':
                        $this->mostrarRubro();
                        break;

                    default:
                        if (is_numeric($url_segmentada[1])) {
                            $this->obtenerPorId();
                        }
                        break;
                    break;
                }
                break;
            
            case 'modificar':
                $this->modificar();
                break;

            case 'crear':
                $this->crear();
                break;
            
            case 'cargar-lista':
                $this->cargarLista();
                break;
            
            case 'subir-logo':
                $this->subirLogo();
                break;
            
            case 'setear-en-0':
                $this->setearEn0();
                break;
            
            case 'eliminar-no-utilizados':
                $this->eliminarNoUtilizados();
                break;
                
            
            default:
                http_response_code(404);
                echo json_encode(['error' => 'Acción no encontrada para Rubro.']);
                break;
        }
    }
    
    
    private function mostrarTodos(): void {
        $datos = json_decode(file_get_contents('php://input'), true);
        $id_empresa = $datos['id_empresa'] ?? 0;
        
        // === CACHE EN ARCHIVO ===
        $cacheFile = $_SERVER['DOCUMENT_ROOT'] . "/Scripts/Cache/rubros_empresa_{$id_empresa}.json";
        
        if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < CACHE_TIME) {
            http_response_code(200);
            echo file_get_contents($cacheFile);
            return;
        }
        
        try {
            $listaRubros = $this->rubroRepositorio->obtenerTodos($id_empresa);
            
            $json = json_encode($listaRubros);
            file_put_contents($cacheFile, $json); // Guarda cache
            
            http_response_code(200);
            echo $json;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al mostrar los articulos entre los valores recibidos' . $e->getMessage()]);
        }
    }
    
    private function cargarLista(): void {
        $input = json_decode(file_get_contents('php://input'), true);
        $id_empresa = (int)$input['id_empresa'];
        $datos = $input['lista'];
        $nuevaLista = [];
        foreach ($datos as $item) {
            $nombre_rubro = $item['nombre_rubro'] ?? '';
            try {
                // Llama al repositorio para crear el rubro, pasando el id_empresa extraído
                $id_rubro = $this->rubroRepositorio->crearPorCsv($id_empresa, $nombre_rubro);
                // Crea un nuevo array para el artículo final.
                $articulo_final = $item;
                // Añade el id_rubro al nuevo array.
                $articulo_final['nombre_rubro'] = $id_rubro;
    
                // Añade el artículo completo a la nueva lista.
                $nuevaLista[] = $articulo_final;
    
            } catch (Exception $e) {
                // Como pediste, no se manejan los errores
            }
        }
        $this->borrarCacheTodos($id_empresa);
        echo json_encode($nuevaLista);
    }
    
    private function borrarCacheTodos(int $id_empresa): bool {
        $cacheDir = $_SERVER['DOCUMENT_ROOT'] . "/Scripts/Cache/";
        $cacheFile = $cacheDir . "rubros_empresa_{$id_empresa}.json";
    
        if (!file_exists($cacheFile)) {
            return false;
        }
    
        return unlink($cacheFile);
    }


    
    private function setearEn0(): void {
        $input = json_decode(file_get_contents('php://input'), true);
        $id_empresa = (int)$input['id_empresa'];
        $listaRubros = $this->rubroRepositorio->obtenerTodos($id_empresa);
        foreach ($listaRubros as $rubro) {
            $id_rubro = $rubro['id'];
            try {
                // Llama al repositorio para crear el rubro, pasando el id_empresa extraído
                $this->rubroRepositorio->setearCSVEn0($id_empresa);
                $this->articuloRepositorio->setearCSVEn0($id_rubro);
    
            } catch (Exception $e) {
                error_log("Hubo un error en setearEn0() (GestorRubro)");
            }
        }
    }
    
    private function eliminarNoUtilizados(): void {
        $input = json_decode(file_get_contents('php://input'), true);
        $id_empresa = (int)$input['id_empresa'];
        $listaRubros = $this->rubroRepositorio->obtenerTodos($id_empresa);
        foreach ($listaRubros as $rubro) {
            $id_rubro = $rubro['id'];
            try {
                // Llama al repositorio para crear el rubro, pasando el id_empresa extraído
                $this->articuloRepositorio->eliminarNoUtilizados($id_rubro);
                $this->rubroRepositorio->eliminarNoUtilizados($id_empresa);
    
            } catch (Exception $e) {
                error_log("Hubo un error en eliminarRubrosYArtNoUtilizados() (GestorRubro)");
            }
        }
    }
    
    private function crear(): void {
        $datos = json_decode(file_get_contents('php://input'), true);
        
        
        $nombre = $datos['nombre'];
        $logo_url = $datos['logo_url'];
        
        if (empty($nombre) || empty($logo_url)) {
            http_response_code(400);
            echo json_encode(['error' => 'Faltan datos para crear el rubro.']);
        }
        
        if (json_last_error() !== JSON_ERROR_NONE || !is_array($datos)) {
            http_response_code(400);
            echo json_encode(['error' => 'No se pudo decodificar el JSON o el formato es incorrecto.']);}

        try {
            $rubro = $this->rubroRepositorio->crear($id_empresa, $nombre, $logo_url);
            echo json_encode([
            'id' => $rubro['id'],
            'nombre' => $rubro['nombre'],
            'logo_url' => $rubro['logo_url']]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al crear el rubro: ' . $e->getMessage()]);
        }
    }
    
    
    private function modificar(): void {
        $datos = json_decode(file_get_contents('php://input'), true);
        
        $id = $datos['id'];
        $id_empresa = $datos['id_empresa'];
        $nombre = $datos['nombre'];
        $logo_url = $datos['logo_url'];

        if ((is_null($nombre) && is_null($id_empresa))) {
            http_response_code(400);
            echo json_encode(['error' => 'Faltan datos válidos para modificar la empresa con el id recibido']);
            return;
        }

        try {
            $rubroModificado = $this->rubroRepositorio->modificar($id, $id_empresa, $nombre, $logo_url);
            $this->borrarCacheTodos($id_empresa);
            echo json_encode($rubroModificado);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error al modificar la empresa: ' . $e->getMessage()]);
        }
    }

    private function subirLogo(): void {
        
        if (empty($_FILES['imagen']['tmp_name'])) {
            http_response_code(400);
            echo json_encode(['error' => 'No se ha enviado ningún archivo.']);
            return;
        }
        
        $directorioDestino = $_SERVER['DOCUMENT_ROOT'] . '/Archivos/Logos/Rubro/';
        $nombreOriginal = basename($_FILES['imagen']['name']);
        $nombreSinEspacios = str_replace(' ', '-', $nombreOriginal); // Reemplaza espacios por guiones
        $nombreArchivo = uniqid() . '-' . $nombreSinEspacios;
        $rutaDestino = $directorioDestino . $nombreArchivo;

        if (move_uploaded_file($_FILES['imagen']['tmp_name'], $rutaDestino)) {
            //Devuelve la ruta donde se guardó la imagen, para que la guarden en la BD
            $url = '/Archivos/Logos/Rubro/' . $nombreArchivo;
            echo json_encode(['url' => $url]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Error al mover el archivo subido.']);
        }
    }
}