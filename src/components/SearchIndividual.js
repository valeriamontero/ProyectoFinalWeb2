export default function SearchIndividual ({SearchIndividual, addToCart}) {
    const handleAddToCart=()=>{
        addToCart(SearchIndividual);
    }

    return (
        <div className='product'>
            <div className='product-img'>
                <img src={SearchIndividual.url} alt="product-img"/>
            </div>
            <div className='product-text title'>{SearchIndividual.title}</div>
            <div className='product-text description'>{SearchIndividual.description}</div>
            <div className='product-text price'>$ {SearchIndividual.price}</div>
            <div className='btn btn-danger btn-md cart-btn' onClick={handleAddToCart}>ADD TO CART</div>
        </div> 
    )
}