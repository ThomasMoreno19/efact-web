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
  <link rel="stylesheet" href="/Scripts/Administrador/Vista/Css/BarraBusqueda.css?v=<?php echo APP_VERSION; ?>">
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
    <img id="imagen-header" />
    <h1 id="titulo-pagina" />
    <h1 id="info-extra" />
    <button class="hidden boton-volver" id="boton-volver" type="button">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path>
      </svg>
      <div class="text">
        Volver
      </div>
    </button>
  </header>

  <div class="botones-llamar">
    <button class="boton-llamar hidden" type="button" id="boton-llamar-mesero">
      <svg fill="#000000" height="32px" width="32px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 237.888 237.888" xml:space="preserve">
        <g>
          <path d="M197.047,59.153C185.153,23.771,153.764,0,118.938,0C82.628,0,50.816,25.12,39.779,62.506
		c-2.614,8.849-3.94,18.078-3.94,27.434c0,49.588,37.278,89.931,83.1,89.931c45.827,0,83.11-40.343,83.11-89.931
		C202.049,79.352,200.365,68.991,197.047,59.153z M118.938,159.87c-34.793,0-63.1-31.371-63.1-69.931
		c0-6.583,0.827-13.078,2.453-19.346h71.861l9.571-20.909l10.073,20.909h29.791c1.626,6.253,2.461,12.736,2.461,19.346
		C182.049,128.499,153.737,159.87,118.938,159.87z" />
          <polygon points="64.61,180.791 64.61,237.888 118.61,221.853 172.61,237.888 172.61,180.791 118.61,196.829 	" />
        </g>
      </svg>
      Llamar
    </button>

    <button class="boton-llamar hidden" type="button" id="boton-pedir-cuenta">
      <svg fill="#000000" height="32px" width="32px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 512 512" xml:space="preserve">
        <g>
          <g>
            <path d="M189.218,200.348c-27.618,0-50.087,22.469-50.087,50.087c0,27.618,22.469,50.087,50.087,50.087
			c27.618,0,50.087-22.469,50.087-50.087C239.305,222.817,216.836,200.348,189.218,200.348z M189.218,267.13
			c-9.206,0-16.696-7.49-16.696-16.696c0-9.206,7.49-16.696,16.696-16.696s16.696,7.49,16.696,16.696
			C205.913,259.641,198.424,267.13,189.218,267.13z" />
          </g>
        </g>
        <g>
          <g>
            <path d="M322.783,333.913c-27.618,0-50.087,22.469-50.087,50.087s22.469,50.087,50.087,50.087S372.87,411.618,372.87,384
			S350.401,333.913,322.783,333.913z M322.783,400.696c-9.206,0-16.696-7.49-16.696-16.696s7.49-16.696,16.696-16.696
			c9.206,0,16.696,7.49,16.696,16.696S331.989,400.696,322.783,400.696z" />
          </g>
        </g>
        <g>
          <g>
            <path d="M338.635,234.588c-6.519-6.52-17.091-6.52-23.611,0L173.357,376.255c-6.52,6.52-6.52,17.091,0,23.611
			c3.26,3.26,7.533,4.891,11.805,4.891c4.272,0,8.546-1.629,11.805-4.891l141.667-141.667
			C345.155,251.679,345.155,241.109,338.635,234.588z" />
          </g>
        </g>
        <g>
          <g>
            <path d="M456.348,0H55.652c-9.22,0-16.696,7.475-16.696,16.696v478.609c0,5.787,2.996,11.161,7.918,14.202
			c4.923,3.043,11.069,3.317,16.244,0.731l59.316-29.658l59.316,29.658c4.7,2.35,10.232,2.35,14.933,0L256,480.58l59.316,29.658
			c2.35,1.175,4.909,1.762,7.466,1.762c2.558,0,5.117-0.588,7.466-1.762l59.316-29.658l59.316,29.658
			c5.173,2.587,11.32,2.312,16.244-0.731c4.922-3.042,7.918-8.416,7.918-14.202V16.696C473.044,7.475,465.569,0,456.348,0z
			 M439.652,468.29l-42.621-21.31c-4.7-2.35-10.232-2.35-14.933,0l-59.316,29.658l-59.316-29.658
			c-2.35-1.175-4.909-1.762-7.466-1.762s-5.117,0.588-7.466,1.762l-59.316,29.658l-59.316-29.658c-4.7-2.35-10.232-2.35-14.933,0
			l-42.621,21.31V33.391h367.304V468.29z" />
          </g>
        </g>
        <g>
          <g>
            <path d="M389.565,66.783H189.218c-9.22,0-16.696,7.475-16.696,16.696s7.475,16.696,16.696,16.696h200.348
			c9.22,0,16.696-7.475,16.696-16.696S398.786,66.783,389.565,66.783z" />
          </g>
        </g>
        <g>
          <g>
            <path d="M389.565,133.565H189.218c-9.22,0-16.696,7.475-16.696,16.696s7.475,16.696,16.696,16.696h200.348
			c9.22,0,16.696-7.475,16.696-16.696S398.786,133.565,389.565,133.565z" />
          </g>
        </g>
        <g>
          <g>
            <circle cx="122.435" cy="83.478" r="16.696" />
          </g>
        </g>
        <g>
          <g>
            <circle cx="122.435" cy="150.261" r="16.696" />
          </g>
        </g>
      </svg>
      Cuenta
    </button>
  </div>

  <button id="boton-carrito" class="hidden" type="button">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" id="icono-carrito">
      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"></path>
    </svg>
    <div class="text">
      <span id="cantidad-articulos-carrito"></span>
    </div>
  </button>

  <div class="lista-central" id="lista-central">

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
      <h2 id="titulo-rubros">Rubros</h2>
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

  <script src="/Scripts/Administrador/Vista/Js/Articulo.js?v=<?php echo APP_VERSION; ?>"></script>
  <script src="/Scripts/Administrador/Vista/Js/Rubro.js?v=<?php echo APP_VERSION; ?>"></script>
  <script src="/Scripts/Administrador/Vista/Js/Empresa.js?v=<?php echo APP_VERSION; ?>"></script>
  <script src="/Scripts/Cliente/Vista/Js/Carrito.js?v=<?php echo APP_VERSION; ?>"></script>
  <script src="/Scripts/Cliente/Vista/Js/ModalCarrito.js?v=<?php echo APP_VERSION; ?>"></script>
  <script src="/Scripts/Cliente/Vista/Js/PantallaCliente.js?v=<?php echo APP_VERSION; ?>"></script>
  <script src="/Scripts/Cliente/Vista/Js/GestorCliente.js?v=<?php echo APP_VERSION; ?>"></script>
</body>

</html>