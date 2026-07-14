class RubroVista {
  constructor(rubro) {
    const { id, id_empresa, nombre, logo_url, abreviatura } = rubro;
    this.id = id;
    this.id_empresa = id_empresa;
    this.nombre = nombre;
    this.abreviatura = abreviatura;
    this.logo_url = logo_url;
  }

  mostrarUno(paraCliente = false) {
    const divRubro = document.createElement("div");
    divRubro.classList.add("rubro");
    divRubro.dataset.RubroId = this.id;
    divRubro.style.backgroundImage = `url(${this.logo_url})`;

    const pNombre = document.createElement("h3");
    pNombre.textContent = this.nombre;
    // 2. Adjuntar la imagen al div principal
    divRubro.appendChild(pNombre);
    const container2 = document.createElement("div");

    divRubro.appendChild(container2);

    return divRubro;
  }

  modalModificar() {
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
                    <input type="text" id="nombre" name="nombre" value="${this.nombre}" required> 
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
