class ArticuloVista {
  constructor(articulo) {
    const {
      id,
      id_rubro,
      id_marca,
      nombre_marca,
      id_proveedor,
      nombre_proveedor,
      codigo_proveedor,
      existencia,
      nombre,
      precio1,
      precio2,
      precio3,
      no_procesado,
      seleccionado = false,
      video_url = null,
      logo_url = null,
    } = articulo;
    this.id = id;
    this.id_rubro = id_rubro;
    this.id_marca = id_marca;
    this.id_proveedor = id_proveedor;
    this.marca = nombre_marca;
    this.proveedor = nombre_proveedor;
    this.codigo_proveedor = codigo_proveedor;
    this.existencia = existencia;
    this.nombre = nombre;
    this.precio1 = precio1;
    this.precio2 = precio2;
    this.precio3 = precio3;
    this.seleccionado = seleccionado;
    this.no_procesado = no_procesado;
    this.video_url = video_url;
    this.logo_url = logo_url;
    this.videoSVG = `<svg width="35px" height="35px" viewBox="3 3 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity="0.25" fill-rule="evenodd" clip-rule="evenodd" d="M12 3C4.5885 3 3 4.5885 3 12C3 19.4115 4.5885 21 12 21C19.4115 21 21 19.4115 21 12C21 4.5885 19.4115 3 12 3ZM15.224 13.0171C16.011 12.5674 16.011 11.4326 15.224 10.9829L10.7817 8.44446C10.0992 8.05446 9.25 8.54727 9.25 9.33333L9.25 14.6667C9.25 15.4527 10.0992 15.9455 10.7817 15.5555L15.224 13.0171Z" fill="#ffffff"/>
      <path d="M3 12C3 4.5885 4.5885 3 12 3C19.4115 3 21 4.5885 21 12C21 19.4115 19.4115 21 12 21C4.5885 21 3 19.4115 3 12Z" stroke="#ffffff00" stroke-width="2"/>
      <path d="M10.9 8.8L10.6577 8.66152C10.1418 8.36676 9.5 8.73922 9.5 9.33333L9.5 14.6667C9.5 15.2608 10.1418 15.6332 10.6577 15.3385L10.9 15.2L15.1 12.8C15.719 12.4463 15.719 11.5537 15.1 11.2L10.9 8.8Z" stroke="#ffffff" fill="#ffffff" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;

    this.imagenSVG = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="Media / Image_02">
      <path id="Vector" d="M3.00005 18.0001C3 17.9355 3 17.8689 3 17.8002V6.2002C3 5.08009 3 4.51962 3.21799 4.0918C3.40973 3.71547 3.71547 3.40973 4.0918 3.21799C4.51962 3 5.08009 3 6.2002 3H17.8002C18.9203 3 19.4801 3 19.9079 3.21799C20.2842 3.40973 20.5905 3.71547 20.7822 4.0918C21 4.5192 21 5.07899 21 6.19691V17.8031C21 18.2881 21 18.6679 20.9822 18.9774M3.00005 18.0001C3.00082 18.9884 3.01337 19.5058 3.21799 19.9074C3.40973 20.2837 3.71547 20.5905 4.0918 20.7822C4.5192 21 5.07899 21 6.19691 21H17.8036C18.9215 21 19.4805 21 19.9079 20.7822C20.2842 20.5905 20.5905 20.2837 20.7822 19.9074C20.9055 19.6654 20.959 19.3813 20.9822 18.9774M3.00005 18.0001L7.76798 12.4375L7.76939 12.436C8.19227 11.9426 8.40406 11.6955 8.65527 11.6064C8.87594 11.5282 9.11686 11.53 9.33643 11.6113C9.58664 11.704 9.79506 11.9539 10.2119 12.4541L12.8831 15.6595C13.269 16.1226 13.463 16.3554 13.6986 16.4489C13.9065 16.5313 14.1357 16.5406 14.3501 16.4773C14.5942 16.4053 14.8091 16.1904 15.2388 15.7607L15.7358 15.2637C16.1733 14.8262 16.3921 14.6076 16.6397 14.5361C16.8571 14.4734 17.0896 14.4869 17.2988 14.5732C17.537 14.6716 17.7302 14.9124 18.1167 15.3955L20.9822 18.9774M20.9822 18.9774L21 18.9996M15 9C14.4477 9 14 8.55228 14 8C14 7.44772 14.4477 7 15 7C15.5523 7 16 7.44772 16 8C16 8.55228 15.5523 9 15 9Z"
       stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      </svg>`;
  }

