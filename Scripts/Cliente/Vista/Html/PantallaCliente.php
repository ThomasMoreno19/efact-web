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
    <button class="abrir-menu" id="abrir-menu" type="button">
      <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6H20M4 12H20M4 18H20" stroke="#e9b44c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <img id="imagen-header"> </img>
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

  <div class="hidden modal" id="modal-menu">
    <div class="contenedor-menu" id="contenedor-menu">
      <a
        href="https://gold-sandpiper-490696.hostingersite.com/"
        class="boton-menu">
        <span id="texto-consulta-saldos">Consultá tu saldo</span>
        <svg class="link" width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 9.00001L21 3.00001M21 3.00001H15M21 3.00001L12 12M10 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V14" stroke="#e9b44c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </a>
    </div>
  </div>

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

    <div class="botones-lista-cliente">

      <div id="lista-botones-filtros"> </div>

      <div id="lista-botones-listas" class="">
        <button id="boton-lista-rubros" class="boton-lista-cliente activo-cliente" type="button">
          <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.54" fill="#ffffff" width="16px" height="16px">
            <title>search-categories</title>
            <path d="M4.69,0H46.22a4.71,4.71,0,0,1,4.69,4.69V46a4.69,4.69,0,0,1-4.69,4.69H4.69a4.65,4.65,0,0,1-3.31-1.38l-.09-.09A4.67,4.67,0,0,1,0,46V4.69A4.71,4.71,0,0,1,4.69,0ZM89.44,61.94a26.56,26.56,0,0,1,10.18,2l.07,0a26.61,26.61,0,0,1,15.25,32.16,26.18,26.18,0,0,1-2.7,6.11l10.3,11.24a1.27,1.27,0,0,1-.07,1.8l-7.57,6.9a1.27,1.27,0,0,1-1.79-.07l-9.86-10.85a26.36,26.36,0,0,1-6.1,2.74,26.87,26.87,0,0,1-7.71,1.13,26.51,26.51,0,0,1-10.17-2l-.07,0A26.64,26.64,0,0,1,64.85,78.37l0-.07A26.6,26.6,0,0,1,89.44,61.94Zm15,11.59a21.38,21.38,0,0,0-6.89-4.61l-.06,0a21.22,21.22,0,0,0-23.07,4.64l-.07.07a21.25,21.25,0,0,0-4.54,6.83l0,.06a21.32,21.32,0,0,0-1.58,8.06,21.26,21.26,0,0,0,29.35,19.62,21.54,21.54,0,0,0,6.89-4.61l.07-.07a21.09,21.09,0,0,0,4.54-6.83l0-.06a21.35,21.35,0,0,0,0-16.17,21.34,21.34,0,0,0-4.62-6.9ZM4.69,63.2H46.22a4.71,4.71,0,0,1,4.69,4.7v41.34a4.68,4.68,0,0,1-4.69,4.69H4.69A4.69,4.69,0,0,1,0,109.24V67.9a4.71,4.71,0,0,1,4.69-4.7ZM68.78,0h41.53A4.71,4.71,0,0,1,115,4.69V46a4.71,4.71,0,0,1-4.69,4.69H68.78A4.71,4.71,0,0,1,64.09,46V4.69a4.69,4.69,0,0,1,1.37-3.31l.1-.09A4.67,4.67,0,0,1,68.78,0Z" />
          </svg>
          Rubros
        </button>
        <button id="boton-lista-proveedores" class="boton-lista-cliente hidden" type="button">
          <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 121.52 122.88" style="enable-background:new 0 0 121.52 122.88" xml:space="preserve" fill="#ffffff">
            <style type=" text/css">
              .st0 {
                fill-rule: evenodd;
                clip-rule: evenodd;
              }
            </style>
            <g>
              <path class="st0" d="M49.91,26.09l53.86-13.45c1.52-0.38,3.08,0.56,3.46,2.08l13.45,53.86c0.38,1.52-0.56,3.08-2.08,3.46 L64.75,85.49c-1.52,0.38-3.08-0.56-3.46-2.08L47.83,29.55C47.45,28.03,48.39,26.47,49.91,26.09L49.91,26.09L49.91,26.09z M54.59,90.54c8.93,0,16.17,7.24,16.17,16.17c0,8.93-7.24,16.17-16.17,16.17c-8.93,0-16.17-7.24-16.17-16.17 C38.42,97.78,45.66,90.54,54.59,90.54L54.59,90.54z M74,92.69l41.87-11.22l2.51-0.67l0.67,2.51l1.8,6.72l0.67,2.51l-2.51,0.67 l-41.87,11.22l-2.51,0.67l-0.67-2.51l-1.8-6.72l-0.67-2.51L74,92.69L74,92.69L74,92.69z M4.21,0.04l8.34,1.45 c9.58,1.67,14.41,2.63,17.54,5.12c3.37,2.68,4.13,6.28,5.59,13.26c0.27,1.27,0.56,2.69,0.96,4.4c0.36,1.58,0.82,3.43,1.42,5.64 l14.87,54.67c0.38,1.39-0.44,2.81-1.83,3.19c-0.04,0.01-0.08,0.02-0.12,0.03l-6.61,1.79c-1.38,0.37-2.81-0.45-3.18-1.83l0,0 l-6.76-24.85l-8.11-29.82c-0.56-2.08-1.05-4.08-1.47-5.94l-0.02-0.12c-0.41-1.8-0.73-3.33-1.02-4.7c-0.73-3.47-1.1-5.27-2.23-6.08 c-1.47-1.07-4.67-1.67-11.06-2.79l-3.23-0.56l-5.11-0.89c-1.42-0.24-2.37-1.58-2.12-3l1.17-6.86C1.45,0.75,2.79-0.2,4.21,0.04 L4.21,0.04z" />
            </g>
          </svg>
          Proveedores
        </button>

        <button id="boton-lista-marcas" class="boton-lista-cliente" type="button">
          <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 122.879 122.891" enable-background="new 0 0 122.879 122.891" xml:space="preserve" fill="#ffffff">
            <g>
              <path d="M89.767,18.578c3.848,0,7.332,1.561,9.854,4.082c2.521,2.522,4.082,6.007,4.082,9.855s-1.561,7.332-4.082,9.854 c-2.522,2.522-6.007,4.082-9.854,4.082c-3.849,0-7.333-1.56-9.854-4.082c-2.522-2.522-4.082-6.006-4.082-9.854 s1.56-7.333,4.082-9.855C82.434,20.138,85.918,18.578,89.767,18.578L89.767,18.578z M122.04,56.704l-65.337,65.337 c-1.132,1.133-2.969,1.133-4.101,0L0.849,70.287c-1.132-1.131-1.132-2.967,0-4.1L66.186,0.85C66.752,0.284,67.494,0,68.236,0v0 h50.051c1.602,0,2.9,1.298,2.9,2.9c0,0.048-0.002,0.097-0.004,0.145l1.694,51.517c0.026,0.83-0.301,1.589-0.845,2.134 L122.04,56.704L122.04,56.704z M54.652,115.889l62.406-62.407L115.49,5.8H69.438L7.001,68.238L54.652,115.889L54.652,115.889z M96.244,26.037c-1.657-1.657-3.948-2.683-6.478-2.683c-2.53,0-4.82,1.025-6.478,2.683c-1.658,1.657-2.684,3.948-2.684,6.478 s1.025,4.82,2.684,6.478c1.657,1.658,3.947,2.683,6.478,2.683c2.529,0,4.82-1.025,6.478-2.683s2.683-3.948,2.683-6.478 S97.901,27.694,96.244,26.037L96.244,26.037z" />
            </g>
          </svg>
          Marcas
        </button>

        <button id="boton-lista-ofertas" class="boton-lista-cliente" type="button">
          <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" heigth="20px" width="20px" fill="#ffffff" stroke="#ffffff" viewBox="0 0 122.88 122.88">
            <title>offer</title>
            <path d="M13.7,49.54,8,33.63a3.47,3.47,0,0,1,2.1-4.44,3.93,3.93,0,0,1,.81-.18L27.3,27.3,29,10.79a3.47,3.47,0,0,1,3.81-3.1,2.9,2.9,0,0,1,.71.15l16,4.11L58.8,1.21A3.49,3.49,0,0,1,63.7.83a3.91,3.91,0,0,1,.61.68l9,12.17,15.91-5.8A3.48,3.48,0,0,1,93.69,10a3.44,3.44,0,0,1,.19.83l1.7,16.51L112.09,29a3.47,3.47,0,0,1,2.71,5.09l-7.3,13.77,14,10.83a3.46,3.46,0,0,1,.62,4.87,3.18,3.18,0,0,1-.72.7L109.2,73.33,115,89.24a3.48,3.48,0,0,1-2.08,4.45,3.44,3.44,0,0,1-.83.19l-16.51,1.7L93.88,112a3.48,3.48,0,0,1-3.81,3.1,3.61,3.61,0,0,1-1.27-.38L75,107.49l-10.85,14a3.46,3.46,0,0,1-5.57-.1l-9.08-12.25-15.91,5.74A3.47,3.47,0,0,1,29,112.05L27.3,97.29,10.53,93.82a3.46,3.46,0,0,1-2.7-4.09A2.62,2.62,0,0,1,8,89.11L13.7,73.34,1.4,64.23a3.48,3.48,0,0,1-.72-4.86,3.42,3.42,0,0,1,.77-.75L13.7,49.54Zm62.39-6.2L55.66,78.86a6.86,6.86,0,0,1-.67,1,2.76,2.76,0,0,1-.82.71,3.14,3.14,0,0,1-1.1.31,10.25,10.25,0,0,1-1.31.07H47.9a1.16,1.16,0,0,1-1.16-1.15,1.18,1.18,0,0,1,.21-.67L67.39,43.57a7.2,7.2,0,0,1,.65-1l0-.06a2.84,2.84,0,0,1,.78-.65A3.15,3.15,0,0,1,70,41.59h0a10,10,0,0,1,1.29-.07h3.85a1.16,1.16,0,0,1,1.16,1.15,1.18,1.18,0,0,1-.21.67Zm-7.4,36.07c-1.72-1.8-2.59-4.56-2.59-8.28s.87-6.48,2.59-8.28,4.52-2.7,8.4-2.7,6.68.9,8.4,2.7,2.58,4.56,2.58,8.28-.86,6.48-2.58,8.28-4.52,2.7-8.4,2.7-6.68-.9-8.4-2.7Zm6-11.44v8h1.3a16.21,16.21,0,0,0,3.27-.26c.22-.18.33-.67.33-1.46v-8h-3a3,3,0,0,0-1.58.26c-.21.18-.32.67-.32,1.46ZM37.39,60q-2.58-2.7-2.58-8.28t2.58-8.28q2.58-2.7,8.4-2.7t8.4,2.7q2.58,2.7,2.58,8.28T54.19,60q-2.58,2.7-8.4,2.7T37.39,60Zm6-11.44v8h3a2.93,2.93,0,0,0,1.57-.27c.22-.18.33-.67.33-1.46v-8H46.93a15.28,15.28,0,0,0-3.26.27c-.22.17-.33.66-.33,1.45ZM16,35.46l5,14a3.48,3.48,0,0,1-1.14,4.13L9.3,61.44,19.9,69.3a3.48,3.48,0,0,1,1.2,4L15.84,87.84,31,91a3.48,3.48,0,0,1,3,3.05l1.49,12.9,14.05-5.06A3.47,3.47,0,0,1,53.59,103l7.91,10.68,9.74-12.61A3.48,3.48,0,0,1,75.69,100l11.81,6.21L89,92.1A3.47,3.47,0,0,1,92.06,89L107,87.43,101.8,73.32a3.46,3.46,0,0,1,1.18-4l10.67-7.92-12.52-9.67A3.5,3.5,0,0,1,100,47.18l6.26-11.8L92.1,33.93A3.48,3.48,0,0,1,89,30.82L87.43,15.93,73.32,21.08a3.48,3.48,0,0,1-4-1.18L61.24,9l-7.8,9.07a3.48,3.48,0,0,1-3.5,1.1L35.5,15.5,33.92,30.78a3.47,3.47,0,0,1-3.1,3.14L16,35.46Z" />
          </svg>
          Ofertas
        </button>


        <button id="boton-lista-articulos" class="boton-lista-cliente" type="button">
          <svg fill="#ffffff" height="18px" width="18px" version="1.1" id="svg-lupa" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 512 512" xml:space="preserve">
            <g>
              <g>
                <path d="M508.255,490.146l-128-128c-0.06-0.06-0.137-0.077-0.196-0.128c34.193-38.434,55.142-88.917,55.142-144.418
			c0-120.175-97.425-217.6-217.6-217.6S0.001,97.425,0.001,217.6s97.425,217.6,217.6,217.6c55.501,0,105.975-20.949,144.418-55.151
			c0.06,0.06,0.077,0.137,0.128,0.196l128,128c2.5,2.509,5.777,3.755,9.054,3.755s6.554-1.246,9.054-3.746
			C513.247,503.253,513.247,495.147,508.255,490.146z M217.601,409.6c-105.865,0-192-86.135-192-192s86.135-192,192-192
			s192,86.135,192,192S323.466,409.6,217.601,409.6z" />
              </g>
            </g>
          </svg>
        </button>

      </div>

    </div>

    <div class="loader" id="loader">
    </div>

    <div class="listas">
      <div id="contenedor-busqueda-nombre" class="contenedor-busqueda hidden">

        <input
          type="text"
          id="barra-busqueda"
          class="barra hidden"
          placeholder="Búsqueda por Nombre" />

        <p id="eliminar-busqueda-nombre" class="eliminar-busqueda hidden">✕</p>

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
      <div id="contenedores-codigos" class="hidden">

        <div id="contenedor-busqueda-codigo-proveedor" class="contenedor-busqueda hidden">

          <input
            type="text"
            id="barra-busqueda-codigo-proveedor"
            class="barra hidden"
            placeholder="Código de Proveedor" />

          <p id="eliminar-busqueda-codigo-proveedor" class="eliminar-busqueda hidden">✕</p>

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

        <div id="contenedor-busqueda-codigo-interno" class="contenedor-busqueda hidden">

          <input
            type="number"
            id="barra-busqueda-codigo-interno"
            class="barra hidden"
            placeholder="Código Interno" />

          <p id="eliminar-busqueda-codigo-interno" class="eliminar-busqueda hidden">✕</p>

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
      </div>

      <div class="lista hidden" id="lista-articulos"></div>
      <div class="lista lista-grupos" id="lista-rubros"></div>
      <div class="lista hidden lista-grupos" id="lista-marcas"></div>
      <div class="lista hidden lista-grupos" id="lista-proveedores"></div>
      <div class="lista hidden" id="lista-ofertas"></div>
      <div class="lista hidden" id="lista-vacia">Ingrese criterios de búsqueda para obtener resultados</div>

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
  <script src="/Scripts/Administrador/Vista/Js/Proveedor.js?v=<?php echo APP_VERSION; ?>"></script>
  <script src="/Scripts/Administrador/Vista/Js/Marca.js?v=<?php echo APP_VERSION; ?>"></script>
  <script src="/Scripts/Administrador/Vista/Js/Empresa.js?v=<?php echo APP_VERSION; ?>"></script>
  <script src="/Scripts/Cliente/Vista/Js/Carrito.js?v=<?php echo APP_VERSION; ?>"></script>
  <script src="/Scripts/Cliente/Vista/Js/ModalCarrito.js?v=<?php echo APP_VERSION; ?>"></script>
  <script src="/Scripts/Cliente/Vista/Js/PantallaCliente.js?v=<?php echo APP_VERSION; ?>"></script>
  <script src="/Scripts/Cliente/Vista/Js/GestorCliente.js?v=<?php echo APP_VERSION; ?>"></script>
</body>

</html>