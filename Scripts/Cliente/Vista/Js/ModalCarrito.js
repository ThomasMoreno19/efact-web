class ModalCarrito {
  constructor(
    carrito,
    empresa,
    onEliminarArticulo,
    onFinalizarCompra,
    horarios,
    moduloCarrito,
    incluirHorario,
    pedidosFueraHorario,
    carritoSinPedidos,
    esInterno,
  ) {
    this.carrito = carrito;
    this.empresa = empresa;
    this.onEliminarArticulo = onEliminarArticulo;
    this.onFinalizarCompra = onFinalizarCompra;
    this.moduloCarrito = moduloCarrito;
    this.horarios = horarios || { horarios: [], noLab: [] };
    this.listaCentral = document.getElementById("lista-central");
    this.wrapper = null;
    this.datosPersonales = {
      nombre: "",
      observaciones: "",
    };
    this.incluirHorario = incluirHorario;
    this.pedidosFueraHorario = pedidosFueraHorario;
    this.carritoSinPedidos = carritoSinPedidos;
    this.esInterno = esInterno;
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
        this.wrapper.remove();
        this.wrapper = null;
        this.listaCentral.classList.remove("hidden");
      }
    });

    this.trashSVG = `<svg fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6 7H5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7H6zm10.618-3L15 2H9L7.382 4H3v2h18V4z"/></svg>`;
  }

  abrirModalCarrito() {
    this.crearModal();
    this.botonEnviar = this.wrapper.querySelector("#boton-finalizar-compra");
    this.renderCarrito();
    this.inicializarEventos();
  }

  crearModal() {
    this.wrapper = document.getElementById("modal-carrito-wrapper");
    if (this.wrapper) this.wrapper.remove();

    this.wrapper = document.createElement("div");
    this.wrapper.id = "modal-carrito-wrapper";
    this.wrapper.innerHTML = `
    <div class="modal-carrito">
      <header id="header-modal-carrito">
        <button id="borrar-carrito" class="btn-eliminar">
          ${this.trashSVG}
        </button>
        <button class="hidden boton-volver" id="boton-volver-carrito" type="button" >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path>
            </svg>
        </button>
        <h2 id="titulo-modal-carrito">Movimiento de existencia</h2>
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
    const overlay = document.createElement("div");
    overlay.id = "modal-overlay";

    overlay.innerHTML = `
      <div class="modal-box">
        <p>¿Desea eliminar todos los artículos de Movimiento de existencia?</p>
        <div class="modal-actions">
          <button id="modal-cancelar">Cancelar</button>
          <button id="modal-confirmar">Eliminar</button>
        </div>
      </div>
    `;

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

  estaAbiertoPorHorarioAhora() {
    if (!this.incluirHorario || this.esInterno) return true;
    const ahora = new Date();

    const jsDay = ahora.getDay();

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

      if (cierre > apertura) {
        return minutosActuales >= apertura && minutosActuales < cierre;
      }

      if (!permitirCruce) return false;

      return minutosActuales >= apertura || minutosActuales < cierre;
    };

    const abiertoHoy = (registroHoy?.rangos || []).some((r) =>
      estaEnRango(r, true),
    );
    if (abiertoHoy) return true;

    const abiertoPorAyer = (registroAyer?.rangos || []).some((r) => {
      if (!r?.apertura || !r?.cierre) return false;

      const [ha, ma] = r.apertura.split(":").map(Number);
      const [hc, mc] = r.cierre.split(":").map(Number);

      const apertura = ha * 60 + ma;
      const cierre = hc * 60 + mc;

      if (cierre > apertura) return false;

      return minutosActuales < cierre;
    });

    return abiertoPorAyer;
  }

  actualizarDisponibilidadPedido() {
    const mensaje = this.wrapper?.querySelector("#mensaje-fuera-horario");
    if (!mensaje) return;

    const abierto =
      (this.estaAbiertoPorHorarioAhora() || this.pedidosFueraHorario) &&
      this.moduloCarrito &&
      !this.carritoSinPedidos;

    this.botonSigPaso.desactivado = !abierto;
    this.botonSigPaso.classList.toggle("desactivado", !abierto);

    if (abierto) {
      mensaje.classList.add("hidden");
      mensaje.innerHTML = "";
      return;
    }

    if (this.incluirHorario && !this.carritoSinPedidos) {
      mensaje.classList.remove("hidden");
      mensaje.innerHTML =
        'No se pueden realizar pedidos fuera de horario <button type="button" id="btn-consultar-horarios" class="btn-consultar-horarios">consultar horarios</button>';

      const btn = mensaje.querySelector("#btn-consultar-horarios");
      btn?.addEventListener("click", () => this.mostrarModalHorarios());

      this.botonSigPaso.classList.remove("hidden");
    }
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
        <h3 class="titulo-horarios-cafeteria">Horarios del local</h3>

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
        ultimo.hasta = primero.hasta;
        grupos.shift();
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
          No hay artículos para movimiento de existencia.
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
    if (!this.carritoSinPedidos) {
      this.botonSigPaso.classList.remove("hidden");
    }

    this.actualizarDisponibilidadPedido();

    articulos.forEach((articulo, index) => {
      if (typeof articulo.cantidad === "undefined") articulo.cantidad = 1;
      if (!articulo.observaciones) articulo.observaciones = ["", "", ""];

      const consultarPrecio = !!articulo.consultarPrecio;

      const precioBase = consultarPrecio
        ? null
        : this.carrito.eliminarPuntoPrecio(articulo.precio);

      const subtotal = consultarPrecio ? null : precioBase * articulo.cantidad;

      const precioDisplay = consultarPrecio
        ? "Consultar"
        : `$${this.carrito.insertarPuntoPrecio(precioBase)} c/u`;

      const subtotalDisplay = consultarPrecio
        ? "Consultar"
        : `$${this.carrito.insertarPuntoPrecio(subtotal)}`;

      const bloque = document.createElement("div");
      bloque.classList.add("bloque-articulo");
      bloque.classList.add(index % 2 === 0 ? "par" : "impar");

      bloque.innerHTML = `
        <div class="fila-articulo">
          <div class="nombre-precioUnitario"  ${
            this.carritoSinPedidos ? ` style="flex-direction: column; >"` : ">"
          }
            <div class="col-nombre">${articulo.nombre}</div>
            <div class="col-precio">${precioDisplay}</div>
          </div>

          ${
            !this.carritoSinPedidos
              ? `
          <div class="observacion-wrapper">
            <textarea class="observacion-textarea"
              data-id="${articulo.id}"
              data-index="0"
              maxlength="50"
              placeholder="Observaciones">
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
          `
              : ""
          }
        </div>

        <div class="info-extra">
          <div class="subtotal-eliminar">
            <div class="celda col-subtotal">${subtotalDisplay}</div>
            <button class="btn-eliminar" data-id="${articulo.id}">
              ${this.trashSVG}
            </button>
          </div>

          <div class="col-cantidad">
            <button class="btn-cant menos" data-id="${articulo.id}">-</button>
            <input
              type="number"
              class="cantidad-input"
              data-id="${articulo.id}"
              min="1"
              max="99"
              value="${articulo.cantidad}"
            >
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

    cuerpo.addEventListener("keydown", (e) => {
      const input = e.target.closest(".cantidad-input");
      if (!input) return;

      if (e.key === "Enter") {
        e.preventDefault();
        this.actualizarCantidadInput(input);
        input.blur();
      }
    });

    cuerpo.addEventListener(
      "blur",
      (e) => {
        const input = e.target.closest(".cantidad-input");
        if (!input) return;

        this.actualizarCantidadInput(input);
      },
      true,
    );

    cuerpo.querySelectorAll(".observacion-textarea").forEach((textarea) => {
      textarea.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          textarea.value = textarea.value.replace(/\n/g, "");
        }
      });

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

        if (textareas[0].value.length > 35)
          textareas[1].classList.remove("hidden");
        else {
          textareas[1].classList.add("hidden");
          textareas[1].value = "";
          articulo.observaciones[1] = "";
        }

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

  actualizarCantidadInput(input) {
    const id = input.dataset.id;

    const articulo = this.carrito
      .mostrarArticulos()
      .find((a) => String(a.id) === String(id));

    if (!articulo) return;

    let cantidad = Number(input.value);

    if (input.value === "" || isNaN(cantidad)) {
      cantidad = articulo.cantidad;
    }

    cantidad = Math.max(1, Math.min(99, cantidad));

    articulo.cantidad = cantidad;

    this.renderCarrito();
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
        <label class="label" for="input-observaciones-cliente">Observaciones</label>
        <input
          type="text"
          id="input-observaciones-cliente"
          placeholder="Información extra sobre el pedido"
          required
        >
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
      cuerpo.addEventListener("click", (e) => {
        const btnEliminar = e.target.closest(".btn-eliminar");
        if (btnEliminar) {
          const id = btnEliminar.dataset.id;

          this.carrito.eliminarArticulo(id);

          if (this.onEliminarArticulo) this.onEliminarArticulo(id);

          this.renderCarrito();
          return;
        }

        const btnCant = e.target.closest(".btn-cant");
        if (btnCant && cuerpo.contains(btnCant)) {
          const id = btnCant.dataset.id;
          const articulo = this.carrito
            .mostrarArticulos()
            .find((a) => String(a.id) === String(id));
          if (!articulo) return;

          if (btnCant.classList.contains("mas") && articulo.cantidad < 99)
            articulo.cantidad = (Number(articulo.cantidad) || 0) + 1;
          else if (
            (btnCant.classList.contains("menos") &&
              Number(articulo.cantidad) > 1) ||
            (btnCant.classList.contains("menos") &&
              Number(articulo.cantidad) > 0 &&
              this.esInterno)
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
      if (this.pedidosFueraHorario && !this.estaAbiertoPorHorarioAhora()) {
        this.alertaFueraHorario();
        return;
      } else this.enviarPedidoWhatsApp();
    });

    this.botonSigPaso?.addEventListener("click", () => {
      if (this.botonSigPaso.desactivado) return;

      if (this.esInterno) {
        const articulos = this.carrito.mostrarArticulos();
        const hayIgualExistencia = articulos.some(
          (articulo) =>
            Number(articulo.cantidad) === Number(articulo.existencia),
        );
        if (hayIgualExistencia) {
          this.advertirCantidadIgualExistencia();
          return;
        }
      }

      this.renderCarrito();
      window.history.pushState(
        { vista: "modal", paso: 2 },
        "",
        window.location.href,
      );
      this.renderDatosPersonales();
    });

    if (botonCerrar) {
      botonCerrar.addEventListener("click", () => {
        this.listaCentral.classList.remove("hidden");
        if (this.wrapper) this.wrapper.remove();
      });
    }
  }

  advertirCantidadIgualExistencia() {
    const articulos = this.carrito.mostrarArticulos();
    const articulosConflicto = articulos.filter(
      (articulo) => Number(articulo.cantidad) === Number(articulo.existencia),
    );

    if (!articulosConflicto.length) return;

    const modalPrevio = document.getElementById("modal-overlay");
    if (modalPrevio) modalPrevio.remove();

    const listaHtml = articulosConflicto
      .map((a) => `<li>${a.nombre}</li>`)
      .join("");

    const modal = document.createElement("div");
    modal.id = "modal-overlay";
    modal.innerHTML = `
    <div class="modal-box">
      <p>
        Los siguientes artículos no mantienen diferencia entre cantidad y existencia:
      </p>
      <ul style="text-align: left;">
        ${listaHtml}
      </ul>
      <button id="cerrar-modal-existencia-igual">Cerrar</button>
    </div>
  `;

    document.body.appendChild(modal);

    modal
      .querySelector("#cerrar-modal-existencia-igual")
      .addEventListener("click", () => modal.remove());
  }

  alertaFueraHorario() {
    const overlay = document.createElement("div");
    overlay.id = "modal-overlay";

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
          <li class="dia-horario-item" style="margin-bottom: 8px; background: rgba(0, 0, 0, 0.1); padding: 8px; border-radius: 4px; border: none;">
            <strong class="dia-horario-titulo">${titulo}</strong>
            <div class="rangos-horario">
              ${rangosHTML || `<div class="rango-horario">Cerrado</div>`}
            </div>
          </li>
        `;
      })
      .join("");

    overlay.innerHTML = `
      <div class="modal-box">
        <h2 style="margin-top: 0;">Fuera de horario</h2>
        <p style="padding: 8px 0;">Se te contestará cuando vuelvan a abrir.</p>
        
        <div class="modal-mostrar-horarios">
          <div id="toggle-horarios" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center; padding: 10px; background: rgba(0, 0, 0, 0.1); border-radius: 5px; margin-bottom: 10px;">
            <strong>Mostrar horarios</strong>
            <span id="flecha-horarios" style="transition: transform 0.3s; transform: rotate(0deg);">▼</span>
          </div>
          
          <div id="contenedor-horarios" style="display: none; max-height: 200px; overflow-y: auto; padding: 0 10px;">
            <ul class="horarios-cafeteria" style="list-style: none; padding: 0; margin: 0;">
              ${items || "<li>No hay horarios configurados</li>"}
            </ul>
          </div>
        </div>

        <div class="modal-actions" >
          <button id="cerrar-modal-fuera-horario" class="boton-modal btn-horario-eliminar">Cerrar</button>
          <button id="enviar-modal-fuera-horario" class="boton-modal" >Enviar pedido</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const btnCerrar = overlay.querySelector("#cerrar-modal-fuera-horario");
    const btnEnviar = overlay.querySelector("#enviar-modal-fuera-horario");
    const toggleHorarios = overlay.querySelector("#toggle-horarios");
    const contenedorHorarios = overlay.querySelector("#contenedor-horarios");
    const flechaHorarios = overlay.querySelector("#flecha-horarios");

    btnCerrar?.addEventListener("click", () => overlay.remove());

    btnEnviar?.addEventListener("click", () => {
      overlay.remove();
      this.enviarPedidoWhatsApp();
    });

    toggleHorarios?.addEventListener("click", () => {
      const estaOculto = contenedorHorarios.style.display === "none";
      contenedorHorarios.style.display = estaOculto ? "block" : "none";
      flechaHorarios.style.transform = estaOculto
        ? "rotate(180deg)"
        : "rotate(0deg)";
    });
  }

  enviarPedidoWhatsApp() {
    const articulos = this.carrito.mostrarArticulos();
    if (!articulos || articulos.length === 0) {
      alert("El carrito está vacío.");
      return;
    }
    var mensaje = this.esInterno
      ? "Movimiento de existencia\nLa cantidad ingresada representa la existencia real"
      : "Pedido";

    mensaje += `\n\nNombre: ${this.datosPersonales.nombre}\n`;
    if (this.datosPersonales.observaciones)
      mensaje += `Observación: ${this.datosPersonales.observaciones}\n\n`;
    else mensaje += `\n`;

    mensaje += `+Fecha: ${new Date().toLocaleString()}\n`;
    mensaje += `\n`;

    articulos.forEach((a) => {
      const id = String(a.id);
      const nombre = String(a.nombre);
      const cant = String(a.cantidad);
      const precioUnitario = Number(this.carrito.eliminarPuntoPrecio(a.precio));
      const existencia = Number(a.existencia);
      const obs = this.formatearObservacion(a.observaciones || []);

      mensaje += `#codi:${id}`;
      mensaje += ` #cant:${cant}`;
      if (!this.esInterno) {
        if (a.consultarPrecio) {
          mensaje += ` #subt:consultar`;
        } else {
          mensaje += ` #subt:$${this.carrito.insertarPuntoPrecio(String(precioUnitario * a.cantidad))}`;
        }
      }
      if (this.esInterno) mensaje += ` #exist:${existencia}`;
      mensaje += ` #desc:${nombre}`;

      if (obs.trim()) {
        mensaje += ` #obse:${obs}`;
      }

      mensaje += "\n";
    });

    const numeroWhatsApp = this.empresa.telefono.replace(/[^0-9]/g, "");

    const mensajeCodificado = encodeURIComponent(mensaje);

    const esMovil = /Android|iPhone|iPad|iPod|Windows Phone/i.test(
      navigator.userAgent,
    );

    const url = esMovil
      ? `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`
      : `https://web.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensajeCodificado}`;

    window.open(url, "_blank");

    articulos.forEach((articulo) => {
      this.onEliminarArticulo(articulo.id);
    });
    this.onFinalizarCompra();
    document.getElementById("modal-carrito-wrapper").remove();
    this.listaCentral.classList.remove("hidden");
  }

  formatearObservacion(observaciones) {
    return observaciones.filter((obs) => obs && obs.trim() !== "").join(" | ");
  }

  tomarDatosPersonales() {
    document
      .getElementById("input-nombre-cliente")
      .addEventListener("input", (e) => {
        this.datosPersonales.nombre = e.target.value.trim();
      });

    document
      .getElementById("input-observaciones-cliente")
      .addEventListener("input", (e) => {
        this.datosPersonales.observaciones = e.target.value.trim();
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
    this.pendiente = ["nombre"];
    this.botonEnviar.classList.add("desactivado");

    this.botonVolver.onclick = () => {
      this.volverAPaso1();
    };

    this.wrapperA.addEventListener("input", (e) => {
      const id = e.target.id;
      const valor = e.target.value.trim();

      if (id === "input-nombre-cliente") {
        if (valor !== "") {
          this.pendiente = this.pendiente.filter((p) => p !== "nombre");
        } else if (!this.pendiente.includes("nombre")) {
          this.pendiente.push("nombre");
        }
      }

      this.verificarPendientes();
    });

    this.wrapperA.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      this.verificarPendientes();
    });
  }

  verificarPendientes() {
    this.botonEnviar.removeEventListener("click", this.handleEnviarClick);

    if (this.pendiente.length === 0) {
      this.botonEnviar.classList.remove("desactivado");
      if (this.pedidosFueraHorario && !this.estaAbiertoPorHorarioAhora()) {
        this.botonEnviar.addEventListener(
          "click",
          this.alertaFueraHorario.bind(this),
        );
      } else this.botonEnviar.addEventListener("click", this.handleEnviarClick);
    } else {
      this.botonEnviar.classList.add("desactivado");
    }
  }

  conocerSlug(texto) {
    const url_segmentada = window.location.pathname.split("/");
    const slug = url_segmentada[texto];
    return slug;
  }
}
