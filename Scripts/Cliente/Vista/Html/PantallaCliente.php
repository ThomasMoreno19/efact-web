<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="/Scripts/Cliente/Vista/Css/pantalla.css?v=<?php echo APP_VERSION; ?>">
  <link rel="stylesheet" href="/Scripts/Cliente/Vista/Css/ListaArticulos.css?v=<?php echo APP_VERSION; ?>">
  <link rel="stylesheet" href="/Scripts/Administrador/Vista/Css/BotonesAlta.css?v=<?php echo APP_VERSION; ?>">
  <link rel="stylesheet" href="/Scripts/Administrador/Vista/Css/BotonesMostrarLista.css?v=<?php echo APP_VERSION; ?>">
  <link rel="stylesheet" href="/Scripts/Administrador/Vista/Css/BotonCargar.css?v=<?php echo APP_VERSION; ?>">
  <link rel="stylesheet" href="/Scripts/Cliente/Vista/Css/BarraBusqueda.css?v=<?php echo APP_VERSION; ?>">
  <link rel="stylesheet" href="/Scripts/Cliente/Vista/Css/BotonVolver.css?v=<?php echo APP_VERSION; ?>">
  <link rel="stylesheet" href="/Scripts/Cliente/Vista/Css/MadeBy.css?v=<?php echo APP_VERSION; ?>">
  <link rel="stylesheet" href="/Scripts/Administrador/Vista/Css/Loader.css?v=<?php echo APP_VERSION; ?>">
  <link rel="stylesheet" href="/Scripts/Cliente/Vista/Css/modalCarrito.css?v=<?php echo APP_VERSION; ?>">
  <link rel="stylesheet" href="/Scripts/Cliente/Vista/Css/modalPedirNombreYTel.css?v=<?php echo APP_VERSION; ?>">
  <link rel="stylesheet" href="/Scripts/Cliente/Vista/Css/formgroup.css?v=<?php echo APP_VERSION; ?>">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>

