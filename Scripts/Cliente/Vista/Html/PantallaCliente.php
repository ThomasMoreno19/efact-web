<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/Scripts/Cliente/Vista/Css/pantallaCliente.css?v=1.1">
    <link rel="stylesheet" href="/Scripts/Cliente/Vista/Css/ListaArticulos.css?v=1.1">
    <link rel="stylesheet" href="/Scripts/Administrador/Vista/Css/BotonesAlta.css">
    <link rel="stylesheet" href="/Scripts/Administrador/Vista/Css/BotonesMostrarLista.css">
    <link rel="stylesheet" href="/Scripts/Administrador/Vista/Css/modalNuevaEmpresa.css">
    <link rel="stylesheet" href="/Scripts/Administrador/Vista/Css/BotonCargar.css">
    <link rel="stylesheet" href="/Scripts/Administrador/Vista/Css/BarraBusqueda.css">
    <link rel="stylesheet" href="/Scripts/Cliente/Vista/Css/BotonVolver.css">
    <link rel="stylesheet" href="/Scripts/Cliente/Vista/Css/MadeBy.css">
    <link rel="stylesheet" href="/Scripts/Administrador/Vista/Css/Loader.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body>
    <header id="header">
        <img id="imagen-header"/>
        <h1 id="titulo-pagina"/>
        <h1 id="info-extra"/>
    </header>
    
    <div class="lista-central">
        <button class="hidden" id="boton-volver" type="button" >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path>
            </svg>
            <div class="text">
                Volver
            </div>
        </button>
        <input type="text" id="barra-busqueda" class="barra .hidden" placeholder="Buscar artículos...">
        <div class="loader" id="loader">
          <div class="cup">
            <div class="cup-handle"></div>
            <div class="smoke one"></div>
            <div class="smoke two"></div>
            <div class="smoke three"></div>
          </div>
          <div class="load">..........................</div>
        </div>
        
        <div class="listas">
            <h2 id="titulo-rubros">Rubro</h2>
            <div class="lista" id="lista-articulos"></div>
            <div class="lista" id="lista-rubros"></div>
        </div>
    </div>
    <div class="made-by">
        <div class="social-icons">
            <a href="https://www.instagram.com/iteracion.informatica/" target="_blank" class="instagram" title="Instagram">
                <i class="fab fa-instagram"></i>
            </a>
            <a href="https://www.facebook.com/tu_pagina/" target="_blank" class="facebook" title="Facebook">
                <i class="fab fa-facebook-f"></i>
            </a>
        </div>
        <p><?php echo date('Y'); ?>  IteraciON</p>
    </div>
    
    <script src="/Scripts/Administrador/Vista/Js/Articulo.js"></script>
    <script src="/Scripts/Administrador/Vista/Js/Rubro.js"></script>
    <script src="/Scripts/Administrador/Vista/Js/Empresa.js"></script>
    <script src="/Scripts/Cliente/Vista/Js/PantallaCliente.js?v=1.5.2"></script>
    <script src="/Scripts/Cliente/Vista/Js/GestorCliente.js"></script>
</body>
</html>