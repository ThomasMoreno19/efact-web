class PantallaCliente {
  constructor() {
    // Inicializamos el Gestor y los elementos del DOM
    this.header = document.getElementById("header");
    this.imagenHeader = document.getElementById("imagen-header");
    this.tituloPagina = document.getElementById("titulo-pagina");
    this.botonVolver = document.getElementById("boton-volver");
    this.infoExtra = document.getElementById("info-extra");
    this.gestor = new GestorCliente();
    this.listaArticulos = document.getElementById("lista-articulos");
    this.listaRubros = document.getElementById("lista-rubros");
    this.barraBusqueda = document.getElementById("barra-busqueda");
    this.contenedorBarraBusqueda = document.getElementById(
      "contenedor-busqueda",
    );
    this.onBuscarGeneral = this.filtrarArticulos.bind(this);
    this.onBuscarRubro = null;
    this.onClickVolver = this.eventClickVolver.bind(this);
    this.onClickTelefono = this.eventClickTelefono.bind(this);
    this.onClickModalCarrito = this.abrirModalCarrito.bind(this);
    this.onPopState = this.eventPopState.bind(this);
    this.tituloRubros = document.getElementById("titulo-rubros");
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
    this.clonesSeleccionados = [];
    this.todosLosRubros = [];
    this.enVistaRubro = false;
    this.carritoSinPedidos = new URLSearchParams(window.location.search).has(
      "soloPresupuesto",
    );
    this.botonEscaner = document.getElementById("boton-escaner");

    this.MINUTOS_DIA = 1440;

    this.agregarEventListeners();
  }

  async init() {
    const data = await this.gestor.conocerEmpresa(this.conocerSlug(2));
    this.empresa = new EmpresaVista(data);
    if (this.carritoSinPedidos) {
      this.botonEscaner.classList.remove("hidden");
      this.escanear();
    }
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

    try {
      this.horarios = await this.gestor.obtenerHorarios(this.empresa.id);
    } catch (error) {
      console.warn("No se pudieron cargar horarios/no laborables:", error);
      this.horarios = { horarios: [] };
    }

    const textoAdicional = "- Carta";
    this.horarios = await this.gestor.obtenerHorarios(this.empresa.id);

    await this.mostrarLogoEmpresa();
    await this.empresa.asignarIconoYPagina(textoAdicional);
  }

  agregarEventListeners() {
    this.limpiarBusqueda();
    this.barraBusqueda.removeEventListener("input", this.onBuscarGeneral);
    this.barraBusqueda.addEventListener("input", this.onBuscarGeneral);

    this.botonVolver.removeEventListener("click", this.onClickVolver);
    this.botonVolver.addEventListener("click", this.onClickVolver);

    window.removeEventListener("popstate", this.onPopState);
    window.addEventListener("popstate", this.onPopState);
  }

  async habilitarVentanaPrincipal() {
    // Cargar y mostrar los rubros y artículos
    this.loader.classList.remove("hidden");
    this.tituloRubros.classList.add("hidden");
    this.barraBusqueda.classList.add("hidden");
    this.contenedorBarraBusqueda.classList.add("hidden");
    this.listaArticulos.classList.add("hidden");
    this.listaRubros.classList.add("hidden");
    this.botonVolver.classList.add("hidden");
    this.carrito.vaciarCarrito();
    this.botonCarrito.classList.add("hidden");

    await this.mostrarTodo();
    this.aplicarColoresAlternados(this.listaArticulos);
    this.loader.classList.add("hidden");
    this.tituloRubros.classList.remove("hidden");
    this.barraBusqueda.classList.remove("hidden");
    this.contenedorBarraBusqueda.classList.remove("hidden");
    this.listaArticulos.classList.remove("hidden");
    this.listaRubros.classList.remove("hidden");
  }

  async escanear() {
    if (this._escanerInicializado) return;
    this._procesandoEscaneo = false;
    this._escanerInicializado = true;

    let html5QrCode = null;
    const boton = document.getElementById("boton-escaner");
    const contenedor = document.getElementById("contenedor-camara");
    const btnCerrar = document.getElementById("cerrar-camara");

    if (btnCerrar) {
      btnCerrar.textContent = "✕";
    }

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
          () => {
            /* Ignorar errores de frame individual */
          },
        );
      } catch (err) {
        console.error("Error detallado:", err);
        contenedor.style.display = "none";
        alert("No se pudo acceder a la cámara: " + err.message);
      }
    });
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
        const codigoArticulo = String(a.dataset.articuloId || "")
          .trim()
          .replace(/\s+/g, "");
        return codigoArticulo === codigoBuscado;
      }) || null
    );
  }

  mostrarModalArticuloEscaneado(elemento) {
    // Evitar duplicados
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
    if (!this.listaArticulos || !this.listaRubros) return;
    try {
      // Limpiar las listas antes de cargar nuevos datos
      this.listaRubros.innerHTML = "";
      this.listaArticulos.innerHTML = "";
      this.todosLosArticulos = [];

      // Obtener la lista de todos los rubros
      const rubrosRecibidos = await this.gestor.mostrarListaRubros(
        this.empresa.id,
      );

      // Si no hay rubros, mostrar mensaje y salir
      if (rubrosRecibidos.length === 0) {
        this.listaArticulos.innerHTML = `<p class="texto-vacio"> No se encontraron artículos. </p>`;
        return;
      }

      // 1. Generar la lista de rubros como botones y guardar las referencias
      rubrosRecibidos.forEach((rubro) => {
        const rubroVista = new RubroVista(rubro);
        const rubroBoton = rubroVista.mostrarUno(true); // 'mostrarUno' ahora actúa como un botón
        rubroBoton.onclick = () => {
          this.barraBusqueda.value = "";
          this.tituloRubros.classList.add("hidden");
          this.filtrarArticulosPorRubro(rubro.id);
          this.cambiarHeaderPorRubro(rubro.nombre, rubro.logo_url);
        };
        this.listaRubros.appendChild(rubroBoton);
        this.todosLosRubros.push(rubroBoton);
      });

      const articulosRecibidos =
        await this.gestor.mostrarListaArticulosPorEmpresa(this.empresa.id);
      const articulosPorRubro = articulosRecibidos.reduce((acc, articulo) => {
        const idRubro = String(articulo.id_rubro);
        if (!acc[idRubro]) {
          acc[idRubro] = [];
        }
        acc[idRubro].push(articulo);
        return acc;
      }, {});

      // 2. Generar la lista de artículos agrupados por rubro
      for (const rubro of rubrosRecibidos) {
        const id_rubro = rubro["id"];

        // Crear el contenedor para el rubro
        const containerRubro = document.createElement("div");
        containerRubro.classList.add("container-rubro");
        containerRubro.classList.add("hidden");
        containerRubro.dataset.rubroId = id_rubro; // Asignar el ID del rubro para filtrar

        // Obtener la lista de artículos para el rubro actual (ya cargada en bloque)
        const listaArticulosRecibidos =
          articulosPorRubro[String(id_rubro)] || [];

        const listaArticulosDiv = document.createElement("div");
        listaArticulosDiv.classList.add("lista-articulos-rubro");

        if (listaArticulosRecibidos.length > 0) {
          listaArticulosRecibidos.forEach((articulo) => {
            const articuloRecibido = new ArticuloVista(articulo);
            const elementoArticulo = articuloRecibido.mostrarUna(
              null,
              true,
              this.empresa.imagenesEnArticulos,
            );

            // Guardar el código en dataset para búsqueda por scanner
            elementoArticulo.dataset.codigo =
              articulo.codigo || articulo.codigo_carta || "";

            listaArticulosDiv.appendChild(elementoArticulo);
            this.todosLosArticulos.push(elementoArticulo);
          });
        } else {
          const noArticulosMsg = document.createElement("p");
          noArticulosMsg.textContent = "No hay artículos en este rubro.";
          listaArticulosDiv.appendChild(noArticulosMsg);
        }

        containerRubro.appendChild(listaArticulosDiv);
        this.listaArticulos.appendChild(containerRubro);
        this.listaArticulos.classList.add("hidden");
      }
    } catch (error) {
      console.error("Error en mostrarTodo:", error);
      this.listaArticulos.innerHTML = `<p class="texto-error"> Error al cargar los datos: ${error.message}. Por favor, recargue la página. </p>`;
    }
  }

  // Al clickear un rubro, mostrar los artículos de ese rubro
  filtrarArticulosPorRubro(idRubroSeleccionado) {
    this.registrarNavegacionRubro(idRubroSeleccionado);
    this.limpiarBusqueda();
    this.botonVolver.classList.remove("hidden");
    this.barraBusqueda.classList.remove("hidden");
    this.contenedorBarraBusqueda.classList.remove("hidden");
    this.listaRubros.classList.add("hidden");
    this.listaArticulos.classList.remove("hidden");

    // Ocultar todos los contenedores de rubros
    document.querySelectorAll(".container-rubro").forEach((containerRubro) => {
      if (containerRubro.dataset.rubroId !== idRubroSeleccionado.toString())
        containerRubro.classList.add("hidden");
      else containerRubro.classList.remove("hidden");
    });

    // Crear y registrar el nuevo listener para este rubro
    this.onBuscarRubro = () =>
      this.filtrarArticulosEnRubro(idRubroSeleccionado);
    this.barraBusqueda.removeEventListener("input", this.onBuscarRubro);
    this.barraBusqueda.addEventListener("input", this.onBuscarRubro);
  }

  limpiarBusqueda() {
    if (this.onBuscarGeneral) {
      this.barraBusqueda.removeEventListener("input", this.onBuscarGeneral);
    }
    if (this.onBuscarRubro) {
      this.barraBusqueda.removeEventListener("input", this.onBuscarRubro);
      this.onBuscarRubro = null;
    }
  }

  filtrarArticulos() {
    this.tituloRubros.classList.add("hidden");
    const textoBusqueda = this.normalizarTexto(this.barraBusqueda.value);

    if (textoBusqueda.length === 0) {
      this.tituloRubros.classList.remove("hidden");
      this.restaurarVistaOriginal();
      return;
    }

    this.ocultarRubrosYPrepararLista();

    const listaPlana = this.crearListaPlana(textoBusqueda);
    this.listaArticulos.appendChild(listaPlana);

    this.aplicarColoresAlternados(listaPlana);
  }

  /* Restaura la vista original (rubros visibles, sin búsqueda activa) */
  restaurarVistaOriginal() {
    // Mostrar todo nuevamente
    this.todosLosArticulos.forEach((articulo) =>
      articulo.classList.remove("hidden"),
    );
    document
      .querySelectorAll(".container-rubro")
      .forEach((container) => container.classList.remove("hidden"));

    // Volver a mostrar la vista inicial
    this.listaArticulos.classList.add("hidden");
    this.listaRubros.classList.remove("hidden");
    this.botonVolver.classList.add("hidden");

    // Eliminar cualquier lista plana residual
    const listaPlana = this.listaArticulos.querySelector(".lista-plana");
    if (listaPlana) listaPlana.remove();

    this.aplicarColoresAlternados(this.todosLosArticulos);
  }

  /* Oculta rubros y prepara el contenedor principal */
  ocultarRubrosYPrepararLista() {
    this.listaRubros.classList.add("hidden");
    this.botonVolver.classList.remove("hidden");
    this.listaArticulos.classList.remove("hidden");

    document
      .querySelectorAll(".container-rubro")
      .forEach((c) => c.classList.add("hidden"));

    const listaPlanaAnterior =
      this.listaArticulos.querySelector(".lista-plana");
    if (listaPlanaAnterior) listaPlanaAnterior.remove();
  }

  crearListaPlana(textoBusqueda) {
    const listaPlana = document.createElement("div");
    listaPlana.classList.add("lista-plana");

    this.todosLosArticulos.forEach((articulo) => {
      const nombre = this.normalizarTexto(articulo.dataset.nombre || "");
      if (!nombre.includes(textoBusqueda)) return;

      const clon = articulo.cloneNode(true);
      if (clon.dataset.no_procesado === "0") {
        clon.addEventListener("click", () => {
          this.clonesSeleccionados.push(clon);
          const id = Number(clon.dataset.articuloId);
          if (!this.listaArticulosSeleccionados.includes(id)) {
            clon.classList.add("seleccionado");
            this.listaArticulosSeleccionados.push(id);
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
      }

      listaPlana.appendChild(clon);
    });

    return listaPlana;
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

  /* Filtra artículos dentro de un rubro específico según la barra de búsqueda */
  filtrarArticulosEnRubro(idRubroSeleccionado) {
    const textoBusqueda = this.normalizarTexto(this.barraBusqueda.value);

    if (textoBusqueda.length === 0) {
      // Si no hay texto, solo mostramos el rubro seleccionado
      this.mostrarSoloRubro(idRubroSeleccionado);
      return;
    }

    this.ocultarRubrosYPrepararLista();

    const containerRubro = this.obtenerContainerRubro(idRubroSeleccionado);
    if (!containerRubro) return;
    const articulosRubro = this.obtenerArticulosDeRubro(containerRubro);
    const articulosFiltrados = articulosRubro.filter((articulo) => {
      const nombre = this.normalizarTexto(articulo.dataset.nombre);
      return nombre.includes(textoBusqueda);
    });

    const listaPlana = this.crearListaPlanaDesdeArticulos(
      articulosFiltrados,
      "No se encontraron artículos de este rubro con el texto buscado.",
    );
    this.mostrarListaPlana(listaPlana);
    this.aplicarColoresAlternados(listaPlana);
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

  /* Muestra únicamente el rubro seleccionado sin filtrar artículos */
  mostrarSoloRubro(idRubroSeleccionado) {
    this.listaRubros.classList.add("hidden");
    this.botonVolver.classList.remove("hidden");
    this.listaArticulos.classList.remove("hidden");

    // Ocultar todos los demás rubros
    document.querySelectorAll(".container-rubro").forEach((c) => {
      if (c.dataset.rubroId === idRubroSeleccionado.toString()) {
        c.classList.remove("hidden");
      } else {
        c.classList.add("hidden");
      }
    });

    // Eliminar cualquier lista plana previa
    const listaPlanaAnterior =
      this.listaArticulos.querySelector(".lista-plana");
    if (listaPlanaAnterior) listaPlanaAnterior.remove();

    // Aplicar colores alternados al rubro visible
    const container = this.obtenerContainerRubro(idRubroSeleccionado);
    if (container) this.aplicarColoresAlternados(container);
  }

  /* Inserta la lista plana en el DOM y elimina la anterior si existía */
  mostrarListaPlana(listaPlana) {
    const listaPlanaAnterior =
      this.listaArticulos.querySelector(".lista-plana");
    if (listaPlanaAnterior) listaPlanaAnterior.remove();

    this.listaArticulos.appendChild(listaPlana);
  }

  volverAtras() {
    this.enVistaRubro = false;
    this.limpiarBusqueda();

    // Hide the back button and search bar
    this.botonVolver.classList.add("hidden");
    this.listaArticulos.classList.add("hidden");
    this.listaRubros.classList.remove("hidden");
    this.tituloRubros.classList.remove("hidden");

    // Hide ALL article containers
    document.querySelectorAll(".container-rubro").forEach((container) => {
      container.classList.remove("hidden");
    });

    if (this.headerOriginal) {
      this.infoExtra.classList.remove("hidden");
      this.tituloPagina.textContent = this.headerOriginal.titulo;
      this.imagenHeader.src = this.headerOriginal.logo;
      this.imagenHeader.style.opacity = "1";
      delete this.headerOriginal; // limpiar
    }

    this.agregarEventListeners();
  }

  conocerSlug(texto) {
    const url_segmentada = window.location.pathname.split("/");
    const slug = url_segmentada[texto];
    return slug;
  }

  async mostrarLogoEmpresa() {
    try {
      // 1. Mostrar el logo de la empresa
      if (this.empresa.logo_url) {
        this.imagenHeader.src = this.empresa.logo_url;
      }

      // 2. Mostrar el nombre de la empresa en el título
      if (this.tituloPagina && this.empresa.nombre) {
        this.tituloPagina.textContent = this.empresa.nombre;
      }

      // 3. Mostrar ubicación y teléfono en info-extra
      if (this.infoExtra) {
        let infoHTML = "";

        if (this.empresa.ubicacion) {
          infoHTML += `<span class="info-ubicacion">📍 ${this.empresa.ubicacion}</span>`;
        }

        if (this.empresa.telefono) {
          // Icono SVG de WhatsApp (color verde oficial)
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
      if (this.tituloPagina) this.tituloPagina.textContent = "Carta";
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
      .normalize("NFD") // Descompone caracteres con tildes
      .replace(/[\u0300-\u036f]/g, "") // Elimina marcas diacríticas (tildes)
      .toLowerCase(); // Convierte a minúsculas
  }

  cambiarHeaderPorRubro(nombreRubro, logoRubro) {
    // Guardar estado original si no existe
    if (!this.headerOriginal) {
      this.headerOriginal = {
        titulo: this.tituloPagina.textContent,
        logo: this.imagenHeader.src,
      };
    }
    this.infoExtra.classList.add("hidden");

    // Cambiar título
    this.tituloPagina.textContent = nombreRubro;

    // Cambiar logo (con fallback)
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

    // Buscar si ya está seleccionado
    const index = this.listaArticulosSeleccionados.findIndex(
      (id) => id === articuloId,
    );

    // Buscar el elemento del DOM correspondiente
    const elemento = this.todosLosArticulos.find(
      (e) => e.dataset.articuloId == articuloId,
    );

    if (!elemento) return;

    if (index === -1) {
      // No está seleccionado → agregar
      this.carrito.agregarArticulo(articulo, 1);
      this.listaArticulosSeleccionados.push(articulo.id);
      elemento.classList.add("seleccionado");
    } else {
      // Ya estaba seleccionado → eliminar
      this.carrito.eliminarArticulo(articulo.id);
      this.listaArticulosSeleccionados.splice(index, 1);
      elemento.classList.remove("seleccionado");
      elemento.classList.remove("pulse");
    }

    if (this.listaArticulosSeleccionados.length > 0) {
      this.botonCarrito.classList.remove("hidden");
    } else {
      this.botonCarrito.classList.add("hidden");
    }
    this.cantidadArticulosCarrito.textContent =
      this.listaArticulosSeleccionados.length;
  }

  articuloSeleccionadoPorId(idArticulo) {
    const articulo = this.todosLosArticulos.find(
      (a) => a.dataset.articuloId == idArticulo,
    );
    articulo.precio1 = this.carrito.eliminarPuntoPrecio(articulo.precio1);
    const index = this.listaArticulosSeleccionados.findIndex((id) => {
      id === articulo.dataset.id;
    });

    if (index === -1) {
      this.carrito.agregarArticulo(articulo, 1);
      this.listaArticulosSeleccionados.push(articulo.dataset.articuloId);
      articulo.classList.add("seleccionado");
    } else {
      this.carrito.eliminarArticulo(articulo.dataset.articuloId);
      this.listaArticulosSeleccionados.splice(index, 1);
      articulo?.classList.remove("seleccionado", "pulse");
      this.removerSeleccionVisual(articulo.dataset.articuloId);
    }

    this.cantidadArticulosCarrito.textContent =
      this.listaArticulosSeleccionados.length;
    this.botonCarrito.classList.toggle(
      "hidden",
      this.listaArticulosSeleccionados.length === 0,
    );
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
      this.carritoSinPedidos,
    );
    this.listaCentral.classList.add("hidden");
    this.modalCarrito.abrirModalCarrito();
  }

  borrarSeleccion() {
    this.todosLosArticulos.forEach((articulo) => {
      articulo.classList.remove("seleccionado");
      articulo.classList.remove("pulse");
    });
    this.volverAtras();
    this.barraBusqueda.value = "";
  }

  removerSeleccionVisual(idArticulo) {
    idArticulo = Number(idArticulo);
    // sacar de listaArticulosSeleccionados
    this.listaArticulosSeleccionados = this.listaArticulosSeleccionados.filter(
      (id) => id !== idArticulo,
    );

    const clon = this.clonesSeleccionados.find(
      (c) => c.dataset.articuloId == idArticulo,
    );
    if (clon) {
      clon.classList.remove("seleccionado");
      clon.classList.remove("pulse");
      this.clonesSeleccionados = this.clonesSeleccionados.filter(
        (c) => c.dataset.articuloId != idArticulo,
      );
    }
    // quitar clase 'seleccionado' del DOM
    const elemento = this.todosLosArticulos.find(
      (e) => e.dataset.articuloId == idArticulo,
    );

    if (elemento) {
      elemento.classList.remove("seleccionado");
      elemento.classList.remove("pulse");
    }

    // actualizar contador del carrito
    this.cantidadArticulosCarrito.textContent =
      this.listaArticulosSeleccionados.length;
    // ocultar botón si no quedan artículos
    if (this.listaArticulosSeleccionados.length === 0) {
      this.botonCarrito.classList.add("hidden");
    }
  }

  /* Aplica colores alternados a los artículos visibles */
  aplicarColoresAlternados(lista) {
    let articulos = [];

    if (Array.isArray(lista)) {
      // Si es un array de elementos ya obtenidos
      articulos = lista;
    } else if (lista instanceof HTMLElement) {
      // Si es un contenedor del DOM
      articulos = Array.from(lista.querySelectorAll(".articulo"));
    } else {
      console.warn("aplicarColoresAlternados: argumento no válido", lista);
      return;
    }

    articulos.forEach((a, i) => {
      a.classList.toggle("fondo-par", i % 2 === 0);
      a.classList.toggle("fondo-impar", i % 2 === 1);
    });
  }

  eventClickVolver() {
    if (this.enVistaRubro && window.history.state?.vistaCarta === "rubro") {
      window.history.back();
      return;
    }

    this.restaurarVistaOriginal();
    this.barraBusqueda.value = "";
    this.volverAtras();
  }

  registrarNavegacionRubro(idRubro) {
    if (window.history.state?.vistaCarta === "rubro") {
      window.history.replaceState(
        { vistaCarta: "rubro", idRubro },
        "",
        window.location.href,
      );
    } else {
      window.history.pushState(
        { vistaCarta: "rubro", idRubro },
        "",
        window.location.href,
      );
    }

    this.enVistaRubro = true;
  }

  eventPopState() {
    if (!this.enVistaRubro) return;

    this.restaurarVistaOriginal();
    this.barraBusqueda.value = "";
    this.volverAtras();
  }

  // Devuelve segmentos en "timeline semanal"
  // Ej: Lunes 19:00-02:00 => [{start:1140, end:1560}]
  toSegments(diaIndex, apertura, cierre) {
    const startMin = diaIndex * this.MINUTOS_DIA + this.timeToMinutes(apertura);
    let endMin = diaIndex * this.MINUTOS_DIA + this.timeToMinutes(cierre);

    // Si cierre <= apertura => cruza medianoche
    if (this.timeToMinutes(cierre) <= this.timeToMinutes(apertura)) {
      endMin += this.MINUTOS_DIA;
    }

    return [{ start: startMin, end: endMin }];
  }

  // Detecta si dos rangos se pisan
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
}

// --- Inicialización ---
// Se crea una instancia de PantallaCliente cuando el DOM está listo
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
    botonVolver = document.getElementById("boton-volver");
    const posicionActual = window.scrollY;

    if (20 > posicionActual) {
      header.classList.remove("minimizado");
      tituloPagina.classList.remove("minimizado");
      imagenHeader.classList.remove("minimizado");
      botonVolver.classList.remove("minimizado");
      infoExtra.classList.remove("minimizado");
      infoExtra.classList.remove("oculto");
    } else {
      header.classList.add("minimizado");
      tituloPagina.classList.add("minimizado");
      imagenHeader.classList.add("minimizado");
      botonVolver.classList.add("minimizado");
      infoExtra.classList.add("oculto");
    }

    ultimaPosicionScroll = posicionActual;
  });
});
