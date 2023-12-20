import React, { useState, useEffect } from 'react';
import { auth, fs } from '../Config/Config';
import Navbar from './Navbar';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState(null);
    const [prodTotal, setProdTotal] = useState(0);

    useEffect(() => {
        const uid = auth.currentUser.uid;

        const GetOrder = fs.collection('Orden').where('compradorID', '==', uid)
            .onSnapshot(snapshot => {
                const userOrders = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setOrders(userOrders);
                GetOrder(userOrders);
            });

        const getUsr = auth.onAuthStateChanged(currentUser => {
            if (currentUser) {
                fs.collection('users')
                    .doc(currentUser.uid)
                    .get()
                    .then(snapshot => {
                        setUser(snapshot.data());
                    });
            } else {
                setUser(null);
            }
        });

        const getCartProducts = auth.onAuthStateChanged(user => {
            if (user) {
                fs.collection('Carrito ' + user.uid).onSnapshot(snapshot => {
                    const cantidad = snapshot.docs.length;
                    setProdTotal(cantidad);                 
                });
            } else {
                console.log('user is not signed in to retrieve cart');
            }
        });

        return () => {
            GetOrder();
            getUsr();
            getCartProducts();
        };
    }, []);


    return (
        <div>
            <Navbar user={user} prodTotal={prodTotal} />
            <h1 className='text-center'>Tus ordenes</h1>
            {orders.length > 0 ? (
                <table className="table table-striped" style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID de Orden</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Fecha</th>
                         
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Productos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <React.Fragment key={order.id}>
                                <tr>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.id}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.fecha}</td>
                                  
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                      
                                        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                                            <thead>
                                                <tr>
                                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Producto</th>
                                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Cantidad</th>
                                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Direccion de envio</th>
                                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Imagen</th>
                                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Estado</th>
                                                    
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {order.productos.map(producto => (
                                                    <tr key={producto.productoID}>
                                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{producto.nombre}</td>
                                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{producto.cantidad}</td>
                                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.Direccion}</td>
                                                        
                                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                            <img src={producto.photo} alt={producto.nombre} style={{ width: '50px', height: '50px' }} />
                                                        </td>
                                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{producto.estado}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr key={`divider-${order.id}`}>
                                    <td colSpan="3" style={{ border: '1px solid #ccc', padding: '8px' }}></td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No hay órdenes disponibles.</p>
            )}
        </div>
    );
};

export default Orders;
