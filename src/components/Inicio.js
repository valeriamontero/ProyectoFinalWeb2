import React, { useState, useEffect} from 'react';
import Navbar from './Navbar';
import Products from './Products';
import { auth, fs } from '../Config/Config';
import {Swal} from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Dropdown, ButtonGroup, Button } from 'react-bootstrap';


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
    const [categoria, setCategoria] = useState(null);
    const [categoriaNombre, setCategoriaNombre] = useState('Todos los productos');
    const [busqueda, setBusqueda] = useState('');
    const [precioFiltro, setPrecioFiltro] = useState(null);

    const getProducts = async () => {
    try {
        let productsRef = fs.collection('Products');

        // Cambia la lógica para usar búsqueda o categoría
        if (busqueda) {
            const titleLower = busqueda.toLowerCase().trim();

            productsRef = productsRef.where('title_lower', '>=', titleLower)
                                    .where('title_lower', '<=', titleLower + '\uf8ff');
        } else if (categoria) {
            productsRef = productsRef.where('category', '==', categoria);
        } else if (precioFiltro === 'mayor') {
            // Ordenar por precio de mayor a menor
            productsRef = productsRef.orderBy('price', 'desc'); 
        } else if (precioFiltro === 'menor') {
            // Ordenar por precio de menor a mayor
            productsRef = productsRef.orderBy('price', 'asc'); 
        }

        const productsSnapshot = await productsRef.get();
        const filteredProducts = [];

        productsSnapshot.forEach((doc) => {
            const data = doc.data();
            data.ID = doc.id;
            data.image = data.url;
            filteredProducts.push(data);
        });

        setProducts(filteredProducts);
    } catch (error) {
        console.error('Error getting products: ', error);
    }
};

useEffect(() => {
    getProducts();
}, [busqueda, categoria, precioFiltro]);


    const handleCategoria = (selectedCategory, categoriaNombre) => {
        setCategoria(selectedCategory);
        setCategoriaNombre(categoriaNombre || 'Todos los productos'); 
        setBusqueda(''); // Limpiar la búsqueda al seleccionar una categoría
    };

    const handleMayor = () => {
        setPrecioFiltro('mayor'); // Marca para filtrar por mayor precio
    };

    const handleMenor = () => {
        setPrecioFiltro('menor'); // Marca para filtrar por menor precio
    };
    
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

                    <div className="dropdown">
            <Dropdown as={ButtonGroup}>
                <Button variant="secondary" id="dropdown-basic">
                    {precioFiltro ? (precioFiltro === 'mayor' ? 'Mayor precio' : 'Menor precio') : 'Filtrar por precio'}
                </Button>

                <Dropdown.Toggle split variant="secondary" id="dropdown-split-basic" />

                <Dropdown.Menu>
                    <Dropdown.Item onClick={handleMayor}>Mayor a menor</Dropdown.Item>
                    <Dropdown.Item onClick={handleMenor}>Menor a mayor</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
                    
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
    </>

    
);
};

export default Inicio;
