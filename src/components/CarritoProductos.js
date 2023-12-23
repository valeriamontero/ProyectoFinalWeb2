import CarritoProductoIndividual from "./CarritoProductoIndividual"
export default function CarritoProductos ({ carritoProductos, SubirProducto, BajarProducto }) {
    return carritoProductos.map((carritoProducto) => (                //carrito productos contiene los productos individuales del carrito
        <CarritoProductoIndividual                                    // recorre cada producto individual del carrito con el map y lo renderiza
            key={carritoProducto.ID} 
            carritoProducto={carritoProducto} 
            SubirProducto={() => SubirProducto(carritoProducto)}
            BajarProducto={() => BajarProducto(carritoProducto)}
        />
    ));
}



// renderiza todos los productos de carrito usando CarritoProductoIndividual.js