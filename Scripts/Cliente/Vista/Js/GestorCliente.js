// Scripts/Administrador/Vista/Js/GestorAdministrador.js

class GestorCliente {
  async cacheFetch(url, body, id_empresa) {
    const requestBody = { ...body, id_empresa };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: "Error" }));
      throw new Error(err.error || "Error de red");
    }

    return await response.json();
  }

  async mostrarListaArticulosPorEmpresa(id_empresa) {
    return await this.cacheFetch(
      `/articulo/mostrar/para-cliente`,
      { id_empresa },
      id_empresa,
    );
  }

  async mostrarListaRubros(id_empresa) {
    return await this.cacheFetch(
      `/rubro/mostrar/para-cliente`,
      { id_empresa },
      id_empresa,
    );
  }

  async conocerEmpresa(id_empresa) {
    // Validación básica
    if (!id_empresa || isNaN(parseInt(id_empresa))) {
      throw new Error("ID de empresa inválido");
    }

    const bodyData = { id_empresa: parseInt(id_empresa) };

    return await this.cacheFetch(`/empresa/mostrar/id`, bodyData, id_empresa);
  }

  async obtenerHorarios(id_empresa) {
    const bodyData = { id_empresa };

    const response = await fetch(`/empresa/mostrar-horarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      const err = await response
        .json()
        .catch(() => ({ error: "Error obteniendo horarios" }));
      throw new Error(err.error || "Error obteniendo horarios");
    }

    return await response.json();
  }

  async obtenerEspectaculos(id_empresa) {
    const bodyData = { id_empresa };

    const response = await fetch(`/empresa/mostrar-espectaculos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      const err = await response
        .json()
        .catch(() => ({ error: "Error obteniendo espectáculos" }));
      throw new Error(err.error || "Error obteniendo espectáculos");
    }

    return await response.json();
  }

  async verificarContrasenaMesero(id_empresa, contrasena) {
    const bodyData = { id_empresa: parseInt(id_empresa), contrasena };

    const response = await fetch(`/empresa/verificar-contrasena-mesero`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      const err = await response
        .json()
        .catch(() => ({ error: "Error al verificar contraseña de mesero" }));
      throw new Error(err.error || "Error al verificar contraseña de mesero");
    }

    return await response.json();
  }

  async iniciarSesionMesero(id_empresa, nombre, contrasena) {
    const bodyData = { id_empresa: parseInt(id_empresa), nombre, contrasena };

    const response = await fetch(`/mesero/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
      credentials: "include",
    });

    if (!response.ok) {
      const err = await response
        .json()
        .catch(() => ({ error: "Error al iniciar sesión de mesero" }));
      throw new Error(err.error || "Error al iniciar sesión de mesero");
    }

    return await response.json();
  }

  async hayMeserosRegistrados(id_empresa) {
    const bodyData = { id_empresa: parseInt(id_empresa) };

    const response = await fetch(`/mesero/hay-meseros-registrados`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
      credentials: "include",
    });

    if (!response.ok) {
      const err = await response
        .json()
        .catch(() => ({ error: "Error al verificar meseros registrados" }));
      throw new Error(err.error || "Error al verificar meseros registrados");
    }

    return await response.json();
  }

  async validarSesionMesero(id_empresa) {
    const bodyData = { id_empresa: parseInt(id_empresa) };
    const response = await fetch(`/mesero/validar-sesion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
      credentials: "include",
    });

    return await response.json();
  }
}