<body>
  <header id="header">
    <button class="hidden boton-volver" id="boton-volver" type="button">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path>
      </svg>
    </button>

    <img id="imagen-header" />
    <h1 id="titulo-pagina"></h1>
    <div id="info-extra"></div>

    <button class="hidden boton-escaner" id="boton-escaner" type="button">
      <svg width="40px" height="40px" viewBox="0 0 32 32" id="svg5" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">

        <defs id="defs2" />

        <g id="layer1" transform="translate(-108,-100)">

          <path d="m 111,106 a 1.0001,1.0001 0 0 0 -1,1 v 3 a 1,1 0 0 0 1,1 1,1 0 0 0 1,-1 v -2 h 2 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z" id="path11698" style="color:#f5b73a;fill:#f5b73a;fill-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4.1;-inkscape-stroke:none" />

          <path d="m 134,106 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 2 v 2 a 1,1 0 0 0 1,1 1,1 0 0 0 1,-1 v -3 a 1.0001,1.0001 0 0 0 -1,-1 z" id="path11700" style="color:#f5b73a;fill:#f5b73a;fill-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4.1;-inkscape-stroke:none" />

          <path d="m 137,121 a 1,1 0 0 0 -1,1 v 2 h -2 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 3 a 1.0001,1.0001 0 0 0 1,-1 v -3 a 1,1 0 0 0 -1,-1 z" id="path11702" style="color:#f5b73a;fill:#f5b73a;fill-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4.1;-inkscape-stroke:none" />

          <path d="m 111,121 a 1,1 0 0 0 -1,1 v 3 a 1.0001,1.0001 0 0 0 1,1 h 3 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 h -2 v -2 a 1,1 0 0 0 -1,-1 z" id="path11704" style="color:#f5b73a;fill:#f5b73a;fill-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4.1;-inkscape-stroke:none" />

          <path d="m 115,110 a 1,1 0 0 0 -1,1 v 10 a 1,1 0 0 0 1,1 1,1 0 0 0 1,-1 v -10 a 1,1 0 0 0 -1,-1 z" id="path11706" style="color:#f5b73a;fill:#f5b73a;fill-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4.1;-inkscape-stroke:none" />

          <path d="m 118,110 a 1,1 0 0 0 -1,1 v 10 a 1,1 0 0 0 1,1 1,1 0 0 0 1,-1 v -10 a 1,1 0 0 0 -1,-1 z" id="path11708" style="color:#f5b73a;fill:#f5b73a;fill-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4.1;-inkscape-stroke:none" />

          <path d="m 121,110 a 1,1 0 0 0 -1,1 v 10 a 1,1 0 0 0 1,1 1,1 0 0 0 1,-1 v -10 a 1,1 0 0 0 -1,-1 z" id="path11710" style="color:#f5b73a;fill:#f5b73a;fill-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4.1;-inkscape-stroke:none" />

          <path d="m 124,110 a 1,1 0 0 0 -1,1 v 10 a 1,1 0 0 0 1,1 1,1 0 0 0 1,-1 v -10 a 1,1 0 0 0 -1,-1 z" id="path11712" style="color:#f5b73a;fill:#f5b73a;fill-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4.1;-inkscape-stroke:none" />

          <path d="m 127,110 a 1,1 0 0 0 -1,1 v 10 a 1,1 0 0 0 1,1 1,1 0 0 0 1,-1 v -10 a 1,1 0 0 0 -1,-1 z" id="path11714" style="color:#f5b73a;fill:#f5b73a;fill-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4.1;-inkscape-stroke:none" />

          <path d="m 130,110 a 1,1 0 0 0 -1,1 v 10 a 1,1 0 0 0 1,1 1,1 0 0 0 1,-1 v -10 a 1,1 0 0 0 -1,-1 z" id="path11716" style="color:#f5b73a;fill:#f5b73a;fill-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4.1;-inkscape-stroke:none" />

          <path d="m 133,110 a 1,1 0 0 0 -1,1 v 5.20703 1.31445 V 121 a 1,1 0 0 0 1,1 1,1 0 0 0 1,-1 V 117.52148 116.20703 111 a 1,1 0 0 0 -1,-1 z" id="path11720" style="color:#f5b73a;fill:#f5b73a;fill-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4.1;-inkscape-stroke:none" />

        </g>

      </svg>
    </button>
  </header>

  <button id="boton-carrito" class="hidden" type="button">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" id="icono-carrito">
      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"></path>
    </svg>
    <div class="text">
      <span id="cantidad-articulos-carrito"></span>
    </div>
  </button>

  <div id="contenedor-camara" style="display:none;">
    <button id="cerrar-camara">Cerrar</button>
    <div id="video-escaner"></div>
  </div>

  <div class="lista-central" id="lista-central">

    <div id="contenedor-busqueda" class="contenedor-busqueda hidden">

      <input
        type="text"
        id="barra-busqueda"
        class="barra hidden"
        placeholder="Buscar artículos" />

      <svg
        class="icono-busqueda"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round" />
      </svg>
    </div>

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
      <h2 id="titulo-rubros" class="hidden"></h2>
      <div class="lista" id="lista-articulos"></div>
      <div class="lista" id="lista-rubros"></div>
    </div>
  </div>
  <div class="made-by">
    <div class="social-icons">
      <a href="https://www.instagram.com/iteracion.informatica/" target="_blank" class="instagram" title="Instagram">
        <i class="fab fa-instagram"></i>
      </a>
      <a href="https://www.facebook.com" target="_blank" class="facebook" title="Facebook">
        <i class="fab fa-facebook-f"></i>
      </a>
    </div>
    <p><?php echo date('Y'); ?> - IteraciON</p>
  </div>

  <script src="https://unpkg.com/html5-qrcode"></script>
  <script src="/Scripts/Administrador/Vista/Js/Articulo.js?v=<?php echo APP_VERSION; ?>"></script>
  <script src="/Scripts/Administrador/Vista/Js/Rubro.js?v=<?php echo APP_VERSION; ?>"></script>
  <script src="/Scripts/Administrador/Vista/Js/Empresa.js?v=<?php echo APP_VERSION; ?>"></script>
  <script src="/Scripts/Cliente/Vista/Js/Carrito.js?v=<?php echo APP_VERSION; ?>"></script>
  <script src="/Scripts/Cliente/Vista/Js/ModalCarrito.js?v=<?php echo APP_VERSION; ?>"></script>
  <script src="/Scripts/Cliente/Vista/Js/PantallaCliente.js?v=<?php echo APP_VERSION; ?>"></script>
  <script src="/Scripts/Cliente/Vista/Js/GestorCliente.js?v=<?php echo APP_VERSION; ?>"></script>
</body>

</html>