class ArticuloVista {
  constructor(articulo) {
    const {
      id,
      id_rubro,
      nombre,
      descripcion,
      precio1,
      precio2,
      precio3,
      codigo_carta,
      no_procesado,
      seleccionado = false,
    } = articulo;
    this.id = id;
    this.id_rubro = id_rubro;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio1 = precio1;
    this.precio2 = precio2;
    this.precio3 = precio3;
    this.codigo_carta = codigo_carta;
    this.no_procesado = no_procesado;
    this.seleccionado = seleccionado;
  }

  mostrarUna(precio_activo = 1) {
    const divArticulo = document.createElement("div");
    divArticulo.classList.add("articulo");
    divArticulo.dataset.articuloId = this.id; //🤣😎
    divArticulo.dataset.nombre = this.nombre;
    divArticulo.dataset.descripcion = this.descripcion;
    divArticulo.dataset.precio1 = this.precio1;
    divArticulo.dataset.precio2 = this.precio2;
    divArticulo.dataset.precio3 = this.precio3;

    const infoContainer = document.createElement("div");
    infoContainer.classList.add("articulo-info");

    const pNombre = document.createElement("p");
    pNombre.id = "nombre-articulo";

    // Concatenar código de carta si existe
    if (this.codigo_carta) {
      pNombre.textContent = `${this.nombre} (${this.codigo_carta})`;
    } else {
      pNombre.textContent = this.nombre;
    }

    infoContainer.appendChild(pNombre);

    const precioActual = this[`precio${precio_activo}`] ?? this.precio1;
    const pPrecio = document.createElement("p");
    pPrecio.id = "id-articulo";
    pPrecio.textContent = "$" + precioActual;
    infoContainer.appendChild(pPrecio);

    divArticulo.appendChild(infoContainer);

    if (!this.no_procesado) {
      if (this.descripcion) {
        const pDescripcion = document.createElement("p");
        pDescripcion.textContent = this.descripcion;
        pDescripcion.classList.add("descripcion");

        divArticulo.appendChild(pDescripcion);
      }

      divArticulo.addEventListener("click", () => {
        const event = new CustomEvent("articuloSeleccionado", { detail: this });
        document.dispatchEvent(event);

        divArticulo.classList.toggle("seleccionado");

        // Reinicia animación si ya estaba activa
        divArticulo.classList.remove("pulse");
        void divArticulo.offsetWidth;
        divArticulo.classList.add("pulse");

        if (typeof window.gestorDeArticulosCallback === "function") {
          window.gestorDeArticulosCallback(this);
        }
      });
    } else {
      divArticulo.classList.add("no-procesado");
      console.log(this.nombre + " no procesado: " + this.no_procesado);
    }

    return divArticulo;
  }

  modalConfigurar() {
    const modalConfigurarArticulo = document.createElement("div");
    modalConfigurarArticulo.classList.add("modal");
    modalConfigurarArticulo.id = "modal-configurar-articulo";

    const modalContenido = document.createElement("div");
    modalContenido.classList.add("modal-content-partial");

    const codigoCartaTexto = this.codigo_carta ? ` (${this.codigo_carta})` : "";

    const htmlContent = `
            <form id="form-configurar-articulo">
                <h2 id="nombre-articulo-modal">${this.nombre}${codigoCartaTexto}</h2>
                <p class="descripcion">${this.descripcion || ""}</p>
                <h2 id="id-articulo">$${this.precio1}</h2>
                <h2 id="id-articulo2">$${this.precio2}</h2>
                <h2 id="id-articulo3">$${this.precio3}</h2>
                <button type="button" class="submit-button" id="modificar">Modificar</button>
            </form>`;

    modalContenido.innerHTML = htmlContent;
    modalConfigurarArticulo.appendChild(modalContenido);

    return modalConfigurarArticulo;
  }

  modalModificar() {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.id = "modal-modificar-articulo";

    const contenido = document.createElement("div");
    contenido.classList.add("modal-content-partial");

    // Quitar puntos del precio (si lo guardas con formato 1.234, etc.)
    const precioSinPuntos = this.sacarPuntosPrecio(this.precio1);
    const precioSinPuntos2 = this.sacarPuntosPrecio(this.precio2);
    const precioSinPuntos3 = this.sacarPuntosPrecio(this.precio3);

    contenido.innerHTML = `
            <form id="form-modificar-articulo">
                <h2>Modificar Artículo</h2>
                <div class="form-group">
                    <label for="input-nombre">Nombre:</label>
                    <input type="text" name="nombre" id="input-nombre" value="${this.nombre}" required>
                </div>
                <div class="form-group">
                    <label for="input-codigo-carta">Código de carta:</label>
                    <input type="text" name="codigo-carta" id="input-codigo-carta" value="${this.codigo_carta || ""}">
                </div>
                <div class="form-group">
                    <label for="input-descripcion">Descripción:</label>
                    <input type="text" name="descripcion" id="input-descripcion" value="${this.descripcion || ""}">
                </div>
                <div class="form-group">
                    <label for="input-precio1">Precio 1:</label>
                    <input type="number" name="precio1" id="input-precio1" value="${precioSinPuntos}" required>
                </div>
                <div class="form-group">
                    <label for="input-precio2">Precio 2:</label>
                    <input type="number" name="precio2" id="input-precio2" value="${precioSinPuntos2}" required>
                </div>
                <div class="form-group">
                    <label for="input-precio3">Precio 3:</label>
                    <input type="number" name="precio3" id="input-precio3" value="${precioSinPuntos3}" required>
                </div>
                <button type="submit" class="submit-button">Guardar Cambios</button>
            </form>
        `;

    modal.appendChild(contenido);
    return modal;
  }

  sacarPuntosPrecio(precioConPuntos) {
    return precioConPuntos.replace(/\./g, "");
  }
}
