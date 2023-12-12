import React, { useState, useEffect} from 'react';
import Navbar from './Navbar';
import Products from './Products';
import { auth, fs } from '../Config/Config';
import {Swal} from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Inicio = () => {
    const [user, setUser] = useState(null);
    const history = useNavigate();
    


    //obtener usuario logueado

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

    

//************************************************************ */

    //PRODUCTOS

    const [products, setProducts] = useState([]);

    const getProducts = async () => {
        try {
            const products = await fs.collection('Products').get();
            const arrayProducts = [];
            products.forEach((doc) => {
                var data = doc.data();
                data.ID = doc.id;
                data.image = data.url;
                arrayProducts.push(data);
            });
            setProducts(arrayProducts);
        } catch (error) {
            console.error('Error getting products: ', error);
        }
    };
    

   useEffect(() => {
       getProducts();
   },[]);

   /**************************************************************** */


   /*****************************Carrito */


    function GetUserUid(){
        const [uid, setUid] = useState(null);
        useEffect(() => {
            auth.onAuthStateChanged(user => {
                if (user) {
                    setUid(user.uid);
                }
            })
        },[])
        return uid;
    }
    const uid = GetUserUid();


    let Producto;
    const addToCart = (product) => {
        if (uid !== null) {
            // console.log(product);
            Producto = product;
            Producto['cantidad'] = 1;
            Producto['total'] = Producto.cantidad * Producto.price;
            fs.collection('Carrito ' + uid).doc(product.ID).set(Producto).then(() => {
                console.log('Producto agregado al carrito');
            });
        } else {
            history('/login');
        }
    };
    


    /****************************************************************** */



    return (
        <>
            <Navbar user={user} />
            {products.length > 0 && (
                <div className='container-flui'>
                <h1 className='text-center'>Productos</h1>
                <div className='products-box'> 
                <Products products={products} addToCart={addToCart} />
                </div>
                </div>
                
            )}
            {products.length < 1 && (
                <div className='container-fluid'>
                    Cargando....

                </div>

            )}
        </>
    );
};

export default Inicio;
