<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/png" href="/Archivos/Logos/Iteracion.png">
  <link rel="stylesheet" href="/Scripts/Administrador/Vista/Css/PantallaModerador.css?v=<?php echo APP_VERSION; ?>">
  <link rel="stylesheet" href="/Scripts/Administrador/Vista/Css/ListaArticulos.css?v=<?php echo APP_VERSION; ?>">
  <link rel="stylesheet" href="/Scripts/Administrador/Vista/Css/BotonesAlta.css?v=<?php echo APP_VERSION; ?>">
  <link rel="stylesheet" href="/Scripts/Administrador/Vista/Css/BotonesMostrarLista.css?v=<?php echo APP_VERSION; ?>">
  <link rel="stylesheet" href="/Scripts/Administrador/Vista/Css/BotonCargar.css?v=<?php echo APP_VERSION; ?>">
  <link rel="stylesheet" href="/Scripts/Administrador/Vista/Css/BarraBusqueda.css?v=<?php echo APP_VERSION; ?>">
  <link rel="stylesheet" href="/Scripts/Administrador/Vista/Css/Loader.css?v=<?php echo APP_VERSION; ?>">
  <link rel="stylesheet" href="/Scripts/Administrador/Vista/Css/pantallaHorario.css?v=<?php echo APP_VERSION; ?>">
  <link rel="stylesheet" href="/Scripts/Administrador/Vista/Css/modalNuevaEmpresa.css?v=<?php echo APP_VERSION; ?>">
</head>

