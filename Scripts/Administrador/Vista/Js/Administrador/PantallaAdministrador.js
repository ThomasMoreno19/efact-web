
class PantallaAdministrador {
    
    constructor() {
        // Inicializamos el Gestor y los elementos del DOM
        this.listaEmpresas = document.getElementById('lista-empresas');
        this.gestor = new GestorAdministrador();
        this.botonNuevaEmpresa = document.getElementById('alta-empresa');
        window.gestorDeEmpresasCallback = (empresa) => this.modalEmpresaSeleccionada(empresa);
        window.gestorDeModeradoresCallback = (moderador) => this.modalModeradorSeleccionado(moderador);
        
        this.agregarEventListeners();
    }
    
    agregarEventListeners() {
        
        if (this.botonNuevaEmpresa) {
            this.botonNuevaEmpresa.addEventListener('click', () => {
                this.abrirModalNuevaEmpresa();
            });
        }
    }
    
    async habilitarVentanaPrincipal() {
        await this.mostrarLista();
    }
    
    async mostrarLista() {
    
        try {
            const listaRecibida = await this.gestor.mostrarListaEmpresas();
    
            this.listaEmpresas.innerHTML = '';
            if (listaRecibida.length === 0) {
                this.listaEmpresas.innerHTML = `<p class="texto-vacio"> No hay empresas cargadas. </p>`;
            } else {
                listaRecibida.forEach(empresa => {
                    const itemVista = new EmpresaVista(empresa.id, empresa.nombre, empresa.telefono, empresa.ubicacion, empresa.logo_url);
                    this.listaEmpresas.appendChild(itemVista.mostrarUna());
                });
            }
        } catch (error) {
            console.error('Error en mostrarListaEmpresas:', error);
            this.listaEmpresas.innerHTML = `<p class="texto-error"> Error al cargar los datos: ${error.message}. Por favor, recargue la página. </p>`;
        }
    }
    
    async modalEmpresaSeleccionada(empresa) {
        const modal = empresa.modalConfigurarEmpresa();
        
        // Agregamos un ID al modal para poder identificarlo
        document.body.appendChild(modal);
        const botonCambiarLogo = document.getElementById('cambiar-logo');
        const botonSecccionModificar = document.getElementById('seccion-modificar');
        const botonGestionArticulos = document.getElementById('visitar-gestion');
        const botonVisitarPagina = document.getElementById('visitar-pagina');
        
        //Se cierra el modal si se clickea afuera
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                document.body.removeChild(modal);
        }});
        
        botonVisitarPagina.addEventListener('click', (event) => {
            event.preventDefault();
            window.open(`/carta/${empresa.id}`, '_blank');
        });
        
        botonGestionArticulos.addEventListener('click', (event) => {
            event.preventDefault();
            window.open(`/moderador/${empresa.id}`, '_blank');
        });
        
        botonSecccionModificar.addEventListener('click', async (event) => {
            event.preventDefault();
            await this.abrirModalModificar(empresa, modal);
            document.body.removeChild(modal);
        });
        
        botonCambiarLogo.addEventListener('click', async (event) => {
            event.preventDefault();
            await this.abrirModalCambiarLogo(empresa, modal);
            document.body.removeChild(modal);
        });
    }
    
    abrirModalNuevaEmpresa() {
        const empresa = new EmpresaVista();
        const moderador = new ModeradorVista();
        const modal = empresa.modalNuevaEmpresa();
    
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            document.body.removeChild(modal);}});
    
        const form = document.getElementById('formNuevaEmpresa');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const formData = new FormData(form);
            const nombre = formData.get('nombre');
            const archivoImagen = formData.get('imagen');
            const usuario = formData.get('usuario');
            const contrasena = formData.get('contrasena');
            const telefono = formData.get('telefono');
            const ubicacion = formData.get('ubicacion');
            
            try {
                // Llamamos al método del gestor con el nombre y el archivo.
                const nuevaEmpresa = await this.gestor.crearEmpresa(nombre, telefono, ubicacion, archivoImagen);
                const nuevoModerador = await this.gestor.crearModerador(usuario, nuevaEmpresa.id, contrasena);
                modal.classList.add('hidden');
                document.body.removeChild(modal);
                await this.mostrarLista();
                
            } catch (error) {
                alert(`Error: ${error.message}`);
            }
        });
    }
    
    async abrirModalModificar(empresa, modalPadre) {
        const moderador = await this.gestor.obtenerModerador(empresa.id);
        const modal = empresa.modalModificar(moderador);
        
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.add('hidden');
                document.body.appendChild(modalPadre);
                document.body.removeChild(modal);  
            }});
            
            const form = document.getElementById('formModificarEmpresa');
            form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            const nombre = formData.get('nombre');
            const telefono = formData.get('telefono');
            const ubicacion = formData.get('ubicacion');
            const usuario = formData.get('usuario');
            const contrasena = formData.get('contrasena');
            
            try {
                // Llamamos al método del gestor con el nombre y el archivo.
                const moderadorModificado = await this.gestor.modificarModerador(moderador.id, usuario, contrasena);
                const empresaModificada = this.gestor.modificarEmpresa(empresa.id, nombre, telefono, ubicacion);
                modal.classList.add('hidden');
                document.body.removeChild(modal);
                await this.mostrarLista();
                
            } catch (error) {
                alert(`Error: ${error.message}`);
            }
        });
    }
    
    async abrirModalCambiarLogo(empresa, modalPadre) {
        const modal = empresa.modalCambiarLogo();
        
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            document.body.appendChild(modalPadre);
            document.body.removeChild(modal);
        }});
    
        const form = document.getElementById('formCambiarLogoEmpresa');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            const imagen = formData.get('imagen');
            
            try {
                const empresaModificada = await this.gestor.cambiarLogoEmpresa(empresa.id, imagen, empresa.nombre);
                modal.classList.add('hidden');
                document.body.removeChild(modal);
                await this.mostrarLista();
                
            } catch (error) {
                alert(`Error: ${error.message}`);
            }
        });
    }
}


// --- Inicialización ---
// Se crea una instancia de PantallaAdministrador cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    const pantalla = new PantallaAdministrador();
    pantalla.habilitarVentanaPrincipal();
});