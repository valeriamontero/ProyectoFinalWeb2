import IndivProduct from './IndivProduct';

export default function Products({ products, addToCart }) {
  return products.map((individualProduct) => (
    <IndivProduct 
      key={individualProduct.ID} 
      individualProduct={individualProduct} 
      addToCart={addToCart}
    />
  ));
}
