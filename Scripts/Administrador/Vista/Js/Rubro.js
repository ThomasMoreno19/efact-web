class RubroVista {
  constructor(rubro) {
    const { id, id_empresa, nombre, logo_url, video_url = null } = rubro;
    this.id = id;
    this.id_empresa = id_empresa;
    this.nombre = nombre;
    this.logo_url = logo_url;
    this.video_url = video_url;
    this.videoSVG = `<svg height="33px" width="33px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
        viewBox="0 0 512 512"  xml:space="preserve">
      <style type="text/css">
        .st0{fill:#ffffff;}
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

  mostrarUno(paraCliente = false) {
    const divRubro = document.createElement("div");
    divRubro.classList.add("rubro");
    divRubro.dataset.RubroId = this.id; //🤣😎
    divRubro.style.backgroundImage = `url(${this.logo_url})`;

    const pNombre = document.createElement("h3");
    pNombre.textContent = this.nombre;
    // 2. Adjuntar la imagen al div principal
    divRubro.appendChild(pNombre);
    const container2 = document.createElement("div");

    if (this.video_url) {
      const botonVideo = document.createElement("button");
      botonVideo.classList.add("btn-ver-video");
      botonVideo.innerHTML = this.videoSVG;
      botonVideo.style = `
      position: absolute;
      top: 0px;
      right: 0px;
      padding: 0px;
      background-color: transparent;
      border: none;
      margin: 0px 5px;
      cursor: pointer;
      filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.9));`;

      botonVideo.addEventListener("click", (e) => {
        e.stopPropagation(); // Evita que se dispare el click del divArticulo (selección/animación)
        if (paraCliente)
          this.mostrarModalReproductorParaCliente(this.video_url);
        else this.mostrarModalReproductor(this.video_url);
      });

      container2.appendChild(botonVideo);
    }

    divRubro.appendChild(container2);

    divRubro.addEventListener("click", () => {
      const event = new CustomEvent("rubroSeleccionado", { detail: this });
      document.dispatchEvent(event);

      if (typeof window.gestorDeRubrosCallback === "function") {
        window.gestorDeRubrosCallback(this);
      }
    });

    return divRubro;
  }

  modalConfigurar() {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.id = "modal-configurar-rubro";

    const modalContenido = document.createElement("div");
    modalContenido.classList.add("modal-content-partial");

    const codigoCartaTexto = this.codigo_carta ? ` (${this.codigo_carta})` : "";

    const htmlContent = `
    <span class="close-modal-btn" style="position: absolute; top: 5px; right: 5px; cursor: pointer; font-size: 30px;">&times;</span>
    <form id="form-configurar-rubro">
      <h2 id="nombre-articulo-modal">${this.nombre}</h2>
      <button type="button" class="submit-button" id="modificar">Modificar</button>
      <button type="button" class="submit-button" id="boton-subir-video-rubro">Subir video</button>
    </form>`;

    modalContenido.innerHTML = htmlContent;

    modal.appendChild(modalContenido);

    const closeBtn = modal.querySelector(".close-modal-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation(); // Evita que interfieran otros listeners del modal
        modal.remove();
      });
    }

    return modal;
  }

  modalModificar(nombre) {
    const modalModificar = document.createElement("div");
    modalModificar.classList.add("modal");
    modalModificar.id = "modal-modificar-rubro";

    const modalModificarContenido = document.createElement("div");
    modalModificarContenido.classList.add("modal-content-partial");

    const htmlContent = `
    <span class="close-modal-btn" style="position: absolute; top: 5px; right: 5px; cursor: pointer; font-size: 30px;">&times;</span>
            <form id="form-modificar-rubro" method="POST" enctype="multipart/form-data"> 
                <h2 id ="titulo-modal">Modificar Rubro</h2> 
                <div class="form-group"> 
                    <label for="nombre">Nombre:</label> 
                    <input type="text" id="nombre" name="nombre" value="${nombre}" required> 
                </div> 
                <div class="form-group"> 
                    <label for="nombre">Imagen:</label> 
                    <input type="file" id="imagen" name="imagen" accept="image/*"> 
                </div> 
                <button type="submit" class="submit-button" id="boton-modificar-rubro">Enviar</button> 
            </form> `;
    modalModificarContenido.innerHTML = htmlContent;
    modalModificar.appendChild(modalModificarContenido);

    const closeBtn = modalModificar.querySelector(".close-modal-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation(); // Evita que interfieran otros listeners del modal
        modalModificar.remove();
      });
    }
    return modalModificar;
  }

  modalSubirVideoRubro() {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
    <div class="modal-content-partial">
      <span class="close-modal-btn" style="position: absolute; top: 5px; right: 5px; cursor: pointer; font-size: 30px;">&times;</span>
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
    const closeBtn = modal.querySelector(".close-modal-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation(); // Evita que interfieran otros listeners del modal
        modal.remove();
      });
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
    const eliminarBtn = modal.querySelector("#eliminar-video");
    if (eliminarBtn) {
      eliminarBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation(); // Evita que interfieran otros listeners del modal
        this.modalEliminarVideo();
      });
    }

    return modal;
  }

  mostrarModalReproductor(url) {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.id = "modal-video-rubro";

    modal.innerHTML = `
      <div class="modal-content-partial" id="modal-video">
        <button class="btn-eliminar" id="eliminar-video">
          <img src="../../../../Archivos/Iconos/trash4.svg" alt="Eliminar Icon" height="25" width="25"/>
        </button>
        <span class="close-modal-btn" style="position: absolute; top: -20px; right: 0px; cursor: pointer; font-size: 50px;">&times;</span>
        <h3 id="nombre-video" style="font-size: 21px;width: 75%;margin: auto;">${this.nombre}</h3>
        <div class="reproductor-container">
          ${
            url.toLowerCase().endsWith(".gif")
              ? `<img src="${url}" alt="GIF Artículo" style="max-width: 100%; border-radius: 8px;"/>`
              : `<video 
                  src="${url}" 
                  autoplay 
                  loop 
                  controls 
                  playsinline
                  controlsList="nodownload noplaybackrate"
                  disablePictureInPicture
                >
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
    modal.id = "modal-video-rubro";

    modal.innerHTML = `
      <div class="modal-content-partial" id="modal-video">
        <span class="close-modal-btn" style="position: absolute; top: -20px; right: 0px; cursor: pointer; font-size: 50px;">&times;</span>
        <h3 id="nombre-video" style="font-size: 21px;width: 75%;margin: auto;">${this.nombre}</h3>
        <div class="reproductor-container">
          ${
            url.toLowerCase().endsWith(".gif")
              ? `<img src="${url}" alt="GIF Artículo" style="max-width: 100%; border-radius: 8px;"/>`
              : `<video 
                  src="${url}" 
                  autoplay 
                  loop 
                  controls 
                  playsinline
                  controlsList="nodownload noplaybackrate"
                  disablePictureInPicture
                >
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
      const event = new CustomEvent("videoEliminarRubro", { detail: this });
      document.dispatchEvent(event);
      if (typeof window.eliminarVideoRubro === "function") {
        window.eliminarVideoRubro(this);
        document.getElementById("modal-video-rubro").remove();
        modal.remove();
      }
    });

    cancelarBtn.addEventListener("click", () => {
      modal.remove();
    });
  }
}