<body>
  <header id="titulo-pagina">
    <h1 id="titulo-pagina"></h1>
  </header>

  <button type="button" id="modificar-cafeteria">
    <svg height="50px" width="50px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 512 512" xml:space="preserve">
      <style type="text/css">
        .st0 {
          fill: #e89e13;
        }
      </style>
      <g>
        <path class="st0" d="M277.028,262.753l-26.612-2.882c-3.641-0.394-6.72-2.788-8.118-6.172c-0.017-0.04-0.034-0.081-0.05-0.121
		c-1.403-3.383-0.92-7.252,1.376-10.105l16.78-20.855c3.164-3.932,2.857-9.616-0.712-13.185l-31.411-31.411
		c-3.569-3.569-9.252-3.876-13.185-0.712l-20.864,16.787c-2.846,2.29-6.704,2.776-10.082,1.386c-0.037-0.015-0.074-0.03-0.111-0.045
		c-3.396-1.394-5.799-4.478-6.194-8.128l-2.883-26.624c-0.543-5.018-4.779-8.82-9.826-8.82h-44.422c-5.047,0-9.283,3.802-9.826,8.82
		l-2.883,26.624c-0.395,3.649-2.799,6.734-6.195,8.128c-0.037,0.015-0.074,0.03-0.11,0.045c-3.378,1.391-7.236,0.904-10.082-1.386
		L70.752,177.31c-3.932-3.164-9.616-2.857-13.184,0.712l-31.411,31.411c-3.569,3.569-3.876,9.253-0.712,13.185l16.78,20.855
		c2.296,2.854,2.779,6.722,1.376,10.105c-0.017,0.04-0.033,0.081-0.05,0.121c-1.399,3.384-4.477,5.778-8.118,6.172L8.82,262.753
		C3.802,263.296,0,267.532,0,272.579v44.422c0,5.047,3.802,9.283,8.82,9.826l26.612,2.881c3.641,0.394,6.72,2.788,8.118,6.172
		c0.017,0.04,0.033,0.081,0.05,0.121c1.403,3.383,0.92,7.252-1.376,10.106l-16.78,20.855c-3.164,3.932-2.857,9.616,0.712,13.185
		l31.411,31.411c3.569,3.569,9.253,3.876,13.185,0.712l20.864-16.787c2.846-2.291,6.704-2.777,10.082-1.386
		c0.037,0.015,0.074,0.03,0.111,0.045c3.396,1.394,5.799,4.478,6.194,8.128l2.883,26.624c0.543,5.018,4.779,8.82,9.826,8.82h44.422
		c5.047,0,9.283-3.802,9.826-8.82l2.883-26.624c0.395-3.649,2.798-6.734,6.194-8.128c0.037-0.015,0.074-0.03,0.11-0.045
		c3.378-1.391,7.236-0.905,10.083,1.386l20.864,16.787c3.932,3.164,9.616,2.857,13.185-0.712l31.411-31.411
		c3.569-3.569,3.875-9.253,0.712-13.185l-16.78-20.855c-2.296-2.853-2.779-6.722-1.376-10.106c0.016-0.04,0.033-0.08,0.05-0.121
		c1.399-3.384,4.477-5.778,8.118-6.172l26.612-2.881c5.017-0.544,8.82-4.78,8.82-9.826v-44.422
		C285.848,267.532,282.046,263.296,277.028,262.753z M142.924,339.349c-24.609,0-44.559-19.95-44.559-44.559
		c0-24.609,19.95-44.559,44.559-44.559s44.559,19.95,44.559,44.559C187.483,319.399,167.533,339.349,142.924,339.349z" />
        <path class="st0" d="M507.469,218.212L489.2,203.785c-2.91-2.298-4.526-5.821-4.528-9.53c0-0.039,0-0.078,0-0.118
		c-0.006-3.717,1.611-7.249,4.528-9.552l18.269-14.428c4.184-3.304,5.664-8.985,3.624-13.91l-8.025-19.374
		c-2.04-4.926-7.104-7.896-12.398-7.274l-23.12,2.716c-3.692,0.434-7.333-0.92-9.956-3.553c-0.027-0.028-0.055-0.056-0.083-0.083
		c-2.622-2.624-3.97-6.258-3.537-9.941l2.716-23.119c0.622-5.294-2.349-10.358-7.274-12.398l-19.374-8.024
		c-4.925-2.04-10.606-0.56-13.91,3.623l-14.428,18.268c-2.299,2.911-5.822,4.526-9.53,4.528c-0.04,0-0.079,0-0.118,0
		c-3.716,0.006-7.248-1.611-9.552-4.528l-14.428-18.269c-3.304-4.184-8.986-5.664-13.911-3.624l-19.374,8.025
		c-4.925,2.04-7.896,7.104-7.274,12.399l2.716,23.12c0.434,3.691-0.92,7.332-3.553,9.956c-0.028,0.028-0.056,0.056-0.084,0.084
		c-2.624,2.622-6.257,3.97-9.941,3.537l-23.119-2.716c-5.295-0.622-10.358,2.349-12.398,7.274l-8.025,19.374
		c-2.04,4.925-0.56,10.607,3.624,13.911l18.268,14.427c2.911,2.299,4.526,5.821,4.528,9.53c0,0.04,0,0.079,0,0.118
		c0.007,3.717-1.611,7.249-4.528,9.552l-18.269,14.428c-4.184,3.304-5.664,8.985-3.623,13.91l8.024,19.374
		c2.04,4.925,7.104,7.896,12.398,7.274l23.121-2.716c3.691-0.434,7.332,0.92,9.956,3.553c0.028,0.028,0.055,0.056,0.083,0.083
		c2.622,2.624,3.97,6.257,3.537,9.941l-2.716,23.12c-0.622,5.295,2.349,10.358,7.274,12.398l19.374,8.025
		c4.925,2.04,10.606,0.56,13.911-3.624l14.427-18.268c2.299-2.911,5.821-4.526,9.53-4.528c0.039,0,0.078,0,0.118,0
		c3.716-0.007,7.249,1.611,9.552,4.528l14.428,18.269c3.304,4.184,8.985,5.664,13.911,3.624l19.374-8.025
		c4.925-2.04,7.896-7.104,7.274-12.398l-2.716-23.12c-0.434-3.691,0.92-7.333,3.553-9.956c0.028-0.028,0.056-0.056,0.084-0.083
		c2.624-2.621,6.257-3.97,9.941-3.537l23.12,2.716c5.295,0.622,10.358-2.349,12.398-7.274l8.025-19.374
		C513.132,227.198,511.653,221.516,507.469,218.212z M403.948,228.701c-18.584,7.698-39.89-1.127-47.588-19.712
		s1.128-39.89,19.712-47.588c18.584-7.698,39.89,1.127,47.588,19.712C431.357,199.697,422.532,221.004,403.948,228.701z" />
      </g>
    </svg>
  </button>

  <div class="boton-carga csv">
    <button class="boton-cargar" type="button" id="boton-actualizar-articulos">
      <img src="../../../../Archivos/Iconos/excel.svg" alt="Actualizar" width="28" height="28">
      Actualizar
    </button>

    <button class="boton-cargar" type="button" id="boton-cargar-articulos">
      <img src="../../../../Archivos/Iconos/excel.svg" alt="Cargar" width="28" height="28">
      Sincronizar
    </button>
  </div>

  <div class="lista-central" id="lista-central">
    <div class="botones-lista">
      <button class="boton-lista activo" type="button" id="boton-mostrar-articulos">Artículos</button>
      <button class="boton-lista" type="button" id="boton-mostrar-ofertas">Ofertas</button>
      <button class="boton-lista" type="button" id="boton-mostrar-rubros">Rubros</button>
      <button class="boton-lista" type="button" id="boton-mostrar-proveedores">Proveedores</button>
      <button class="boton-lista" type="button" id="boton-mostrar-marcas">Marcas</button>
    </div>

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

    <div class="loader" id="loader">
    </div>

    <div class="listas">
      <div class="lista" id="lista-articulos"></div>
      <div class="lista" id="lista-ofertas"></div>
      <div class="lista-grupos lista" id="lista-rubros"></div>
      <div class="lista-grupos lista" id="lista-proveedores"></div>
      <div class="lista-grupos lista" id="lista-marcas"></div>
    </div>
  </div>

  <script src="/Scripts/Administrador/Vista/Js/Articulo.js?v=<?php echo APP_VERSION; ?>"></script>
  <script src="/Scripts/Administrador/Vista/Js/Empresa.js?v=<?php echo APP_VERSION; ?>"></script>
  <script src="/Scripts/Administrador/Vista/Js/Rubro.js?v=<?php echo APP_VERSION; ?>"></script>
  <script src="/Scripts/Administrador/Vista/Js/Proveedor.js?v=<?php echo APP_VERSION; ?>"></script>
  <script src="/Scripts/Administrador/Vista/Js/Marca.js?v=<?php echo APP_VERSION; ?>"></script>
  <script src="/Scripts/Administrador/Vista/Js/Moderador.js?v=<?php echo APP_VERSION; ?>"></script>
  <script src="/Scripts/Administrador/Vista/Js/Moderador/PantallaModerador.js?v=<?php echo APP_VERSION; ?>"></script>
  <script src="/Scripts/Administrador/Vista/Js/Moderador/GestorModerador.js?v=<?php echo APP_VERSION; ?>"></script>
  <script src="/Scripts/Administrador/Vista/Js/dias_semana.const.js?v=<?php echo APP_VERSION; ?>"></script>
  <script src="https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"></script>
</body>

</html>