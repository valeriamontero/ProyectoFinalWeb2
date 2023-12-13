import React from 'react';
import Navbar from './Navbar';
import { auth, fs } from '../Config/Config';
import { useEffect, useState } from 'react';
import CarritoProductos from './CarritoProductos';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2'




export default function Carrito(){

    const history = useNavigate();



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
console.log(precioTotal);

 

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

    //Cantidad para el icono de carrito
const [prodTotal, setprodTotal] = useState(0);

//get productos carrito

useEffect(() => {
    auth.onAuthStateChanged(user => {
        if (user) {
            fs.collection('Carrito ' + user.uid).onSnapshot(snapshot => {
                const cantidad = snapshot.docs.length;
                setprodTotal(cantidad);                 
            });
        } else {
            console.log('user is not signed in to retrieve cart');
        }
    });
}, []);


//PAGOS      Tarjeta de prueba. Numero: 4242 4242 4242 4242. Fecha: la fecha actual. CVC: 242. 

const handleToken = async (token) => {
    const carrito = { name: 'Todos los productos', precioTotal };
    const response = await axios.post('http://localhost:8080/pago', {
        token,
        carrito
    });

    let { estatus } = response.data;
    if (estatus === 'success') {
        try {
            // Crear la orden en Firebase
            const uid = auth.currentUser.uid;
            const carritos = await fs.collection('Carrito ' + uid).get();
            const nuevaOrdenRef = await fs.collection('Orden').doc(); // Crea un nuevo documento para la orden
    
            // Aquí se creará la estructura de la orden con los productos del carrito
            const productosOrden = [];
    
            for (var snap of carritos.docs) {
                const carritoProducto = snap.data();
    
                const productoOrden = {
                    productoID: carritoProducto.ID,
                    cantidad: carritoProducto.cantidad,
                    estado: 'pendiente',
                    vendedor: carritoProducto.addedBy, // Utiliza el campo 'addedBy' como el vendedor del producto
                    nombre: carritoProducto.title,
                    photo: carritoProducto.url,
                    precio: carritoProducto.total,
                  
                };
    
                productosOrden.push(productoOrden);
    
                // Elimina el producto del carrito
                await fs.collection('Carrito ' + uid).doc(snap.id).delete();
            }
    
            // Guarda todos los productos en la nueva orden
            await nuevaOrdenRef.set({
                compradorID: uid,
                Direccion: user.Direccion,
                productos: productosOrden,
                estado: 'pendiente',
               
            });
    
            // Mostrar un mensaje o realizar otras acciones después de completar la operación
            history('/');
            Swal.fire({
                title: "¡Éxito!",
                text: "Se ha completado la orden y vaciado el carrito.",
                icon: "success"
            });
        } catch (error) {
            console.error('Error:', error);
            // Manejar errores si ocurre alguno durante el proceso
        }
    }
    
};






    return (
        <>
       
        <Navbar user={user} prodTotal={prodTotal}/>
        <br></br>
        <div>
         <h1 className="text-center">Carrito de Compras</h1>
        </div>

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
                    <StripeCheckout
                    stripeKey = 'pk_test_51OMbT7D66JOqoGT6gEz3eMg7LWd83tmc2se4fGbODITgoy2OUblhQNki1Yqd0KuECSaimWvsLfisOrWvqRLvSC8900cEPG6Vc3'
                    token = {handleToken}
                    billingAddress
                    shippingAddress
                    name = 'All Products'
                    amount = {precioTotal * 100}

                        
                    ></StripeCheckout>
                    
                </div>
            </div>
        ) : (
            
            <div className='container-fluid text-center'>No hay productos...</div>
        )}
    </>
    
    
        
    );
}