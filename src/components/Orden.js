import React, { useState, useEffect } from 'react';
import { auth, fs } from '../Config/Config';
import Navbar from './Navbar'; // Asegúrate de importar tu componente de Navbar si aún no lo has hecho

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const uid = auth.currentUser.uid;

        // Obtener las órdenes del usuario actual desde Firestore
        const unsubscribe = fs.collection('Orden').where('compradorID', '==', uid)
            .onSnapshot(snapshot => {
                const userOrders = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
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
    <div>
        <Navbar user={user} prodTotal={prodTotal} />
        <h1>Órdenes del Usuario</h1>
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
                                {/* Mostrar la lista de productos de la orden */}
                                <ul>
                                    {order.productos.map(producto => (
                                        <li key={producto.productoID}>
                                            <img src={producto.photo} alt={producto.nombre} style={{ width: '50px', height: '50px' }} />
                                            {producto.nombre}
                                        </li>
                                    ))}
                                </ul>
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

export default Orders;
