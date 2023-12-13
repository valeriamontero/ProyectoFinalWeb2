import React, { useState, useEffect } from 'react';
import { auth, fs } from '../Config/Config';
import Navbar from './Navbar'; // Asegúrate de importar tu componente de Navbar si aún no lo has hecho

const VerOrden = () => {
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const uid = auth.currentUser.uid;
    
        const unsubscribe = fs.collection('Orden').onSnapshot(snapshot => {
            const userOrders = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                productos: doc.data().productos.filter(producto => producto.vendedor === uid)
            })).filter(order => order.productos.length > 0);
    
            setOrders(userOrders);
        });
    
        return () => unsubscribe();
    }, []);
    


    useEffect(() => {
        const getUsr = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                fs.collection('users')
                    .doc(currentUser.uid)
                    .get()
                    .then((snapshot) => {
                        setUser(snapshot.data());
                    });
                  
            } else {
                setUser(null);
            }
        });

        return () => getUsr();
    }, []);

    // Función para actualizar el estado del producto en Firebase
    const updateProductState = (orderId, productId, newState) => {
        const orderRef = fs.collection('Orden').doc(orderId);
        orderRef.get().then(doc => {
            if (doc.exists) {
                const orderData = doc.data();
                const updatedProducts = orderData.productos.map(producto => {
                    if (producto.productoID === productId) {
                        return { ...producto, estado: newState };
                    }
                    return producto;
                });

                orderRef.update({ productos: updatedProducts });
            }
        });
    };

    // Resto de tu código para mostrar las órdenes y los productos

    return (
        <div>
            <Navbar user={user} />
            <h1>Órdenes</h1>
            {orders.length > 0 ? (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID de Orden</th>
                            <th>Estado</th>
                            <th>Productos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.estado}</td>
                                <td>
                                    {/* Mostrar los productos y sus estados con selectores */}
                                    {order.productos.map(producto => (
                                        <div key={producto.productoID}>
                                            <span>{producto.productoID}</span>
                                          
                                            <select
                                                value={producto.estado}
                                                onChange={(e) => updateProductState(order.id, producto.productoID, e.target.value)}
                                            >
                                                <option value="pendiente">Pendiente</option>
                                                <option value="enviado">Enviado</option>
                                                {/* Agrega más opciones de estado según tus necesidades */}
                                            </select>
                                        </div>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No hay órdenes disponibles.</p>
            )}
        </div>
    );
};

export default VerOrden;
