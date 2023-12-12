export default function IndivProduct({individualProduct, addToCart}){
    //console.log(individualProduct)


    const handleCarrito =() => {
        addToCart(individualProduct);
    }


    
    return (
        <div className='product'>
            <div className='product-img'>
                <img src={individualProduct.image} alt="product-img" />
            </div>

            <div className='product-text title'>{individualProduct.title}</div>
            <div className='product-text description'>{individualProduct.description}</div>
            <div className='product-text price'>${individualProduct.price}</div>
            <div className='btn btn-danger btn-md cart-btn' onClick={handleCarrito}>Añadir al carrito</div>


        </div>
       
    )
}