import IndivProduct from './IndivProduct';
//Pasar como props a IndivProduct.js
export default function Products({ products, addToCart, user }) {
  return products.map((individualProduct) => (
    <IndivProduct 
      key={individualProduct.ID} 
      individualProduct={individualProduct} 
      addToCart={addToCart}
      user={user} 
    />
  ));
}


