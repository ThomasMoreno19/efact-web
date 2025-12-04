class EmpresaVista {
    
    constructor(id, nombre, telefono, ubicacion, tieneCarrito, logo_url) {
        this.id = id;
        this.nombre = nombre;
        this.telefono = telefono;
        this.ubicacion = ubicacion;
        this.tieneCarrito = tieneCarrito;
        this.logo_url = logo_url;
    }
    
    mostrarUna() {
        const divEmpresa = document.createElement('div');
        divEmpresa.classList.add('empresa');
        divEmpresa.dataset.empresaId = this.id;  //🤣😎
        divEmpresa.style.backgroundImage = `url('${this.logo_url || '/Archivos/Logos/Vacio.png'}')`;
        
        const pNombre = document.createElement('p');
        pNombre.textContent = this.nombre;
        divEmpresa.appendChild(pNombre);
        
        divEmpresa.addEventListener('click', () => {
            const event = new CustomEvent('empresaSeleccionada', { detail: { empresaId: this.id, empresaNombre: this.nombre, empresaTelefono: this.telefono, empresaUbicacion: this.ubicacion, empresaTieneCarrito: this.tieneCarrito, empresaLogoUrl: this.logo_url } });
            document.dispatchEvent(event);
            if (typeof window.gestorDeEmpresasCallback === 'function') {
                window.gestorDeEmpresasCallback(this);
            }
        });
        
        return divEmpresa;
    }
    
    async asignarIconoYPagina(texto) {
        try {
            // Cambiar el título de la pestaña
            document.title = `${texto} ${this.nombre}`;
            
            // Crear nuevo favicon con el logo de la empresa
            const nuevoFavicon = document.createElement("link");
            nuevoFavicon.rel = "icon";
            nuevoFavicon.type = "image/png";
            nuevoFavicon.href = this.logo_url || "/Archivos/Logos/Vacio.png";
            
            document.head.appendChild(nuevoFavicon);
        } catch (error) {
            console.error('Error al asignar el ícono o el título de la pestaña:', error);
        }
    }
    
    modalNuevaEmpresa() {
        const modalNuevaEmpresa = document.createElement('div');
        modalNuevaEmpresa.classList.add('modal-backdrop');
        modalNuevaEmpresa.id = 'modalNuevaEmpresa';

        const modalNuevaEmpresaContenido = document.createElement('div');
        modalNuevaEmpresaContenido.classList.add('modal-content');
        
        const htmlContent = `
            <form id="formNuevaEmpresa">
                <h2 id ="titulo-modal">Alta Empresa</h2>
                <div class="form-group">
                    <label for="nombre">Nombre:</label>
                    <input type="text" id="nombre" name="nombre" required>
                </div>
                <div class="form-group">
                    <label for="telefono">Nro de telefono:</label>
                    <input type="text" id="telefono" name="telefono" maxlength=18 required>
                </div>
                <div class="form-group">
                    <label for="ubicacion">Direccion:</label>
                    <input type="text" id="ubicacion" name="ubicacion" required>
                </div>
                <div class="form-group">
                    <label for="tieneCarrito">Módulo Carrito:</label>
                    <input type="checkbox" id="tieneCarrito" name="tieneCarrito">
                </div>
                <div class="form-group">
                    <label for="imagen">Imagen:</label>
                    <input type="file" id="imagen" name="imagen" accept="image/*">
                </div>
                <div class="form-group">
                    <label for="usuario">Usuario:</label>
                    <input type="text" id="usuario" name="usuario" required>
                </div>
                <div class="form-group">
                    <label for="contrasena">Contrasena:</label>
                    <input type="password" id="contrasena" name="contrasena" required>
                </div>
                <button type="submit" class="submit-button" id="boton-guardar-empresa">Enviar</button>
            </form>
        `;

        modalNuevaEmpresaContenido.innerHTML = htmlContent;
        modalNuevaEmpresa.appendChild(modalNuevaEmpresaContenido);
        
        return modalNuevaEmpresa;
    }
    
    modalConfigurarEmpresa() {
        const modalConfigurarEmpresa = document.createElement('div');
        modalConfigurarEmpresa.classList.add('modal-backdrop');
        modalConfigurarEmpresa.id = 'modal-configuracion-empresa';

        const modalConfigurarEmpresaContenido = document.createElement('div');
        modalConfigurarEmpresaContenido.classList.add('modal-content');
        const htmlContent = `
            <form id="form-configurar-empresa">
                <h2 id = "nombre-empresa-modal">${this.nombre}</h2>
                <h3 id = "id-empresa-modal">ID ${this.id}</h3>
                <button type = "button" class = "submit-button" id = "seccion-modificar" >Modificar</button>
                <button type = "button" class = "submit-button" id = "cambiar-logo" >Cambiar Logo</button>
                <button type = "button" class = "submit-button" id = "visitar-pagina" >Página de Carta</button>
                <button type = "button" class = "submit-button" id = "visitar-gestion" >Página de Gestión</button>
                
            </form>
        `;

        modalConfigurarEmpresaContenido.innerHTML = htmlContent;
        modalConfigurarEmpresa.appendChild(modalConfigurarEmpresaContenido);
        
        return modalConfigurarEmpresa;
    }
    
    modalModificar(moderador) {
        const modalNuevaEmpresa = document.createElement('div');
        modalNuevaEmpresa.classList.add('modal-backdrop');
        modalNuevaEmpresa.id = 'modalModificarEmpresa';

        const modalNuevaEmpresaContenido = document.createElement('div');
        modalNuevaEmpresaContenido.classList.add('modal-content');
        
        const htmlContent = `
            <form id="formModificarEmpresa">
                <h2 id ="titulo-modal">Modificar ${this.nombre}</h2>
                <div class="form-group">
                    <label for="nombre">Nombre:</label>
                    <input type="text" id="nombre" name="nombre" value="${this.nombre}" required>
                </div>
                <div class="form-group">
                    <label for="telefono">Nro de telefono:</label>
                    <input type="text" id="telefono" name="telefono" value="${this.telefono}" maxlength=18 required>
                </div>
                <div class="form-group">
                    <label for="ubicacion">Direccion:</label>
                    <input type="text" id="ubicacion" name="ubicacion" value="${this.ubicacion}" required>
                </div>
                <div class="form-group">
                    <label for="tieneCarrito">Módulo Carrito:</label>
                    <input type="checkbox" id="tieneCarrito" name="tieneCarrito" ${this.tieneCarrito ? 'checked' : ''}>
                </div>
                <div class="form-group">
                    <label for="usuario">Usuario:</label>
                    <input type="text" id="usuario" name="usuario" value="${moderador.nombre}" required>
                </div>
                <div class="form-group">
                    <label for="contrasena">Contrasena:</label>
                    <input type="password" id="contrasena" name="contrasena" placeholder="Dejar vacío en caso de no cambiar la contrasena">
                </div>
                <button type="submit" class="submit-button" id="boton-guardar-empresa">Enviar</button>
            </form>
        `;

        modalNuevaEmpresaContenido.innerHTML = htmlContent;
        modalNuevaEmpresa.appendChild(modalNuevaEmpresaContenido);
        
        return modalNuevaEmpresa;
    }
    
    modalCambiarLogo() {
        const modalCambiarLogoEmpresa = document.createElement('div');
        modalCambiarLogoEmpresa.classList.add('modal-backdrop');
        modalCambiarLogoEmpresa.id = 'modalCambiarLogoEmpresa';

        const modalCambiarLogoEmpresaContenido = document.createElement('div');
        modalCambiarLogoEmpresaContenido.classList.add('modal-content');
        
        const htmlContent = `
            <form id="formCambiarLogoEmpresa">
                <h2 id ="titulo-modal">Logo de ${this.nombre}</h2>
                <div class="form-group">
                    <label for="imagen">Imagen:</label>
                    <input type="file" id="imagen" name="imagen" accept="image/*">
                </div>
                <button type="submit" class="submit-button" id="boton-guardar-logo">Enviar</button>
            </form>
        `;

        modalCambiarLogoEmpresaContenido.innerHTML = htmlContent;
        modalCambiarLogoEmpresa.appendChild(modalCambiarLogoEmpresaContenido);
        
        return modalCambiarLogoEmpresa;
    }
    
}