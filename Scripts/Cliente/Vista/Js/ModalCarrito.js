class ModalCarrito {
  constructor(
    carrito,
    empresa,
    onEliminarArticulo,
    onFinalizarCompra,
    esMesero,
    horarios,
    moduloCarrito,
    esDelivery,
  ) {
    this.carrito = carrito;
    this.empresa = empresa;
    this.onEliminarArticulo = onEliminarArticulo;
    this.onFinalizarCompra = onFinalizarCompra;
    this.esMesero = esMesero;
    this.esDelivery = esDelivery;
    this.moduloCarrito = moduloCarrito;
    this.horarios = horarios || { horarios: [], noLab: [] };
    this.listaCentral = document.getElementById("lista-central");
    this.wrapper = null;
    this.datosPersonales = {
      nombre: "",
      telefono: "",
      metodoPago: "",
      formaEntrega: "",
      direccion: "",
      referencia: "",
      numeroMesa: null,
    };
    this.horarios = horarios || [];
    this.handleEnviarClick = this.enviarPedidoWhatsApp.bind(this);

    window.addEventListener("popstate", (event) => {
      const state = event.state;
      if (!state) return;

      if (state.vista === "modal") {
        if (state.paso === 1) {
          this.volverAPaso1();
        }
      }
    });

    window.addEventListener("popstate", () => {
      if (this.wrapper) {
        this.wrapper.remove(); // Cierra el modal eliminándolo del DOM
        this.wrapper = null; // Limpia la referencia
        this.listaCentral.classList.remove("hidden"); // Muestra la lista central nuevamente
      }
    });
  }

  abrirModalCarrito() {
    this.crearModal(); // crea el HTML del modal en el DOM
    this.botonEnviar = this.wrapper.querySelector("#boton-finalizar-compra");
    this.renderCarrito(); // dibuja las filas en base al carrito actual
    this.inicializarEventos(); // agrega delegación de eventos sobre elementos ya presentes
  }

  crearModal() {
    // Elimino modal previo si existe (evita duplicados)
    this.wrapper = document.getElementById("modal-carrito-wrapper");
    if (this.wrapper) this.wrapper.remove();

    this.wrapper = document.createElement("div");
    this.wrapper.id = "modal-carrito-wrapper";
    this.wrapper.innerHTML = `
    <div class="modal-carrito">
      <header id="header-modal-carrito">
        <button class="hidden boton-volver" id="boton-volver-carrito" type="button" >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path>
            </svg>
        </button>
        <h2 id="titulo-modal-carrito">Carrito</h2>
        <button id="cerrar-modal-carrito" class="boton-cerrar">&times;</button>
      </header>

      <div class="modal-content">
        <div id="lista-articulos-wrapper">
          <div id="lista-articulos-contenedor">
            <div id="cuerpo-tabla-carrito"></div>
          </div>
        </div>

        <div id="zona-total">
            <div id="total-carrito">
                Total: $<span id="monto-total-carrito">0.00</span>
            </div>
          
          <p id="mensaje-fuera-horario" class="hidden mensaje-fuera-horario"></p>
          <button class = "boton hidden" id="boton-finalizar-compra">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
              <!-- ICONO WHATSAPP -->
              <path fill="#fff" d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"></path>
              <path fill="#40c351" d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774
                c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006
                c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"></path>
            </svg>
            Enviar pedido
          </button>

          <button class="boton hidden desactivado" id="boton-siguiente-paso">
            Siguiente
            <svg 
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="margin-left: 8px;"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
          
        <button id="borrar-carrito" class="btn-eliminar">
          <img src="../../../../Archivos/Iconos/trash4.svg" alt="Eliminar" width="25" height="25"></img>
        </button>

        </div>
        

      </div>
      
    </div>
    `;

    this.botonSigPaso = this.wrapper.querySelector("#boton-siguiente-paso");

    document.body.appendChild(this.wrapper);
    window.history.pushState(
      { vista: "modal", paso: 1 },
      "",
      window.location.href,
    );

    const botonEliminarCarrito = this.wrapper.querySelector("#borrar-carrito");
    botonEliminarCarrito.addEventListener("click", () => {
      this.confirmarEliminarCarrito();
    });
  }

  confirmarEliminarCarrito() {
    // Crear el HTML del modal
    const overlay = document.createElement("div");
    overlay.id = "modal-overlay";

    overlay.innerHTML = `
    <div class="modal-box">
      <p>¿Desea eliminar todos los artículos del carrito?</p>
      <div class="modal-actions">
        <button id="modal-cancelar">Cancelar</button>
        <button id="modal-confirmar">Eliminar</button>
      </div>
    </div>
  `;

    // Agregar al body
    document.body.appendChild(overlay);

    const btnConfirmar = overlay.querySelector("#modal-confirmar");
    const btnCancelar = overlay.querySelector("#modal-cancelar");

    const cerrarModal = () => {
      overlay.remove();
    };

    btnConfirmar.addEventListener("click", () => {
      this.carrito.mostrarArticulos().forEach((articulo) => {
        this.onEliminarArticulo(articulo.id);
      });
      this.carrito.vaciarCarrito();
      this.renderCarrito();
      cerrarModal();
    });

    btnCancelar.addEventListener("click", cerrarModal);
  }

  diaIndexToNombre(diaIndex) {
    const mapa = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    return mapa[diaIndex] || `Día ${diaIndex}`;
  }

  esDiaNoLaboralHoy() {
    const ahora = new Date();
    const dd = String(ahora.getDate()).padStart(2, "0");
    const mm = String(ahora.getMonth() + 1).padStart(2, "0");
    const yyyy = String(ahora.getFullYear());
    const hoyDm = `${dd}/${mm}`;
    const hoyCompleta = `${dd}/${mm}/${yyyy}`;

    const noLab = this.horarios.noLab || [];
    return noLab.includes(hoyCompleta) || noLab.includes(hoyDm);
  }

  estaAbiertoPorHorarioAhora() {
    const ahora = new Date();

    const jsDay = ahora.getDay(); // 0 domingo..6 sábado

    // Tu sistema: 0 lunes..6 domingo
    const diaIndexHoy = jsDay === 0 ? 6 : jsDay;
    const diaIndexAyer = diaIndexHoy === 0 ? 6 : diaIndexHoy;

    const horarios = this.horarios.horarios || [];

    const registroHoy = horarios.find(
      (h) => Number(h.diaIndex) === diaIndexHoy,
    );
    const registroAyer = horarios.find(
      (h) => Number(h.diaIndex) === diaIndexAyer,
    );

    const minutosActuales = ahora.getHours() * 60 + ahora.getMinutes();

    const estaEnRango = (r, permitirCruce) => {
      if (!r?.apertura || !r?.cierre) return false;

      const [ha, ma] = r.apertura.split(":").map(Number);
      const [hc, mc] = r.cierre.split(":").map(Number);

      const apertura = ha * 60 + ma;
      const cierre = hc * 60 + mc;

      // Normal
      if (cierre > apertura) {
        return minutosActuales >= apertura && minutosActuales < cierre;
      }

      // Cruza medianoche
      if (!permitirCruce) return false;

      return minutosActuales >= apertura || minutosActuales < cierre;
    };

    // 1) Horarios del día de hoy
    const abiertoHoy = (registroHoy?.rangos || []).some((r) =>
      estaEnRango(r, true),
    );
    if (abiertoHoy) return true;

    // 2) Horarios del día anterior que cruzan medianoche
    const abiertoPorAyer = (registroAyer?.rangos || []).some((r) => {
      if (!r?.apertura || !r?.cierre) return false;

      const [ha, ma] = r.apertura.split(":").map(Number);
      const [hc, mc] = r.cierre.split(":").map(Number);

      const apertura = ha * 60 + ma;
      const cierre = hc * 60 + mc;

      // Solo si cruza medianoche
      if (cierre > apertura) return false;

      // En el día siguiente solo vale la parte 00:00 -> cierre
      return minutosActuales < cierre;
    });

    return abiertoPorAyer;
  }

  actualizarDisponibilidadPedido() {
    const mensaje = this.wrapper?.querySelector("#mensaje-fuera-horario");
    if (!mensaje) return;

    const abierto =
      (this.estaAbiertoPorHorarioAhora() &&
        !this.esDiaNoLaboralHoy() &&
        this.moduloCarrito) ||
      this.esMesero;

    if (this.esMesero) {
      this.botonEnviar.desactivado = !abierto;
      this.botonEnviar.classList.toggle("desactivado", !abierto);
    } else {
      if (!this.esDelivery) {
        this.botonEnviar.desactivado = !abierto;
        this.botonEnviar.classList.toggle("desactivado", !abierto);
      } else {
        this.botonSigPaso.desactivado = !abierto;
        this.botonSigPaso.classList.toggle("desactivado", !abierto);
      }
    }

    if (abierto) {
      mensaje.classList.add("hidden");
      mensaje.innerHTML = "";
      return;
    }

    mensaje.classList.remove("hidden");
    mensaje.innerHTML =
      'No se pueden realizar pedidos fuera de horario <button type="button" id="btn-consultar-horarios" class="btn-consultar-horarios">consultar horarios</button>';
    if (this.esDiaNoLaboralHoy())
      mensaje.innerHTML =
        'Hoy es día no laboral <button type="button" id="btn-consultar-horarios" class="btn-consultar-horarios">consultar horarios</button>';
    const btn = mensaje.querySelector("#btn-consultar-horarios");
    btn?.addEventListener("click", () => this.mostrarModalHorarios());
  }

  mostrarModalHorarios() {
    const viejo = document.getElementById("modal-horarios-cafeteria");
    if (viejo) viejo.remove();

    const modal = document.createElement("div");
    modal.id = "modal-horarios-cafeteria";
    modal.className = "modal-horarios-cafeteria";

    const grupos = this.agruparHorariosPorRangos(this.horarios.horarios);

    const items = (grupos || [])
      .map((g) => {
        const titulo =
          g.desde === g.hasta
            ? this.diaIndexToNombre(g.desde)
            : g.desde < g.hasta
              ? `De ${this.diaIndexToNombre(g.desde)} a ${this.diaIndexToNombre(g.hasta)}`
              : `De ${this.diaIndexToNombre(g.desde)} a ${this.diaIndexToNombre(g.hasta)}`;

        const rangosHTML = (g.rangos || [])
          .map(
            (r) =>
              `<div class="rango-horario">${r.apertura} - ${r.cierre}</div>`,
          )
          .join("");

        return `
          <li class="dia-horario-item">
            <strong class="dia-horario-titulo">${titulo}</strong>
            <div class="rangos-horario">
              ${rangosHTML || `<div class="rango-horario">Cerrado</div>`}
            </div>
          </li>
        `;
      })
      .join("");

    modal.innerHTML = `
      <div class="modal-horarios-contenido">
        <h3 class="titulo-horarios-cafeteria">Horarios de la cafetería</h3>

        <ul class="horarios-cafeteria">
          ${items || "<li>No hay horarios configurados</li>"}
        </ul>
      </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.remove();
    });

    modal
      .querySelector("#cerrar-modal-horarios-cafeteria")
      ?.addEventListener("click", () => modal.remove());
  }

  agruparHorariosPorRangos(horarios) {
    const ordenados = (horarios || [])
      .slice()
      .sort((a, b) => Number(a.diaIndex) - Number(b.diaIndex));

    const grupos = [];
    let grupoActual = null;

    for (const dia of ordenados) {
      const diaIndex = Number(dia.diaIndex);

      const firma =
        (dia.rangos || [])
          .slice()
          .sort((a, b) => a.apertura.localeCompare(b.apertura))
          .map((r) => `${r.apertura}-${r.cierre}`)
          .join("|") || "CERRADO";

      if (!grupoActual) {
        grupoActual = {
          desde: diaIndex,
          hasta: diaIndex,
          firma,
          rangos: dia.rangos || [],
        };
        continue;
      }

      const esConsecutivo = diaIndex === grupoActual.hasta + 1;
      const mismaFirma = firma === grupoActual.firma;

      if (esConsecutivo && mismaFirma) {
        grupoActual.hasta = diaIndex;
      } else {
        grupos.push(grupoActual);
        grupoActual = {
          desde: diaIndex,
          hasta: diaIndex,
          firma,
          rangos: dia.rangos || [],
        };
      }
    }

    if (grupoActual) grupos.push(grupoActual);

    // 🔥 PARTE IMPORTANTE: unión circular (sábado + domingo)
    if (grupos.length >= 2) {
      const primero = grupos[0];
      const ultimo = grupos[grupos.length - 1];

      const primeroEsDomingo = primero.desde === 0;
      const ultimoEsSabado = ultimo.hasta === 6;

      if (
        primeroEsDomingo &&
        ultimoEsSabado &&
        primero.firma === ultimo.firma
      ) {
        // Unimos: el grupo final absorbe el primero
        ultimo.hasta = primero.hasta; // normalmente 0
        grupos.shift(); // sacamos el primero
      }
    }

    return grupos;
  }

  renderCarrito() {
    const cuerpo = document.getElementById("cuerpo-tabla-carrito");
    const totalSpan = document.querySelector("#monto-total-carrito");
    const botonEliminarCarrito = this.wrapper.querySelector("#borrar-carrito");

    if (!this.carrito.mostrarArticulos().length) {
      botonEliminarCarrito.classList.add("hidden");
    } else {
      botonEliminarCarrito.classList.remove("hidden");
    }

    if (!cuerpo || !totalSpan) return;

    cuerpo.innerHTML = "";

    const articulos = this.carrito.mostrarArticulos();

    if (!articulos || articulos.length === 0) {
      cuerpo.innerHTML = `
        <div class="vacio">
          El carrito está vacío.
        </div>
      `;
      this.botonEnviar.classList.remove("boton-deshabilitado-horario");
      this.botonEnviar.disabled = true;
      this.botonSigPaso?.classList.remove("boton-deshabilitado-horario");
      this.botonSigPaso && (this.botonSigPaso.disabled = true);
      this.botonSigPaso?.classList.add("desactivado");
      const msg = this.wrapper?.querySelector("#mensaje-fuera-horario");
      if (msg) {
        msg.classList.add("hidden");
        msg.innerHTML = "";
      }
      totalSpan.textContent = this.carrito.obtenerTotal() || "0.00";
      return;
    } else {
      this.botonSigPaso?.classList.remove("desactivado");
    }
    if (this.esMesero || !this.esDelivery) {
      this.botonEnviar.classList.remove("hidden");
      this.botonSigPaso.classList.add("hidden");
    } else {
      this.botonEnviar.classList.add("hidden");
      this.botonSigPaso.classList.remove("hidden");
    }

    this.actualizarDisponibilidadPedido();

    articulos.forEach((articulo, index) => {
      if (typeof articulo.cantidad === "undefined") articulo.cantidad = 1;
      if (!articulo.observaciones) articulo.observaciones = ["", "", ""];

      const precioBase = this.carrito.eliminarPuntoPrecio(articulo.precio);

      const subtotal = precioBase * articulo.cantidad;

      const precioFormateado = this.carrito.insertarPuntoPrecio(precioBase);
      const subtotalFormateado = this.carrito.insertarPuntoPrecio(subtotal);

      const bloque = document.createElement("div");
      bloque.classList.add("bloque-articulo");
      bloque.classList.add(index % 2 === 0 ? "par" : "impar");

      bloque.innerHTML = `
        <div class="fila-articulo">
          <div class="nombre-precioUnitario">
            <div class="col-nombre">${articulo.nombre}</div>
            <div class="col-precio">$${precioFormateado} c/u</div>
          </div>

          <div class="observacion-wrapper">
            <textarea class="observacion-textarea"
              data-id="${articulo.id}"
              data-index="0"
              maxlength="50"
              placeholder="Observaciones del platillo">
            </textarea>

            <textarea class="observacion-textarea hidden"
              data-id="${articulo.id}"
              data-index="1"
              maxlength="50"
              placeholder="Más observaciones">
            </textarea>

            <textarea class="observacion-textarea hidden"
              data-id="${articulo.id}"
              data-index="2"
              maxlength="50"
              placeholder="Más observaciones">
            </textarea>
          </div>
        </div>

        <div class="info-extra">
          <div class="subtotal-eliminar">
            <div class="celda col-subtotal">$${subtotalFormateado}</div>
            <button class="btn-eliminar" data-id="${articulo.id}">
              <img src="../../../../Archivos/Iconos/trash4.svg" alt="Eliminar Icon" height="20" width="20"/>
            </button>
          </div>

          <div class="col-cantidad">
            <button class="btn-cant menos" data-id="${articulo.id}">-</button>
            <span class="cantidad" data-id="${articulo.id}">${articulo.cantidad}</span>
            <button class="btn-cant mas" data-id="${articulo.id}">+</button>
          </div>
        </div>
      `;

      cuerpo.appendChild(bloque);
      const textareas = bloque.querySelectorAll(".observacion-textarea");

      textareas.forEach((ta, i) => {
        ta.value = articulo.observaciones[i] || "";

        if (i > 0 && articulo.observaciones[i - 1].length <= 35)
          ta.classList.add("hidden");
        else ta.classList.remove("hidden");
      });
    });

    totalSpan.textContent = this.carrito.obtenerTotal();

    // Listener para textarea
    cuerpo.querySelectorAll(".observacion-textarea").forEach((textarea) => {
      // ✅ Keydown solo una vez
      textarea.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          textarea.value = textarea.value.replace(/\n/g, "");
        }
      });

      // ✅ Input para actualizar observaciones
      textarea.addEventListener("input", () => {
        const id = textarea.dataset.id;
        const index = Number(textarea.dataset.index);

        const articulo = this.carrito
          .mostrarArticulos()
          .find((a) => String(a.id) === String(id));

        if (!articulo) return;

        articulo.observaciones[index] = textarea.value;

        const wrapper = textarea.closest(".observacion-wrapper");
        const textareas = wrapper.querySelectorAll(".observacion-textarea");

        // Obs 2
        if (textareas[0].value.length > 35)
          textareas[1].classList.remove("hidden");
        else {
          textareas[1].classList.add("hidden");
          textareas[1].value = "";
          articulo.observaciones[1] = "";
        }

        // Obs 3
        if (textareas[1].value.length > 35)
          textareas[2].classList.remove("hidden");
        else {
          textareas[2].classList.add("hidden");
          textareas[2].value = "";
          articulo.observaciones[2] = "";
        }
      });
    });
  }

  renderDatosPersonales() {
    this.pendiente = [];
    this.listaArticulos = document.getElementById("lista-articulos-wrapper");
    this.botonVolver = document.getElementById("boton-volver-carrito");
    this.titulo = document.getElementById("titulo-modal-carrito");
    this.botonSigPaso.classList.add("hidden");
    this.botonEnviar.classList.remove("hidden");
    this.listaArticulos.classList.add("hidden");
    this.botonVolver.classList.remove("hidden");
    document.querySelector("#borrar-carrito").classList.add("hidden");

    this.titulo.textContent = "Complete con sus datos personales";

    const viejo = document.getElementById("pedir-datos-wrapper");
    if (viejo) viejo.remove();

    this.wrapperA = document.createElement("div");
    this.wrapperA.id = "pedir-datos-wrapper";

    this.wrapperA.innerHTML = `
      <div class="form-group">
        <label class="label required" for="input-nombre-cliente">Nombre</label>
        <input
          type="text"
          id="input-nombre-cliente"
          placeholder="Juan"
          required
        >
      </div>

      <div class="form-group">
        <label class="label required" for="input-telefono-cliente">Teléfono</label>
        <input
          type="tel"
          id="input-telefono-cliente"
          placeholder="3534123456"
          maxlength="12"
          inputmode="numeric"
          pattern="[0-9]*"
          required
        >
      </div>

      <div class="form-group">
        <text class="label required"  id="titulo-forma-entrega"> Forma de entrega </text>
        <div class="lista-botones">
          <button type="button"
            id="btnRetirar"
            data-value = "Retirar"
            class="toggle-btn btnes-forma-entrega">
            <svg xmlns="http://www.w3.org/2000/svg" id="icono-retirar" width="23" height="23" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 icono">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
            </svg>

            Retiro en el local
          </button>

          <button type="button"
            id="btnDelivery"
            data-value = "Delivery"
            class="toggle-btn btnes-forma-entrega">

            <svg id="boton-delivery" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" stroke="currentColor" width="23" height="23" x="0" y="0" viewBox="0 0 64 64" style="enable-background:new 0 0 512 512" xml:space="preserve" class="icono"><g><path d="M4 16h14.001a3 3 0 0 1 3 3v11.001a3 3 0 0 1-3 3h-14a3 3 0 0 1-3.001-3v-11a3 3 0 0 1 3-3z" class=""></path><circle cx="33.002" cy="7" r="5" class=""></circle><path d="M12.003 35.852a5.917 5.917 0 0 0 1.7 4.15H29.96v-4.155a.996.996 0 0 0-.996-.996H12.998a1 1 0 0 0-.995 1.001z" class=""></path><path d="M61.737 51.359a8.13 8.13 0 0 0-8.322-5.994 7.038 7.038 0 0 0 .24-1.791A5.925 5.925 0 0 0 51 38.75c-2.147-1.425-3.753-5.048-3.996-8.858h1.916a2.99 2.99 0 0 0 2.991-2.982v-1.986a2.99 2.99 0 0 0-2.991-2.982h-6.84c-5.782-1.665-7.522-3.583-8.561-4.732a7.382 7.382 0 0 1-.063-.07 3.706 3.706 0 0 0-2.018-3.813 3.64 3.64 0 0 0-5.122 2.497l-2.869 13.71a2.983 2.983 0 0 0 2.598 3.571l4.917.544a.994.994 0 0 1 .887 1.043l-.774 13.106a5.273 5.273 0 0 1-1.477-5.796H14.313c-1.612 2.671-4.193 7.679-3.149 10.936a4.04 4.04 0 0 0 2.609 2.622 3.726 3.726 0 0 0 1.39.15 6.406 6.406 0 0 0 12.78 0h17.14a1.262 1.262 0 0 0 .875-.423 6.997 6.997 0 0 0 .587 1.703.996.996 0 0 0 1.716.14c.117-.168.243-.33.376-.491a6.4 6.4 0 1 0 12.484-2.718.986.986 0 0 0 .875-1.075 7.763 7.763 0 0 0-.26-1.487zm-40.184 8.318a4.407 4.407 0 0 1-4.385-3.967h8.77a4.407 4.407 0 0 1-4.385 3.967zM40.94 48.754h-3.885l1.718-16.24a2.982 2.982 0 0 0-1.926-3.104l-4.9-1.829a.992.992 0 0 1-.622-1.149l.745-3.215a17.078 17.078 0 0 0 8.87 3.633zm14.586 11.218a4.413 4.413 0 0 1-4.961-4.86l.304-.38a11.083 11.083 0 0 1 7.676-1.51l.236.183a4.4 4.4 0 0 1-3.255 6.567z" class=""></path></g></svg>
            Delivery
          </button>
        </div>
      </div>

      <div id="direccion-cliente" class="form-group hidden">
        <label class="label required" for="input-direccion-cliente">Dirección</label>
        <input
          type="text"
          id="input-direccion-cliente"
          placeholder="Calle 123, Ciudad"
          required
        >
      </div>

      <div id="especificaciones-direccion" class="form-group hidden">
        <label class="label" for="input-especificaciones-direccion">Especificaciones para el cadete</label>
        <input
          type="text"
          id="input-especificaciones-direccion"
          placeholder="Piso, Departamento, Torre, etc."
        >
      </div>

      <div class="form-group">
        <text class="label required"  id="titulo-metodos-pago"> Método de pago </text>
        <div class="lista-botones">
          <button type="button"
              id="btnEfectivo"
              data-value = "Efectivo"
              class="toggle-btn btnes-metodos-pago ${!!this.empresa.efectivo ? "" : "hidden"}">
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" stroke="currentColor" width="23" height="23" x="0" y="0" viewBox="0 0 128 128" style="enable-background:new 0 0 512 512" xml:space="preserve" class="icono"><g><path d="M123.1 21.9H14.97a4.4 4.4 0 0 0-4.4 4.4v5.67H4.9a4.4 4.4 0 0 0-4.4 4.4v65.68a4.4 4.4 0 0 0 4.4 4.4h108.13a4.4 4.4 0 0 0 4.4-4.4v-5.67h5.67a4.4 4.4 0 0 0 4.4-4.4V26.3a4.4 4.4 0 0 0-4.4-4.4zm-9.67 80.15c0 .22-.18.4-.4.4H4.9c-.22 0-.4-.18-.4-.4V36.37c0-.22.18-.4.4-.4h108.13c.22 0 .4.18.4.4zm10.07-10.07c0 .22-.18.4-.4.4h-5.67V36.37a4.4 4.4 0 0 0-4.4-4.4H14.57V26.3c0-.22.18-.4.4-.4H123.1c.22 0 .4.18.4.4z" class=""></path><path d="M105.86 50.99c-4.11 0-7.45-3.34-7.45-7.45 0-1.1-.9-2-2-2h-74.9c-1.1 0-2 .9-2 2 0 4.11-3.34 7.45-7.45 7.45-1.1 0-2 .9-2 2v32.43c0 1.1.9 2 2 2 4.11 0 7.45 3.34 7.45 7.45 0 1.1.9 2 2 2h74.91c1.1 0 2-.9 2-2 0-4.11 3.34-7.45 7.45-7.45 1.1 0 2-.9 2-2V52.99c-.01-1.1-.9-2-2.01-2zm-2 32.61a11.47 11.47 0 0 0-9.27 9.27H23.34a11.47 11.47 0 0 0-9.27-9.27V54.82a11.47 11.47 0 0 0 9.27-9.27h71.25a11.47 11.47 0 0 0 9.27 9.27z" class=""></path><path d="M58.97 51.96c-9.51 0-17.25 7.74-17.25 17.25s7.74 17.25 17.25 17.25 17.25-7.74 17.25-17.25c-.01-9.51-7.74-17.25-17.25-17.25zm0 30.5c-7.3 0-13.25-5.94-13.25-13.25s5.94-13.25 13.25-13.25 13.25 5.94 13.25 13.25-5.95 13.25-13.25 13.25zM27.63 61.54c-4.23 0-7.67 3.44-7.67 7.67s3.44 7.67 7.67 7.67 7.67-3.44 7.67-7.67-3.44-7.67-7.67-7.67zm0 11.34c-2.02 0-3.67-1.65-3.67-3.67s1.65-3.67 3.67-3.67 3.67 1.65 3.67 3.67-1.65 3.67-3.67 3.67zM90.3 61.54c-4.23 0-7.67 3.44-7.67 7.67s3.44 7.67 7.67 7.67 7.67-3.44 7.67-7.67-3.44-7.67-7.67-7.67zm0 11.34c-2.02 0-3.67-1.65-3.67-3.67s1.65-3.67 3.67-3.67 3.67 1.65 3.67 3.67-1.65 3.67-3.67 3.67z"   class=""></path></g></svg>
            Efectivo
          </button>

          <button type="button"
              id="btnTarjeta"
              data-value = "Tarjeta"
              class="toggle-btn btnes-metodos-pago ${!!this.empresa.tarjeta ? "" : "hidden"}">
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" stroke="currentColor" width="23" height="23" x="0" y="0" viewBox="0 0 512.002 512.002" style="enable-background:new 0 0 512 512" xml:space="preserve" class="icono"><g><path d="M502.903 96.829c-6.634-7.842-15.924-12.632-26.161-13.487L116.185 53.236c-10.238-.855-20.192 2.328-28.035 8.961-7.811 6.607-12.594 15.85-13.476 26.037L67.42 156.29H38.455C17.251 156.29 0 173.541 0 194.745v225.702c0 21.204 17.251 38.455 38.455 38.455h361.813c21.205 0 38.456-17.251 38.456-38.455v-36.613l12.839 1.072c1.083.09 2.16.135 3.228.135 19.768 0 36.62-15.209 38.294-35.257l18.781-224.919c.854-10.237-2.329-20.193-8.963-28.036zM38.455 176.29h361.813c10.176 0 18.456 8.279 18.456 18.455v20.566H20v-20.566c0-10.176 8.279-18.455 18.455-18.455zM20 235.311h398.724V276.8H20zm380.268 203.591H38.455c-10.176 0-18.455-8.279-18.455-18.455V296.8h398.724v123.647c0 10.176-8.28 18.455-18.456 18.455zM491.935 123.2l-18.781 224.919c-.847 10.141-9.788 17.706-19.927 16.856l-14.503-1.211V194.745c0-21.204-17.251-38.455-38.456-38.455H87.534l7.039-66.04c.008-.076.015-.151.021-.228.847-10.141 9.783-17.705 19.927-16.855l360.558 30.106c4.913.41 9.372 2.709 12.555 6.473s4.711 8.541 4.301 13.454z"  ></path><path d="M376.873 326.532h-96.242c-5.523 0-10 4.477-10 10v62.789c0 5.523 4.477 10 10 10h96.242c5.523 0 10-4.477 10-10v-62.789c0-5.523-4.477-10-10-10zm-10 62.789h-76.242v-42.789h76.242z" class=""></path></g></svg>
            Tarjeta
          </button>

          <button type="button"
              id="btnTransferencia"
              data-value = "Transferencia"
              class="toggle-btn btnes-metodos-pago ${!!this.empresa.transferencia ? "" : "hidden"}">
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" stroke="currentColor" fill="currentColor" width="23" height="23" x="0" y="0" viewBox="0 0 24 24" style="enable-background:new 0 0 512 512" xml:space="preserve" class="icono"><g><g ><path d="M21 11H7c-.6 0-1-.4-1-1s.4-1 1-1h11.6l-2.3-2.3c-.4-.4-.4-1 0-1.4s1-.4 1.4 0l4 4c.3.3.4.7.2 1.1-.1.4-.5.6-.9.6zM7 19c-.3 0-.5-.1-.7-.3l-4-4c-.3-.3-.4-.7-.2-1.1s.5-.6.9-.6h14c.6 0 1 .4 1 1s-.4 1-1 1H5.4l2.3 2.3c.4.4.4 1 0 1.4-.2.2-.4.3-.7.3z" class=""></path></g></g></svg>
              Transferencia
          </button>
        </div>
      </div>

      
    `;
    const modalContent = document.querySelector(".modal-content");
    const zonaTotal = modalContent.querySelector("#zona-total");
    modalContent.insertBefore(this.wrapperA, zonaTotal);

    this.tomarDatosPersonales();
    this.renderizadorFormulario();
  }

  inicializarEventos() {
    this.wrapper = document.getElementById("modal-carrito-wrapper");
    if (!this.wrapper) return;

    const cuerpo = this.wrapper.querySelector("#cuerpo-tabla-carrito");
    const botonCerrar = this.wrapper.querySelector("#cerrar-modal-carrito");
    if (!cuerpo) return;

    if (!cuerpo._listenerAttached) {
      // Delegación: un solo listener en el tbody para manejar +, -, eliminar
      cuerpo.addEventListener("click", (e) => {
        // Buscamos si el click vino de (o dentro de) un btn-eliminar
        const btnEliminar = e.target.closest(".btn-eliminar");
        if (btnEliminar) {
          const id = btnEliminar.dataset.id;

          this.carrito.eliminarArticulo(id);

          // notificar a PantallaCliente
          if (this.onEliminarArticulo) this.onEliminarArticulo(id);

          this.renderCarrito();
          return;
        }

        // Aumentar / Disminuir
        const btnCant = e.target.closest(".btn-cant");
        if (btnCant && cuerpo.contains(btnCant)) {
          const id = btnCant.dataset.id;
          const articulo = this.carrito
            .mostrarArticulos()
            .find((a) => String(a.id) === String(id));
          if (!articulo) return;

          if (btnCant.classList.contains("mas") && articulo.cantidad < 15)
            articulo.cantidad = (Number(articulo.cantidad) || 0) + 1;
          else if (
            btnCant.classList.contains("menos") &&
            Number(articulo.cantidad) > 1
          )
            articulo.cantidad = Number(articulo.cantidad) - 1;

          this.renderCarrito();
          return;
        }
      });

      cuerpo._listenerAttached = true;
    }

    this.botonEnviar?.addEventListener("click", () => {
      if (this.botonEnviar.desactivado) return;

      // Si el botón enviar SOLO existe para mesero:
      if (!this.esDelivery) {
        if (this.esNumeroMesa()) {
          this.datosPersonales.numeroMesa = this.conocerNumeroMesa();
          this.enviarPedidoWhatsApp();
          return;
        }
        this.pedirMesa();
      }

      if (this.esMesero) {
        this.pedirMesa();
      }
    });

    this.botonSigPaso?.addEventListener("click", () => {
      if (this.botonSigPaso.desactivado) return;
      window.history.pushState(
        { vista: "modal", paso: 2 },
        "",
        window.location.href,
      );
      this.renderDatosPersonales();
    });

    // Listener para cerrar
    if (botonCerrar) {
      botonCerrar.addEventListener("click", () => {
        this.listaCentral.classList.remove("hidden");
        if (this.wrapper) this.wrapper.remove();
      });
    }
  }

  enviarPedidoWhatsApp() {
    const articulos = this.carrito.mostrarArticulos();
    if (!articulos || articulos.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    // Construyo el mensaje
    if (this.datosPersonales.numeroMesa !== null) {
      var mensaje = `Mesa: ${this.datosPersonales.numeroMesa}\n####################################\n`;
    } else {
      var mensaje = `Nombre: ${this.datosPersonales.nombre}\n`;
      mensaje += `Celular: ${this.datosPersonales.telefono}\n\n`;

      mensaje += `+Fecha: ${new Date().toLocaleString()}\n`;
      mensaje += `+Forma de pago: ${this.datosPersonales.metodoPago}\n`;
      mensaje += `+Entrega: ${this.datosPersonales.formaEntrega}\n`;
      if (this.datosPersonales.formaEntrega === "Delivery") {
        if (this.datosPersonales.direccion)
          mensaje += `+Dirección: ${this.datosPersonales.direccion}\n`;
        if (this.datosPersonales.referencia)
          mensaje += `+Referencia: ${this.datosPersonales.referencia}\n`;
      }
      mensaje += `\n`;
    }

    articulos.forEach((a) => {
      const id = String(a.id).padEnd(6).slice(0, 6);
      const nombre = String(a.nombre).padEnd(30).slice(0, 30);
      const cant = String(a.cantidad).padEnd(10).slice(0, 10);
      const obs = this.formatearObservacion(a.observaciones || ["", "", ""]);

      mensaje += `${id}${nombre}${cant}${obs}\n`;
    });

    // Teléfono del cliente
    const numeroWhatsApp = this.empresa.telefono.replace(/[^0-9]/g, "");

    // Codifico el mensaje para URL
    const mensajeCodificado = encodeURIComponent(mensaje);

    const esMovil = /Android|iPhone|iPad|iPod|Windows Phone/i.test(
      navigator.userAgent,
    );

    // Seleccionar la URL según el dispositivo
    const url = esMovil
      ? `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}` // Si el dispositivo es móvil
      : `https://web.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensajeCodificado}`; // Si el dispositivo es escritorio

    // Abrir WhatsApp
    window.open(url, "_blank");

    articulos.forEach((articulo) => {
      this.onEliminarArticulo(articulo.id);
    });
    this.onFinalizarCompra();
    document.getElementById("modal-carrito-wrapper").remove();
    this.listaCentral.classList.remove("hidden");
  }

  pedirMesa() {
    // Eliminar modal previo si existe
    const viejo = document.getElementById("modal-datos-wrapper");
    if (viejo) viejo.remove();

    const wrapper = document.createElement("div");
    wrapper.id = "modal-datos-wrapper";

    wrapper.innerHTML = `
      <div class="modal-datos">
        <h2>Ingrese los datos</h2>

        <label class="labels">Número de mesa*:</label>
        <input type="number" id="input-numero-mesa" placeholder="Ej: 1" required>

        <button id="btn-confirmar-datos" class="confirmar">Enviar pedido</button>
      </div>
    `;
    document.body.appendChild(wrapper);
    const modalContenido = wrapper.querySelector(".modal-datos");

    // Cerrar modal al hacer click fuera
    wrapper.addEventListener("click", (e) => {
      if (!modalContenido.contains(e.target)) {
        wrapper.remove();
      }
    });

    document.getElementById("btn-confirmar-datos").onclick = () => {
      this.datosPersonales.numeroMesa = document
        .getElementById("input-numero-mesa")
        .value.trim();

      if (!this.datosPersonales.numeroMesa) return;
      wrapper.remove();
      this.enviarPedidoWhatsApp();
      this.carrito.vaciarCarrito();
      const modalCarrito = document.getElementById("modal-carrito-wrapper");
      if (modalCarrito) modalCarrito.remove();
      this.listaCentral.classList.remove("hidden");
    };
  }

  formatearObservacion(observaciones) {
    return observaciones
      .map((obs) => (obs || "").padEnd(50, " ").slice(0, 50))
      .join("");
  }

  tomarDatosPersonales() {
    //Nombre
    document
      .getElementById("input-nombre-cliente")
      .addEventListener("input", (e) => {
        this.datosPersonales.nombre = e.target.value.trim();
      });

    //Telefono
    document
      .getElementById("input-telefono-cliente")
      .addEventListener("input", (e) => {
        this.datosPersonales.telefono = e.target.value.replace(/\D/g, "");
      });

    const botonesFormaEntrega = document.querySelectorAll(
      ".btnes-forma-entrega",
    );
    //Forma de entrega
    botonesFormaEntrega.forEach((btn) => {
      btn.addEventListener("click", () => {
        botonesFormaEntrega.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        this.datosPersonales.formaEntrega = btn.dataset.value;
      });
    });

    //Dirección
    document
      .getElementById("input-direccion-cliente")
      .addEventListener("input", (e) => {
        this.datosPersonales.direccion = e.target.value.trim();
      });

    //Referencia
    document
      .getElementById("input-especificaciones-direccion")
      .addEventListener("input", (e) => {
        this.datosPersonales.referencia = e.target.value.trim();
      });

    //Metodo de pago
    const botonesMetodosPago = document.querySelectorAll(".btnes-metodos-pago");
    botonesMetodosPago.forEach((btn) => {
      btn.addEventListener("click", () => {
        botonesMetodosPago.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.datosPersonales.metodoPago = btn.dataset.value;
      });
    });
  }

  volverAPaso1() {
    this.listaArticulos.classList.remove("hidden");
    this.botonVolver.classList.add("hidden");
    this.botonEnviar.classList.add("hidden");
    this.botonSigPaso.classList.remove("hidden");
    this.wrapperA.classList.add("hidden");
    this.titulo.textContent = "Carrito";
    document.getElementById("borrar-carrito").classList.remove("hidden");
  }

  renderizadorFormulario() {
    // Estado inicial
    this.pendiente = ["nombre", "telefono", "btnTipoEntrega", "metodoPago"];
    this.botonEnviar.classList.add("desactivado");

    // BOTÓN VOLVER
    this.botonVolver.onclick = () => {
      this.volverAPaso1();
    };

    // =========================
    // INPUTS (nombre, telefono, direccion)
    // =========================
    this.wrapperA.addEventListener("input", (e) => {
      const id = e.target.id;
      const valor = e.target.value.trim();

      // NOMBRE
      if (id === "input-nombre-cliente") {
        if (valor !== "") {
          this.pendiente = this.pendiente.filter((p) => p !== "nombre");
        } else if (!this.pendiente.includes("nombre")) {
          this.pendiente.push("nombre");
        }
      }

      // TELEFONO
      if (id === "input-telefono-cliente") {
        const soloNumeros = valor.replace(/\D/g, "");

        if (soloNumeros.length > 0) {
          this.pendiente = this.pendiente.filter((p) => p !== "telefono");
        } else if (!this.pendiente.includes("telefono")) {
          this.pendiente.push("telefono");
        }
      }

      // DIRECCION (solo si Delivery está activo)
      if (id === "input-direccion-cliente") {
        if (valor !== "") {
          this.pendiente = this.pendiente.filter((p) => p !== "direccion");
        } else if (!this.pendiente.includes("direccion")) {
          this.pendiente.push("direccion");
        }
      }

      this.verificarPendientes();
    });

    // =========================
    // CLICKS (entrega + pago)
    // =========================
    this.wrapperA.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      // -----------------
      // FORMA ENTREGA
      // -----------------
      if (btn.classList.contains("btnes-forma-entrega")) {
        const botonesEntrega = this.wrapperA.querySelectorAll(
          ".btnes-forma-entrega",
        );
        botonesEntrega.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const DOMDireccion = document.getElementById("direccion-cliente");
        const DOMEspecificaciones = document.getElementById(
          "especificaciones-direccion",
        );

        this.pendiente = this.pendiente.filter((p) => p !== "btnTipoEntrega");

        if (btn.dataset.value === "Delivery") {
          DOMDireccion.classList.remove("hidden");
          DOMEspecificaciones.classList.remove("hidden");

          if (!this.pendiente.includes("direccion")) {
            this.pendiente.push("direccion");
          }
        } else {
          DOMDireccion.classList.add("hidden");
          DOMEspecificaciones.classList.add("hidden");
          this.pendiente = this.pendiente.filter((p) => p !== "direccion");
        }
      }

      // -----------------
      // METODO PAGO
      // -----------------
      if (btn.classList.contains("btnes-metodos-pago")) {
        const botonesPago = this.wrapperA.querySelectorAll(
          ".btnes-metodos-pago",
        );
        botonesPago.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        this.pendiente = this.pendiente.filter((p) => p !== "metodoPago");
      }

      this.verificarPendientes();
    });
  }

  verificarPendientes() {
    this.botonEnviar.removeEventListener("click", this.handleEnviarClick);

    if (this.pendiente.length === 0) {
      this.botonEnviar.classList.remove("desactivado");
      this.botonEnviar.addEventListener("click", this.handleEnviarClick);
    } else {
      this.botonEnviar.classList.add("desactivado");
    }
  }

  conocerSlug(texto) {
    const url_segmentada = window.location.pathname.split("/");
    const slug = url_segmentada[texto];
    return slug;
  }

  conocerNumeroMesa() {
    const slug = this.conocerSlug(4);
    try {
      if (parseInt(slug) < 500) return slug;
    } catch {
      return false;
    }
  }

  esNumeroMesa() {
    const slug = this.conocerSlug(4);
    return slug && !isNaN(parseInt(slug));
  }
}
