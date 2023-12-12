import React from 'react';
import Navbar from './Navbar';
import { auth, fs } from '../Config/Config';
import { useEffect, useState } from 'react';


export default function Carrito(){
    function GetUser(){
        const [user, setUser] = useState(null);
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
        return user;
    }

    const user = GetUser();
   console.log(user)
    
// get productos carrito


const [products, setProducts] = useState([]);

useEffect(()=>{
    auth.onAuthStateChanged(user=>{
        if(user){
            fs.collection('Carrito ' + user.uid).onSnapshot(snapshot=>{
                const newCart = snapshot.docs.map((doc)=>({
                    ID: doc.id,
                    ...doc.data(),
                }));
                setProducts(newCart);                    
            })
        }
        else{
            console.log('user is not signed in to retrieve cart');
        }
    })
},[])

console.log(products);





    return (
       <>
        <Navbar user={user}/>
        <br></br>

       </>
       
           

       
    )
}