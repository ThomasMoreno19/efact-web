class Carrito {
  constructor() {
    this.articulos = [];
  }

  agregarArticulo(articulo, precio_activo) {
    let copia = {
      id: null,
      nombre: null,
      cantidad: 1,
      existencia: null,
      tiene_existencia: false,
      precio: null,
      precios: {},
      consultarPrecio: false,
    };

    if (articulo.nombre !== undefined) {
      copia.id = articulo.id;
      copia.nombre = articulo.nombre;
      copia.existencia = articulo.existencia;
      copia.tiene_existencia = articulo.tiene_existencia;
      copia.consultarPrecio = !!articulo.consultarPrecio;

      copia.precios = {
        1: articulo.precio1,
      };
    } else {
      copia.id = articulo.dataset.articuloId;
      copia.nombre = articulo.dataset.nombre;
      copia.existencia = articulo.dataset.existencia;
      copia.tiene_existencia = articulo.dataset.tiene_existencia;
      copia.consultarPrecio = articulo.dataset.consultarPrecio === "true";

      copia.precios = {
        1: articulo.dataset.precio1,
      };
    }

    copia.precio = copia.precios[precio_activo];

    if (this.articulos.includes(copia)) return;

    this.articulos.push(copia);
  }

  eliminarArticulo(articuloId) {
    const idNum = Number(articuloId);
    this.articulos = this.articulos.filter(
      (articulo) => Number(articulo.id) !== idNum,
    );
  }

  cambiarCantidad(nuevaCantidad, articuloId) {
    const articulo = this.articulos.find((art) => art.id === articuloId);
    if (articulo) {
      articulo.cantidad = nuevaCantidad;
    }
  }

  obtenerTotal() {
    const total = this.articulos.reduce((total, articulo) => {
      if (articulo.consultarPrecio) return total;

      return (
        total +
        Number(this.eliminarPuntoPrecio(articulo.precio) * articulo.cantidad)
      );
    }, 0);
    return this.insertarPuntoPrecio(total);
  }

  mostrarArticulos() {
    return this.articulos;
  }

  actualizarPrecios(precio_activo) {
    this.articulos.forEach((articulo) => {
      const precioSinPuntos = this.eliminarPuntoPrecio(articulo.precio);
      articulo.precio = articulo.precios[`${precio_activo}`];
    });
    this.obtenerTotal();
    return this.articulos;
  }

  eliminarPuntoPrecio(precio) {
    return precio.replace(/\./g, "");
  }

  insertarPuntoPrecio(precio) {
    return precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  vaciarCarrito() {
    this.articulos = [];
  }
}
