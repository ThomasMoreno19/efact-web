// Scripts/Administrador/Vista/Js/GestorAdministrador.js
class GestorModerador {
  // El método mostrarListaEmpresas ahora solo devuelve los datos, sin manipular el DOM
  async llamadaAlBackend(url, body, id_empresa) {
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

  // El método mostrarListaEmpresas ahora solo devuelve los datos, sin manipular el DOM
  async mostrarListaArticulos(id_rubro, id_empresa) {
    return await this.llamadaAlBackend(
      `/articulo/mostrar`,
      { id_rubro },
      id_empresa,
    );
  }

  async mostrarListaArticulosPorEmpresa(id_empresa) {
    return await this.llamadaAlBackend(
      `/articulo/mostrar/empresa`,
      { id_empresa },
      id_empresa,
    );
  }

  async mostrarListaRubros(id_empresa) {
    return await this.llamadaAlBackend(
      `/rubro/mostrar`,
      { id_empresa },
      id_empresa,
    );
  }

  async subirImagen(archivoImagen, logo_url) {
    if (!archivoImagen) {
      return logo_url;
    }
    const formData = new FormData();
    formData.append("imagen", archivoImagen);

    try {
      // 3. Enviar la solicitud POST con FormData en el body
      const response = await fetch(`/rubro/subir-logo`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Error desconocido" }));
        throw new Error(
          errorData.message || `Error al subir la imagen: ${response.status}`,
        );
      }

      // 4. El backend debería responder con un JSON que contenga la URL del logo
      const data = await response.json();

      // 5. Retornar solo la URL del logo
      return data.url;
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      throw error;
    }
  }

  async subirImagenArticulo(archivoImagen, logo_url) {
    if (!archivoImagen) {
      return logo_url;
    }
    const formData = new FormData();
    formData.append("imagen", archivoImagen);

    try {
      // 3. Enviar la solicitud POST con FormData en el body
      const response = await fetch(`/articulo/subir-logo`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Error desconocido" }));
        throw new Error(
          errorData.message || `Error al subir la imagen: ${response.status}`,
        );
      }

      // 4. El backend debería responder con un JSON que contenga la URL del logo
      const data = await response.json();

      // 5. Retornar solo la URL del logo
      return data.url;
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      throw error;
    }
  }

  async cambiarLogoEmpresa(id_empresa, imagen, nombre) {
    try {
      // Crear FormData correctamente
      const formData = new FormData();
      formData.append("id_empresa", id_empresa);
      formData.append("nombre", nombre);
      formData.append("imagen", imagen);

      // Enviar FormData (NO uses headers manuales, fetch lo hace solo)
      const response = await fetch(`/empresa/modificar-logo`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 2. Await the .json() call to get the data
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        "Error al cambiar el logo de la empresa ",
        id_empresa,
        ":",
        error,
      );
      throw error;
    }
  }

  async cargarArticulosYRubros(archivo, id_empresa) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (event) => {
        try {
          const listaObjetos = [];

          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          const lineasSinCabecera = jsonData.slice(2);

          lineasSinCabecera.forEach((columnas) => {
            if (!columnas || columnas.length === 0) return;
            listaObjetos.push({
              id_articulo: columnas[0],
              nombre_articulo: columnas[1].trim(),
              precio1: parseFloat(columnas[2]),
              precio2: parseFloat(columnas[3]),
              precio3: parseFloat(columnas[4]),
              nombre_rubro: columnas[5].trim(),
              no_procesado: columnas[6],
            });
          });

          await this.setearEn0(id_empresa);

          const listaRubros = await this.cargarRubros(listaObjetos, id_empresa);
          const booleanoArticulos = await this.cargarArticulos(
            listaRubros,
            id_empresa,
          );

          if (!booleanoArticulos) {
            return reject(new Error("Error al cargar los artículos"));
          }

          const resultado = await this.borrarRubrosYArtNoUtilizados(id_empresa);

          // ✅ ESTE es el retorno correcto
          resolve({
            rubros: listaRubros,
            articulos: booleanoArticulos,
            resultado: resultado,
          });
        } catch (error) {
          reject(new Error(`Error al procesar el archivo: ${error.message}`));
        }
      };

      reader.onerror = () => {
        reject(new Error("Error al leer el archivo."));
      };

      if (archivo.type === "text/csv") {
        reader.readAsText(archivo);
      } else {
        reader.readAsArrayBuffer(archivo);
      }
    });
  }

  async cargarRubros(lista, id_empresa) {
    try {
      const bodyData = {
        id_empresa: id_empresa,
        lista: lista,
      };
      const response = await fetch("/rubro/cargar-lista", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Stringify the combined object
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Error en el servidor: ${response.status}`,
        );
      }

      const resultado = await response.json();
      return resultado;
    } catch (error) {
      console.error("Error al enviar la lista:", error);
    }
  }

  async cargarArticulos(lista, id_empresa) {
    try {
      const bodyData = {
        id_empresa: id_empresa,
        lista: lista,
      };

      const response = await fetch("/articulo/cargar-lista", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      // ⚠️ Leer primero como texto para ver qué llega
      const rawText = await response.text();

      // Intentar parsear solo si parece JSON
      let resultado;
      try {
        resultado = JSON.parse(rawText);
      } catch {
        throw new Error("El servidor devolvió HTML o un error PHP");
      }

      if (!response.ok) {
        throw new Error(
          resultado.error || `Error en el servidor: ${response.status}`,
        );
      }

      return resultado;
    } catch (error) {
      console.error("Error al enviar la lista:", error);
      throw error; // importante para que se propague arriba
    }
  }

  async setearEn0(id_empresa) {
    try {
      const bodyData = {
        id_empresa: id_empresa,
      };
      const response = await fetch("/rubro/setear-en-0", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Stringify the combined object
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Error en el servidor: ${response.status}`,
        );
      }
    } catch (error) {
      console.error("Error al enviar la lista:", error);
    }
  }

  async borrarRubrosYArtNoUtilizados(id_empresa) {
    try {
      const bodyData = {
        id_empresa: id_empresa,
      };
      const response = await fetch("/rubro/eliminar-no-utilizados", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Stringify the combined object
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Error en el servidor: ${response.status}`,
        );
      }
    } catch (error) {
      console.error("Error al enviar la lista:", error);
    }
  }
  async modificarArticulo(
    id,
    id_rubro,
    id_empresa,
    nombre,
    precio1,
    precio2,
    precio3,
    imagen,
    logo_url = "",
  ) {
    let urlLogo = logo_url;

    // Solo subir imagen si se proporcionó una nueva
    if (imagen) {
      urlLogo = await this.subirImagenArticulo(imagen, logo_url);
    }

    const bodyData = {
      id: id,
      id_rubro: id_rubro,
      id_empresa: id_empresa,
      nombre: nombre,
      precio1: precio1,
      precio2: precio2,
      precio3: precio3,
      logo_url: urlLogo,
    };

    try {
      const response = await fetch(`/articulo/modificar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "Error desconocido al modificar articulo",
        }));
        throw new Error(
          errorData.message ||
            `Error al crear el moderador: ${response.status}`,
        );
      }

      // El backend debe devolver el objeto del nuevo moderador creado.
      const articulo = await response.json();
      return articulo;
    } catch (error) {
      console.error("Error al modificar articulo:", error);
      throw error;
    }
  }

  async modificarRubro(id, id_empresa, nombre, archivoImagen, logo_url = "") {
    let urlLogoEmpresa = logo_url;

    // Solo subir imagen si se proporcionó una nueva
    if (archivoImagen) {
      urlLogoEmpresa = await this.subirImagen(archivoImagen, logo_url);
    }

    const bodyData = {
      id: id,
      id_empresa: id_empresa,
      nombre: nombre,
      logo_url: urlLogoEmpresa,
    };

    try {
      const response = await fetch(`/rubro/modificar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Error desconocido al modificar rubro" }));
        throw new Error(
          errorData.message ||
            `Error al modificar el rubro: ${response.status}`,
        );
      }

      // El backend debe devolver el objeto del nuevo rubro modificado.
      return await response.json();
    } catch (error) {
      console.error("Error al modificar articulo:", error);
      throw error;
    }
  }

  async conocerEmpresa(id_empresa) {
    // Validación básica
    if (!id_empresa || isNaN(parseInt(id_empresa))) {
      throw new Error("ID de empresa inválido");
    }

    const bodyData = { id_empresa: parseInt(id_empresa) };

    return await this.llamadaAlBackend(
      `/empresa/mostrar/id`,
      bodyData,
      id_empresa,
    );
  }

  async modificarModerador(id, nombre, contrasena) {
    const bodyData = {
      nombre: nombre,
      id: id,
      contrasena: contrasena,
    };

    try {
      const response = await fetch(`/moderador/modificar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "Error desconocido al modificar moderador",
        }));
        throw new Error(
          errorData.message ||
            `Error al modificar el moderador: ${response.status}`,
        );
      }

      // El backend debe devolver el objeto del nuevo moderador creado.
      const moderador = await response.json();
      return moderador;
    } catch (error) {
      console.error("Error al modificar el moderador:", error);
      throw error;
    }
  }

  async modificarEmpresa(
    id,
    nombre,
    telefono,
    ubicacion,
    efectivo,
    tarjeta,
    transferencia,
    imagenesEnArticulos,
    incluirHorarios,
  ) {
    const bodyData = {
      id: id,
      nombre: nombre,
      telefono: telefono,
      ubicacion: ubicacion,
      efectivo: efectivo,
      tarjeta: tarjeta,
      transferencia: transferencia,
      imagenesEnArticulos: imagenesEnArticulos,
      incluirHorarios: incluirHorarios,
    };

    try {
      const response = await fetch(`/empresa/modificar-para-moderador`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Error desconocido al modificar empresa" }));
        throw new Error(
          errorData.message ||
            `Error al modificar la empresa: ${response.status}`,
        );
      }

      // El backend debe devolver el objeto de la nueva empresa creada.
      return await response.json();
    } catch (error) {
      console.error("Error al modificar el empresa:", error);
      throw error;
    }
  }

  async subirVideoArticulo(archivo, id_articulo, id_empresa, video_url) {
    const formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id_articulo", id_articulo);
    formData.append("id_empresa", id_empresa);
    formData.append("video_url", video_url);

    try {
      const response = await fetch(`/articulo/subir-video`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Error desconocido al subir video" }));
        throw new Error(
          errorData.message || `Error al subir video: ${response.status}`,
        );
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async subirVideoRubro(archivo, id_rubro, id_empresa, video_url) {
    const formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id_rubro", id_rubro);
    formData.append("id_empresa", id_empresa);
    formData.append("video_url", video_url);

    try {
      const response = await fetch(`/rubro/subir-video`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Error desconocido al subir video" }));
        throw new Error(
          errorData.message || `Error al subir video: ${response.status}`,
        );
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async eliminarVideoArticulo(id_articulo, video_url, id_empresa) {
    const bodyData = {
      id_articulo: id_articulo,
      video_url: video_url,
      id_empresa: id_empresa,
    };

    try {
      const response = await fetch(`/articulo/eliminar-video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Error desconocido al eliminar video" }));
        throw new Error(
          errorData.message || `Error al eliminar el video: ${response.status}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error al eliminar el video:", error);
      throw error;
    }
  }

  async eliminarVideoRubro(id_rubro, video_url, id_empresa) {
    const bodyData = {
      id_rubro: id_rubro,
      video_url: video_url,
      id_empresa: id_empresa,
    };

    try {
      const response = await fetch(`/rubro/eliminar-video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Error desconocido al eliminar video" }));
        throw new Error(
          errorData.message || `Error al eliminar el video: ${response.status}`,
        );
      }

      return await response.json();
    } catch (error) {
      return error;
    }
  }

  async loguearAdministrador(nombre, contrasena) {
    try {
      // Realiza el fetch a la URL 'admin/login/nombre/contrasena'
      const response = await fetch(`/admin/login/${nombre}/${contrasena}`);

      // Verifica si la respuesta HTTP es exitosa
      if (!response.ok) {
        throw new Error(`Error en el servidor: ${response.status}`);
      }

      return await response.json(); // Esto debería ser 'true' o 'false'
    } catch (error) {
      console.error("Error en loginAdministrador:", error);
      // Propagamos el error para que la pantalla lo maneje
      throw error;
    }
  }

  async obtenerModerador(id_empresa) {
    try {
      // Verifica si la empresa ya tiene un moderador asignado
      const bodyData = {
        id_empresa: id_empresa,
      };
      const Moderador = await fetch(`/moderador/obtener-por-empresa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      const moderador = await Moderador.json();
      return moderador;
    } catch (error) {
      console.error(
        `Error al obtener el moderador de la empresa con ID ${id_empresa}`,
        error,
      );
      // Propagamos el error para que la pantalla lo maneje
      throw error;
    }
  }

  limpiarDescripcion(texto) {
    if (!texto) return "";
    // Reemplaza saltos de línea (\r, \n, \r\n) por una coma y espacio
    return texto.replace(/[\r\n]+/g, ", ").trim();
  }

  async guardarHorarios(horarios, id_empresa) {
    const bodyData = {
      id_empresa: id_empresa,
      horarios: horarios,
    };

    const response = await fetch(`/empresa/guardar-horarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      const err = await response
        .json()
        .catch(() => ({ error: "Error guardando horarios" }));
      throw new Error(err.error || "Error guardando horarios");
    }

    return await response.json();
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

  async loguearModerador(nombre, contrasena, id_empresa) {
    try {
      const bodyData = {
        nombre: nombre,
        contrasena: contrasena,
        id_empresa: id_empresa,
      };
      const responseBack = await fetch(`/moderador/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      const response = await responseBack.json();

      // Verifica si la respuesta HTTP es exitosa
      if (!responseBack.ok || !response) {
        return this.loguearAdministrador(nombre, contrasena);
      }

      return await response; // Esto debería ser 'true' o 'false'
    } catch (error) {
      console.error("Error en loginModerador:", error);
      // Propagamos el error para que la pantalla lo maneje
      throw error;
    }
  }
}
