import React from 'react';
import Navbar from './Navbar';
import { auth, fs } from '../Config/Config';
import { useEffect, useState } from 'react';
import CarritoProductos from './CarritoProductos';
import StripeCheckout from 'react-stripe-checkout';


export default function Carrito(){
    function GetUser(){
        const [user, setUser] = useState(null);
        useEffect(() => {
            const getUsr = auth.onAuthStateChanged(currentUser => {
                if (currentUser) {
                    fs.collection('users').doc(currentUser.uid).get().then(snapshot => {
                        setUser(snapshot.data());
                    });
                } else {
                    setUser(null);
                }
            });
    
            return () => getUsr(); 
        }, []);
        return user;
    }

    const user = GetUser();
   console.log(user)
    
    // Obtener productos del carrito
    const [carritoProductos, setCarritoProductos] = useState([]);

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                fs.collection('Carrito ' + user.uid).onSnapshot(snapshot => {
                    const newCart = snapshot.docs.map(doc => ({
                        ID: doc.id,
                        ...doc.data(),
                    }));
                    setCarritoProductos(newCart);                    
                })
            } else {
                console.log('user is not signed in to retrieve cart');
            }
        })
    },[]);

    console.log(carritoProductos);


    //cantidad total del carrito:
const cantidad = carritoProductos.map((carritoProducto) => {
    return carritoProducto.cantidad;
})

//juntar los arrays en uno solo
const arraysCantidad = (param1, param2) => param1 + param2;
const cantidadTotal = cantidad.reduce(arraysCantidad, 0);
 console.log(cantidadTotal);



 //precio total del carrito

 const precio = carritoProductos.map((carritoProducto) => {
    return carritoProducto.total;
 })

 const arraysPrecio = (param1, param2) => param1 + param2;
 const precioTotal = precio.reduce(arraysPrecio, 0);


 

    //Subir Producto
    let Producto;
    const SubirProducto=(carritoProductos)=>{
        //console.log(carritoProductos)
        Producto=carritoProductos;
        Producto.cantidad=Producto.cantidad+1;
        Producto.total=Producto.cantidad*Producto.price;
        //actualizar firebase
        auth.onAuthStateChanged(user=>{
            if(user){
                fs.collection('Carrito '+user.uid).doc(carritoProductos.ID).update(Producto).then(()=>{
                    console.log("Incrementado exitoso");
                })
            }
            else{
                console.log("No hay usuario")
            }
        })
    }

    //bajar producto

    const BajarProducto=(carritoProductos)=>{
        //console.log(carritoProductos)
        Producto=carritoProductos;
        if(Producto.cantidad >1) {
            Producto.cantidad=Producto.cantidad-1;
            Producto.total=Producto.cantidad*Producto.price;

        }
        //actualizar firebase
        auth.onAuthStateChanged(user=>{
            if(user){
                fs.collection('Carrito '+user.uid).doc(carritoProductos.ID).update(Producto).then(()=>{
                    console.log("Decremento exitoso");
                })
            }
            else{
                console.log("No hay usuario")
            }
        })
    }




    return (
        <>
        <Navbar user={user} />
        <br></br>
        {carritoProductos.length > 0 ? (
            <div className='container-fluid'>
                <h1 className='text-center'>Carrito de compras</h1>
                <div className='products-box'>
                    <CarritoProductos
                        carritoProductos={carritoProductos}
                        SubirProducto={SubirProducto}
                        BajarProducto={BajarProducto}
                    />
                </div>
                <div className='summary-box'>
                    <h5>Cart Summary</h5>
                    <br></br>
                    <div>Total No of Products: <span>{cantidadTotal}</span></div>
                    <div>Total Price to Pay: <span>$ {precioTotal}</span></div>
                    <br></br>
                    <StripeCheckout></StripeCheckout>
                </div>
            </div>
        ) : (
            <div className='container-fluid'>No hay productos...</div>
        )}
    </>
    
    
        
    );
}