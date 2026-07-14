class MarcaVista {
  constructor(marca) {
    const { id, id_empresa, nombre, logo_url, abreviatura } = marca;
    this.id = id;
    this.id_empresa = id_empresa;
    this.nombre = nombre;
    this.abreviatura = abreviatura;
    this.logo_url = logo_url ?? "Archivos/Logos/Vacio.png";
  }

  mostrarUno(paraCliente = false) {
    const divMarca = document.createElement("div");
    divMarca.classList.add("rubro");
    divMarca.dataset.MarcaId = this.id;
    divMarca.style.backgroundImage = `url(${this.logo_url})`;

    const pNombre = document.createElement("h3");
    pNombre.textContent = this.nombre;
    // 2. Adjuntar la imagen al div principal
    divMarca.appendChild(pNombre);
    const container2 = document.createElement("div");

    divMarca.appendChild(container2);

    return divMarca;
  }

  modalModificar() {
    const modalModificar = document.createElement("div");
    modalModificar.classList.add("modal");
    modalModificar.id = "modal-modificar-marca";

    const modalModificarContenido = document.createElement("div");
    modalModificarContenido.classList.add("modal-content-partial");

    const htmlContent = `
    <span class="close-modal-btn" style="position: absolute; top: 5px; right: 5px; cursor: pointer; font-size: 30px;">&times;</span>
            <form id="form-modificar-marca" method="POST" enctype="multipart/form-data"> 
                <h2 id ="titulo-modal">Modificar Marca</h2> 
                <div class="form-group"> 
                    <label for="nombre">Nombre:</label> 
                    <input type="text" id="nombre" name="nombre" value="${this.nombre}" required> 
                </div> 
                <div class="form-group"> 
                    <label for="nombre">Imagen:</label> 
                    <input type="file" id="imagen" name="imagen" accept="image/*"> 
                </div> 
                <button type="submit" class="submit-button" id="boton-modificar-marca">Enviar</button> 
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
