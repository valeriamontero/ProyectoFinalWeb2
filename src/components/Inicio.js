import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Products from './Products';
import { auth, fs } from '../Config/Config';
import {Swal} from 'sweetalert2';

const Inicio = () => {
    const [user, setUser] = useState(null);
    


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



    return (
        <>
            <Navbar user={user} />
            {products.length > 0 && (
                <div className='container-flui'>
                <h1 className='text-center'>Productos</h1>
                <div className='products-box'> 
                <Products products={products} />
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
