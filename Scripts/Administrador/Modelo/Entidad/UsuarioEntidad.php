<?php
// Scripts/Modelo/Entidades/Empresa.php

class Usuario {
    public $id;
    public $nombre;
    public $contrasena;

    // Puedes añadir un constructor si quieres inicializar propiedades
    public function __construct($id, $nombre, $contrasena) {
        $this->id = $id;
        $this->nombre = $nombre;
        $this->contrasena = $contrasena;
    }
    
        // Getters
    public function getId() {
        return $this->id;
    }

    public function getNombre() {
        return $this->nombre;
    }

    public function getContrasena() {
        return $this->contrasena;
    }

    // Setters
    public function setNombre($nombre) {
        $this->nombre = $nombre;
    }

    public function setContrasenaHash($contrasenaHash) {
        $this->contrasena = $contrasenaHash;
    }
}