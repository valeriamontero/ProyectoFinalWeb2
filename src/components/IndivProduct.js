import Inicio from './Inicio';
import Swal from 'sweetalert2';



export default function IndivProduct({ individualProduct, addToCart, user }) {
    const vendedor = user && user.Rol === 'Vendedor';

    const handleCarrito = () => {
        if (!vendedor) {
            addToCart(individualProduct);
        } else {
            Swal.fire({
                icon: 'info',
                title: 'Oops...',
                text: 'Vendedores no pueden agregar productos al carrito.',
            });
        }
    }

    return (
        <div className='product'>
            <div className='product-img'>
                <img src={individualProduct.image} alt="product-img" />
            </div>

            <div className='product-text title'>{individualProduct.title}</div>
            <div className='product-text description'>{individualProduct.description}</div>
            <div className='product-text price'>${individualProduct.price}</div>

         
            {!vendedor && (
                <div className='btn btn-danger btn-md cart-btn' onClick={handleCarrito}>
                    Añadir al carrito
                </div>
            )}
        </div>
    )
}
