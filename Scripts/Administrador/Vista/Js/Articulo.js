class ArticuloVista {
    
    constructor(id, id_rubro, nombre, descripcion, precio, codigo_carta) {
        this.id = id;
        this.id_rubro = id_rubro;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.codigo_carta = codigo_carta;
    }
    
    mostrarUna() {
        const divArticulo = document.createElement('div');
        divArticulo.classList.add('articulo');
        divArticulo.dataset.ArticuloId = this.id;  //🤣😎
        divArticulo.dataset.nombre = this.nombre;
        divArticulo.dataset.descripcion = this.descripcion;
        divArticulo.dataset.precio = this.precio;
        
        const infoContainer = document.createElement('div');
        infoContainer.classList.add('articulo-info');
        
        const pNombre = document.createElement('p');
        pNombre.id = 'nombre-articulo';
        
        // Concatenar código de carta si existe
        if (this.codigo_carta) {
            pNombre.textContent = `${this.nombre} (${this.codigo_carta})`;
        } else {
            pNombre.textContent = this.nombre;
        }
        
        infoContainer.appendChild(pNombre);
        
        const pPrecio = document.createElement('p');
        pPrecio.id = 'id-articulo';
        pPrecio.textContent = '$'+this.precio;
        infoContainer.appendChild(pPrecio);
        
        divArticulo.appendChild(infoContainer);
        
        if(this.descripcion){
            const pDescripcion = document.createElement('p');
            pDescripcion.textContent = this.descripcion;
            pDescripcion.classList.add("descripcion");
            
            divArticulo.appendChild(pDescripcion);
        }
        
        divArticulo.addEventListener('click', () => {
            const event = new CustomEvent('articuloSeleccionado', { detail: { articuloId: this.id, articuloIdRubro: this.id_rubro, articuloNombre: this.nombre, articuloDescripcion: this.descripcion, articuloPrecio: this.precio, articuloCodigoCarta : this.codigo_carta } });
            document.dispatchEvent(event);

            if (typeof window.gestorDeArticulosCallback === 'function') {
                window.gestorDeArticulosCallback(this.id, this.id_rubro, this.nombre, this.descripcion, this.precio, this.codigo_carta);
            }
        });
        
        return divArticulo;
    }
    
    modalConfigurar(id, nombre, descripcion, precio, texto_codigo_carta) {
        const modalConfigurarArticulo = document.createElement('div');
        modalConfigurarArticulo.classList.add('modal-backdrop');
        modalConfigurarArticulo.id = 'modal-configurar-articulo';

        const modalConfigurarArticuloContenido = document.createElement('div');
        modalConfigurarArticuloContenido.classList.add('modal-content');
        
        const codigo_carta = texto_codigo_carta && texto_codigo_carta.trim() !== '' 
        ? ` (${texto_codigo_carta})` 
        : '';
        
        const htmlContent = `
            <form id="form-configurar-articulo">
                <h2 id ="nombre-articulo-modal">${nombre} ${codigo_carta}</h2>
                <p class="descripcion">${descripcion}</p>
                <h2 id ="id-articulo">$${precio}</h2>
                <button type="button" class="submit-button" id="modificar">Modificar</button>
            </form>`;

        modalConfigurarArticuloContenido.innerHTML = htmlContent;
        modalConfigurarArticulo.appendChild(modalConfigurarArticuloContenido);
        
        return modalConfigurarArticulo;
    }
    
    modalModificar(nombre, descripcion, precioConPuntos, codigo_carta = '') {
        const modalModificarArticulo = document.createElement('div');
        modalModificarArticulo.classList.add('modal-backdrop');
        modalModificarArticulo.id = 'modal-modificar-articulo';

        const modalModificarArticuloContenido = document.createElement('div');
        modalModificarArticuloContenido.classList.add('modal-content');
        
        const precio = this.sacarPuntosPrecio(precioConPuntos);
        
        const htmlContent = `
            <form id="form-modificar-articulo" method="POST" enctype="multipart/form-data">
                <h2 id ="titulo-modal">Modificar Articulo</h2>
                <div class="form-group">
                    <label for="nombre">Nombre:</label>
                    <input type="text" id="nombre" name="nombre" value="${nombre}" required>
                </div>
                <div class="form-group">
                    <label for="codigo_carta">Codigo de carta:</label>
                    <input type="text" id="codigo de carta" name="codigo_carta" value="${codigo_carta}">
                </div>
                <div class="form-group">
                    <label for="descripcion">Descripcion:</label>
                    <input type="text" id="descripcion" name="descripcion" value="${descripcion}">
                </div>
                <div class="form-group">
                    <label for="precio">Precio:</label>
                    <input type="numeric" id="precio" name="precio" value="${precio}" required>
                </div>
                <button type="submit" class="submit-button" id="boton-modificar-articulo">Enviar</button>
            </form>
        `;

        modalModificarArticuloContenido.innerHTML = htmlContent;
        modalModificarArticulo.appendChild(modalModificarArticuloContenido);
        
        return modalModificarArticulo;
    }
    
    sacarPuntosPrecio(precioConPuntos){
        return precioConPuntos.replace(/\./g, '');
    }
}