  mostrarUna(
    precio_activo = 1,
    paraClientes = false,
    imagenesEnArticulos = true,
  ) {
    const divArticulo = document.createElement("div");
    divArticulo.classList.add("articulo");
    divArticulo.dataset.articuloId = this.id;
    divArticulo.dataset.nombre = this.nombre;
    divArticulo.dataset.precio1 = this.precio1;
    divArticulo.dataset.precio2 = this.precio2;
    divArticulo.dataset.precio3 = this.precio3;
    divArticulo.dataset.no_procesado = this.no_procesado;

    const infoContainer = document.createElement("div");
    infoContainer.classList.add("articulo-info");

    const infoMarcaProv = document.createElement("div");
    infoMarcaProv.classList.add("info-marca-prov");

    const pNombre = document.createElement("p");
    pNombre.id = "nombre-articulo";
    pNombre.textContent = this.nombre;

    const pMarca = document.createElement("p");
    pMarca.id = "marca-articulo";
    pMarca.textContent = this.marca;

    const pProveedor = document.createElement("p");
    pProveedor.id = "proveedor-articulo";
    pProveedor.textContent = this.proveedor;

    infoMarcaProv.appendChild(pMarca);
    infoMarcaProv.appendChild(pProveedor);
    infoContainer.appendChild(pNombre);
    infoContainer.appendChild(infoMarcaProv);

    const precioActual = this[`precio${precio_activo}`] ?? this.precio1;
    const pPrecio = document.createElement("p");
    pPrecio.id = "id-articulo";
    pPrecio.textContent = "$" + precioActual;

    const container2 = document.createElement("div");
    container2.classList.add("container");
    container2.appendChild(pPrecio);

    if (this.video_url) {
      const botonVideo = document.createElement("button");
      botonVideo.classList.add("btn-ver-video");
      botonVideo.innerHTML = this.videoSVG;
      botonVideo.addEventListener("click", (e) => {
        e.stopPropagation();
        if (paraClientes)
          this.mostrarModalReproductorParaCliente(this.video_url);
        else this.mostrarModalReproductor(this.video_url);
      });
      container2.appendChild(botonVideo);
    }

    const logoContainer = document.createElement("div");
    logoContainer.classList.add("articulo-logo");

    // Se corrigió la condición lógica original para evitar inyectar "null" en el src
    if (this.logo_url && this.logo_url !== "Archivos/Logos/Vacio.png") {
      const img = document.createElement("img");
      img.src = this.logo_url;
      img.alt = this.nombre;
      logoContainer.appendChild(img);
    } else {
      logoContainer.innerHTML = this.imagenSVG;
    }
    // Asignación de evento para el modal de la imagen
    logoContainer.style.cursor = "pointer";
    logoContainer.addEventListener("click", (e) => {
      e.stopPropagation();
      // Deberás implementar este método en la clase ArticuloVista
      this.mostrarModalImagen(this.logo_url);
    });
    const contentGroup = document.createElement("div");
    contentGroup.classList.add("articulo-content");
    contentGroup.appendChild(container2);

    if (!this.no_procesado) {
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
      contentGroup.appendChild(infoContainer);
    } else {
      divArticulo.classList.add("no-procesado");
      contentGroup.appendChild(infoContainer);
    }

    if (imagenesEnArticulos) {
      divArticulo.appendChild(logoContainer);
    }
    divArticulo.appendChild(contentGroup);

    return divArticulo;
  }

