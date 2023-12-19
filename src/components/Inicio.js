import React, { useState, useEffect} from 'react';
import Navbar from './Navbar';
import Products from './Products';
import { auth, fs } from '../Config/Config';
import {Swal} from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Dropdown, ButtonGroup, Button } from 'react-bootstrap';
import Footer from './Footer';


const Inicio = () => {
    const [user, setUser] = useState(null);
    const history = useNavigate();
    const [precioMinimo, setPrecioMinimo] = useState('');
    const [precioMaximo, setPrecioMaximo] = useState('');
    


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
    const [categoria, setCategoria] = useState(null);
    const [categoriaNombre, setCategoriaNombre] = useState('Todos los productos');
    const [busqueda, setBusqueda] = useState('');
    const [precioFiltro, setPrecioFiltro] = useState(null);

    const getProducts = async () => {
        try {
            let productsRef = fs.collection('Products');
    

            if (busqueda) {
                const titleLower = busqueda.toLowerCase().trim();
                productsRef = productsRef.where('title_lower', '>=', titleLower)
                    .where('title_lower', '<=', titleLower + '\uf8ff');
            }
            if (categoria) {
                productsRef = productsRef.where('category', '==', categoria);
            }
    
            let filteredProducts = await productsRef.get();
    
            // Si hay filtros de precio, aplicarlos a la colección filtrada actual
            if (precioMinimo !== '' && precioMaximo !== '') {
                filteredProducts = filteredProducts.docs.filter(doc => {
                    const price = parseFloat(doc.data().price);
                    return price >= parseFloat(precioMinimo) && price <= parseFloat(precioMaximo);
                });
            }
    
            const formattedProducts = filteredProducts.map(doc => {
                const data = doc.data();
                data.ID = doc.id;
                data.image = data.url;
                return data;
            });
    
            setProducts(formattedProducts);
        } catch (error) {
            console.error('Error getting products: ', error);
        }
    };




    const handleCategoria = (selectedCategory, categoriaNombre) => {
        setCategoria(selectedCategory);
        setCategoriaNombre(categoriaNombre || 'Todos los productos');
        setBusqueda('');
    };

    const handleFiltrarPorRango = (min, max) => {
        setPrecioMinimo(min);
        setPrecioMaximo(max);
    };

    //cargar la pagina siempre con todos los productos

    useEffect(() => {
        handleFiltrarPorRango('0', '1000000');
    }, []); 

    useEffect(() => {
        getProducts();
    }, [busqueda, categoria, precioMinimo, precioMaximo]);
    
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


//************************************************************ */
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





return (
    <>
        <Navbar user={user} prodTotal={prodTotal} />
        <div className='container-fluid d-flex'>
            <div className='filter-menu'>
                <div className='filter-box'>
                    <h6>Buscar por nombre</h6>
                <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar"
                />
                    <br></br>
                    <h6>Filtrar por categoría</h6>
                    <span onClick={() => handleCategoria(null)}>Todos los productos</span>
                    <span onClick={() => handleCategoria('mountain', 'Bicicletas de montaña')}>
                        Bicicleta de montaña
                    </span>
                    <span onClick={() => handleCategoria('carretera', 'Bicicletas de carretera')}>
                        Bicicleta de carretera
                    </span>
                    <span onClick={() => handleCategoria('electricas', 'Bicicletas electricas')}>
                        Bicicleta electrica
                    </span>
                    <span onClick={() => handleCategoria('infantil', 'Bicicleta infantil')}>
                    Bicicleta infantil
                    </span>
                    <span onClick={() => handleCategoria('repuestos', 'Repuestos y accesorios')}>
                    Repuestos y accesorios
                    </span>
                    <br></br>

                    <h6>Filtrar por rango de precios</h6>
                    <div className="form-check">
                    <input className="form-check-input" type="radio" name="precioRadio" id="todosPrecios" onClick={() => handleFiltrarPorRango('0', '1000000')}  defaultChecked="true"/>
                    <label className="form-check-label" htmlFor="todosPrecios">
                    Todos los precios </label></div>

                    <div className="form-check">
                    <input className="form-check-input" type="radio" name="precioRadio" id="rango1" onClick={() => handleFiltrarPorRango('1', '100')}/>
                    <label className="form-check-label" htmlFor="rango1">
                    $1 - $100 </label></div>

                    <div className="form-check">
                    <input className="form-check-input" type="radio" name="precioRadio" id="rango2" onClick={() => handleFiltrarPorRango('100', '500')}/>
                    <label className="form-check-label" htmlFor="rango2">
                    $100 - $500  </label></div>

                    <div className="form-check">
                    <input className="form-check-input" type="radio" name="precioRadio" id="rango3" onClick={() => handleFiltrarPorRango('500', '1000')}/>
                    <label className="form-check-label" htmlFor="rango3">
                    $500 - $1000 </label></div>

                    <div className="form-check">
                    <input className="form-check-input" type="radio" name="precioRadio" id="rango4" onClick={() => handleFiltrarPorRango('1000', '5000')}/>
                    <label className="form-check-label" htmlFor="rango4">
                    $1000 - $5000 </label></div>

                    <div className="form-check">
                    <input className="form-check-input" type="radio" name="precioRadio" id="rango5" onClick={() => handleFiltrarPorRango('5000', '1000000000')}/>
                    <label className="form-check-label" htmlFor="rango5">
                    $5000+ </label></div>

                 

        
                    
                </div>
            </div>
            <div className='products-container'>
                <h1 className='text-center'>{categoriaNombre}</h1>
                <div className='products-box'>
                    {products.length > 0 ? (
                        <Products products={products} addToCart={addToCart} user={user} />
                    ) : (
                        <h1 className='text-center'>No hay productos!</h1>
                    )}
                </div>
            </div>
        </div>
        <Footer />
    </>

    
);
};

export default Inicio;
