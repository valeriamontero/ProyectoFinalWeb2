import React from 'react';
import ModificarProducto from './ModificarProducto';
import { useParams } from 'react-router-dom';

const ModificarProductoIndiv = () => {
  const { productId } = useParams();

  return <ModificarProducto productId={productId} />;
};

export default ModificarProductoIndiv;
