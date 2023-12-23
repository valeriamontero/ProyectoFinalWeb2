import React, { useEffect, useState } from 'react';
import { auth, fs } from '../Config/Config';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Footer from './Footer';


export default function PanelVendedor() {
    const [user, setUser] = useState(null);
    const [userProducts, setUserProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const history = useNavigate();


    // Obtener usuario logueado y su id. Se pasa ese id a la función GetProductosUsuario
    useEffect(() => {
        const getUsr = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                fs.collection('users')
                    .doc(currentUser.uid)
                    .get()
                    .then((snapshot) => {
                        setUser(snapshot.data());
                    });
                    GetProductosUsuario(currentUser.uid);
            } else {
                setUser(null);
            }
        });

        return () => getUsr();
    }, []);

    // Obtener productos del usuario segun si fueron agregados por el id que se consiguió en el useEffect anterior
    const GetProductosUsuario = (userId) => {
        fs.collection('Products')
            .where('addedBy', '==', userId)
            .get()
            .then((querySnapshot) => {
                const products = [];
                querySnapshot.forEach((doc) => {
                    products.push({ id: doc.id, ...doc.data() });
                });
                setUserProducts(products);
            })
            .catch((error) => {
                console.log('Error al obtener productos:', error);
            });
    };

    const handleAgregar = () => {
        history('/add-product')
    }

    const handleSelectProduct = (productId) => {
        setSelectedProductId(productId === selectedProductId ? null : productId);
    }

    const handleModificarProducto = () => {
        if (selectedProductId) {
            history(`/modificar/${selectedProductId}`);
        } else {
            Swal.fire('Error', 'Debe seleccionar un producto para modificarlo', 'error')
        }
    }

    const handleEliminarProducto = () => {
        if (selectedProductId) {
            fs.collection('Products')
                .doc(selectedProductId)
                .delete()
                .then(() => {
                    // Eliminación exitosa, ahora actualizamos la lista de productos
                    const updatedProducts = userProducts.filter(product => product.id !== selectedProductId);
                    setUserProducts(updatedProducts); // Actualizar el estado local
                    setSelectedProductId(null);
                    Swal.fire('Éxito', 'Producto eliminado exitosamente', 'success');
                })
                .catch((error) => {
                    Swal.fire('Error', 'Hubo un problema al eliminar el producto', 'error');
                });
        } else {
            Swal.fire('Error', 'Debe seleccionar un producto para eliminar', 'error');
        }
    };

    const handleVerOrden = () => {
        history('/ver-orden')

    }

    
    
    

    return (
        <div>
            <Navbar user={user} />
            <br />
            <br />
            <div className="container">
                <div className="mb-3">
                    <button className="btn btn-success  me-2" onClick={handleAgregar}>Agregar Producto</button>
                    <button className="btn btn-primary me-2" onClick={handleModificarProducto}>Modificar Producto</button>
                    <button className="btn btn-danger me-2" onClick={handleEliminarProducto}>Eliminar Producto</button>
                    <button className="btn btn-warning me-40" onClick={handleVerOrden}>Ver ordenes</button>
                </div>
                <h2>Mis productos en venta</h2>
                <br/>

                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID del producto</th>
                            <th>Título</th>
                            <th>Precio</th>
                            <th>Categoría</th>
                            <th>Descripción</th>
                            <th>Codigo de usuario vendedor</th>
                            <th>Imagen</th>
                            <th>Cantidad en stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userProducts.map((product) => (
                            <tr key={product.id} onClick={() => handleSelectProduct(product.id)} className={selectedProductId === product.id ? 'table-dark' : ''}>
                                <td>{product.id}</td>
                                <td>{product.title}</td>
                                <td>${product.price}</td>
                                <td>{product.category}</td>
                                <td>{product.description}</td>
                                <td>{product.addedBy}</td>
                                <td>
                                    <img src={product.url} alt={product.title} style={{ maxWidth: '100px' }} />
                                </td>
                                <td>{product.cantidad}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer/>
        </div>
    );
}
