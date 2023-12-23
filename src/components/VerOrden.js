import React, { useState, useEffect } from 'react';
import { auth, fs } from '../Config/Config';
import Navbar from './Navbar'; // Asegúrate de importar tu componente de Navbar si aún no lo has hecho

const VerOrden = () => {
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState(null);
    const [cantidadTotal, setCantidadTotal] = useState(0);
    const [precioTotal, setPrecioTotal] = useState(0);


    // Obtener las órdenes de los productos que le corresponden al vendedor acutal
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

//calculo de estadisticas usando cantidad y precio.
    const calcularEstadisticas = () => {
        let totalCantidad = 0;
        let totalPrecio = 0;

        orders.forEach(order => {
            order.productos.forEach(producto => {
                totalCantidad += producto.cantidad;
                totalPrecio += producto.cantidad * producto.precio;
            });
        });

        setCantidadTotal(totalCantidad);
        setPrecioTotal(totalPrecio);
    };

    useEffect(() => {
        calcularEstadisticas();
    }, [orders]);
    


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

  

    return (
        <div>
            <Navbar user={user} />
            <h1>Órdenes</h1>
            {orders.length > 0 ? (
                <div>
                    
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>ID de Orden</th>
                                <th>Fecha</th>
                                <th>Estado</th>
                                <th>Dirección de envío</th>
                                <th>Productos</th>
                            </tr>
                        </thead>
                        <tbody>
                        {orders.map(order => (
    <tr key={order.id}>
        <td>{order.id}</td>
        <td>{order.fecha}</td>
        <td>{order.estado}</td>
        <td>{order.Direccion}</td>
        <td>
            <ul>
                {order.productos.map(producto => (
                    <li key={producto.productoID}>
                        <span>{producto.nombre}</span>
                        {/* Mostrar la cantidad del producto */}
                        <span> || Cantidad: {producto.cantidad}  ||  </span> 
                        <select
                            value={producto.estado}
                            onChange={(e) => updateProductState(order.id, producto.productoID, e.target.value)}
                        >
                            <option value="pendiente">Pendiente</option>
                            <option value="enviado">Enviado</option>
                        </select>
                    </li>
                ))}
            </ul>
        </td>
    </tr>
))}
                        </tbody>
                        <br></br>
                
                        <h2>Estadísticas de ventas</h2>
                    <p>Cantidad total vendida: {cantidadTotal}</p>
                    <p>Precio total vendido: {precioTotal}</p>    </table>
                </div>
            ) : (
                <p>No hay órdenes disponibles.</p>
            )}
        </div>
    );
};

export default VerOrden;