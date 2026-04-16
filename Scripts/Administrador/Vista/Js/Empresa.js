class EmpresaVista {
  constructor(empresa) {
    this.id = empresa.id;
    this.nombre = empresa.nombre;
    this.telefono = empresa.telefono;
    this.ubicacion = empresa.ubicacion;
    this.tieneCarrito = empresa.tieneCarrito ?? false;
    this.moduloMesero = empresa.moduloMesero ?? false;
    this.deshabilitarExcel = empresa.deshabilitarExcel ?? false;
    this.efectivo = empresa.efectivo ?? false;
    this.tarjeta = empresa.tarjeta ?? false;
    this.transferencia = empresa.transferencia ?? false;
    this.precio1 = empresa.precio1 ?? "";
    this.precio2 = empresa.precio2 ?? "";
    this.precio3 = empresa.precio3 ?? "";
    this.logo_url = empresa.logo_url;
  }

  update(
    nombre,
    telefono,
    ubicacion,
    efectivo,
    tarjeta,
    transferencia,
    precio1,
    precio2,
    precio3,
  ) {
    this.nombre = nombre;
    this.telefono = telefono;
    this.ubicacion = ubicacion;
    this.efectivo = efectivo;
    this.tarjeta = tarjeta;
    this.transferencia = transferencia;
    this.precio1 = precio1;
    this.precio2 = precio2;
    this.precio3 = precio3;
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
          empresaModuloMesero: this.moduloMesero,
          empresaDeshabilitarExcel: this.deshabilitarExcel,
          empresaEfectivo: this.efectivo,
          empresaTarjeta: this.tarjeta,
          empresaTransferencia: this.transferencia,
          empresaPrecio1: this.precio1,
          empresaPrecio2: this.precio2,
          empresaPrecio3: this.precio3,
          empresaLogoUrl: this.logo_url,
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
        <h2 id ="titulo-modal">Nueva Cafetería</h2>
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
              id="btnMesero"
              class="toggle-btn ${this.moduloMesero ? "active" : ""}">
            Módulo Mesero
          </button>

          <button type="button"
              id="btnDeshabilitarExcel"
              class="toggle-btn ${this.deshabilitarExcel ? "active" : ""}">
            Deshabilitar Excel
          </button>
        </div>
        <text id="titulo-modulos"> Métodos de pago </text>
        <div class="lista-botones">
          <button type="button"
              id="btnEfectivo"
              class="toggle-btn ${this.efectivo ? "active" : ""}">
            Efectivo
          </button>

          <button type="button"
              id="btnTarjeta"
              class="toggle-btn ${this.tarjeta ? "active" : ""}">
            Tarjeta
          </button>

          <button type="button"
              id="btnTransferencia"
              class="toggle-btn ${this.transferencia ? "active" : ""}">
            Transferencia
          </button>
        </div>
        <input type="hidden" name="tieneCarrito" id="tieneCarrito" value="${!!this.tieneCarrito}">
        <input type="hidden" name="moduloMesero" id="moduloMesero" value="${!!this.moduloMesero}">
        <input type="hidden" name="deshabilitarExcel" id="deshabilitarExcel" value="${!!this.deshabilitarExcel}">
        <input type="hidden" name="efectivo" id="efectivo" value="${!!this.efectivo}">
        <input type="hidden" name="tarjeta" id="tarjeta" value="${!!this.tarjeta}">
        <input type="hidden" name="transferencia" id="transferencia" value="${!!this.transferencia}">
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
          <label for="contrasenaMesero">Contraseña de Mesero</label>
          <input type="password" id="contrasenaMesero" name="contrasenaMesero">
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
          <h3 class="subtitulo-horarios">Horarios registrados</h3>
          <div id="listaHorariosRegistrados" class="horarios-grid"></div>
        </div>


        <!-- BOTÓN FINAL -->
        <div class="boton-final-container">
          <button type="button" class="botonCambiarForm" id="btnFormDiasNoLaborales">
            Configurar días no laborales
          </button>

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

  modalConfigurarDiasNoLaborales() {
    const modalDiasNoLaborales = document.createElement("div");
    modalDiasNoLaborales.classList.add("wrapper");
    modalDiasNoLaborales.id = "modalConfigurarDiasNoLaborales";

    const modalContenido = document.createElement("div");
    modalContenido.classList.add("wrapper-content");

    const htmlContent = `
      <form id="formConfigurarDiasNoLaborales">
        <header id="header-wrapper">
          <h2 id="titulo-wrapper" class="titulo">Configuración de días no laborales</h2>
          <button type="button" id="cerrar-wrapper-dias-no-laborales" class="boton-cerrar">&times;</button>
        </header>

        <div class="modulos">
          <text id="titulo-modulos-dia"> Agregar día individual </text>

          <div class="form-group">
            <label for="fechaNoLaboral">Fecha:</label>
            <input type="date" class="fecha-no-laboral-input" id="fechaNoLaboral" name="fechaNoLaboral" title="Seleccioná una fecha">
          </div>

          <button type="button" class="boton" id="agregarDiaNoLaboral">
            + Agregar día
          </button>

          <text id="titulo-modulos-rango"> Agregar rango de fechas </text>

          <div class="form-group">
            <label for="fechaNoLaboralInicio">Desde:</label>
            <input type="date" class="fecha-no-laboral-input" id="fechaNoLaboralInicio" name="fechaNoLaboralInicio" title="Seleccioná una fecha">
          </div>

          <div class="form-group">
            <label for="fechaNoLaboralFin">Hasta:</label>
            <input type="date" class="fecha-no-laboral-input" id="fechaNoLaboralFin" name="fechaNoLaboralFin" title="Seleccioná una fecha">
          </div>

          <button type="button" class="boton" id="agregarRangoNoLaboral">
            + Agregar rango
          </button>
        </div>

        <h3 class="subtitulo-horarios">Días no laborales registrados</h3>
        <div id="listaDiasNoLaborales" class="horarios-grid"></div>

        <div class="boton-final-container">
          <button type="button" class="botonCambiarForm" id="btnFormConfigurarHorarios">
            Configurar horarios
          </button>
          <button type="submit" class="boton boton-final disabled" id="btnGuardarDiasNoLaborales">
            Guardar
          </button>
        </div>
      </form>
    `;

    modalContenido.innerHTML = htmlContent;
    modalDiasNoLaborales.appendChild(modalContenido);

    return modalDiasNoLaborales;
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
              id="btnMesero"
              class="toggle-btn ${this.moduloMesero ? "active" : ""}">
            Módulo Mesero
          </button>

          <button type="button"
              id="btnDeshabilitarExcel"
              class="toggle-btn ${this.deshabilitarExcel ? "active" : ""}">
            Deshabilitar Excel
          </button>
        </div>
        <text id="titulo-modulos"> Métodos de pago </text>
        <div class="lista-botones">
          <button type="button"
              id="btnEfectivo"
              class="toggle-btn ${this.efectivo ? "active" : ""}">
            Efectivo
          </button>

          <button type="button"
              id="btnTarjeta"
              class="toggle-btn ${this.tarjeta ? "active" : ""}">
            Tarjeta
          </button>

          <button type="button"
              id="btnTransferencia"
              class="toggle-btn ${this.transferencia ? "active" : ""}">
            Transferencia
          </button>
        </div>
        <input type="hidden" name="tieneCarrito" id="tieneCarrito" value="${!!this.tieneCarrito}">
        <input type="hidden" name="moduloMesero" id="moduloMesero" value="${!!this.moduloMesero}">
        <input type="hidden" name="deshabilitarExcel" id="deshabilitarExcel" value="${!!this.deshabilitarExcel}">
        <input type="hidden" name="efectivo" id="efectivo" value="${!!this.efectivo}">
        <input type="hidden" name="tarjeta" id="tarjeta" value="${!!this.tarjeta}">
        <input type="hidden" name="transferencia" id="transferencia" value="${!!this.transferencia}">
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
        <div class="form-group">
          <label for="contrasenaMesero">Contraseña de Mesero</label>
          <input type="password" id="contrasenaMesero" name="contrasenaMesero" placeholder="Dejar vacío en caso de no cambiar la contraseña">
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
        <button type = "button" class = "submit-button" id = "visitar-pagina" >Página de Carta</button>
        <button type = "button" class = "submit-button" id = "visitar-gestion" >Página de Gestión</button>
      </form>
    `;

    modalConfigurarEmpresaContenido.innerHTML = htmlContent;
    modalConfigurarEmpresa.appendChild(modalConfigurarEmpresaContenido);

    return modalConfigurarEmpresa;
  }

  modalModificarParaModerador(moderador) {
    const modalNuevaEmpresa = document.createElement("div");
    modalNuevaEmpresa.classList.add("modal-backdrop");
    modalNuevaEmpresa.id = "modalModificarEmpresa";

    const modalNuevaEmpresaContenido = document.createElement("div");
    modalNuevaEmpresaContenido.classList.add("modal-content");

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
        <text id="titulo-modulos"> Métodos de pago </text>
        <div class="lista-botones">
          <button type="button"
              id="btnEfectivo"
              class="toggle-btn ${this.efectivo ? "active" : ""}">
            Efectivo
          </button>

          <button type="button"
              id="btnTarjeta"
              class="toggle-btn ${this.tarjeta ? "active" : ""}">
            Tarjeta
          </button>

          <button type="button"
              id="btnTransferencia"
              class="toggle-btn ${this.transferencia ? "active" : ""}">
            Transferencia
          </button>
        </div>
        <input type="hidden" name="efectivo" id="efectivo" value="${!!this.efectivo}">
        <input type="hidden" name="tarjeta" id="tarjeta" value="${!!this.tarjeta}">
        <input type="hidden" name="transferencia" id="transferencia" value="${!!this.transferencia}">

        <text id="titulo-modulos"> Precios </text>
        <div class="lista-botones form-group precios">
          <input type="text" id="precio-1" name="precio-1" value="${this.precio1}" placeholder="Precio 1">

          <input type="text" id="precio-2" name="precio-2" value="${this.precio2}" placeholder="Precio 2">

          <input type="text" id="precio-3" name="precio-3" value="${this.precio3}" placeholder="Precio 3">
        </div>
        
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
        <div class="form-group">
          <label for="contrasenaMesero">Contraseña de Mesero</label>
          <input type="password" id="contrasenaMesero" name="contrasenaMesero" placeholder="Dejar vacío en caso de no cambiar la contraseña">
        </div>
        <div class="footer-wrapper">
          <button type="submit" id="boton-guardar-empresa">Enviar</button>
        </div>
      </form>
    `;
    modalNuevaEmpresaContenido.innerHTML = htmlContent;
    if (!this.tieneCarrito) {
      const listaBotones =
        modalNuevaEmpresaContenido.querySelector(".lista-botones");
      const btnEfectivo =
        modalNuevaEmpresaContenido.querySelector("#btnEfectivo");
      const btnTarjeta =
        modalNuevaEmpresaContenido.querySelector("#btnTarjeta");
      const btnTransferencia =
        modalNuevaEmpresaContenido.querySelector("#btnTransferencia");
      const textoMetodosPago =
        modalNuevaEmpresaContenido.querySelector("#titulo-modulos");
      listaBotones.classList.add("hidden");
      textoMetodosPago.classList.add("hidden");
      btnEfectivo.classList.add("hidden");
      btnTarjeta.classList.add("hidden");
      btnTransferencia.classList.add("hidden");
    }

    modalNuevaEmpresa.appendChild(modalNuevaEmpresaContenido);

    return modalNuevaEmpresa;
  }
}
