import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Products from './Products';
import { auth, fs } from '../Config/Config';

const Inicio = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(currentUser => {
            if (currentUser) {
                fs.collection('users').doc(currentUser.uid).get().then(snapshot => {
                    setUser(snapshot.data().Nombre);
                });
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe(); // Limpiar la suscripción al desmontar el componente
    }, []);

    console.log(user);

    return (
        <>
            <Navbar user={user} />
            <Products />
        </>
    );
};

export default Inicio;
