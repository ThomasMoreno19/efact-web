<?php
// Scripts/Administrador/Modelo/Entidad/RubroEntidad.php

class Rubro
{
  private int $id;
  private string $nombre;
  private int $id_empresa;
  private string $fecha_eliminado;
  private bool $aparece_en_csv;
  private bool $creado_en_pagina;
  private string $logo_url;
  private array $articulos;



  // Puedes añadir un constructor si quieres inicializar propiedades
  public function __construct(int $id, string $nombre, int $id_empresa, bool $aparece_en_csv, bool $creado_en_pagina, ?string $logo_url = 'Archivos/Logos/Vacio.png', ?string $fecha_eliminado = '', ?array $articulos = [])
  {
    $this->id = $id;
    $this->nombre = $nombre;
    $this->nombre = $nombre;
    $this->id_empresa = $id_empresa;
    $this->fecha_eliminado = $fecha_eliminado;
    $this->aparece_en_csv = $aparece_en_csv;
    $this->creado_en_pagina = $creado_en_pagina;
    $this->logo_url = $logo_url;
    $this->articulos = $articulos;
  }



  //Getters
  public function getId(): int
  {
    return $this->id;
  }

  public function getNombre(): string
  {
    return $this->nombre;
  }

  public function getIdEmpresa(): int
  {
    return $this->id_empresa;
  }

  public function getFechaEliminado(): ?string
  {
    return $this->fecha_eliminado;
  }

  public function getApareceEnCsv(): bool
  {
    return $this->aparece_en_csv;
  }

  public function getCreadoEnPagina(): bool
  {
    return $this->creado_en_pagina;
  }

  public function getLogoUrl(): string
  {
    return $this->logo_url;
  }

  public function getArticulos(): array
  {
    return $this->articulos;
  }



  //Setters
  public function setId(int $id): void
  {
    $this->id = $id;
  }

  public function setNombre(string $nombre): void
  {
    $this->nombre = $nombre;
  }

  public function setIdEmpresa(int $id_empresa): void
  {
    $this->id_empresa = $id_empresa;
  }

  public function setFechaEliminado(string $fecha_eliminado): void
  {
    $this->fecha_eliminado = $fecha_eliminado;
  }

  public function setApareceEnCsv(bool $aparece_en_csv): void
  {
    $this->aparece_en_csv = $aparece_en_csv;
  }

  public function setCreadoEnPagina(bool $creado_en_pagina): void
  {
    $this->creado_en_pagina = $creado_en_pagina;
  }

  public function setLogoUrl(string $logo_url): void
  {
    $this->logo_url = $logo_url;
  }

  public function setArticulos(array $articulos): void
  {
    $this->articulos = $articulos;
  }

  //agregarArticulo agrega un articulo nuevo al array
  public function agregarArticulo(Articulo $articulo): void
  {
    $this->articulos[] = $articulo;
  }
}
