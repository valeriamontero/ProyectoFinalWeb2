import React from 'react';
import ModificarProducto from './ModificarProducto';
import { useParams } from 'react-router-dom';



// pasar el id del producto para saber cual producto se esta modificando
const ModificarProductoIndiv = () => {
  const { productId } = useParams();         // obtener el id del producto por la url

  return <ModificarProducto productId={productId} />;
};

export default ModificarProductoIndiv;
