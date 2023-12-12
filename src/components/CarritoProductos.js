import CarritoProductoIndividual from "./CarritoProductoIndividual"
export default function CarritoProductos ({ carritoProductos, SubirProducto, BajarProducto }) {
    return carritoProductos.map((carritoProducto) => (
        <CarritoProductoIndividual 
            key={carritoProducto.ID} 
            carritoProducto={carritoProducto} 
            SubirProducto={() => SubirProducto(carritoProducto)}
            BajarProducto={() => BajarProducto(carritoProducto)}
        />
    ));
}
