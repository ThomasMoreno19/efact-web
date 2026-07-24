<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Acceso EW-Fact</title>

  <link rel="stylesheet" href="/Scripts/Cliente/Vista/Css/LoginInterno.css">
</head>

<body>

  <main class="loginInterno">
    <section class="loginInterno__contenedor">

      <h1>Acceso</h1>

      <p>Ingrese la contraseña para acceder al catálogo.</p>

      <input
        type="password"
        id="password"
        placeholder="Contraseña"
        autocomplete="current-password">

      <button id="btnIngresar">
        Ingresar
      </button>

      <p id="mensajeError"></p>

    </section>
  </main>

  <script src="/Scripts/Cliente/Vista/Js/LoginExterno.js"></script>

</body>

</html>