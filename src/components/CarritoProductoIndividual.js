import React from 'react';
import { Icon } from 'react-icons-kit';
import { minus } from 'react-icons-kit/feather/minus';
import { plus } from 'react-icons-kit/feather/plus';
import {auth,fs} from '../Config/Config';


// renderiza un producto individual con las fuciones de subir y bajar cantidad

export default function CarritoProductoIndividual({ carritoProducto, SubirProducto, BajarProducto }) {

    const handleSubirProducto = () => {
        SubirProducto();
    }

    const handleBajarProducto = () => {
        BajarProducto();
    }

    const handleBorrarCarrito = () => {
        auth.onAuthStateChanged(user=>{
            if(user){
                fs.collection('Carrito ' + user.uid).doc(carritoProducto.ID).delete().then(()=>{
                    console.log('Producto eliminado del carrito')
                }).catch(err=>{
                    console.log(err)
                })
            }
        })
    }





    return (
        <div className='product'>
        <div className='product-img'>
            <img src={carritoProducto.url} alt="product-img"/>
        </div>
        <div className='product-text title'>{carritoProducto.title}</div>
        <div className='product-text description'>{carritoProducto.description}</div>
        <div className='product-text price'>$ {carritoProducto.price}</div>
        <span>Cantidad</span>
        <div className='product-text quantity-box'>
            <div className='action-btns minus' >
                <Icon icon={minus} size={20} onClick={handleBajarProducto}/>
            </div>                
            <div>{carritoProducto.cantidad}</div>               
            <div className='action-btns plus' onClick={handleSubirProducto} >
                <Icon icon={plus} size={20}/>
            </div>
        </div>
        TOTAL:
        <div className='product-text cart-price'>$ {carritoProducto.total}</div>
        <div className='btn btn-danger btn-md cart-btn' onClick={handleBorrarCarrito}>Eliminar</div>            
    </div>

    )
}