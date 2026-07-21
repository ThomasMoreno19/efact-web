class LoginInterno {
  constructor() {
    this.inputPassword = document.getElementById("password");
    this.btnIngresar = document.getElementById("btnIngresar");
    this.mensajeError = document.getElementById("mensajeError");

    this.idEmpresa = this.obtenerIdEmpresa();

    this.inicializarEventos();
  }

  inicializarEventos() {
    this.btnIngresar.addEventListener("click", () => this.ingresar());

    this.inputPassword.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.ingresar();
      }
    });
  }

  obtenerIdEmpresa() {
    const partes = window.location.pathname.split("/");
    console.log(partes);
    return partes[2];
  }

  async ingresar() {
    const password = this.inputPassword.value.trim();

    this.mensajeError.textContent = "";
    this.btnIngresar.disabled = true;

    try {
      const respuesta = await fetch("/interno/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_empresa: this.idEmpresa,
          password,
        }),
      });

      const data = await respuesta.json();

      if (data.ok) {
        window.location.reload();
        return;
      }

      this.mensajeError.textContent = data.mensaje;

      if (!this.inputPassword.disabled) {
        this.btnIngresar.disabled = false;
      }
    } catch (error) {
      console.error(error);
      this.mensajeError.textContent = "Ocurrió un error al intentar ingresar.";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new LoginInterno();
});
