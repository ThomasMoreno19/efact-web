class PantallaModerador {
  constructor() {
    this.gestor = new GestorModerador();
    this.listaArticulos = document.getElementById("lista-articulos");
    this.listaRubros = document.getElementById("lista-rubros");
    this.listaProveedores = document.getElementById("lista-proveedores");
    this.listaMarcas = document.getElementById("lista-marcas");
    this.listaOfertas = document.getElementById("lista-ofertas");
    this.listaCentral = document.getElementById("lista-central");
    this.horariosGuardados = [];
    this.horarios = [];
    this.MINUTOS_DIA = 1440;

    this.botonListaArticulos = document.getElementById(
      "boton-mostrar-articulos",
    );
    this.botonListaRubros = document.getElementById("boton-mostrar-rubros");
    this.botonCargarArticulos = document.getElementById(
      "boton-cargar-articulos",
    );

    this.botonActualizarArticulos = document.getElementById(
      "boton-actualizar-articulos",
    );

    this.botonListaProveedores = document.getElementById(
      "boton-mostrar-proveedores",
    );

    this.botonListaMarcas = document.getElementById("boton-mostrar-marcas");

    this.botonListaOfertas = document.getElementById("boton-mostrar-ofertas");

    this.botonModificarCafeteria = document.getElementById(
      "modificar-cafeteria",
    );

    this.barraBusqueda = document.getElementById("barra-busqueda");
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

    this.filtros = {
      nombre: "",
      codigoProveedor: "",
      codigoInterno: "",
      abreviatura: "",
    };
    this.tituloPagina = document.getElementById("titulo-pagina");
    this.loader = document.getElementById("loader");
    window.gestorDeArticulosCallback = (articulo) =>
      this.abrirModalModificarArticulo(articulo);

    this.agregarEventListeners();
    this.todosLosArticulos = [];
    this.arrayContainerRubro = [];

    this.todosLosRubros = [];
    this.todasLasMarcas = [];
    this.todosLosProveedores = [];

    window.addEventListener("scroll", this.handleScroll.bind(this));
  }

  async init() {
    const data = await this.gestor.conocerEmpresa(this.obtenerIdEmpresa());
    this.empresa = new EmpresaVista(data);
    if (this.empresa.deshabilitarExcel) {
      this.botonCargarArticulos.classList.add("hidden");
      this.botonActualizarArticulos.classList.add("hidden");
    }

    try {
      this.horarios = await this.gestor.obtenerHorarios(this.empresa.id);
      window.eliminarVideoArticulo = (articulo) => {
        this.eliminarVideoArticulo(articulo);
      };

      window.eliminarVideoRubro = (rubro) => {
        this.eliminarVideoRubro(rubro);
      };
    } catch (error) {
      this.horariosGuardados = [];
      console.warn(
        "No se pudieron cargar los horarios o días no laborales previos.",
        error,
      );
    }

    await this.asignarTituloPagina("Gestión de");
  }

  insertarLoader(modalPadre) {
    if (!modalPadre) return;

    modalPadre.innerHTML = `
      <div class="loader-container">
        <div class="spinner"></div>
        <p>Cargando...</p>
      </div>
    `;
  }

  mensajeError(modalPadre, mensaje) {
    modalPadre.innerHTML = `
      <div class="exito-error-container">
        <img src="../../../../Archivos/Iconos/error.svg" alt="Error Icon" class="icon" id="error-icon" height="50" width="50"/>
        <h2 id="error-title">¡Algo ha salido mal!</h2>
        <p>${mensaje}</p>
      </div>
    `;
  }

  mensajeExitoso(modalPadre, mensaje) {
    modalPadre.innerHTML = `
      <div class="exito-error-container">
        <img src="../../../../Archivos/Iconos/check.svg" alt="Exitoso Icon" class="icon" id="exitoso-icon" height="50" width="50"/>
        <h2 id="exitoso-title">¡Operación exitosa!</h2>
        <p>${mensaje}</p>
      </div>
    `;
  }

  agregarEventListeners() {
    this.botonCargarArticulos.addEventListener("click", () => {
      if (this.empresa.deshabilitarExcel) return;
      this.abrirModalCargarArticulos();
    });

    this.botonActualizarArticulos.addEventListener("click", () => {
      this.abrirModalActualizarArticulos();
    });

    this.botonModificarCafeteria.addEventListener("click", (event) => {
      event.preventDefault();
      this.configurarEmpresa();
    });
  }

  async habilitarVentanaPrincipal(tipo = "articulo") {
    this.barraBusqueda.classList.add("hidden");
    this.barraBusquedaCodigoInterno.classList.add("hidden");
    this.barraBusquedaCodigoProveedor.classList.add("hidden");
    this.contenedorBarraBusqueda.classList.add("hidden");
    this.contenedorBarraBusquedaCodigoInterno.classList.add("hidden");
    this.contenedorBarraBusquedaCodigoProveedor.classList.add("hidden");
    this.loader.classList.remove("hidden");
    await this.mostrarLista(tipo);
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

    this.botonListaRubros.onclick = () => this.mostrarTipo("rubros");
    this.botonListaMarcas.onclick = () => this.mostrarTipo("marcas");
    this.botonListaArticulos.onclick = () => this.mostrarTipo("articulos");
    this.botonListaOfertas.onclick = () => this.mostrarTipo("ofertas");
    this.botonListaProveedores.onclick = () => this.mostrarTipo("proveedores");

    this.botonListaArticulos.click();
  }

  clickFuera(modal) {
    let clickEmpezoAfuera = false;

    modal.addEventListener("mousedown", (event) => {
      clickEmpezoAfuera = event.target === modal;
    });

    modal.addEventListener("mouseup", (event) => {
      const clickTerminoAfuera = event.target === modal;

      if (clickEmpezoAfuera && clickTerminoAfuera) {
        document.body.removeChild(modal);
      }
    });
  }

  async mostrarLista(tipo = null) {
    try {
      this.listaRubros.innerHTML = "";
      this.listaArticulos.innerHTML = "";
      this.listaProveedores.innerHTML = "";
      this.listaMarcas.innerHTML = "";
      this.listaOfertas.innerHTML = "";
      const listaGrupos = await this.gestor.mostrarListaGrupos(this.empresa.id);

      this.todosLosRubros = listaGrupos.rubros ?? [];
      if (this.todosLosRubros.length === 0)
        this.botonListaRubros.classList.add("hidden");
      else this.botonListaRubros.classList.remove("hidden");

      this.todasLasMarcas = listaGrupos.marcas ?? [];
      if (this.todasLasMarcas.length === 0)
        this.botonListaMarcas.classList.add("hidden");
      else this.botonListaMarcas.classList.remove("hidden");

      this.todosLosProveedores = listaGrupos.proveedores ?? [];
      if (this.todosLosProveedores.length === 0)
        this.botonListaProveedores.classList.add("hidden");
      else this.botonListaProveedores.classList.remove("hidden");

      this.todosLosArticulos =
        await this.gestor.mostrarListaArticulosPorEmpresa(this.empresa.id);

      this.todasLasOfertas = this.todosLosArticulos.filter(
        (articulo) => articulo.oferta,
      );
      if (this.todasLasOfertas.length === 0)
        this.botonListaOfertas.classList.add("hidden");
      else this.botonListaOfertas.classList.remove("hidden");

      if (tipo) this.mostrarTipo(tipo);
      else this.mostrarTipo("articulo");
    } catch (error) {
      console.error("Error en mostrarLista:", error);
    }
  }

  mostrarTipo(tipo) {
    this.listaRubros.classList.add("hidden");
    this.listaMarcas.classList.add("hidden");
    this.listaProveedores.classList.add("hidden");
    this.listaArticulos.classList.add("hidden");
    this.listaOfertas.classList.add("hidden");

    this.contenedoresBarraCodigos.classList.add("hidden");

    this.botonListaRubros.classList.remove("activo");
    this.botonListaMarcas.classList.remove("activo");
    this.botonListaProveedores.classList.remove("activo");
    this.botonListaOfertas.classList.remove("activo");
    this.botonListaArticulos.classList.remove("activo");

    switch (tipo) {
      case "rubros":
        this.mostrarRubro("");
        this.listaRubros.classList.remove("hidden");
        this.botonListaRubros.classList.add("activo");

        this.barraBusqueda.oninput = () =>
          this.buscarPorNombre(this.barraBusqueda.value, "rubro");
        break;

      case "marcas":
        this.mostrarMarca("");
        this.listaMarcas.classList.remove("hidden");
        this.botonListaMarcas.classList.add("activo");

        this.barraBusqueda.oninput = () =>
          this.buscarPorNombre(this.barraBusqueda.value, "marca");
        break;

      case "proveedores":
        this.mostrarProveedor("");
        this.listaProveedores.classList.remove("hidden");
        this.botonListaProveedores.classList.add("activo");

        this.barraBusqueda.oninput = () =>
          this.buscarPorNombre(this.barraBusqueda.value, "proveedor");
        break;

      case "articulos":
        this.listaArticulos.classList.remove("hidden");
        this.contenedoresBarraCodigos.classList.remove("hidden");
        this.botonListaArticulos.classList.add("activo");

        this.barraBusqueda.oninput = () =>
          this.buscarPorNombre(this.barraBusqueda.value);
        this.actualizarArticulos();
        break;

      case "ofertas":
        this.mostrarOferta("");
        this.listaOfertas.classList.remove("hidden");
        this.botonListaOfertas.classList.add("activo");
        this.barraBusqueda.oninput = () =>
          this.buscarPorNombre(this.barraBusqueda.value, "oferta");
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
    this.actualizarArticulos();
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

  mostrarRubro(valor) {
    this.botonListaRubros.classList.add("activo");
    this.listaRubros.classList.remove("hidden");

    window.history.pushState({ vista: "rubros" }, "", window.location.href);
    this.listaRubros.innerHTML = "";

    const palabras = valor.toLowerCase().trim().split(/\s+/).filter(Boolean);

    const rubros = this.todosLosRubros.filter((r) => {
      const nombre = (r.nombre ?? "").toLowerCase();

      return palabras.every((palabra) => nombre.includes(palabra));
    });

    rubros.forEach((rubro) => {
      const vista = new RubroVista(rubro);
      const elemento = vista.mostrarUno(true);
      elemento.onclick = () => this.abrirModalModificarRubro(vista);

      this.listaRubros.appendChild(elemento);
    });
  }

  mostrarProveedor(valor) {
    this.botonListaProveedores.classList.add("activo");
    this.listaProveedores.classList.remove("hidden");

    window.history.pushState(
      { vista: "proveedores" },
      "",
      window.location.href,
    );
    this.listaProveedores.innerHTML = "";

    const palabras = valor.toLowerCase().trim().split(/\s+/).filter(Boolean);

    const proveedores = this.todosLosProveedores.filter((p) => {
      const nombre = (p.nombre ?? "").toLowerCase();

      return palabras.every((palabra) => nombre.includes(palabra));
    });

    proveedores.forEach((proveedor) => {
      const vista = new ProveedorVista(proveedor);
      const elemento = vista.mostrarUno(true);
      elemento.onclick = () => this.abrirModalModificarProveedor(vista);

      this.listaProveedores.appendChild(elemento);
    });
  }

  mostrarMarca(valor) {
    this.botonListaMarcas.classList.add("activo");
    this.listaMarcas.classList.remove("hidden");

    window.history.pushState({ vista: "marcas" }, "", window.location.href);
    this.listaMarcas.innerHTML = "";

    const palabras = valor.toLowerCase().trim().split(/\s+/).filter(Boolean);

    const marcas = this.todasLasMarcas.filter((m) => {
      const nombre = (m.nombre ?? "").toLowerCase();

      return palabras.every((palabra) => nombre.includes(palabra));
    });

    marcas.forEach((marca) => {
      const vista = new MarcaVista(marca);
      const elemento = vista.mostrarUno(true);
      elemento.onclick = () => this.abrirModalModificarMarca(vista);

      this.listaMarcas.appendChild(elemento);
    });
  }

  mostrarOferta(valor) {
    this.botonListaOfertas.classList.add("activo");
    this.listaOfertas.classList.remove("hidden");

    window.history.pushState({ vista: "ofertas" }, "", window.location.href);
    this.listaOfertas.innerHTML = "";

    const palabras = valor.toLowerCase().trim().split(/\s+/).filter(Boolean);

    const ofertas = this.todasLasOfertas.filter((m) => {
      const nombre = (m.nombre ?? "").toLowerCase();

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
  actualizarArticulos() {
    this.articulosActuales = [];
    let articulos = [...this.todosLosArticulos];
    this.botonListaArticulos.classList.add("activo");

    this.listaArticulos.classList.add("hidden");

    // ==========================
    // BÚSQUEDA POR CÓDIGO INTERNO
    // ==========================
    const codigoInterno = this.filtros.codigoInterno.trim();
    const nombre = this.filtros.nombre.trim().toLowerCase();
    const codigoProveedor = this.filtros.codigoProveedor.trim();

    if (codigoInterno !== "") {
      articulos = articulos.filter(
        (a) => String(a.codigo_interno ?? "") === codigoInterno,
      );

      this.mostrarArticulos(articulos);
      return;
    }

    // ==================
    // BÚSQUEDA POR NOMBRE
    // ==================

    if (nombre !== "") {
      const palabras = nombre.split(/\s+/).filter(Boolean);

      articulos = articulos.filter((a) => {
        const nombreArticulo = (a.nombre ?? "").toLowerCase();

        return palabras.every((palabra) => nombreArticulo.includes(palabra));
      });
    }

    // =============================
    // BÚSQUEDA CÓDIGO PROVEEDOR
    // =============================

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

      this.listaArticulos.appendChild(
        vista.mostrarUna(1, true, this.empresa.imagenesEnArticulos),
      );
    }

    this.indiceActual = fin;
  }

  abrirModalModificarArticulo(articulo) {
    if (!articulo) return;
    const modal = articulo.modalModificar();
    document.body.appendChild(modal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });

    const botonSubirVideo = document.getElementById(
      "boton-subir-video-articulo",
    );
    botonSubirVideo.addEventListener("click", () => {
      this.abrirModalSubirVideoArticulo(articulo);
      document.body.removeChild(modal);
    });

    const botonEliminar = document.getElementById("eliminar-articulo");
    botonEliminar.addEventListener("click", () => {
      this.confirmarEliminar(articulo, "articulo");
      document.body.removeChild(modal);
    });

    const form = modal.querySelector("#form-modificar-articulo");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      let imagen = formData.get("imagen");
      if (!imagen || imagen.size === 0) {
        imagen = null;
      }

      try {
        await this.gestor.modificarArticulo(
          articulo.id,
          articulo.id_rubro,
          this.empresa.id,
          formData.get("nombre"),
          formData.get("precio1"),
          imagen,
        );

        document.body.removeChild(modal);
        await this.habilitarVentanaPrincipal();
      } catch (error) {
        alert("Error al modificar: " + error.message);
      }
    });
  }

  async confirmarEliminar(entidad, tipo) {
    if (
      confirm(
        "Seguro que desea eliminar?",
        tipo === "articulo"
          ? ""
          : "Se eliminarán todos los artículos asociados.",
      )
    ) {
      const respuesta = await this.gestor.eliminarEntidad(
        entidad.id,
        tipo,
        this.empresa.id,
      );

      if (respuesta?.success) {
        await this.mostrarLista();
        this.botonListaArticulos.click();
      }
    }
  }

  abrirModalModificarRubro(rubro) {
    const modal = rubro.modalModificar();
    document.body.appendChild(modal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });

    const botonEliminar = document.getElementById("eliminar-rubro");
    botonEliminar.addEventListener("click", () => {
      this.confirmarEliminar(rubro, "rubro");
      document.body.removeChild(modal);
    });

    const form = modal.querySelector("#form-modificar-rubro");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      let imagen = formData.get("imagen");
      if (!imagen || imagen.size === 0) {
        imagen = null;
      }

      try {
        await this.gestor.modificarRubro(
          rubro.id,
          this.empresa.id,
          formData.get("nombre"),
          imagen,
          rubro.logo_url,
        );

        document.body.removeChild(modal);
        await this.habilitarVentanaPrincipal("rubro");
      } catch (error) {
        alert("Error al modificar: " + error.message);
      }
    });
  }

  abrirModalModificarMarca(marca) {
    const modal = marca.modalModificar();
    document.body.appendChild(modal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });

    const botonEliminar = document.getElementById("eliminar-marca");
    botonEliminar.addEventListener("click", () => {
      this.confirmarEliminar(marca, "marca");
      document.body.removeChild(modal);
    });

    const form = modal.querySelector("#form-modificar-marca");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      let imagen = formData.get("imagen");
      if (!imagen || imagen.size === 0) {
        imagen = null;
      }

      try {
        await this.gestor.modificarMarca(
          marca.id,
          this.empresa.id,
          formData.get("nombre"),
          imagen,
          marca.logo_url,
        );

        document.body.removeChild(modal);
        await this.habilitarVentanaPrincipal("marca");
      } catch (error) {
        alert("Error al modificar: " + error.message);
      }
    });
  }

  abrirModalModificarProveedor(proveedor) {
    const modal = proveedor.modalModificar();
    document.body.appendChild(modal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });

    const botonEliminar = document.getElementById("eliminar-proveedor");
    botonEliminar.addEventListener("click", () => {
      this.confirmarEliminar(proveedor, "proveedor");
      document.body.removeChild(modal);
    });

    const form = modal.querySelector("#form-modificar-proveedor");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      let imagen = formData.get("imagen");
      if (!imagen || imagen.size === 0) {
        imagen = null;
      }

      try {
        await this.gestor.modificarProveedor(
          proveedor.id,
          this.empresa.id,
          formData.get("nombre"),
          imagen,
          proveedor.logo_url,
        );

        document.body.removeChild(modal);
        await this.habilitarVentanaPrincipal("proveedor");
      } catch (error) {
        alert("Error al modificar: " + error.message);
      }
    });
  }

  abrirModalCargarArticulos() {
    const modal = this.modalCargarArticulos();
    document.body.appendChild(modal);

    this.clickFuera(modal);

    const modalContent = modal.querySelector(".modal-content-partial");

    const form = document.getElementById("form-cargar");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const archivoInput = document.getElementById("archivo");
      const archivo = archivoInput.files[0];

      this.mostrarConfirmacionSincronizacion(async () => {
        try {
          this.insertarLoader(modalContent);

          await this.gestor.cargarListaArticulos(archivo, this.empresa.id);

          this.mensajeExitoso(modalContent, "Artículos cargados exitosamente.");

          this.loader.classList.remove("hidden");
          this.listaRubros.classList.add("hidden");
          this.listaArticulos.classList.add("hidden");

          await this.mostrarLista();

          this.loader.classList.add("hidden");
          this.listaArticulos.classList.remove("hidden");
        } catch (error) {
          this.mensajeError(modalContent, error);
        }
      });
    });
  }

  // Método auxiliar para crear el HTML del modal
  modalCargarArticulos() {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
      <div class="modal-content-partial">
      <span class="close-modal-btn" style="position: absolute; top: 5px; right: 5px; cursor: pointer; font-size: 30px;">&times;</span>
        <h2>Excel</h2>
        
        <form id="form-cargar">

          <div id="dropzone" class="dropzone">
            <div class="drop-content">
              <img src="../../../../Archivos/Iconos/excel.svg" alt="Upload Icon" class="icon" height="50" width="50"/>
              <p>Arrastrá tu archivo aquí o hacé click</p>
            </div>

            <input type="file" id="archivo" name="archivo"
              accept=".csv,.xlsx,.xls" hidden required>
          </div>

          <div id="file-preview" class="file-preview hidden"></div>

          <button type="submit" class="submit-button disabled" id="boton-cargar">Enviar</button>

        </form>
      </div>
    `;
    const dropzone = modal.querySelector("#dropzone");
    const input = modal.querySelector("#archivo");
    const preview = modal.querySelector("#file-preview");

    function accionBotonCargar(estado) {
      const boton = document.querySelector("#boton-cargar");

      if (!boton) return;

      boton.disabled = !estado;

      if (estado) {
        boton.classList.remove("disabled");
      } else {
        boton.classList.add("disabled");
      }
    }

    // Click abre selector
    dropzone.addEventListener("click", () => input.click());

    // Drag events
    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.classList.add("dragover");
    });

    dropzone.addEventListener("dragleave", () => {
      dropzone.classList.remove("dragover");
    });

    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.classList.remove("dragover");

      const file = e.dataTransfer.files[0];
      input.files = e.dataTransfer.files;

      mostrarArchivo(file);
    });

    // Cambio manual
    input.addEventListener("change", () => {
      const file = input.files[0];
      mostrarArchivo(file);
    });

    // Mostrar info
    function mostrarArchivo(file) {
      if (!file) return;

      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      const validExtensions = /\.(xls|xlsx)$/i;

      if (!validTypes.includes(file.type) && !validExtensions.test(file.name)) {
        preview.classList.remove("hidden");
        preview.innerHTML =
          "<strong>❌ Archivo inválido. Solo se permiten .xls o .xlsx</strong>";

        input.value = "";
        accionBotonCargar(false);
        return;
      }

      preview.classList.remove("hidden");
      preview.innerHTML = `
      <div class="file-info">
        <strong>${file.name}</strong>
        <strong>
          ${(file.size / 1024).toFixed(2)} KB
        </strong>
      </div>
      `;
      accionBotonCargar(true);
    }

    const closeBtn = modal.querySelector(".close-modal-btn");
    closeBtn.addEventListener("click", () => {
      modal.remove();
    });

    return modal;
  }

  mostrarConfirmacionSincronizacion(onConfirm) {
    const confirmModal = document.createElement("div");
    confirmModal.classList.add("modal");

    confirmModal.innerHTML = `
    <div class="modal-content-partial confirm-modal">

      <p class="confirm-message">
        Esta acción sincronizará los datos del archivo Excel con el catálogo actual.
        <br><br>
        <strong>Los artículos que no estén presentes en el Excel serán eliminados del catálogo.</strong>
        <br><br>
      </p>

      <div class="confirm-actions">
        <button id="cancelar-confirmacion" class="boton-modal-confirmacion">
          Cancelar
        </button>

        <button id="confirmar-sincronizacion" class="boton-modal-confirmacion disabled" disabled>
          Continuar (5)
        </button>
      </div>
    </div>
  `;

    document.body.appendChild(confirmModal);

    const btnCancelar = confirmModal.querySelector("#cancelar-confirmacion");
    const btnConfirmar = confirmModal.querySelector(
      "#confirmar-sincronizacion",
    );

    let segundos = 5;

    const intervalo = setInterval(() => {
      segundos--;

      if (segundos <= 0) {
        clearInterval(intervalo);
        btnConfirmar.disabled = false;
        btnConfirmar.classList.remove("disabled");
        btnConfirmar.textContent = "Confirmar";
        return;
      }

      btnConfirmar.textContent = `Confirmar (${segundos})`;
    }, 1000);

    btnCancelar.addEventListener("click", () => {
      clearInterval(intervalo);
      confirmModal.remove();
    });

    btnConfirmar.addEventListener("click", () => {
      clearInterval(intervalo);
      confirmModal.remove();
      onConfirm();
    });
  }

  abrirModalActualizarArticulos() {
    const modal = this.modalActualizarCatalogo();
    document.body.appendChild(modal);

    this.clickFuera(modal);

    const modalContent = modal.querySelector(".modal-content-partial");

    const form = modal.querySelector("#form-actualizar");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const archivo = modal.querySelector("#archivo").files[0];

      const hojasSeleccionadas = {};

      modal.querySelectorAll(".btn-hoja").forEach((boton) => {
        hojasSeleccionadas[boton.dataset.hoja] =
          boton.classList.contains("activo-hoja");
      });

      if (!Object.values(hojasSeleccionadas).some(Boolean)) {
        this.mensajeError(
          modalContent,
          new Error("Debe seleccionar al menos una hoja."),
        );
        return;
      }

      try {
        this.insertarLoader(modalContent);

        await this.gestor.actualizarCatalogo(
          archivo,
          this.empresa.id,
          hojasSeleccionadas,
        );

        this.mensajeExitoso(
          modalContent,
          "Catálogo actualizado correctamente.",
        );

        this.loader.classList.remove("hidden");
        this.listaRubros.classList.add("hidden");
        this.listaArticulos.classList.add("hidden");

        await this.mostrarLista();

        this.loader.classList.add("hidden");
        this.listaArticulos.classList.remove("hidden");
      } catch (error) {
        this.mensajeError(modalContent, error);
      }
    });
  }

  modalActualizarCatalogo() {
    const modal = document.createElement("div");

    modal.classList.add("modal");

    modal.innerHTML = `
    <div class="modal-content-partial">

      <span class="close-modal-btn"
        style="position:absolute;top:5px;right:5px;cursor:pointer;font-size:30px;">
        &times;
      </span>

      <h2>Actualizar Catálogo</h2>

      <form id="form-actualizar">

        <h4 class="modal-actualizar">Seleccione las hojas a actualizar</h4>

        <div class="hojas-container">

          <button
              type="button"
              class="btn-hoja activo-hoja"
              data-hoja="articulos">
              Artículos
          </button>

          <button
              type="button"
              class="btn-hoja"
              data-hoja="proveedores">
              Proveedores
          </button>

          <button
              type="button"
              class="btn-hoja"
              data-hoja="rubros">
              Rubros
          </button>

          <button
              type="button"
              class="btn-hoja"
              data-hoja="marcas">
              Marcas
          </button>

        </div>

        <div id="dropzone" class="dropzone">

          <div class="drop-content">

            <img
              src="../../../../Archivos/Iconos/excel.svg"
              class="icon"
              width="50"
              height="50"
            />

            <p>Arrastrá tu archivo aquí o hacé click</p>

          </div>

          <input
            type="file"
            id="archivo"
            accept=".xls,.xlsx"
            hidden
            required
          >

        </div>

        <div
          id="file-preview"
          class="file-preview hidden"
        ></div>

        <button
          type="submit"
          id="boton-actualizar"
          class="submit-button disabled"
          disabled
        >
          Actualizar
        </button>

      </form>

    </div>
  `;

    const dropzone = modal.querySelector("#dropzone");
    const input = modal.querySelector("#archivo");
    const preview = modal.querySelector("#file-preview");
    const boton = modal.querySelector("#boton-actualizar");

    const botones = modal.querySelectorAll(".btn-hoja");

    botones.forEach((boton) => {
      boton.addEventListener("click", () => {
        boton.classList.toggle("activo-hoja");
      });
    });

    function habilitarBoton(habilitado) {
      boton.disabled = !habilitado;
      boton.classList.toggle("disabled", !habilitado);
    }

    function mostrarArchivo(file) {
      if (!file) {
        habilitarBoton(false);
        return;
      }

      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      const validExtensions = /\.(xls|xlsx)$/i;

      if (!validTypes.includes(file.type) && !validExtensions.test(file.name)) {
        preview.classList.remove("hidden");
        preview.innerHTML =
          "<strong>❌ Archivo inválido. Solo se permiten .xls o .xlsx</strong>";

        input.value = "";

        habilitarBoton(false);

        return;
      }

      preview.classList.remove("hidden");

      preview.innerHTML = `
      <div class="file-info">
        <strong>${file.name}</strong>
        <strong>${(file.size / 1024).toFixed(2)} KB</strong>
      </div>
    `;

      habilitarBoton(true);
    }

    dropzone.addEventListener("click", () => input.click());

    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.classList.add("dragover");
    });

    dropzone.addEventListener("dragleave", () => {
      dropzone.classList.remove("dragover");
    });

    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();

      dropzone.classList.remove("dragover");

      input.files = e.dataTransfer.files;

      mostrarArchivo(e.dataTransfer.files[0]);
    });

    input.addEventListener("change", () => {
      mostrarArchivo(input.files[0]);
    });

    modal.querySelector(".close-modal-btn").addEventListener("click", () => {
      modal.remove();
    });

    return modal;
  }

  abrirModalSubirVideoArticulo(articulo) {
    const modal = articulo.modalSubirVideoArticulo();
    document.body.appendChild(modal);

    this.clickFuera(modal);

    const modalContent = modal.querySelector(".modal-content-partial");

    const form = document.getElementById("form-cargar-video");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const archivoInput = document.getElementById("archivo-video");
      const archivo = archivoInput.files[0];

      try {
        this.insertarLoader(modalContent);

        const respuesta = await this.gestor.subirVideoArticulo(
          archivo,
          articulo.id,
          this.empresa.id,
          articulo.video_url,
        );

        this.mensajeExitoso(modalContent, "Video/GIF cargado exitosamente.");

        this.loader.classList.remove("hidden");
        this.listaArticulos.classList.add("hidden");
        await this.mostrarLista();
        this.loader.classList.add("hidden");
        this.listaArticulos.classList.remove("hidden");
      } catch (error) {
        this.mensajeError(modalContent, error);
      }
    });
  }

  abrirModalSubirVideoRubro(rubro) {
    const modal = rubro.modalSubirVideoRubro();
    document.body.appendChild(modal);

    this.clickFuera(modal);

    const modalContent = modal.querySelector(".modal-content-partial");

    const form = document.getElementById("form-cargar-video");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const archivoInput = document.getElementById("archivo-video");
      const archivo = archivoInput.files[0];

      try {
        this.insertarLoader(modalContent);

        const respuesta = await this.gestor.subirVideoRubro(
          archivo,
          rubro.id,
          this.empresa.id,
          rubro.video_url,
        );

        this.mensajeExitoso(modalContent, "Video/GIF cargado exitosamente.");

        this.loader.classList.remove("hidden");
        this.listaRubros.classList.add("hidden");
        await this.mostrarLista();
        this.loader.classList.add("hidden");
        this.listaRubros.classList.remove("hidden");
      } catch (error) {
        if (error.value == "Error al procesar el archivo:") {
          this.mensajeError(modalContent, error);
        }
      }
    });
  }

  async abrirModalModificar(modalPadre) {
    const moderador = await this.gestor.obtenerModerador(this.empresa.id);
    const modal = this.empresa.modalModificarParaModerador(moderador);
    this.listaCentral.classList.add("hidden");

    document.body.appendChild(modal);
    this.clickFuera(modal);

    document.querySelectorAll(".toggle-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.classList.toggle("active");
        const activo = btn.classList.contains("active");

        if (btn.id === "btnImagenesEnArticulos") {
          document.getElementById("imagenesEnArticulos").value = activo;
        }

        if (btn.id === "btnIncluirHorarios") {
          document.getElementById("incluirHorarios").value = activo;
        }

        if (btn.id === "btnPedidosFueraHorario") {
          document.getElementById("pedidosFueraHorario").value = activo;
        }

        if (btn.id === "btnIncluirCodigoBarra") {
          document.getElementById("incluirCodigoBarra").value = activo;
        }
      });
    });

    const botonCerrar = document.getElementById("cerrar-wrapper");
    botonCerrar.addEventListener("click", () => {
      modal.classList.add("hidden");
      document.body.removeChild(modal);
      document.body.appendChild(modalPadre);
      this.listaCentral.classList.remove("hidden");
    });

    const botonVaciarContrasenaInternos = document.getElementById(
      "vaciar-contrasena-interno",
    );
    botonVaciarContrasenaInternos.addEventListener("click", () => {
      this.ConfirmarVaciarContrasenaInternos();
    });

    const botonVaciarContrasenaExternos = document.getElementById(
      "vaciar-contrasena-externo",
    );
    botonVaciarContrasenaExternos.addEventListener("click", () => {
      this.ConfirmarVaciarContrasenaExternos();
    });

    const form = document.getElementById("formModificarEmpresa");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const nombre = formData.get("nombre");
      const telefono = formData.get("telefono");
      const ubicacion = formData.get("ubicacion");
      const imagenesEnArticulos =
        formData.get("imagenesEnArticulos") === "true";
      const incluirHorarios = formData.get("incluirHorarios") === "true";
      const pedidosFueraHorario =
        formData.get("pedidosFueraHorario") === "true";
      const incluirCodigoBarra = formData.get("incluirCodigoBarra") === "true";
      const usuario = formData.get("usuario");
      const contrasena = formData.get("contrasena");
      const contrasenaInternos = formData.get("contrasenaInternos");
      const contrasenaExternos = formData.get("contrasenaExternos");
      const imagen = formData.get("imagen");

      try {
        await this.gestor.modificarModerador(moderador.id, usuario, contrasena);
        await this.gestor.modificarEmpresa(
          this.empresa.id,
          nombre,
          telefono,
          ubicacion,
          imagenesEnArticulos,
          incluirHorarios,
          pedidosFueraHorario,
          incluirCodigoBarra,
          contrasenaInternos,
          contrasenaExternos,
        );
        if (imagen && imagen.size > 0) {
          const empresaConNuevoLogo = await this.gestor.cambiarLogoEmpresa(
            this.empresa.id,
            imagen,
            nombre,
          );
          if (empresaConNuevoLogo?.logo_url) {
            this.empresa.logo_url = empresaConNuevoLogo.logo_url;
          }
        }
        this.empresa.update(
          nombre,
          telefono,
          ubicacion,
          imagenesEnArticulos,
          incluirHorarios,
          pedidosFueraHorario,
          incluirCodigoBarra,
        );
        this.mostrarLista();
        modal.classList.add("hidden");
        document.body.removeChild(modal);
        this.listaCentral.classList.remove("hidden");
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    });
  }

  ConfirmarVaciarContrasenaInternos() {
    if (
      confirm(
        "¿Estás seguro de que deseas vaciar la contraseña de los usuarios internos? Esta acción no se puede deshacer.",
      )
    ) {
      this.gestor.vaciarContrasenaInternos(this.empresa.id);
    }
  }

  ConfirmarVaciarContrasenaExternos() {
    if (
      confirm(
        "¿Estás seguro de que deseas vaciar la contraseña de los usuarios externos? Esta acción no se puede deshacer.",
      )
    ) {
      this.gestor.vaciarContrasenaExternos(this.empresa.id);
    }
  }

  async configurarEmpresa() {
    const modal = this.empresa.modalConfigurarEmpresa();

    document.body.appendChild(modal);
    const botonEliminar = document.getElementById("btn-eliminar-empresa");
    botonEliminar.classList.add("hidden");
    const idEmpresa = document.getElementById("id-empresa");
    idEmpresa.classList.add("hidden");
    const botonSecccionModificar = document.getElementById("seccion-modificar");
    const botonConfigurarHorarios = document.getElementById(
      "configurar-horarios",
    );

    this.clickFuera(modal);
    botonSecccionModificar.addEventListener("click", async (event) => {
      event.preventDefault();
      await this.abrirModalModificar(modal);
      document.body.removeChild(modal);
    });

    botonConfigurarHorarios.addEventListener("click", async (event) => {
      event.preventDefault();
      await this.abrirModalConfigurarHorarios(modal);
      document.body.removeChild(modal);
    });
  }

  async abrirModalConfigurarHorarios() {
    const modal = this.empresa.modalConfigurarHorarios();
    this.listaCentral.classList.add("hidden");

    document.body.appendChild(modal);

    this.horariosGuardados = Array.isArray(this.horarios.horarios)
      ? this.horarios.horarios.map((h) => {
          const diaIndex = Number(h.diaIndex);

          return {
            ...h,
            dia: DIAS_SEMANA[diaIndex] || "",
            nombre: NOMBRE_DIAS[diaIndex] || "",
            rangos: Array.isArray(h.rangos) ? h.rangos : [],
          };
        })
      : [];

    this.renderHorariosEnModal(modal);

    const botonCerrar = document.getElementById("cerrar-wrapper");

    if (botonCerrar) {
      botonCerrar.addEventListener("click", (e) => {
        e.preventDefault();

        const hayHorarios =
          this.horarios.horarios.length !== this.horariosGuardados.length;

        if (hayHorarios) {
          const seguro = confirm(
            "¿Estás seguro de que querés salir?\nSe borrará tu progreso.",
          );

          if (!seguro) return;
        }

        this.listaCentral.classList.remove("hidden");
        modal.classList.add("hidden");
        document.body.removeChild(modal);
      });
    }

    const botonesDias = modal.querySelectorAll(".toggle-btn");

    botonesDias.forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.classList.toggle("active");
      });
    });

    const form = document.getElementById("formConfigurarHorariosEmpresa");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const horaApertura = document.getElementById("horaApertura").value;
      const horaCierre = document.getElementById("horaCierre").value;

      if (!horaApertura || !horaCierre) {
        alert("Tenés que elegir hora de apertura y cierre");
        return;
      }

      const botonesActivos = modal.querySelectorAll(".toggle-btn.active");

      if (botonesActivos.length === 0) {
        alert("Tenés que seleccionar al menos un día");
        return;
      }

      const nuevosHorarios = Array.from(botonesActivos).map((btn) => {
        const diaNombre = btn.textContent.trim();

        const diaIndex = DIAS_SEMANA.indexOf(diaNombre);
        const nombreDia = NOMBRE_DIAS[diaIndex];

        return {
          dia: diaNombre,
          nombre: nombreDia,
          diaIndex,
          apertura: horaApertura,
          cierre: horaCierre,
        };
      });

      const horariosExistentesPlano = this.aplanarHorariosGuardados();

      const error = this.validarNoSuperposicion(
        nuevosHorarios,
        horariosExistentesPlano,
      );

      if (error) {
        alert("No se puede guardar: ese horario pisa otro.");
        return;
      }

      nuevosHorarios.forEach((nuevo) => {
        const existente = this.horariosGuardados.find(
          (h) => h.diaIndex === nuevo.diaIndex,
        );

        if (existente) {
          existente.rangos.push({
            apertura: nuevo.apertura,
            cierre: nuevo.cierre,
          });
        } else {
          this.horariosGuardados.push({
            dia: nuevo.dia,
            nombre: nuevo.nombre,
            diaIndex: nuevo.diaIndex,
            rangos: [
              {
                apertura: nuevo.apertura,
                cierre: nuevo.cierre,
              },
            ],
          });
        }
      });

      botonesActivos.forEach((btn) => btn.classList.remove("active"));
      document.getElementById("horaApertura").value = "";
      document.getElementById("horaCierre").value = "";

      this.renderHorariosEnModal(modal);
    });

    const btnGuardar = modal.querySelector("#btnGuardarHorarios");
    btnGuardar.addEventListener("click", async () => {
      if (!this.horariosGuardados || this.horariosGuardados.length === 0) {
        alert("No hay horarios cargados para guardar.");
        return;
      }

      const horarios = this.horariosGuardados.map((d) => ({
        diaIndex: d.diaIndex,
        dia: d.dia,
        rangos: d.rangos.map((r) => ({
          apertura: r.apertura,
          cierre: r.cierre,
        })),
      }));

      try {
        await this.gestor.guardarHorarios(horarios, this.empresa.id);
        alert("Horarios guardados correctamente ✔️");
        this.horarios = await this.gestor.obtenerHorarios(this.empresa.id);
        this.horariosGuardados = Array.isArray(this.horarios.horarios)
          ? this.horarios.horarios.map((h) => {
              const diaIndex = Number(h.diaIndex);

              return {
                ...h,
                dia: DIAS_SEMANA[diaIndex] || "",
                nombre: NOMBRE_DIAS[diaIndex] || "",
                rangos: Array.isArray(h.rangos) ? h.rangos : [],
              };
            })
          : [];
        this.renderHorariosEnModal(modal);
      } catch (error) {
        alert(`Error guardando horarios: ${error.message}`);
      }
    });
  }

  dateToIndex(fecha) {
    if (typeof fecha !== "string") {
      throw new Error(`Fecha inválida: ${fecha}`);
    }

    const [d, m, y] = fecha.split("/").map(Number);

    if (
      Number.isNaN(d) ||
      Number.isNaN(m) ||
      Number.isNaN(y) ||
      m < 1 ||
      m > 12 ||
      d < 1 ||
      d > 31
    ) {
      throw new Error(`Formato de fecha inválido: ${fecha}`);
    }

    const timestamp = Date.UTC(y, m - 1, d);

    return Math.floor(timestamp / 60000);
  }

  formatearFechaCompleta(fechaISO) {
    if (!fechaISO) return null;
    const fecha = String(fechaISO).trim();
    const partesNumericas = fecha.match(/\d+/g) || [];

    // Soporta DD/MM/YYYY, DD-MM-YYYY, DDMMYYYY, y YYYY-MM-DD.
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

  confirmarAnioSiCorresponde(fechas) {
    const anioActual = new Date().getFullYear();
    let anio = null;
    const hayAnioDistinto = (fechas || []).some((fechaInput) => {
      const fecha = this.formatearFechaCompleta(fechaInput);
      if (!fecha) return false;
      anio = Number(fecha.split("/")[2]);
      return anio !== anioActual;
    });

    if (!hayAnioDistinto) return true;
    return confirm(
      `La fecha que quiere registrar pertenece al año ${anio}, está seguro que desea registrarlo?`,
    );
  }

  volverAtras() {
    // Show the list of rubros
    this.listaArticulos.classList.remove("hidden");
  }

  obtenerIdEmpresa() {
    const url_segmentada = window.location.pathname.split("/");
    const ultimo_slug = url_segmentada[url_segmentada.length - 1];
    return ultimo_slug;
  }

  async asignarTituloPagina(texto) {
    try {
      this.tituloPagina.innerHTML = `${texto} ${this.empresa.nombre}`;
      document.title = `E-Fact - ${this.empresa.nombre}`;
    } catch (error) {
      console.error("Error al asignar el título de la página:", error);
      this.tituloPagina.innerHTML = `<p>Error al cargar el título.</p>`;
    }
  }

  normalizarTexto(texto) {
    return texto
      .normalize("NFD") // Descompone caracteres con tildes
      .replace(/[\u0300-\u036f]/g, "") // Elimina marcas diacríticas (tildes, acentos, etc.)
      .toLowerCase(); // Convierte a minúsculas
  }

  renderHorariosEnModal(modal) {
    const contenedor = modal.querySelector("#listaHorariosRegistrados");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    const btnGuardar = modal.querySelector("#btnGuardarHorarios");

    // Si no hay horarios
    if (
      !Array.isArray(this.horariosGuardados) ||
      this.horariosGuardados.length === 0
    ) {
      contenedor.innerHTML = `<p style="opacity:0.6; text-align:center;">
        Todavía no cargaste horarios.
      </p>`;

      if (btnGuardar) btnGuardar.classList.add("disabled");
      return;
    }

    if (btnGuardar) btnGuardar.classList.remove("disabled");

    // Ordenar por día
    const ordenados = [...this.horariosGuardados].sort(
      (a, b) => Number(a.diaIndex) - Number(b.diaIndex),
    );

    for (const dia of ordenados) {
      const card = document.createElement("div");
      card.classList.add("horario-card");

      // 👇 por si rangos viene null o undefined
      const rangos = Array.isArray(dia.rangos) ? dia.rangos : [];

      const rangosOrdenados = [...rangos].sort((a, b) =>
        (a.apertura || "").localeCompare(b.apertura || ""),
      );

      const rangosHTML = rangosOrdenados
        .map(
          (r) => `
            <div class="horario-linea">Apertura: ${r.apertura}</div>
            <div class="horario-linea cierre">Cierre: ${r.cierre}</div>
          `,
        )
        .join("");

      card.innerHTML = `
        <button type="button" class="btn-eliminar-horario" data-diaindex="${dia.diaIndex}">
          ✖
        </button>

        <div class="horario-dia">${dia.nombre || dia.dia || `Día ${dia.diaIndex}`}</div>
        ${rangosHTML}
      `;

      contenedor.appendChild(card);
    }

    // Listener eliminar
    contenedor.querySelectorAll(".btn-eliminar-horario").forEach((btn) => {
      btn.addEventListener("click", () => {
        const diaIndex = Number(btn.dataset.diaindex);

        this.horariosGuardados = this.horariosGuardados.filter(
          (h) => Number(h.diaIndex) !== diaIndex,
        );

        this.renderHorariosEnModal(modal);
      });
    });
  }
  timeToMinutes(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
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

  validarNoSuperposicion(nuevosHorarios, horariosExistentes) {
    const existentesSeg = [];
    const nuevosSeg = [];

    // EXISTENTES -> segmentos
    for (const h of horariosExistentes) {
      const segs = this.toSegments(h.diaIndex, h.apertura, h.cierre);

      for (const s of segs) {
        existentesSeg.push({
          dia: h.dia,
          start: s.start,
          end: s.end,
        });
      }
    }

    // NUEVOS -> segmentos
    for (const h of nuevosHorarios) {
      const segs = this.toSegments(h.diaIndex, h.apertura, h.cierre);

      for (const s of segs) {
        nuevosSeg.push({
          dia: h.dia,
          start: s.start,
          end: s.end,
        });
      }
    }

    // Comparar nuevos contra existentes
    for (const nuevo of nuevosSeg) {
      for (const existente of existentesSeg) {
        if (this.overlap(nuevo, existente)) {
          return `El horario de ${nuevo.dia} pisa otro horario existente.`;
        }

        const semana = 7 * this.MINUTOS_DIA;

        const nuevoPlus = {
          start: nuevo.start + semana,
          end: nuevo.end + semana,
        };
        const existentePlus = {
          start: existente.start + semana,
          end: existente.end + semana,
        };

        if (this.overlap(nuevoPlus, existente))
          return `Hay choque de horarios (por cruce semanal).`;
        if (this.overlap(nuevo, existentePlus))
          return `Hay choque de horarios (por cruce semanal).`;
      }
    }

    // Comparar nuevos entre sí
    for (let i = 0; i < nuevosSeg.length; i++) {
      for (let j = i + 1; j < nuevosSeg.length; j++) {
        if (this.overlap(nuevosSeg[i], nuevosSeg[j])) {
          return `Los nuevos horarios se pisan entre sí (${nuevosSeg[i].dia} con ${nuevosSeg[j].dia}).`;
        }
      }
    }

    return null;
  }
  aplanarHorariosGuardados() {
    return this.horariosGuardados.flatMap((dia) =>
      dia.rangos.map((r) => ({
        dia: dia.dia,
        nombre: dia.nombre,
        diaIndex: dia.diaIndex,
        apertura: r.apertura,
        cierre: r.cierre,
      })),
    );
  }

  async eliminarVideoArticulo(articulo) {
    const mensaje = await this.gestor.eliminarVideoArticulo(
      articulo.id,
      articulo.video_url,
      this.empresa.id,
    );
    await this.mostrarLista();
  }

  async eliminarVideoRubro(rubro) {
    await this.gestor.eliminarVideoRubro(
      rubro.id,
      rubro.video_url,
      this.empresa.id,
    );
    await this.mostrarLista();
  }
}

// --- Inicialización ---
// Se crea una instancia de PantallaAdministrador cuando el DOM está listo
document.addEventListener("DOMContentLoaded", async () => {
  const pantalla = new PantallaModerador();
  await pantalla.init();
  pantalla.habilitarVentanaPrincipal();
});
