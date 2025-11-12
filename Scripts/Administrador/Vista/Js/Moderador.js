class ModeradorVista {
    
    constructor(id, id_empresa, nombre, logo_url) {
        this.id = id;
        this.id_empresa = id_empresa;
        this.nombre = nombre;
        this.logo_url = logo_url;
    }
    
    mostrarUna() {
        const divModerador = document.createElement('div');
        divModerador.classList.add('rubro');
        divModerador.dataset.ModeradorId = this.id;  //🤣😎
        
        const imgLogo = document.createElement('img');
        imgLogo.src = this.logo_url;
        imgLogo.alt = `Logo de ${this.nombre}`;
        divModerador.appendChild(imgLogo);
        
        const Nombre = document.createElement('p');
        Nombre.textContent = this.nombre;
        divModerador.appendChild(Nombre);
        
        divModerador.addEventListener('click', () => {
            const event = new CustomEvent('moderadorSeleccionado', { detail: { moderadorId: this.id, moderadorNombre: this.nombre } });
            document.dispatchEvent(event);

            if (typeof window.gestorDeModeradoresCallback === 'function') {
                window.gestorDeModeradoresCallback(this);
            }
        });
        
        return divModerador;
    }
    
    setLogo(logo_url){
        this.logo_url = logo_url;
    }
    
    modalNuevoModerador() {
        const modalNuevoModerador = document.createElement('div');
        modalNuevoModerador.classList.add('modal-backdrop');
        modalNuevoModerador.id = 'modal-nuevo-moderador';

        const modalNuevoModeradorContenido = document.createElement('div');
        modalNuevoModeradorContenido.classList.add('modal-content');
        
        const htmlContent = `
            <form id="form-nuevo-moderador" method="POST" enctype="multipart/form-data">
                <h2 id ="titulo-modal">Alta Moderador</h2>
                <div class="form-group">
                    <label for="nombre">Nombre:</label>
                    <input type="text" id="nombre" name="nombre" required>
                </div>
                <div class="form-group">
                    <label for="contrasena">Contrasena:</label>
                    <input type="password" id="contrasena" name="contrasena" required>
                </div>
                <button type="submit" class="submit-button" id="boton-guardar-moderador">Guardar Moderador</button>
            </form>
        `;

        modalNuevoModeradorContenido.innerHTML = htmlContent;
        modalNuevoModerador.appendChild(modalNuevoModeradorContenido);
        
        return modalNuevoModerador;
    }
    
    modalConfigurarModerador() {
        const modalConfigurarModerador = document.createElement('div');
        modalConfigurarModerador.classList.add('modal-backdrop');
        modalConfigurarModerador.id = 'modal-configuracion-moderador';

        const modalConfigurarModeradorContenido = document.createElement('div');
        modalConfigurarModeradorContenido.classList.add('modal-content');
        
        const htmlContent = `
            <form id="form-configurar-moderador" method="POST" enctype="multipart/form-data">
                <h2 id ="nombre-moderador-modal">${this.nombre}</h2>
                <button type="button" class="submit-button" id="modificar-moderador">Modificar</button>
                <button type="button" class="submit-button" id="visitar-pagina">Visitar Página</button>
            </form>
        `;

        modalConfigurarModeradorContenido.innerHTML = htmlContent;
        modalConfigurarModerador.appendChild(modalConfigurarModeradorContenido);
        
        return modalConfigurarModerador;
    }
    
    modalModificarModerador(){
        const modalModificarModerador = document.createElement('div');
        modalModificarModerador.classList.add('modal-backdrop');
        modalModificarModerador.id = 'modal-modificar-moderador';

        const modalModificarModeradorContenido = document.createElement('div');
        modalModificarModeradorContenido.classList.add('modal-content');
        
        const htmlContent = `
            <form id="form-modificar-moderador" method="POST" enctype="multipart/form-data">
                <h2 id ="nombre-moderador-modal">${this.nombre}</h2>
                <div class="form-group">
                    <label for="nombre">Nombre:</label>
                    <input type="text" id="nombre" name="nombre" required>
                </div>
                <div class="form-group">
                    <label for="contrasena">Contrasena:</label>
                    <input type="password" id="contrasena" name="contrasena" required>
                </div>
                <button type="submit" class="submit-button" id="boton-modificar-moderador">Enviar</button>
            </form>
        `;

        modalModificarModeradorContenido.innerHTML = htmlContent;
        modalModificarModerador.appendChild(modalModificarModeradorContenido);
        
        return modalModificarModerador;
    }
}