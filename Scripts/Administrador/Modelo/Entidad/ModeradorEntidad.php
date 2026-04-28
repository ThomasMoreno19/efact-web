<?php
//Scripts/Administrador/Modelo/Entidad/ModeradorEntidad.php

class Moderador
{
  private int $id;
  private int $id_empresa;
  private string $nombre;
  private string $contrasena;



  // Puedes añadir un constructor si quieres inicializar propiedades
  public function __construct(int $id, int $id_empresa, string $nombre, string $contrasena)
  {
    $this->id = $id;
    $this->id_empresa = $id_empresa;
    $this->nombre = $nombre;
    $this->contrasena = $contrasena;
  }



  //Getters
  public function getId(): int
  {
    return $this->id;
  }

  public function getIdEmpresa(): int
  {
    return $this->id_empresa;
  }

  public function getNombre(): string
  {
    return $this->nombre;
  }

  public function getContrasena(): string
  {
    return $this->contrasena;
  }



  //Setters
  public function setId(int $id): void
  {
    $this->id = $id;
  }

  public function setIdEmpresa(int $id_empresa): void
  {
    $this->id_empresa = $id_empresa;
  }

  public function setNombre(string $nombre): void
  {
    $this->nombre = $nombre;
  }

  public function setContrasena(string $contrasena): void
  {
    $this->contrasena = $contrasena;
  }
}
