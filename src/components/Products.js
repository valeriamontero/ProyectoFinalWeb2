import IndivProduct from './IndivProduct'

export default function Products({products}){

    return products.map((individualProduct) => (

        <IndivProduct key = {individualProduct.ID} individualProduct = {individualProduct} />

    ))
}