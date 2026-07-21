class EmpresaVista {
  constructor(empresa) {
    this.id = empresa.id;
    this.nombre = empresa.nombre;
    this.telefono = empresa.telefono;
    this.ubicacion = empresa.ubicacion;
    this.tieneCarrito = empresa.tieneCarrito ?? false;
    this.deshabilitarExcel = empresa.deshabilitarExcel ?? false;
    this.imagenesEnArticulos = empresa.imagenesEnArticulos ?? true;
    this.incluirHorarios = empresa.incluirHorarios ?? false;
    this.incluirCodigoBarra = empresa.incluirCodigoBarra ?? false;
    this.logo_url = empresa.logo_url;
  }

  update(
    nombre,
    telefono,
    ubicacion,
    imagenesEnArticulos,
    incluirHorarios,
    incluirCodigoBarra,
  ) {
    this.nombre = nombre;
    this.telefono = telefono;
    this.ubicacion = ubicacion;
    this.imagenesEnArticulos = imagenesEnArticulos;
    this.incluirHorarios = incluirHorarios;
    this.incluirCodigoBarra = incluirCodigoBarra;
  }

  mostrarUna() {
    const divEmpresa = document.createElement("div");
    divEmpresa.classList.add("empresa");
    divEmpresa.dataset.empresaId = this.id; //🤣😎
    divEmpresa.style.backgroundImage = `url('${this.logo_url || "/Archivos/Logos/Vacio.png"}')`;

    const pNombre = document.createElement("p");
    pNombre.textContent = this.nombre;
    divEmpresa.appendChild(pNombre);

    divEmpresa.addEventListener("click", () => {
      const event = new CustomEvent("empresaSeleccionada", {
        detail: {
          empresaId: this.id,
          empresaNombre: this.nombre,
          empresaTelefono: this.telefono,
          empresaUbicacion: this.ubicacion,
          empresaTieneCarrito: this.tieneCarrito,
          empresaDeshabilitarExcel: this.deshabilitarExcel,
          empresaLogoUrl: this.logo_url,
          empresaImagenesEnArticulos: this.imagenesEnArticulos ?? true,
          empresaIncluirHorarios: this.incluirHorarios ?? false,
          empresaIncluirCodigoBarra: this.incluirCodigoBarra ?? false,
        },
      });
      document.dispatchEvent(event);
      if (typeof window.gestorDeEmpresasCallback === "function") {
        window.gestorDeEmpresasCallback(this);
      }
    });

    return divEmpresa;
  }

  async asignarIconoYPagina(texto) {
    try {
      // Cambiar el título de la pestaña
      document.title = `${this.nombre} ${texto}`;

      // Crear nuevo favicon con el logo de la empresa
      const nuevoFavicon = document.createElement("link");
      nuevoFavicon.rel = "icon";
      nuevoFavicon.type = "image/png";
      nuevoFavicon.href = this.logo_url || "/Archivos/Logos/Vacio.png";

      document.head.appendChild(nuevoFavicon);
    } catch (error) {
      console.error(
        "Error al asignar el ícono o el título de la pestaña:",
        error,
      );
    }
  }

  static modalNuevaEmpresa() {
    const modalNuevaEmpresa = document.createElement("div");
    modalNuevaEmpresa.classList.add("modal-backdrop");
    modalNuevaEmpresa.id = "modalNuevaEmpresa";

    const modalNuevaEmpresaContenido = document.createElement("div");
    modalNuevaEmpresaContenido.classList.add("modal-content");

    const htmlContent = `
      <form id="formNuevaEmpresa">
      <div id="header-wrapper">
        <h2 id ="titulo-modal">Nueva Empresa</h2>
        <button type="button" id="cerrar-wrapper" class="boton-cerrar">&times;</button>
      </div>
        <div class="form-group">
          <label for="nombre" class="required" >Nombre</label>
          <input type="text" id="nombre" name="nombre" required>
        </div>
        <div class="form-group">
          <label for="telefono">Nro de telefono</label>
          <input type="text" id="telefono" name="telefono" maxlength=18>
        </div>
        <div class="form-group">
          <label for="ubicacion">Direccion</label>
          <input type="text" id="ubicacion" name="ubicacion">
        </div>
        <text id="titulo-modulos"> Módulos Disponibles </text>
        <div class="lista-botones">
          <button type="button"
              id="btnCarrito"
              class="toggle-btn ${this.tieneCarrito ? "active" : ""}">
            Módulo Carrito
          </button>

          <button type="button"
              id="btnDeshabilitarExcel"
              class="toggle-btn ${this.deshabilitarExcel ? "active" : ""}">
            Deshabilitar Excel
          </button>
        </div>
        <input type="hidden" name="tieneCarrito" id="tieneCarrito" value="${!!this.tieneCarrito}">
        <input type="hidden" name="deshabilitarExcel" id="deshabilitarExcel" value="${!!this.deshabilitarExcel}">
        <div class="form-group">
          <label for="imagen">Imagen</label>
          <input type="file" id="imagen" name="imagen" accept="image/*">
        </div>
        <div class="form-group">
          <label for="usuario" class="required">Usuario</label>
          <input type="text" id="usuario" name="usuario" required>
        </div>
        <div class="form-group">
          <label for="contrasena" class="required">Contraseña</label>
          <input type="password" id="contrasena" name="contrasena" required>
        </div>
          <div class="form-group">
            <label for="contrasenaInternos" class="">Contraseña para internos</label>
            <input type="password" id="contrasenaInternos" name="contrasenaInternos">
          </div>
        <div class="footer-wrapper">
          <button type="submit" class="submit-button" id="boton-guardar-empresa">Enviar</button>
        </div>
      </form>
    `;

    modalNuevaEmpresaContenido.innerHTML = htmlContent;
    modalNuevaEmpresa.appendChild(modalNuevaEmpresaContenido);

    return modalNuevaEmpresa;
  }

  modalConfigurarHorarios() {
    const modalHorarios = document.createElement("div");
    modalHorarios.classList.add("wrapper");
    modalHorarios.id = "modalConfigurarHorarios";

    const modalHorarioContenido = document.createElement("div");
    modalHorarioContenido.classList.add("wrapper-content");

    const dias = DIAS_SEMANA.map((nombre) => ({
      nombre,
      abierto: false,
      horaApertura: "",
      horaCierre: "",
    }));

    const botonesDiasHTML = dias
      .map(
        (dia, index) => `
      <button type="button"
          id="btnDia${index}"
          class="toggle-btn ${dia.abierto ? "active" : ""}">
        ${dia.nombre}
      </button>
    `,
      )
      .join("");

    const htmlContent = `
      <form id="formConfigurarHorariosEmpresa">
        <header id="header-wrapper">
          <h2 id="titulo-wrapper" class="titulo">Configuración de Horarios</h2>
          <button type="button" id="cerrar-wrapper" class="boton-cerrar">&times;</button>
        </header>

        <div class="modulos">
          <text id="titulo-modulos" class="required"> Seleccione los días de apertura </text>

          <div class="lista-botones">
            ${botonesDiasHTML}
          </div>

          <div class="form-group">
            <label for="horaApertura" class="required">Hora de Apertura</label>
            <input type="time" id="horaApertura" name="horaApertura" required>
          </div>

          <div class="form-group">
            <label for="horaCierre" class="required">Hora de Cierre</label>
            <input type="time" id="horaCierre" name="horaCierre" required>
          </div>

          <!-- ESTE submit es para REGISTRAR en el array -->
          <button type="submit" class="boton" id="boton-registrar-horarios">
            + Registrar
          </button>
          
        </div>

        <div class="lista-horarios"></div>
          <!-- LISTA DE HORARIOS -->
          <h3 class="subtitulo-horarios">Vista previa de Horarios</h3>
          <div id="listaHorariosRegistrados" class="horarios-grid"></div>
        </div>


        <!-- BOTÓN FINAL -->
        <div class="boton-final-container">
          <button type="button" class="boton boton-final disabled" id="btnGuardarHorarios">
            Guardar
          </button>
        </div>
      </form>
    `;

    modalHorarioContenido.innerHTML = htmlContent;
    modalHorarios.appendChild(modalHorarioContenido);

    return modalHorarios;
  }

  modalModificar(moderador) {
    const modalNuevaEmpresa = document.createElement("div");
    modalNuevaEmpresa.classList.add("modal-backdrop");
    modalNuevaEmpresa.id = "modalModificarEmpresa";

    const modalNuevaEmpresaContenido = document.createElement("div");
    modalNuevaEmpresaContenido.classList.add("modal-content");

    const htmlContent = `
      <form id="formModificarEmpresa">
      <div id="header-wrapper">
        <h2 id ="titulo-modal">Modificar ${this.nombre}</h2>
        <button type="button" id="cerrar-wrapper" class="boton-cerrar">&times;</button>
      </div>
        <div class="form-group">
          <label for="nombre">Nombre</label>
          <input type="text" id="nombre" name="nombre" value="${this.nombre}" required>
        </div>
        <div class="form-group">
          <label for="telefono">Nro de telefono</label>
          <input type="text" id="telefono" name="telefono" value="${this.telefono}" maxlength=18 >
        </div>
        <div class="form-group">
          <label for="ubicacion" >Direccion</label>
          <input type="text" id="ubicacion" name="ubicacion" value="${this.ubicacion}" >
        </div>
        <text id="titulo-modulos"> Módulos Disponibles </text>
        <div class="lista-botones">
          <button type="button"
              id="btnCarrito"
              class="toggle-btn ${this.tieneCarrito ? "active" : ""}">
            Módulo Carrito
          </button>

          <button type="button"
              id="btnDeshabilitarExcel"
              class="toggle-btn ${this.deshabilitarExcel ? "active" : ""}">
            Deshabilitar Excel
          </button>
        </div>
        <input type="hidden" name="tieneCarrito" id="tieneCarrito" value="${!!this.tieneCarrito}">
        <input type="hidden" name="deshabilitarExcel" id="deshabilitarExcel" value="${!!this.deshabilitarExcel}">
        <div class="form-group">
          <label for="imagen">Imagen</label>
          <input type="file" id="imagen" name="imagen" accept="image/*">
        </div>
        <div class="form-group">
          <label for="usuario">Usuario</label>
          <input type="text" id="usuario" name="usuario" value="${moderador.nombre}" required>
        </div>
        <div class="form-group">
          <label for="contrasena">Contraseña</label>
          <input type="password" id="contrasena" name="contrasena" placeholder="Dejar vacío en caso de no cambiar la contrasena">
        </div>
        <div class="contenedor-contrasena-internos">
        <div class="form-group">
          <label for="contrasenaInternos" class="">Contraseña para internos</label>
          <input type="password" id="contrasenaInternos" name="contrasenaInternos" placeholder="Dejar vacío en caso de no cambiar la contrasena">
        </div>
        <button type="button" id="vaciar-contrasena-interno" class="boton-vaciar eliminar">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6m5 0V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
        </div>
        <div class="footer-wrapper">
        <button type="submit" class="submit-button" id="boton-guardar-empresa">Enviar</button>
        </div>
      </form>
    `;
    modalNuevaEmpresaContenido.innerHTML = htmlContent;

    modalNuevaEmpresa.appendChild(modalNuevaEmpresaContenido);

    return modalNuevaEmpresa;
  }

  modalConfigurarEmpresa() {
    const modalConfigurarEmpresa = document.createElement("div");
    modalConfigurarEmpresa.classList.add("modal-configurar");
    modalConfigurarEmpresa.id = "modal-configuracion-empresa";

    const modalConfigurarEmpresaContenido = document.createElement("div");
    modalConfigurarEmpresaContenido.classList.add("modal-content-configurar");
    const htmlContent = `
      <form id="form-configurar-empresa">
        <div class="header-configurar">
          <h2 id = "nombre-empresa-modal">${this.nombre}</h2>
          <div id = "botones-empresa" >
            <button id = "seccion-modificar" class="botones-empresa" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-2">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
              </svg>
            </button>
            <button type="button" id="btn-eliminar-empresa" class="botones-empresa">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6m5 0V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
        <h3 id = "id-empresa"> ID ${this.id} </h3>
        <button type = "button" class = "submit-button" id = "configurar-horarios" >Horarios</button>
        <button type = "button" class = "submit-button" id = "qr-configuracion" >QR</button>
      </form>
    `;

    modalConfigurarEmpresaContenido.innerHTML = htmlContent;
    modalConfigurarEmpresa.appendChild(modalConfigurarEmpresaContenido);

    modalConfigurarEmpresa
      .querySelector("#qr-configuracion")
      .addEventListener("click", () => {
        const modalQR = this.modalQRConfiguracion();
        document.querySelector(".lista-central").classList.add("hidden");
        document.body.appendChild(modalQR); // Ensure modal is appended to the DOM
      });

    return modalConfigurarEmpresa;
  }

  modalModificarParaModerador(moderador) {
    const modalModificarEmpresa = document.createElement("div");
    modalModificarEmpresa.classList.add("modal-backdrop");
    modalModificarEmpresa.id = "modalModificarEmpresa";

    const modalModificarEmpresaContenido = document.createElement("div");
    modalModificarEmpresaContenido.classList.add("modal-content");
    const htmlContent = `
      <form id="formModificarEmpresa">
        <div id="header-wrapper">
          <h2 id ="titulo-modal">Modificar datos</h2>
          <button type="button" id="cerrar-wrapper" class="boton-cerrar">&times;</button>
        </div>
        <div class="form-group">
          <label for="nombre">Nombre</label>
          <input type="text" id="nombre" name="nombre" value="${this.nombre}" required>
        </div>
        <div class="form-group">
          <label for="telefono">Nro de telefono</label>
          <input type="text" id="telefono" name="telefono" value="${this.telefono}" maxlength=18>
        </div>
        <div class="form-group">
          <label for="ubicacion">Direccion</label>
          <input type="text" id="ubicacion" name="ubicacion" value="${this.ubicacion}">
        </div>

        <text id="titulo-modulos-config">Módulos</text>

        <div class="lista-botones" id="lista-modulos">
          <button
              type="button"
              id="btnImagenesEnArticulos"
              class="toggle-btn ${this.imagenesEnArticulos ? "active" : ""}">
            Imágenes en artículos
          </button>
          <button
              type="button"
              id="btnIncluirHorarios"
              class="toggle-btn ${this.incluirHorarios ? "active" : ""}">
            Incluir Horarios
          </button>
          <button
              type="button"
              id="btnIncluirCodigoBarra"
              class="toggle-btn ${this.incluirCodigoBarra ? "active" : ""}">
            Lector de códigos de barras
          </button>
        </div>

        <input
          type="hidden"
          name="imagenesEnArticulos"
          id="imagenesEnArticulos"
          value="${!!this.imagenesEnArticulos}">

        <input
          type="hidden"
          name="incluirHorarios"
          id="incluirHorarios"
          value="${!!this.incluirHorarios}">

        <input
          type="hidden"
          name="incluirCodigoBarra"
          id="incluirCodigoBarra"
          value="${!!this.incluirCodigoBarra}">

        <div class="form-group">
          <label for="imagen">Imagen</label>
          <input type="file" id="imagen" name="imagen" accept="image/*">
        </div>
        <div class="form-group">
          <label for="usuario">Usuario</label>
          <input type="text" id="usuario" name="usuario" value="${moderador.nombre}" required>
        </div>
        <div class="form-group">
          <label for="contrasena">Contraseña</label>
          <input type="password" id="contrasena" name="contrasena" placeholder="Dejar vacío en caso de no cambiar la contrasena">
        </div>
        <div class="footer-wrapper">
          <button type="submit" id="boton-guardar-empresa">Enviar</button>
        </div>
      </form>
    `;
    modalModificarEmpresaContenido.innerHTML = htmlContent;
    if (!this.tieneCarrito) {
      const listaBotones =
        modalModificarEmpresaContenido.querySelector(".lista-botones");
      listaBotones.classList.add("hidden");
    }

    modalModificarEmpresa.appendChild(modalModificarEmpresaContenido);

    return modalModificarEmpresa;
  }

  modalQRConfiguracion() {
    const modalQR = document.createElement("div");
    modalQR.classList.add("modal-backdrop");
    modalQR.id = "modal-qr-configuracion";

    const modalQRContenido = document.createElement("div");
    modalQRContenido.classList.add("modal-content");

    const htmlContent = `
    <div class="header-configurar">
      <h2 id="generar-qr-titulo">Generar QR</h2>
      <button type="button" id="cerrar-qr-modal" class="boton-cerrar">&times;</button>
    </div>

    <div class="engrupador">

      <div class="qr-options">
        <button id="qr-pagina-configuracion" class="qr-button">Página de configuraciones</button>

        <button id="qr-catalogo-local" class="qr-button">Catálogo</button>

        <button id="qr-catalogo-fuera" class="qr-button">Catálogo para Internos</button>
      </div>

      <div id="qr-resultado" style="margin-top:20px; text-align:center;"></div>
    </div>
  `;

    modalQRContenido.innerHTML = htmlContent;
    modalQR.appendChild(modalQRContenido);

    const baseURL = window.location.origin;

    // Eventos
    modalQR
      .querySelector("#qr-pagina-configuracion")
      .addEventListener("click", () => {
        this.generarQR(
          `${baseURL}/moderador/${this.id}`,
          "pagina-configuracion",
        );
      });

    modalQR
      .querySelector("#qr-catalogo-fuera")
      .addEventListener("click", () => {
        this.generarQR(
          `${baseURL}/catalogo/${this.id}?interno`,
          "carta-delivery",
        );
      });

    modalQR
      .querySelector("#qr-catalogo-local")
      .addEventListener("click", () => {
        this.generarQR(`${baseURL}/catalogo/${this.id}`, "carta-local");
      });

    modalQR.querySelector("#cerrar-qr-modal").addEventListener("click", () => {
      modalQR.remove();
      document.querySelector(".lista-central").classList.remove("hidden");
    });

    return modalQR;
  }

  generarQR(url, palabraParaDescargar = "") {
    const contenedor = document.querySelector("#qr-resultado");
    contenedor.innerHTML = "";

    QRCode.toCanvas(url, { width: 200 }, (err, canvas) => {
      if (err) {
        console.error(err);
        return;
      }

      contenedor.appendChild(canvas);

      // Botón descargar
      const btnDescargar = document.createElement("button");
      btnDescargar.textContent = "Descargar QR";
      btnDescargar.classList.add("boton-descargar");
      btnDescargar.style.marginTop = "10px";

      btnDescargar.addEventListener("click", () => {
        const enlace = document.createElement("a");
        enlace.href = canvas.toDataURL("image/png");
        enlace.download = `qr-${this.nombre}-${palabraParaDescargar}.png`;
        enlace.click();
      });

      contenedor.appendChild(btnDescargar);

      // Link clickeable
      const link = document.createElement("a");
      link.href = url;
      link.textContent = url;
      link.target = "_blank";
      link.style.color = "#e89e13";
      link.style.display = "block";
      link.style.marginTop = "10px";

      contenedor.appendChild(link);
    });
  }
}
