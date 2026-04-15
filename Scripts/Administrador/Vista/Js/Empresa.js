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
    this.logo_url = empresa.logo_url;
  }

  update(nombre, telefono, ubicacion, efectivo, tarjeta, transferencia) {
    this.nombre = nombre;
    this.telefono = telefono;
    this.ubicacion = ubicacion;
    this.efectivo = efectivo;
    this.tarjeta = tarjeta;
    this.transferencia = transferencia;
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

  modalMeseros() {
    return `
      <div class="wrapper" id="modalMeseros">
        <div class="wrapper-content" id="lista-meseros-contenido">
          <form id="formConfigurarHorariosEmpresa">
            <header id="header-wrapper">
              <h2 id="titulo-wrapper" class="titulo">Configuración de Meseros</h2>
              <button type="button" id="cerrar-wrapper" class="boton-cerrar">&times;</button>
            </header>

            <div class="modulos">
              <div class="lista-meseros">
              </div>
              <div class="mesero-item" id="contenedorRegistrarMesero">
                <button type="button" class="boton-mesero" id="btnRegistrarMesero">
                  + Registrar Mesero
                </button>
              </div>
            </div>
          </form>
          

          <div class="contrasena-compartida-meseros">
            <form class="form-group" id="formRegistrarContrasenaCompartida">
              <label for="contrasenaCompartida">Contraseña compartida:</label>
              
              <input 
                type="password" 
                id="contrasenaCompartida" 
                name="contrasenaCompartida" 
                maxlength="20"
              >

              <button 
                type="button"
                class="btn-mesero btn-eliminar" 
                id="btnEliminarContrasenaCompartida"
              >
                <img src="../../../../Archivos/Iconos/trash.svg" alt="Eliminar">
              </button>

              <button 
                type="submit" 
                class="mesero-item" 
                id="btnGuardarContrasenaCompartida"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>

        <div class="boton-final-container-meseros">
          <button type="button" class="boton-mesero" id="btnCargarMeseros">
            + Cargar Meseros
          </button>
        </div>
      </div>
    `;
  }

  modalCargarMeseros() {
    const modalCargarMeseros = document.createElement("div");
    modalCargarMeseros.classList.add("modal-configurar");
    modalCargarMeseros.id = "modalCargarMeseros";

    const modalCargarMeserosContenido = document.createElement("div");
    modalCargarMeserosContenido.classList.add("modal-content-partial");

    const htmlContent = `
      <form id="formCargarMeseros">
        <h2 id="titulo-modal">Cargar Meseros</h2>
        <div class="form-group">
          <label for="archivo">Seleccionar archivo Excel:</label>
          <input type="file" id="archivo" name="archivo"
            accept=".csv,.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            required>
        </div>
        <div >
          <button type="submit" class="submit-button">Cargar</button>
        </div>
      </form>
    `;

    modalCargarMeserosContenido.innerHTML = htmlContent;
    modalCargarMeseros.appendChild(modalCargarMeserosContenido);

    return modalCargarMeseros;
  }

  modalRegistrarMesero() {
    const modalRegistrarMesero = document.createElement("div");
    modalRegistrarMesero.classList.add("modal-configurar");
    modalRegistrarMesero.id = "modalRegistrarMesero";

    const modalRegistrarMeseroContenido = document.createElement("div");
    modalRegistrarMeseroContenido.classList.add("modal-content-partial");

    const htmlContent = `
      <form id="formRegistrarMesero">
        <h2 id="titulo-modal">Registrar Mesero</h2>
        <div class="form-group">
          <label for="nombre" class="required">Nombre</label>
          <input type="text" id="nombre" name="nombre" required>
        </div>
        <div class="form-group">
          <label for="abreviaturaNombre">Abreviatura</label>
          <input type="text" id="abreviaturaNombre" name="abreviaturaNombre" maxlength="10" required>
        </div>
        <div class="form-group">
          <label for="contrasena">Contraseña</label>
          <input type="password" id="contrasena" name="contrasena" maxlength="20">
        </div>
        <button type="submit" class="boton" id="btnGuardarMesero">
          Guardar
        </button>
        
      </form>
    `;

    modalRegistrarMeseroContenido.innerHTML = htmlContent;
    modalRegistrarMesero.appendChild(modalRegistrarMeseroContenido);

    return modalRegistrarMesero;
  }

  modalModificarMesero(mesero) {
    const modalModificarMesero = document.createElement("div");
    modalModificarMesero.classList.add("modal-configurar");
    modalModificarMesero.id = "modalModificarMesero";

    const modalModificarMeseroContenido = document.createElement("div");
    modalModificarMeseroContenido.classList.add("modal-content-partial");

    const htmlContent = `
      <form id="formModificarMesero">
        <h2 id="titulo-modal">Modificar Mesero</h2>
        <div class="form-group">
          <label for="nombre" class="required">Nombre</label>
          <input type="text" id="nombre" name="nombre" value="${mesero.nombre}" required>
        </div>
        <div class="form-group">
          <label for="abreviaturaNombre">Abreviatura</label>
          <input type="text" id="abreviaturaNombre" name="abreviaturaNombre" value="${mesero.abreviaturaNombre}" maxlength="10" required>
        </div>
        <div class="form-group">
          <label for="contrasena">Contraseña</label>
          <input type="password" id="contrasena" name="contrasena" placeholder="Dejar en blanco para no cambiar" maxlength="20">
        </div>
        <button type="submit" class="boton" id="btnGuardarMesero">
          Guardar
        </button>
      </form>
    `;

    modalModificarMeseroContenido.innerHTML = htmlContent;
    modalModificarMesero.appendChild(modalModificarMeseroContenido);

    return modalModificarMesero;
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
        <h2 id = "nombre-empresa-modal">Configuración</h2>
        <button type = "button" class = "submit-button" id = "seccion-modificar" >Modificar datos</button>
        <button type = "button" class = "submit-button" id = "configurar-horarios" >Horarios</button>
        <button type = "button" class = "submit-button" id = "meseros" >Meseros</button>
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