  modalConfigurar() {
    const modalConfigurarArticulo = document.createElement("div");
    modalConfigurarArticulo.classList.add("modal");
    modalConfigurarArticulo.id = "modal-configurar-articulo";

    const modalContenido = document.createElement("div");
    modalContenido.classList.add("modal-content-partial");

    const htmlContent = `
    <span class="close-modal-btn" style="position: absolute; top: 0px; right: 10px; cursor: pointer; font-size: 30px;">&times;</span>
            <form id="form-configurar-articulo">
                <h2 id="nombre-articulo-modal">${this.nombre}</h2>
                <h2 id="id-articulo">Precio 1: $${this.precio1}</h2>
                <h2 id="id-articulo2">Precio 2: $${this.precio2}</h2>
                <h2 id="id-articulo3">Precio 3: $${this.precio3}</h2>
                <button type="button" class="submit-button" id="modificar">Modificar</button>
                <button type="button" class="submit-button" id="boton-subir-video-articulo">Subir video/imagen</button>
            </form>`;

    const modal = document.getElementById("modal-configurar-articulo");

    modalContenido.innerHTML = htmlContent;
    modalConfigurarArticulo.appendChild(modalContenido);

    const closeBtn = modalConfigurarArticulo.querySelector(".close-modal-btn");

    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        modalConfigurarArticulo.remove();
      });
    }

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
    <span class="close-modal-btn" style="position: absolute; top: 0px; right: 10px; cursor: pointer; font-size: 30px;">&times;</span>
            <form id="form-modificar-articulo">
                <h2>Modificar Artículo</h2>
                <div class="form-group">
                    <label for="input-nombre">Nombre:</label>
                    <input type="text" name="nombre" id="input-nombre" value="${this.nombre}" required>
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
                <div class="form-group"> 
                    <label for="nombre">Imagen:</label> 
                    <input type="file" id="imagen" name="imagen" accept="image/*"> 
                </div> 
                <button type="submit" class="submit-button">Guardar Cambios</button>
            </form>
        `;

    modal.appendChild(contenido);

    const closeBtn = modal.querySelector(".close-modal-btn");

    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        modal.remove();
      });
    }
    return modal;
  }

  modalSubirVideoArticulo() {
    const modal = document.createElement("div");
    modal.classList.add("modal");

    modal.innerHTML = `
    <div class="modal-content-partial">

      <span class="close-modal-btn"
        style="position: absolute; top: 0px; right: 10px; cursor: pointer; font-size: 30px;">
        &times;
      </span>

      <h2>Subir Archivo Multimedia</h2>

      <form id="form-cargar-video">

        <div id="dropzone-video" class="dropzone">
          <div class="drop-content">
            <img
              src="../../../../Archivos/Iconos/video.svg"
              alt="Upload Icon"
              class="icon"
              height="50"
              width="50"
            />
            <p>Arrastrá tu archivo aquí o hacé click</p>
            <small>Formatos permitidos: MP4, MOV, AVI, GIF, JPG, PNG, WEBP</small>
          </div>

          <input
            type="file"
            id="archivo-video"
            name="archivo"
            accept="
              video/mp4,
              video/quicktime,
              video/x-msvideo,
              image/gif,
              image/jpeg,
              image/png,
              image/webp,
              .mp4,
              .mov,
              .avi,
              .gif,
              .jpg,
              .jpeg,
              .png,
              .webp
            "
            hidden
            required
          >
        </div>

        <div id="video-preview" class="file-preview hidden"></div>

        <button
          type="submit"
          class="submit-button disabled"
          id="boton-cargar-video">
          Enviar
        </button>

      </form>
    </div>
  `;

    const dropzone = modal.querySelector("#dropzone-video");
    const input = modal.querySelector("#archivo-video");
    const preview = modal.querySelector("#video-preview");

    function accionBotonCargar(estado) {
      const boton = modal.querySelector("#boton-cargar-video");

      if (!boton) return;

      boton.disabled = !estado;

      if (estado) {
        boton.classList.remove("disabled");
      } else {
        boton.classList.add("disabled");
      }
    }

    // Click
    dropzone.addEventListener("click", () => input.click());

    // Drag over
    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.classList.add("dragover");
    });

    // Drag leave
    dropzone.addEventListener("dragleave", () => {
      dropzone.classList.remove("dragover");
    });

    // Drop
    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();

      dropzone.classList.remove("dragover");

      const file = e.dataTransfer.files[0];

      input.files = e.dataTransfer.files;

      mostrarArchivo(file);
    });

    // Change input
    input.addEventListener("change", () => {
      const file = input.files[0];
      mostrarArchivo(file);
    });

    // Preview
    function mostrarArchivo(file) {
      if (!file) return;

      const validTypes = [
        "video/mp4",
        "video/quicktime",
        "video/x-msvideo",
        "image/gif",
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      const validExtensions = /\.(mp4|mov|avi|gif|jpg|jpeg|png|webp)$/i;

      if (!validTypes.includes(file.type) && !validExtensions.test(file.name)) {
        preview.classList.remove("hidden");

        preview.innerHTML = `
        <strong>
          ❌ Archivo inválido.
          Solo se permiten MP4, MOV, AVI, GIF, JPG, PNG o WEBP.
        </strong>
      `;

        input.value = "";

        accionBotonCargar(false);

        return;
      }

      const fileURL = URL.createObjectURL(file);

      preview.classList.remove("hidden");

      let previewElement = "";

      // IMÁGENES
      if (file.type.startsWith("image/")) {
        previewElement = `
        <img
          src="${fileURL}"
          alt="Preview Imagen"
          style="
            max-width: 100%;
            max-height: 200px;
            border-radius: 8px;
            margin-top: 10px;
            object-fit: contain;
          "
        />
      `;
      }

      // VIDEOS
      else if (file.type.startsWith("video/")) {
        previewElement = `
        <video
          src="${fileURL}"
          controls
          style="
            max-width: 100%;
            max-height: 200px;
            border-radius: 8px;
            margin-top: 10px;
          ">
        </video>
      `;
      }

      preview.innerHTML = `
      <div class="file-info">
        ${previewElement}

        <p style="margin-top: 5px;">
          <strong>${file.name}</strong>
          (${(file.size / (1024 * 1024)).toFixed(2)} MB)
        </p>
      </div>
    `;

      accionBotonCargar(true);
    }

    const modalContentPartial = modal.querySelector(".modal-content-partial");

    const closeBtn = modalContentPartial.querySelector(".close-modal-btn");

    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        modal.remove();
      });
    }

    return modal;
  }

  mostrarModalReproductor(url) {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.id = "modal-video-articulo";

    modal.innerHTML = `
      <div class="modal-content-partial" id="modal-video">
        <button class="btn-eliminar" id="eliminar-video">
          <img src="../../../../Archivos/Iconos/trash4.svg" alt="Eliminar Icon" height="25" width="25"/>
        </button>
        <span class="close-modal-btn" style="position: absolute; top: -20px; right: 0px; cursor: pointer; font-size: 50px;">&times;</span>
        <h3 id="nombre-video" style="font-size: 22px; width: 75%; margin: auto;">${this.nombre}</h3>
        <div class="reproductor-container">
          ${
            /\.(gif|jpg|jpeg|png|webp)$/i.test(url)
              ? `
                <img
                  src="${url}"
                  alt="Imagen Artículo"
                  style="
                    max-width: 100%;
                    max-height: 80vh;
                    border-radius: 8px;
                    object-fit: contain;
                  "
                />
              `
              : `
              <video
                src="${url}"
                autoplay
                loop
                controls
                playsinline>
              </video>
              `
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

    const eliminarBtn = modal.querySelector("#eliminar-video");
    if (eliminarBtn) {
      eliminarBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation(); // Evita que interfieran otros listeners del modal
        this.modalEliminarVideo();
      });
    }
  }

  mostrarModalReproductorParaCliente(url) {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.id = "modal-video-articulo";

    modal.innerHTML = `
      <div class="modal-content-partial" id="modal-video">
        <span class="close-modal-btn" style="position: absolute; top: -20px; right: 0px; cursor: pointer; font-size: 50px;">&times;</span>
        <h3 id="nombre-video" style="font-size: 22px; width: 75%; margin: auto;">${this.nombre}</h3>
        <div class="reproductor-container">
          ${
            /\.(gif|jpg|jpeg|png|webp)$/i.test(url)
              ? `
                <img
                  src="${url}"
                  alt="Imagen Artículo"
                  style="
                    max-width: 100%;
                    max-height: 80vh;
                    border-radius: 8px;
                    object-fit: contain;
                  "
                />
              `
              : `
              <video
                src="${url}"
                autoplay
                loop
                controls
                playsinline>
              </video>
              `
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

  modalEliminarVideo() {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.id = "modal-eliminar-video";

    const contenido = document.createElement("div");
    contenido.classList.add("modal-content-partial");

    contenido.innerHTML = `
      <h2>¿Deseas eliminar el video?</h2>
      <button type="button" class="submit-button" id="confirmar-eliminar-video">Confirmar</button>
      <button type="button" class="submit-button eliminar" id="cancelar-eliminar-video">Cancelar</button>
    `;

    modal.appendChild(contenido);

    document.body.appendChild(modal);

    this.clickFuera(modal);

    const confirmarBtn = document.getElementById("confirmar-eliminar-video");
    const cancelarBtn = document.getElementById("cancelar-eliminar-video");

    confirmarBtn.addEventListener("click", () => {
      const event = new CustomEvent("videoEliminarArticulo", { detail: this });
      document.dispatchEvent(event);
      if (typeof window.eliminarVideoArticulo === "function") {
        window.eliminarVideoArticulo(this);
        document.getElementById("modal-video-articulo").remove();
        modal.remove();
      }
    });

    cancelarBtn.addEventListener("click", () => {
      modal.remove();
    });
  }

  mostrarModalImagen(url) {
    // Si la URL es el string del SVG, se codifica como Data URI para que el <img> lo interprete
    const esSVGString = url && url.trim().startsWith("<svg");
    const srcFinal = esSVGString
      ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(url)}`
      : url;

    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.id = "modal-imagen-articulo";

    modal.innerHTML = `
      <div class="modal-content-partial" id="modal-imagen">
        <span class="close-modal-btn" style="position: absolute; top: -20px; right: 0px; cursor: pointer; font-size: 50px;">&times;</span>
        <h3 id="nombre-imagen" style="font-size: 22px; width: 75%; margin: auto;">${this.nombre}</h3>
        <div class="reproductor-container">
          <img
            src="${srcFinal}"
            alt="Imagen de ${this.nombre}"
            style="
              max-width: 100%;
              max-height: 80vh;
              border-radius: 8px;
              object-fit: contain;
            "
          />
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    if (typeof this.clickFuera === "function") {
      this.clickFuera(modal);
    }

    const closeBtn = modal.querySelector(".close-modal-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        modal.remove();
      });
    }
  }
}
