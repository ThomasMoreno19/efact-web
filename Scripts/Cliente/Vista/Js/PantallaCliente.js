class PantallaCliente {
  constructor() {
    this.header = document.getElementById("header");
    this.botonMenu = document.getElementById("abrir-menu");
    this.imagenHeader = document.getElementById("imagen-header");
    this.tituloPagina = document.getElementById("titulo-pagina");
    this.infoExtra = document.getElementById("info-extra");
    this.gestor = new GestorCliente();
    this.listaArticulos = document.getElementById("lista-articulos");
    this.listaRubros = document.getElementById("lista-rubros");
    this.listaMarcas = document.getElementById("lista-marcas");
    this.listaProveedores = document.getElementById("lista-proveedores");
    this.listaOfertas = document.getElementById("lista-ofertas");
    this.botonListaOfertas = document.getElementById("boton-lista-ofertas");
    this.barraBusqueda = document.getElementById("barra-busqueda");
    this.listaVacia = document.getElementById("lista-vacia");
    this.esMovil = /Android|iPhone|iPad|iPod|Windows Phone/i.test(
      navigator.userAgent,
    );
    this.contenedoresBarraCodigos = document.getElementById(
      "contenedores-codigos",
    );
    this.barraBusquedaCodigoProveedor = document.getElementById(
      "barra-busqueda-codigo-proveedor",
    );
    this.barraBusquedaCodigoInterno = document.getElementById(
      "barra-busqueda-codigo-interno",
    );
    this.contenedorBarraBusqueda = document.getElementById(
      "contenedor-busqueda-nombre",
    );
    this.contenedorBarraBusquedaCodigoProveedor = document.getElementById(
      "contenedor-busqueda-codigo-proveedor",
    );
    this.contenedorBarraBusquedaCodigoInterno = document.getElementById(
      "contenedor-busqueda-codigo-interno",
    );
    this.botonBorrarBusquedaNombre = document.getElementById(
      "eliminar-busqueda-nombre",
    );
    this.botonBorrarBusquedaCodigoProveedor = document.getElementById(
      "eliminar-busqueda-codigo-proveedor",
    );
    this.botonBorrarBusquedaCodigoInterno = document.getElementById(
      "eliminar-busqueda-codigo-interno",
    );
    this.listaBotonesListas = document.getElementById("lista-botones-listas");
    this.listaBotonesFiltros = document.getElementById("lista-botones-filtros");
    this.nombreFiltroRubro = document.getElementById("nombre-filtro-rubro");
    this.nombreFiltroProveedor = document.getElementById(
      "nombre-filtro-proveedor",
    );
    this.nombreFiltroMarca = document.getElementById("nombre-filtro-marca");
    this.eliminarFiltroRubro = document.getElementById("eliminar-filtro-rubro");
    this.eliminarFiltroProveedor = document.getElementById(
      "eliminar-filtro-proveedor",
    );
    this.eliminarFiltroMarca = document.getElementById("eliminar-filtro-marca");
    this.botonListaArticulos = document.getElementById("boton-lista-articulos");
    this.botonListaRubros = document.getElementById("boton-lista-rubros");
    this.botonListaProveedores = document.getElementById(
      "boton-lista-proveedores",
    );
    this.botonListaMarcas = document.getElementById("boton-lista-marcas");
    this.onClickVolver = this.eventClickVolver.bind(this);
    this.onClickTelefono = this.eventClickTelefono.bind(this);
    this.onClickModalCarrito = this.abrirModalCarrito.bind(this);
    this.loader = document.getElementById("loader");
    this.botonCarrito = document.getElementById("boton-carrito");
    this.cantidadArticulosCarrito = document.getElementById(
      "cantidad-articulos-carrito",
    );
    this.horarios = [];

    this.listaCentral = document.getElementById("lista-central");

    this.carrito = new Carrito();
    this.articulo = null;
    this.listaArticulosSeleccionados = [];
    this.horarios = { horarios: [] };
    this.todosLosArticulos = [];
    this.todosLosRubros = [];
    this.enVistaRubro = false;
    this.botonEscaner = document.getElementById("boton-escaner");

    this.esInterno = new URLSearchParams(window.location.search).has("interno");
    this.filtros = {
      rubro: [],
      marca: [],
      proveedor: [],

      nombre: "",
      codigoProveedor: "",
      codigoInterno: "",
      abreviatura: "",
    };

    this.svgRubro = `<svg id="svg-rubro" class="svg" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.54" fill="#ffffffcf" width="16px" height="16px">
            <title>search-categories</title>
            <path d="M4.69,0H46.22a4.71,4.71,0,0,1,4.69,4.69V46a4.69,4.69,0,0,1-4.69,4.69H4.69a4.65,4.65,0,0,1-3.31-1.38l-.09-.09A4.67,4.67,0,0,1,0,46V4.69A4.71,4.71,0,0,1,4.69,0ZM89.44,61.94a26.56,26.56,0,0,1,10.18,2l.07,0a26.61,26.61,0,0,1,15.25,32.16,26.18,26.18,0,0,1-2.7,6.11l10.3,11.24a1.27,1.27,0,0,1-.07,1.8l-7.57,6.9a1.27,1.27,0,0,1-1.79-.07l-9.86-10.85a26.36,26.36,0,0,1-6.1,2.74,26.87,26.87,0,0,1-7.71,1.13,26.51,26.51,0,0,1-10.17-2l-.07,0A26.64,26.64,0,0,1,64.85,78.37l0-.07A26.6,26.6,0,0,1,89.44,61.94Zm15,11.59a21.38,21.38,0,0,0-6.89-4.61l-.06,0a21.22,21.22,0,0,0-23.07,4.64l-.07.07a21.25,21.25,0,0,0-4.54,6.83l0,.06a21.32,21.32,0,0,0-1.58,8.06,21.26,21.26,0,0,0,29.35,19.62,21.54,21.54,0,0,0,6.89-4.61l.07-.07a21.09,21.09,0,0,0,4.54-6.83l0-.06a21.35,21.35,0,0,0,0-16.17,21.34,21.34,0,0,0-4.62-6.9ZM4.69,63.2H46.22a4.71,4.71,0,0,1,4.69,4.7v41.34a4.68,4.68,0,0,1-4.69,4.69H4.69A4.69,4.69,0,0,1,0,109.24V67.9a4.71,4.71,0,0,1,4.69-4.7ZM68.78,0h41.53A4.71,4.71,0,0,1,115,4.69V46a4.71,4.71,0,0,1-4.69,4.69H68.78A4.71,4.71,0,0,1,64.09,46V4.69a4.69,4.69,0,0,1,1.37-3.31l.1-.09A4.67,4.67,0,0,1,68.78,0Z" />
          </svg>`;

    this.svgProveedor = `<svg version="1.1" id="svg-proveedor" class="svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 121.52 122.88" style="enable-background:new 0 0 121.52 122.88" xml:space="preserve" fill="#ffffff">
            <style type=" text/css">
              .st0 {
                fill-rule: evenodd;
                clip-rule: evenodd;
              }
            </style>
            <g>
              <path class="st0" d="M49.91,26.09l53.86-13.45c1.52-0.38,3.08,0.56,3.46,2.08l13.45,53.86c0.38,1.52-0.56,3.08-2.08,3.46 L64.75,85.49c-1.52,0.38-3.08-0.56-3.46-2.08L47.83,29.55C47.45,28.03,48.39,26.47,49.91,26.09L49.91,26.09L49.91,26.09z M54.59,90.54c8.93,0,16.17,7.24,16.17,16.17c0,8.93-7.24,16.17-16.17,16.17c-8.93,0-16.17-7.24-16.17-16.17 C38.42,97.78,45.66,90.54,54.59,90.54L54.59,90.54z M74,92.69l41.87-11.22l2.51-0.67l0.67,2.51l1.8,6.72l0.67,2.51l-2.51,0.67 l-41.87,11.22l-2.51,0.67l-0.67-2.51l-1.8-6.72l-0.67-2.51L74,92.69L74,92.69L74,92.69z M4.21,0.04l8.34,1.45 c9.58,1.67,14.41,2.63,17.54,5.12c3.37,2.68,4.13,6.28,5.59,13.26c0.27,1.27,0.56,2.69,0.96,4.4c0.36,1.58,0.82,3.43,1.42,5.64 l14.87,54.67c0.38,1.39-0.44,2.81-1.83,3.19c-0.04,0.01-0.08,0.02-0.12,0.03l-6.61,1.79c-1.38,0.37-2.81-0.45-3.18-1.83l0,0 l-6.76-24.85l-8.11-29.82c-0.56-2.08-1.05-4.08-1.47-5.94l-0.02-0.12c-0.41-1.8-0.73-3.33-1.02-4.7c-0.73-3.47-1.1-5.27-2.23-6.08 c-1.47-1.07-4.67-1.67-11.06-2.79l-3.23-0.56l-5.11-0.89c-1.42-0.24-2.37-1.58-2.12-3l1.17-6.86C1.45,0.75,2.79-0.2,4.21,0.04 L4.21,0.04z" />
            </g>
          </svg>`;
    this.svgMarca = `<svg version="1.1" id="svg-marca" class="svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 122.879 122.891" enable-background="new 0 0 122.879 122.891" xml:space="preserve" fill="#ffffff">
            <g>
              <path d="M89.767,18.578c3.848,0,7.332,1.561,9.854,4.082c2.521,2.522,4.082,6.007,4.082,9.855s-1.561,7.332-4.082,9.854 c-2.522,2.522-6.007,4.082-9.854,4.082c-3.849,0-7.333-1.56-9.854-4.082c-2.522-2.522-4.082-6.006-4.082-9.854 s1.56-7.333,4.082-9.855C82.434,20.138,85.918,18.578,89.767,18.578L89.767,18.578z M122.04,56.704l-65.337,65.337 c-1.132,1.133-2.969,1.133-4.101,0L0.849,70.287c-1.132-1.131-1.132-2.967,0-4.1L66.186,0.85C66.752,0.284,67.494,0,68.236,0v0 h50.051c1.602,0,2.9,1.298,2.9,2.9c0,0.048-0.002,0.097-0.004,0.145l1.694,51.517c0.026,0.83-0.301,1.589-0.845,2.134 L122.04,56.704L122.04,56.704z M54.652,115.889l62.406-62.407L115.49,5.8H69.438L7.001,68.238L54.652,115.889L54.652,115.889z M96.244,26.037c-1.657-1.657-3.948-2.683-6.478-2.683c-2.53,0-4.82,1.025-6.478,2.683c-1.658,1.657-2.684,3.948-2.684,6.478 s1.025,4.82,2.684,6.478c1.657,1.658,3.947,2.683,6.478,2.683c2.529,0,4.82-1.025,6.478-2.683s2.683-3.948,2.683-6.478 S97.901,27.694,96.244,26.037L96.244,26.037z" />
            </g>
          </svg>`;

    this.listaGruposSeleccionados = {
      rubros: [],
      marcas: [],
      proveedores: [],
    };

    this.MINUTOS_DIA = 1440;
    this.agregarEventListeners();
  }

  clickFueraCerrar(modal) {
    let clickEmpezoAfuera = false;

    modal.addEventListener("mousedown", (event) => {
      clickEmpezoAfuera = event.target === modal;
    });

    modal.addEventListener("mouseup", (event) => {
      const clickTerminoAfuera = event.target === modal;

      if (clickEmpezoAfuera && clickTerminoAfuera) {
        modal.classList.add("hidden");
      }
    });
  }

  async init() {
    const data = await this.gestor.conocerEmpresa(this.conocerSlug(2));
    this.empresa = new EmpresaVista(data);
    if (this.esInterno || this.empresa.incluirCodigoBarra)
      this.botonEscaner.classList.remove("hidden");
    this.escanear();
    if (this.empresa.tieneCarrito) {
      window.gestorDeArticulosCallback = (articulo) => {
        this.articuloSeleccionado(articulo);
      };
      this.botonCarrito.removeEventListener("click", this.onClickModalCarrito);
      this.botonCarrito.addEventListener("click", this.onClickModalCarrito);
      if (!document.getElementById("css-articulo-seleccionado")) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/Scripts/Cliente/Vista/Css/articuloSeleccionado.css";
        link.id = "css-articulo-seleccionado";
        document.head.appendChild(link);
      }
    }

    this.botonMenu.onclick = () => this.abrirMenu();
    try {
      this.horarios = await this.gestor.obtenerHorarios(this.empresa.id);
    } catch (error) {
      console.warn("No se pudieron cargar horarios/no laborables:", error);
      this.horarios = { horarios: [] };
    }

    const textoAdicional = "- Catálogo";
    this.horarios = await this.gestor.obtenerHorarios(this.empresa.id);

    await this.mostrarLogoEmpresa();
    await this.empresa.asignarIconoYPagina(textoAdicional);
  }

  agregarEventListeners() {
    window.removeEventListener("popstate", this.onPopState);
    window.addEventListener("popstate", this.onPopState);
  }

  async habilitarVentanaPrincipal() {
    this.loader.classList.remove("hidden");
    this.barraBusqueda.classList.add("hidden");
    this.barraBusquedaCodigoInterno.classList.add("hidden");
    this.barraBusquedaCodigoProveedor.classList.add("hidden");
    this.contenedorBarraBusqueda.classList.add("hidden");
    this.contenedorBarraBusquedaCodigoInterno.classList.add("hidden");
    this.contenedorBarraBusquedaCodigoProveedor.classList.add("hidden");
    this.listaArticulos.classList.add("hidden");
    this.listaRubros.classList.add("hidden");
    this.listaBotonesListas.classList.add("hidden");
    this.carrito.vaciarCarrito();
    this.botonCarrito.classList.add("hidden");

    await this.mostrarTodo();
    this.barraBusquedaCodigoInterno.oninput = () =>
      this.buscarPorCodigoInterno(this.barraBusquedaCodigoInterno.value);
    this.barraBusquedaCodigoProveedor.oninput = () =>
      this.buscarPorCodigoProveedor(this.barraBusquedaCodigoProveedor.value);
    this.botonBorrarBusquedaCodigoInterno.onclick = () =>
      this.borrarBusqueda("codigoInterno");
    this.botonBorrarBusquedaCodigoProveedor.onclick = () =>
      this.borrarBusqueda("codigoProveedor");
    this.loader.classList.add("hidden");
    this.barraBusqueda.classList.remove("hidden");
    this.barraBusquedaCodigoInterno.classList.remove("hidden");
    this.barraBusquedaCodigoProveedor.classList.remove("hidden");
    this.contenedorBarraBusqueda.classList.remove("hidden");
    this.contenedorBarraBusquedaCodigoInterno.classList.remove("hidden");
    this.contenedorBarraBusquedaCodigoProveedor.classList.remove("hidden");
    this.listaBotonesListas.classList.remove("hidden");

    this.botonListaRubros.onclick = () => this.mostrarLista("rubros");
    this.botonListaMarcas.onclick = () => this.mostrarLista("marcas");
    if (this.esInterno) {
      this.botonListaProveedores.classList.remove("hidden");
      this.botonListaProveedores.onclick = () =>
        this.mostrarLista("proveedores");
      this.botonMenu.classList.add("hidden");
      this.botonListaOfertas.classList.add("hidden");
    }
    this.botonListaArticulos.onclick = () => this.mostrarLista("articulos");
    this.botonListaOfertas.onclick = () => this.mostrarLista("ofertas");

    this.botonListaRubros.click();

    window.addEventListener("scroll", this.handleScroll.bind(this));
  }

  async escanear() {
    if (this._escanerInicializado) return;
    this._procesandoEscaneo = false;
    this._escanerInicializado = true;

    let html5QrCode = null;
    const boton = document.getElementById("boton-escaner");
    const contenedor = document.getElementById("contenedor-camara");
    const btnCerrar = document.getElementById("cerrar-camara");
    btnCerrar.textContent = "✕";

    const detener = async () => {
      try {
        if (html5QrCode?.isScanning) {
          await html5QrCode.stop();
          html5QrCode.clear();
          this._procesandoEscaneo = false;
        }
      } catch (err) {
        console.warn("Error al detener el escáner:", err);
      } finally {
        contenedor.style.display = "none";
      }
    };

    btnCerrar?.addEventListener("click", detener);
    if (this.esMovil) {
      boton.addEventListener("click", async () => {
        contenedor.style.display = "block";
        void contenedor.offsetHeight;

        if (html5QrCode?.isScanning) {
          await html5QrCode.stop();
        }

        html5QrCode = new Html5Qrcode("video-escaner");

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          videoConstraints: {
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            advanced: [{ focusMode: "continuous" }],
          },
        };

        try {
          await html5QrCode.start(
            { facingMode: "environment" },
            config,
            (decodedText) => {
              if (this._procesandoEscaneo) return;

              this._procesandoEscaneo = true;

              this.manejarResultadoEscaneo(decodedText);
            },
            () => {},
          );
        } catch (err) {
          console.error("Error detallado:", err);
          contenedor.style.display = "none";
          alert("No se pudo acceder a la cámara: " + err.message);
        }
      });
    } else {
      const elementos = document.querySelectorAll(".svg-escaner");

      elementos.forEach((elemento) => {
        elemento.classList.add("disabled");
      });
    }
  }

  manejarResultadoEscaneo(texto) {
    const codigo = String(texto).trim();
    const elemento = this.buscarArticuloPorCodigo(codigo);
    if (elemento) {
      this.mostrarModalArticuloEscaneado(elemento);
    } else {
      this.mostrarModalCodigoNoEncontrado(codigo);
    }
  }

  buscarArticuloPorCodigo(codigo) {
    const codigoBuscado = String(codigo).trim().replace(/\s+/g, "");
    return (
      this.todosLosArticulos.find((a) => {
        const codigoArticulo = String(a.dataset.codigo_barra || "")
          .trim()
          .replace(/\s+/g, "");
        return codigoArticulo === codigoBuscado;
      }) || null
    );
  }

  mostrarModalArticuloEscaneado(elemento) {
    const viejo = document.getElementById("modal-articulo-wrapper");
    if (viejo) viejo.remove();

    const nombre = elemento.dataset.nombre || "Artículo";
    const precioRaw = elemento.dataset.precio1 || "0";
    const precioFormateado = this.carrito.insertarPuntoPrecio(
      Number(String(precioRaw).replace(/\./g, "")) || precioRaw,
    );

    const logoImg = elemento.querySelector(".articulo-logo img");
    const imgHTML = logoImg
      ? `<img src="${logoImg.src}" alt="${nombre}" style="max-width:120px; max-height:120px; object-fit:contain; border-radius:8px;"/>`
      : "";

    const wrapper = document.createElement("div");
    wrapper.id = "modal-articulo-wrapper";
    wrapper.innerHTML = `
      <div class="modal-articulo-escaneado" style="padding:20px;">
        <header id="header-modal-articulo" style="display:flex; align-items:center; justify-content:space-between;">
          <h2 style="margin:0; color:white">${nombre}</h2>
          <button id="cerrar-modal-articulo" class="boton-cerrar">&times;</button>
        </header>

        <div style="margin-top:16px; color:white; display:flex; gap:16px; align-items:center;">
          <div>${imgHTML}</div>
          <div>
            <div style="font-size:18px; margin-bottom:8px;">Precio: $${precioFormateado}</div>
            <button id="boton-agregar-articulo" class="boton" style="padding:10px 16px;">Agregar al carrito</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(wrapper);
    window.history.pushState({ vista: "modal" }, "", window.location.href);

    const cerrarBtn = wrapper.querySelector("#cerrar-modal-articulo");
    cerrarBtn?.addEventListener("click", () => {
      this._procesandoEscaneo = false;
      wrapper.remove();
    });

    const agregarBtn = wrapper.querySelector("#boton-agregar-articulo");

    agregarBtn?.addEventListener("click", () => {
      const id = Number(elemento.dataset.articuloId);

      if (!this.listaArticulosSeleccionados.includes(id)) {
        this.listaArticulosSeleccionados.push(id);
        this.carrito.agregarArticulo(elemento, 1);
        elemento.classList.add("seleccionado");
      }

      this.cantidadArticulosCarrito.textContent =
        this.listaArticulosSeleccionados.length;

      this.botonCarrito.classList.remove("hidden");

      wrapper.remove();
      this._procesandoEscaneo = false;

      this.listaCentral.classList.remove("hidden");
    });
  }

  mostrarModalCodigoNoEncontrado(codigo) {
    const viejo = document.getElementById("modal-articulo-wrapper");
    if (viejo) viejo.remove();

    const overlay = document.createElement("div");
    overlay.id = "modal-articulo-wrapper";
    overlay.className = "modal";
    overlay.innerHTML = `
      <div class="modal-box">
        <p style="padding: 8px 0;">el código ${codigo} escaneado no pertenece a un artículo del local</p>
        <div class="modal-actions">
          <button id="cerrar-no-encontrado" class="boton-modal">Cerrar</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    const btn = overlay.querySelector("#cerrar-no-encontrado");
    btn?.addEventListener("click", () => {
      overlay.remove();
      this._procesandoEscaneo = false;
    });
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.remove();
    });
  }

  async mostrarTodo() {
    try {
      this.todosLosArticulos = [];
      this.listaRubros.innerHTML = "";
      this.listaMarcas.innerHTML = "";
      this.listaProveedores.innerHTML = "";
      this.listaOfertas.innerHTML = "";

      const catalogos = await this.gestor.mostrarListaRubros(this.empresa.id);

      this.todosLosRubros = catalogos.rubros ?? [];
      if (this.todosLosRubros.length === 0)
        this.botonListaRubros.classList.add("hidden");

      this.todasLasMarcas = catalogos.marcas ?? [];
      if (this.todasLasMarcas.length === 0)
        this.botonListaMarcas.classList.add("hidden");

      this.todosLosProveedores = catalogos.proveedores ?? [];
      if (this.todosLosProveedores.length === 0)
        this.botonListaProveedores.classList.add("hidden");

      this.todosLosArticulos =
        await this.gestor.mostrarListaArticulosPorEmpresa(this.empresa.id);

      this.todasLasOfertas = this.todosLosArticulos.filter(
        (articulo) => articulo.oferta,
      );
      if (this.todasLasOfertas.length === 0)
        this.botonListaOfertas.classList.add("hidden");
    } catch (error) {
      console.error(error);
    }
  }

  mostrarLista(tipo) {
    this.listaRubros.classList.add("hidden");
    this.listaMarcas.classList.add("hidden");
    this.listaProveedores.classList.add("hidden");
    this.listaArticulos.classList.add("hidden");
    this.listaOfertas.classList.add("hidden");
    this.listaVacia.classList.add("hidden");

    this.contenedoresBarraCodigos.classList.add("hidden");

    this.botonListaRubros.classList.remove("activo-cliente");
    this.botonListaMarcas.classList.remove("activo-cliente");
    this.botonListaProveedores.classList.remove("activo-cliente");
    this.botonListaOfertas.classList.remove("activo-cliente");
    this.botonListaArticulos.classList.remove("lupa-activa");

    switch (tipo) {
      case "rubros":
        this.mostrarRubro("");
        this.listaRubros.classList.remove("hidden");
        this.botonListaRubros.classList.add("activo-cliente");

        this.barraBusqueda.oninput = () =>
          this.buscarPorNombre(this.barraBusqueda.value, "rubro");
        break;

      case "marcas":
        this.mostrarMarca("");
        this.listaMarcas.classList.remove("hidden");
        this.botonListaMarcas.classList.add("activo-cliente");

        this.barraBusqueda.oninput = () =>
          this.buscarPorNombre(this.barraBusqueda.value, "marca");
        break;

      case "proveedores":
        this.mostrarProveedor("");
        this.listaProveedores.classList.remove("hidden");
        this.botonListaProveedores.classList.add("activo-cliente");

        this.barraBusqueda.oninput = () =>
          this.buscarPorNombre(this.barraBusqueda.value, "proveedor");
        break;

      case "articulos":
        this.listaArticulos.classList.remove("hidden");
        this.contenedoresBarraCodigos.classList.remove("hidden");
        this.botonListaArticulos.classList.add("lupa-activa");

        this.barraBusqueda.oninput = () =>
          this.buscarPorNombre(this.barraBusqueda.value);
        this.actualizarArticulos();
        break;

      case "ofertas":
        this.mostrarOferta("");
        this.listaOfertas.classList.remove("hidden");
        this.botonListaOfertas.classList.add("activo-cliente");
        this.barraBusqueda.oninput = () =>
          this.buscarPorNombre(this.barraBusqueda.value, "oferta");
        break;
    }
  }

  seleccionarTipo(tipo, tipoSeleccionado) {
    const lista = this.filtros[tipoSeleccionado];

    const existe = lista.some((item) => item.id === tipo.id);

    if (existe) {
      this.filtros[tipoSeleccionado] = lista.filter(
        (item) => item.id !== tipo.id,
      );
    } else {
      this.filtros[tipoSeleccionado].push({
        id: tipo.id,
        nombre: tipo.nombre,
        abreviatura: tipo.abreviatura,
      });
    }

    this.barraBusqueda.value = "";
    this.botonBorrarBusquedaNombre.classList.add("hidden");

    this.actualizarFiltros();
  }

  actualizarFiltros(tipo = null) {
    this.botonListaArticulos.classList.remove("lupa-activa");
    this.botonListaMarcas.classList.remove("activo-cliente");
    this.botonListaProveedores.classList.remove("activo-cliente");
    this.botonListaRubros.classList.remove("activo-cliente");
    this.botonListaOfertas.classList.remove("activo-cliente");

    this.contenedoresBarraCodigos.classList.add("hidden");

    this.renderizarFiltros(tipo);
    if (tipo) {
      this.botonListaArticulos.classList.remove("lupa-activa");
      this.mostrarGrupo(tipo);
    }
  }

  mostrarGrupo(tipo, valor = "") {
    this.listaArticulos.classList.add("hidden");
    this.listaRubros.classList.add("hidden");
    this.listaProveedores.classList.add("hidden");
    this.listaMarcas.classList.add("hidden");
    switch (tipo) {
      case "rubro":
        this.mostrarRubro(valor);
        break;
      case "marca":
        this.mostrarMarca(valor);
        break;
      case "proveedor":
        this.mostrarProveedor(valor);
        break;
      case "oferta":
        this.mostrarOferta(valor);
        break;
    }
  }

  buscarPorNombre(valor, tipo = null) {
    if (valor !== "") this.botonBorrarBusquedaNombre.classList.remove("hidden");
    else this.botonBorrarBusquedaNombre.classList.add("hidden");
    if (tipo) {
      this.botonBorrarBusquedaNombre.onclick = () =>
        this.borrarBusqueda("nombre", tipo);
      this.mostrarGrupo(tipo, valor);
      return;
    }
    this.filtros.nombre = valor;

    this.botonBorrarBusquedaNombre.onclick = () =>
      this.borrarBusqueda("nombre");

    this.actualizarArticulos();
  }

  buscarPorCodigoProveedor(valor) {
    this.filtros.codigoProveedor = valor;
    if (valor !== "")
      this.botonBorrarBusquedaCodigoProveedor.classList.remove("hidden");
    else this.botonBorrarBusquedaCodigoProveedor.classList.add("hidden");

    this.actualizarArticulos();
  }

  buscarPorCodigoInterno(valor) {
    this.filtros.codigoInterno = valor;
    if (valor !== "")
      this.botonBorrarBusquedaCodigoInterno.classList.remove("hidden");
    else this.botonBorrarBusquedaCodigoInterno.classList.add("hidden");

    this.actualizarArticulos();
  }

  quitarFiltroIndividual(tipo, id) {
    this.filtros[tipo] = this.filtros[tipo].filter(
      (filtro) => filtro.id !== id,
    );

    this.actualizarFiltros(tipo);
  }

  borrarBusqueda(tipo, tipoGrupo = null) {
    this.filtros[tipo] = "";
    switch (tipo) {
      case "nombre":
        this.barraBusqueda.value = "";
        this.botonBorrarBusquedaNombre.classList.add("hidden");
        break;
      case "codigoInterno":
        this.barraBusquedaCodigoInterno.value = "";
        this.botonBorrarBusquedaCodigoInterno.classList.add("hidden");
        break;
      case "codigoProveedor":
        this.barraBusquedaCodigoProveedor.value = "";
        this.botonBorrarBusquedaCodigoProveedor.classList.add("hidden");
        break;
    }
    if (tipoGrupo) {
      this.mostrarGrupo(tipoGrupo);
      return;
    }
    this.actualizarFiltros();
  }

  crearBotonFiltro(tipo, texto, onclick) {
    const boton = document.createElement("button");

    boton.classList.add("boton-filtro-activo");

    boton.textContent = `${tipo}: ${texto} ✕`;

    boton.onclick = onclick;

    return boton;
  }

  renderizarFiltros(tipo = null) {
    const contenedor = document.getElementById("lista-botones-filtros");

    contenedor.innerHTML = "";

    const crearBotonFiltro = (grupo, filtro, icono) => {
      const boton = document.createElement("button");
      boton.classList.add("boton-filtro", "boton-lista-cliente");

      boton.innerHTML = `
      ${icono}

      <p class="filtro nombre-filtro">
        ${filtro.abreviatura}
      </p>

      <p class="filtro eliminar">
        ✕
      </p>
    `;

      boton.querySelector(".eliminar").addEventListener("click", (e) => {
        e.stopPropagation();

        this.quitarFiltroIndividual(grupo, filtro.id);
      });

      contenedor.appendChild(boton);
    };

    this.filtros.rubro.forEach((rubro) => {
      crearBotonFiltro("rubro", rubro, this.svgRubro);
    });

    this.filtros.marca.forEach((marca) => {
      crearBotonFiltro("marca", marca, this.svgMarca);
    });

    this.filtros.proveedor.forEach((proveedor) => {
      crearBotonFiltro("proveedor", proveedor, this.svgProveedor);
    });

    if (!tipo) this.actualizarArticulos();
  }

  actualizarArticulos() {
    this.articulosActuales = [];
    let articulos = [...this.todosLosArticulos];
    this.botonListaArticulos.classList.add("lupa-activa");
    this.contenedoresBarraCodigos.classList.remove("hidden");

    this.listaArticulos.classList.add("hidden");
    this.listaVacia.classList.add("hidden");

    const codigoInterno = this.filtros.codigoInterno.trim();
    const nombre = this.filtros.nombre.trim().toLowerCase();
    const codigoProveedor = this.filtros.codigoProveedor.trim();

    if (
      !codigoInterno &&
      !nombre &&
      !codigoProveedor &&
      this.filtros.rubro.length === 0 &&
      this.filtros.marca.length === 0 &&
      this.filtros.proveedor.length === 0
    ) {
      this.listaVacia.classList.remove("hidden");
      return;
    }

    if (codigoInterno) {
      articulos = articulos.filter(
        (a) => String(a.codigo_interno ?? "") === codigoInterno,
      );

      this.mostrarArticulos(articulos);
      return;
    }

    if (this.filtros.rubro.length) {
      articulos = articulos.filter((a) =>
        this.filtros.rubro.some((r) => r.id === a.id_rubro),
      );
    }

    if (this.filtros.marca.length) {
      articulos = articulos.filter((a) =>
        this.filtros.marca.some((m) => m.id === a.id_marca),
      );
    }

    if (this.filtros.proveedor.length) {
      articulos = articulos.filter((a) =>
        this.filtros.proveedor.some((p) => p.id === a.id_proveedor),
      );
    }

    if (this.filtros.nombre.trim() !== "") {
      const normalizar = (texto) =>
        String(texto ?? "")
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .toLowerCase();

      const palabras = normalizar(this.filtros.nombre)
        .split(/\s+/)
        .filter(Boolean);

      articulos = articulos.filter((a) => {
        const nombreArticulo = normalizar(a.nombre);

        return palabras.every((palabra) => nombreArticulo.includes(palabra));
      });
    }

    if (codigoProveedor !== "") {
      articulos = articulos.filter(
        (a) => String(a.codigo_proveedor ?? "") === codigoProveedor,
      );
    }

    this.mostrarArticulos(articulos);
  }

  mostrarArticulos(articulos) {
    this.listaArticulos.classList.remove("hidden");
    this.listaProveedores.classList.add("hidden");
    this.listaMarcas.classList.add("hidden");
    this.listaRubros.classList.add("hidden");
    this.listaOfertas.classList.add("hidden");

    window.history.pushState({ vista: "articulos" }, "", window.location.href);

    this.listaArticulos.innerHTML = "";

    if (articulos.length === 0) {
      this.listaArticulos.innerHTML = `
      <p class="texto-vacio">
        No se encontraron artículos.
      </p>
    `;
      return;
    }

    this.articulosActuales = articulos;
    this.indiceActual = 0;
    this.tamanoLote = 15;

    this.cargarSiguienteLote();
  }

  handleScroll() {
    if (this.listaArticulos.classList.contains("hidden")) {
      return;
    }

    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 100
    ) {
      this.cargarSiguienteLote();
    }
  }

  cargarSiguienteLote() {
    const fin = Math.min(
      this.indiceActual + this.tamanoLote,
      this.articulosActuales.length,
    );

    for (let i = this.indiceActual; i < fin; i++) {
      const articulo = this.articulosActuales[i];

      const vista = new ArticuloVista(articulo);

      const estaSeleccionado = this.listaArticulosSeleccionados.includes(
        articulo.id,
      );

      this.listaArticulos.appendChild(
        vista.mostrarUna(
          1,
          true,
          this.empresa.imagenesEnArticulos,
          estaSeleccionado,
          this.esInterno,
        ),
      );
    }

    this.indiceActual = fin;
  }

  normalizar(texto) {
    return String(texto ?? "")
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();
  }

  mostrarRubro(valor) {
    this.botonListaRubros.classList.add("activo-cliente");
    this.listaRubros.classList.remove("hidden");

    window.history.pushState({ vista: "rubros" }, "", window.location.href);
    this.listaRubros.innerHTML = "";

    const palabras = this.normalizar(valor).split(/\s+/).filter(Boolean);

    const rubros = this.todosLosRubros.filter((r) => {
      const nombre = this.normalizar(r.nombre);
      return palabras.every((palabra) => nombre.includes(palabra));
    });

    rubros.forEach((rubro) => {
      const vista = new RubroVista(rubro);
      const cantArticulosSelecc =
        this.listaGruposSeleccionados.rubros[rubro.id] || 0;
      const elemento = vista.mostrarUno(true, cantArticulosSelecc);
      elemento.onclick = () => this.seleccionarTipo(rubro, "rubro");

      this.listaRubros.appendChild(elemento);
    });
  }

  mostrarProveedor(valor) {
    this.botonListaProveedores.classList.add("activo-cliente");
    this.listaProveedores.classList.remove("hidden");

    window.history.pushState(
      { vista: "proveedores" },
      "",
      window.location.href,
    );
    this.listaProveedores.innerHTML = "";

    const palabras = this.normalizar(valor).split(/\s+/).filter(Boolean);

    const proveedores = this.todosLosProveedores.filter((p) => {
      const nombre = this.normalizar(p.nombre);
      return palabras.every((palabra) => nombre.includes(palabra));
    });

    proveedores.forEach((proveedor) => {
      const vista = new ProveedorVista(proveedor);
      const elemento = vista.mostrarUno(true);
      elemento.onclick = () => this.seleccionarTipo(proveedor, "proveedor");

      this.listaProveedores.appendChild(elemento);
    });
  }

  mostrarMarca(valor) {
    this.botonListaMarcas.classList.add("activo-cliente");
    this.listaMarcas.classList.remove("hidden");

    window.history.pushState({ vista: "marcas" }, "", window.location.href);
    this.listaMarcas.innerHTML = "";

    const palabras = this.normalizar(valor).split(/\s+/).filter(Boolean);

    const marcas = this.todasLasMarcas.filter((m) => {
      const nombre = this.normalizar(m.nombre);
      return palabras.every((palabra) => nombre.includes(palabra));
    });

    marcas.forEach((marca) => {
      const vista = new MarcaVista(marca);
      const cantArticulosSelecc =
        this.listaGruposSeleccionados.marcas[marca.id] || 0;
      const elemento = vista.mostrarUno(true, cantArticulosSelecc);
      elemento.onclick = () => this.seleccionarTipo(marca, "marca");

      this.listaMarcas.appendChild(elemento);
    });
  }

  mostrarOferta(valor) {
    this.botonListaOfertas.classList.add("activo-cliente");
    this.listaOfertas.classList.remove("hidden");

    window.history.pushState({ vista: "ofertas" }, "", window.location.href);
    this.listaOfertas.innerHTML = "";

    const palabras = this.normalizar(valor).split(/\s+/).filter(Boolean);

    const ofertas = this.todasLasOfertas.filter((m) => {
      const nombre = this.normalizar(m.nombre);
      return palabras.every((palabra) => nombre.includes(palabra));
    });

    ofertas.forEach((oferta) => {
      const vista = new ArticuloVista(oferta);
      const estaSeleccionado = this.listaArticulosSeleccionados.some((id) => {
        if (id) return id === oferta.id;
      });

      this.listaOfertas.appendChild(
        vista.mostrarUna(
          1,
          true,
          this.empresa.imagenesEnArticulos,
          estaSeleccionado,
          this.esInterno,
        ),
      );
    });
  }

  seleccionarArticulo(id) {
    this.todosLosArticulos.forEach((articulo) => {
      if (articulo.dataset.articuloId == id)
        articulo.classList.add("seleccionado");
    });
  }

  sacarArticulo(id) {
    this.todosLosArticulos.forEach((articulo) => {
      if (articulo.dataset.articuloId == id)
        articulo.classList.remove("seleccionado");
    });
  }

  removerClon(clon) {
    const index = this.listaArticulosSeleccionados.findIndex((id) => {
      if (id) return id === clon.dataset.articuloId;
    });
    if (index !== -1) this.listaArticulosSeleccionados.splice(index, 1);
  }

  /* Obtiene el container del rubro por su id */
  obtenerContainerRubro(idRubro) {
    return document.querySelector(
      `.container-rubro[data-rubro-id="${idRubro}"]`,
    );
  }

  /* Obtiene todos los artículos dentro de un container de rubro */
  obtenerArticulosDeRubro(containerRubro) {
    return Array.from(containerRubro.querySelectorAll(".articulo"));
  }

  /* Crea una lista plana a partir de artículos filtrados (no usa texto, reutiliza lógica) */
  crearListaPlanaDesdeArticulos(articulosFiltrados, mensajeVacio) {
    const listaPlana = document.createElement("div");
    listaPlana.classList.add("lista-plana");

    if (articulosFiltrados.length === 0) {
      listaPlana.id = "lista-vacia";
      listaPlana.textContent = mensajeVacio;
      return listaPlana;
    }

    articulosFiltrados.forEach((a) => {
      const clon = a.cloneNode(true);
      if (clon.no_procesado)
        clon.addEventListener("click", () => {
          this.clonesSeleccionados.push(clon);
          const id = Number(clon.dataset.articuloId);
          if (!this.listaArticulosSeleccionados.includes(id)) {
            clon.classList.add("seleccionado");
            this.listaArticulosSeleccionados.push(
              Number(clon.dataset.articuloId),
            );
            this.carrito.agregarArticulo(clon, 1);
            this.seleccionarArticulo(id);
          } else {
            this.clonesSeleccionados = this.clonesSeleccionados.filter(
              (c) => c.dataset.articuloId != id,
            );
            clon.classList.remove("seleccionado");
            this.carrito.eliminarArticulo(id);
            this.listaArticulosSeleccionados =
              this.listaArticulosSeleccionados.filter((x) => x !== id);
            this.sacarArticulo(id);
          }
          this.cantidadArticulosCarrito.textContent =
            this.listaArticulosSeleccionados.length;
          this.botonCarrito.classList.toggle(
            "hidden",
            this.listaArticulosSeleccionados.length === 0,
          );
        });
      listaPlana.appendChild(clon);
    });

    return listaPlana;
  }

  volverAtras() {
    window.history.back();
    this.listaArticulos.classList.add("hidden");
    this.listaRubros.classList.remove("hidden");
    this.listaBotonesListas.classList.remove("hidden");
    this.listaVacia.classList.add("hidden");
    this.botonListaProveedores.classList.remove("activo-cliente");
    this.botonListaMarcas.classList.remove("activo-cliente");
    this.botonListaArticulos.classList.remove("lupa-activa");
    this.botonListaRubros.classList.add("activo-cliente");
    this.botonListaOfertas.classList.remove("activo-cliente");
  }

  conocerSlug(texto) {
    const url_segmentada = window.location.pathname.split("/");
    const slug = url_segmentada[texto];
    return slug;
  }

  async mostrarLogoEmpresa() {
    try {
      if (
        this.empresa.logo_url &&
        this.empresa.logo_url !== "Archivo/Logos/Vacio.png"
      ) {
        this.imagenHeader.src = this.empresa.logo_url;
      } else {
        this.imagenHeader.src = "/Archivos/Logos/Vacio.png";
      }

      if (this.tituloPagina && this.empresa.nombre) {
        this.tituloPagina.textContent = this.empresa.nombre;
      }

      if (this.infoExtra) {
        let infoHTML = "";

        if (this.empresa.ubicacion) {
          infoHTML += `<span class="info-ubicacion">📍 ${this.empresa.ubicacion}</span>`;
        }

        if (this.empresa.telefono) {
          const whatsappIcon = `
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="15" viewBox="0 0 48 48">
                <path fill="#fff" d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"></path><path fill="#fff" d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"></path><path fill="#cfd8dc" d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"></path><path fill="#40c351" d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"></path><path fill="#fff" fill-rule="evenodd" d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z" clip-rule="evenodd"></path>
              </svg>
            `;

          infoHTML += `
              <span id="info-telefono" class="info-telefono" style="cursor:pointer; user-select:none;">
                ${whatsappIcon}${this.empresa.telefono}
              </span>
            `;
        }

        if (!infoHTML) {
          infoHTML =
            '<span class="info-vacia">Información no disponible</span>';
        }

        this.infoExtra.innerHTML = infoHTML;
        this.botonTelefono();
      }
    } catch (error) {
      console.error("Error al cargar el logo y datos de la empresa:", error);
      if (this.tituloPagina) this.tituloPagina.textContent = "Catálogo";
      if (this.infoExtra)
        this.infoExtra.innerHTML =
          '<span class="info-error">Error al cargar datos</span>';
    }
  }

  botonTelefono() {
    const telefono = document.getElementById("info-telefono");
    if (!telefono) return;

    telefono.classList.add("copiable");
    telefono.removeEventListener("click", this.onClickTelefono);
    telefono.addEventListener("click", this.onClickTelefono);
  }

  normalizarTexto(texto) {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  cambiarHeaderPorRubro(nombreRubro, logoRubro) {
    if (!this.headerOriginal) {
      this.headerOriginal = {
        titulo: this.tituloPagina.textContent,
        logo: this.imagenHeader.src,
      };
    }
    this.infoExtra.classList.add("hidden");

    this.tituloPagina.textContent = nombreRubro;

    if (logoRubro && logoRubro.trim() !== "") {
      this.imagenHeader.src = logoRubro;
      this.imagenHeader.style.transition =
        "height 0.3s ease, transform 0.3s ease, opacity 0.8s ease";
      this.imagenHeader.style.opacity = "0";
      this.imagenHeader.onload = () => {
        this.imagenHeader.style.opacity = "1";
      };
    }
  }

  articuloSeleccionado(articulo) {
    const articuloId = articulo.id;
    const precioSeleccionado = articulo.precio1;
    articulo.precio = this.carrito.eliminarPuntoPrecio(precioSeleccionado);

    const index = this.listaArticulosSeleccionados.findIndex(
      (id) => id === articuloId,
    );

    const elemento = this.todosLosArticulos.find((e) => e.id == articuloId);

    if (!elemento) return;

    if (index === -1) {
      this.carrito.agregarArticulo(articulo, 1);
      this.listaArticulosSeleccionados.push(articulo.id);
      this.incrementarGrupo(
        this.listaGruposSeleccionados.rubros,
        articulo.id_rubro,
      );

      this.incrementarGrupo(
        this.listaGruposSeleccionados.marcas,
        articulo.id_marca,
      );

      this.incrementarGrupo(
        this.listaGruposSeleccionados.proveedores,
        articulo.id_proveedor,
      );
    } else {
      this.carrito.eliminarArticulo(articulo.id);
      this.listaArticulosSeleccionados.splice(index, 1);
      this.decrementarGrupo(
        this.listaGruposSeleccionados.rubros,
        articulo.id_rubro,
      );

      this.decrementarGrupo(
        this.listaGruposSeleccionados.marcas,
        articulo.id_marca,
      );

      this.decrementarGrupo(
        this.listaGruposSeleccionados.proveedores,
        articulo.id_proveedor,
      );
    }

    if (this.listaArticulosSeleccionados.length > 0) {
      this.botonCarrito.classList.remove("hidden");
    } else {
      this.botonCarrito.classList.add("hidden");
    }
    this.cantidadArticulosCarrito.textContent =
      this.listaArticulosSeleccionados.length;
  }

  incrementarGrupo(grupo, id) {
    grupo[id] = (grupo[id] || 0) + 1;
  }

  decrementarGrupo(grupo, id) {
    if (!grupo[id]) return;

    grupo[id]--;

    if (grupo[id] === 0) {
      delete grupo[id];
    }
  }

  abrirModalCarrito() {
    this.modalCarrito = new ModalCarrito(
      this.carrito,
      this.empresa,
      (idEliminado) => {
        this.removerSeleccionVisual(idEliminado);
      },
      () => {
        this.carrito.vaciarCarrito();
        this.listaArticulosSeleccionados = [];
        this.borrarSeleccion();
        this.cantidadArticulosCarrito.textContent = 0;
        this.botonCarrito.classList.add("hidden");
      },
      this.horarios,
      this.empresa.tieneCarrito,
      this.empresa.incluirHorarios,
      this.empresa.pedidosFueraHorario,
      this.carritoSinPedidos,
      this.esInterno,
    );
    this.listaCentral.classList.add("hidden");
    this.modalCarrito.abrirModalCarrito();
  }

  borrarSeleccion() {
    this.mostrarArticulos(this.todosLosArticulos);
    this.volverAtras();
    this.barraBusqueda.value = "";
    this.botonBorrarBusquedaNombre.classList.add("hidden");
  }

  removerSeleccionVisual(idArticulo) {
    idArticulo = Number(idArticulo);
    this.listaArticulosSeleccionados = this.listaArticulosSeleccionados.filter(
      (id) => id !== idArticulo,
    );

    this.cantidadArticulosCarrito.textContent =
      this.listaArticulosSeleccionados.length;

    if (this.listaArticulosSeleccionados.length === 0) {
      this.botonCarrito.classList.add("hidden");
    }

    this.decrementarGrupo(
      this.listaGruposSeleccionados.rubros,
      this.todosLosArticulos.find((a) => a.id === idArticulo)?.id_rubro,
    );

    this.decrementarGrupo(
      this.listaGruposSeleccionados.marcas,
      this.todosLosArticulos.find((a) => a.id === idArticulo)?.id_marca,
    );

    this.decrementarGrupo(
      this.listaGruposSeleccionados.proveedores,
      this.todosLosArticulos.find((a) => a.id === idArticulo)?.id_proveedor,
    );

    this.botonListaArticulos.click();
  }

  eventClickVolver(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.volverAtras();
    return;
  }

  toSegments(diaIndex, apertura, cierre) {
    const startMin = diaIndex * this.MINUTOS_DIA + this.timeToMinutes(apertura);
    let endMin = diaIndex * this.MINUTOS_DIA + this.timeToMinutes(cierre);

    if (this.timeToMinutes(cierre) <= this.timeToMinutes(apertura)) {
      endMin += this.MINUTOS_DIA;
    }

    return [{ start: startMin, end: endMin }];
  }

  overlap(a, b) {
    return a.start < b.end && b.start < a.end;
  }

  formatearFechaCompleta(fechaISO) {
    if (!fechaISO) return null;
    const fecha = String(fechaISO).trim();
    const partesNumericas = fecha.match(/\d+/g) || [];

    if (partesNumericas.length === 3) {
      const [a, b, c] = partesNumericas;
      let dd = "";
      let mm = "";
      let yyyy = "";

      if (a.length === 4) {
        yyyy = a;
        mm = b;
        dd = c;
      } else {
        dd = a;
        mm = b;
        yyyy = c;
      }

      const ddNorm = String(parseInt(dd, 10)).padStart(2, "0");
      const mmNorm = String(parseInt(mm, 10)).padStart(2, "0");
      const yyyyNorm = String(parseInt(yyyy, 10)).padStart(4, "0");
      if (!this.esFechaCompletaValida(ddNorm, mmNorm, yyyyNorm)) return null;
      return `${ddNorm}/${mmNorm}/${yyyyNorm}`;
    }

    if (/^\d{8}$/.test(fecha)) {
      const dd = fecha.slice(0, 2);
      const mm = fecha.slice(2, 4);
      const yyyy = fecha.slice(4, 8);
      if (!this.esFechaCompletaValida(dd, mm, yyyy)) return null;
      return `${dd}/${mm}/${yyyy}`;
    }

    return null;
  }

  esFechaCompletaValida(dia, mes, anio) {
    const dd = Number(dia);
    const mm = Number(mes);
    const yyyy = Number(anio);
    if (
      !Number.isInteger(dd) ||
      !Number.isInteger(mm) ||
      !Number.isInteger(yyyy)
    )
      return false;
    if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return false;
    if (yyyy < 1000 || yyyy > 9999) return false;

    const fecha = new Date(yyyy, mm - 1, dd);
    return (
      fecha.getFullYear() === yyyy &&
      fecha.getMonth() + 1 === mm &&
      fecha.getDate() === dd
    );
  }

  timeToMinutes(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  }

  eventClickTelefono() {
    navigator.clipboard.writeText(this.empresa.telefono).then(() => {
      const numero = this.empresa.telefono.replace(/[^0-9]/g, "");
      const esMovil = /Android|iPhone/i.test(navigator.userAgent);
      const url = esMovil
        ? `https://wa.me/${numero}`
        : `https://web.whatsapp.com/send?phone=${numero}`;
      window.open(url, "_blank");
    });
  }

  modalConfirmacion(texto, callbackConfirmar) {
    const modal = document.createElement("div");

    modal.classList.add("modal");

    modal.innerHTML = `
      <div class="modal-box">
        <p>${texto}</p>

        <div class="modal-actions">
          <button id="cancelar" class="boton-modal">Cancelar</button>
          <button id="confirmar" class="boton-modal">Confirmar</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector("#confirmar").addEventListener("click", () => {
      callbackConfirmar();
      modal.remove();
    });

    modal.querySelector("#cancelar").addEventListener("click", () => {
      modal.remove();
    });
  }

  abrirMenu() {
    const modalMenu = document.getElementById("modal-menu");
    modalMenu.classList.toggle("hidden");
    const menu = document.getElementById("contenedor-menu");
    this.clickFueraCerrar(modalMenu);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const pantalla = new PantallaCliente();
  await pantalla.init();
  await pantalla.habilitarVentanaPrincipal();
  if (!window.history.state || window.history.state.vistaCarta !== "home") {
    window.history.replaceState(
      { vistaCarta: "home" },
      "",
      window.location.href,
    );
  }

  let ultimaPosicionScroll = 0;

  window.addEventListener("scroll", () => {
    header = document.getElementById("header");
    tituloPagina = document.getElementById("titulo-pagina");
    imagenHeader = document.getElementById("imagen-header");
    infoExtra = document.getElementById("info-extra");
    const posicionActual = window.scrollY;

    if (20 > posicionActual) {
      header.classList.remove("minimizado");
      tituloPagina.classList.remove("minimizado");
      imagenHeader.classList.remove("minimizado");
      infoExtra.classList.remove("minimizado");
      infoExtra.classList.remove("oculto");
    } else {
      header.classList.add("minimizado");
      tituloPagina.classList.add("minimizado");
      imagenHeader.classList.add("minimizado");
      infoExtra.classList.add("oculto");
    }

    ultimaPosicionScroll = posicionActual;
  });
});
