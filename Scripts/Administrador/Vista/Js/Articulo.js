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
      video_url = null,
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
    this.video_url = video_url;
    this.videoSVG = `<svg height="33px" width="33px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
        viewBox="0 0 512 512"  xml:space="preserve">
      <style type="text/css">
        .st0{fill:#e89e13;}
      </style>
      <g>
        <path class="st0" d="M0,74.451v363.098h512V74.451H0z M71.524,167.241H47.957c-4.215,0-7.633-3.417-7.633-7.632v-42.974
          c0-4.215,3.418-7.631,7.633-7.631h23.566c4.215,0,7.631,3.416,7.631,7.631v42.974C79.154,163.824,75.738,167.241,71.524,167.241z
          M47.957,221.844h23.566c4.215,0,7.631,3.417,7.631,7.633v42.974c0,4.215-3.416,7.632-7.631,7.632H47.957
          c-4.215,0-7.633-3.417-7.633-7.632v-42.974C40.324,225.261,43.742,221.844,47.957,221.844z M47.957,344.758h23.566
          c4.215,0,7.631,3.418,7.631,7.632v42.975c0,4.215-3.416,7.632-7.631,7.632H47.957c-4.215,0-7.633-3.417-7.633-7.632V352.39
          C40.324,348.176,43.742,344.758,47.957,344.758z M198.982,326.856V185.144c0-5.875,6.359-9.547,11.447-6.609l122.725,70.856
          c5.088,2.937,5.088,10.281,0,13.218L210.43,333.465C205.342,336.402,198.982,332.73,198.982,326.856z M464.041,167.241h-23.565
          c-4.215,0-7.633-3.417-7.633-7.632v-42.974c0-4.215,3.418-7.631,7.633-7.631h23.565c4.215,0,7.631,3.416,7.631,7.631v42.974
          C471.672,163.824,468.256,167.241,464.041,167.241z M440.476,221.844h23.565c4.215,0,7.631,3.417,7.631,7.633v42.974
          c0,4.215-3.416,7.632-7.631,7.632h-23.565c-4.215,0-7.633-3.417-7.633-7.632v-42.974
          C432.844,225.261,436.262,221.844,440.476,221.844z M440.476,344.758h23.565c4.215,0,7.631,3.418,7.631,7.632v42.975
          c0,4.215-3.416,7.632-7.631,7.632h-23.565c-4.215,0-7.633-3.417-7.633-7.632V352.39
          C432.844,348.176,436.262,344.758,440.476,344.758z"/>
      </g>
    </svg>`;
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
    divArticulo.dataset.no_procesado = this.no_procesado;

    const infoContainer = document.createElement("div");
    infoContainer.classList.add("articulo-info");

    const pNombre = document.createElement("p");
    pNombre.id = "nombre-articulo";

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

    const container2 = document.createElement("div");
    container2.classList.add("container");

    container2.appendChild(pPrecio);

    // --- NUEVA LÓGICA: Botón para ver Video / GIF ---
    if (this.video_url) {
      const botonVideo = document.createElement("button");
      botonVideo.classList.add("btn-ver-video");
      botonVideo.innerHTML = this.videoSVG;

      botonVideo.addEventListener("click", (e) => {
        e.stopPropagation(); // Evita que se dispare el click del divArticulo (selección/animación)
        this.mostrarModalReproductor(this.video_url);
      });

      container2.appendChild(botonVideo);
    }

    divArticulo.appendChild(container2);

    if (!this.no_procesado) {
      if (this.descripcion) {
        const pDescripcion = document.createElement("p");
        pDescripcion.textContent = this.descripcion;
        pDescripcion.classList.add("descripcion");

        infoContainer.appendChild(pDescripcion);
      }

      divArticulo.addEventListener("click", () => {
        const event = new CustomEvent("articuloSeleccionado", { detail: this });
        document.dispatchEvent(event);

        divArticulo.classList.toggle("seleccionado");

        divArticulo.classList.remove("pulse");
        void divArticulo.offsetWidth;
        divArticulo.classList.add("pulse");

        if (typeof window.gestorDeArticulosCallback === "function") {
          window.gestorDeArticulosCallback(this);
        }
      });

      divArticulo.appendChild(infoContainer);
    } else {
      divArticulo.classList.add("no-procesado");
      divArticulo.appendChild(infoContainer);
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
                <h2 id="id-articulo">Precio 1: $${this.precio1}</h2>
                <h2 id="id-articulo2">Precio 2: $${this.precio2}</h2>
                <h2 id="id-articulo3">Precio 3: $${this.precio3}</h2>
                <button type="button" class="submit-button" id="modificar">Modificar</button>
                <button type="button" class="submit-button" id="boton-subir-video-articulo">Subir video</button>
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

  modalSubirVideoArticulo() {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
    <div class="modal-content-partial">
      <h2>Subir Video o GIF</h2>
      
      <form id="form-cargar-video">

        <div id="dropzone-video" class="dropzone">
          <div class="drop-content">
            <img src="../../../../Archivos/Iconos/video.svg" alt="Upload Icon" class="icon" height="50" width="50"/>
            <p>Arrastrá tu video o GIF aquí o hacé click</p>
          </div>

          <input type="file" id="archivo-video" name="archivo"
            accept="video/mp4,video/quicktime,video/x-msvideo,image/gif,.mp4,.mov,.avi,.gif" hidden required>
        </div>

        <div id="video-preview" class="file-preview hidden"></div>

        <button type="submit" class="submit-button disabled" id="boton-cargar-video">Enviar</button>

      </form>
    </div>
  `;

    const dropzone = modal.querySelector("#dropzone-video");
    const input = modal.querySelector("#archivo-video");
    const preview = modal.querySelector("#video-preview");

    function accionBotonCargar(estado) {
      const boton = modal.querySelector("#boton-cargar-video"); // Mejor buscar dentro del modal
      if (!boton) return;

      boton.disabled = !estado;
      if (estado) {
        boton.classList.remove("disabled");
      } else {
        boton.classList.add("disabled");
      }
    }

    // Eventos de click y arrastre
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

      const file = e.dataTransfer.files[0];
      input.files = e.dataTransfer.files;
      mostrarArchivo(file);
    });

    input.addEventListener("change", () => {
      const file = input.files[0];
      mostrarArchivo(file);
    });

    // Validación y vista previa
    function mostrarArchivo(file) {
      if (!file) return;

      const validTypes = [
        "video/mp4",
        "video/quicktime", // .mov
        "video/x-msvideo", // .avi
        "image/gif",
      ];
      const validExtensions = /\.(mp4|mov|avi|gif)$/i;

      if (!validTypes.includes(file.type) && !validExtensions.test(file.name)) {
        preview.classList.remove("hidden");
        preview.innerHTML =
          "<strong>❌ Archivo inválido. Solo se permiten MP4, MOV, AVI o GIF.</strong>";
        input.value = "";
        accionBotonCargar(false);
        return;
      }

      // Generar vista previa del contenido multimedia
      const fileURL = URL.createObjectURL(file);
      preview.classList.remove("hidden");

      let previewElement = "";
      if (file.type === "image/gif") {
        previewElement = `<img src="${fileURL}" alt="Preview GIF" style="max-width: 100%; max-height: 150px; border-radius: 4px; margin-top: 100px;"/>`;
      } else {
        previewElement = `<video src="${fileURL}" controls style="max-width: 100%; max-height: 150px; border-radius: 4px; margin-top: 10px;"></video>`;
      }

      preview.innerHTML = `
      <div class="file-info">
        ${previewElement}
        <p style="margin-top: 5px;"><strong>${file.name}</strong> (${(file.size / (1024 * 1024)).toFixed(2)} MB)</p>
      </div>
    `;

      accionBotonCargar(true);
    }

    return modal;
  }

  mostrarModalReproductor(url) {
    const modal = document.createElement("div");
    modal.classList.add("modal");

    modal.innerHTML = `
      <div class="modal-content-partial" id="modal-video">
        <span class="close-modal-btn" style="position: absolute; top: -15px; right: 0px; cursor: pointer; font-size: 50px;">&times;</span>
        <h3 id="nombre-video" style="margin-bottom: 15px; font-size: 24px;">${this.nombre}</h3>
        <div class="reproductor-container">
          ${
            url.toLowerCase().endsWith(".gif")
              ? `<img src="${url}" alt="GIF Artículo" style="max-width: 100%; border-radius: 8px;"/>`
              : `<video 
                  src="${url}" 
                  autoplay 
                  loop 
                  controls 
                  playsinline">
                </video>`
          }
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    this.clickFuera(modal);

    const closeBtn = modal.querySelector(".close-modal-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation(); // Evita que interfieran otros listeners del modal
        modal.remove();
      });
    }
  }

  sacarPuntosPrecio(precioConPuntos) {
    return precioConPuntos.replace(/\./g, "");
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
}
