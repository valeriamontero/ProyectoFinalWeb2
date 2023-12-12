import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../Imagenes/logo.png';
import { Icon } from 'react-icons-kit';
import { shoppingCart } from 'react-icons-kit/fa/shoppingCart';
import {auth} from '../Config/Config'
import { useNavigate } from 'react-router-dom';
import {Swal} from 'sweetalert2';
import { useState } from 'react';
import { useEffect } from 'react';
import { fs } from '../Config/Config';
import Inicio from './Inicio';


export default function Navbar({user, prodTotal}) {

    const navigate = useNavigate();
    const vendedor = user && user.Rol ==='Vendedor';

    const handleLogout = () => {
        auth.signOut().then(()=>{
            console.log('Ha cerrado sesion');
            navigate('/login');
        })
    }

  


    const navbarStyle = {
        backgroundColor: '#F1EFE7' 
    };


   
    




    return (
        <div className='navbar' style={navbarStyle}>
            <div className='leftside'>
                <div className='logo'>
                    <Link className='navlink' to='/'>
                    <img src={logo} alt='logo' />
                        </Link>
                    
                </div>
            </div>
            <div className='rightside'>
                {!user&&<>
                    <div><Link className='navlink' to="signup"> Registro</Link></div>
                <div><Link className='navlink' to="login"> Iniciar Sesion</Link></div>

                </>}

                {user && (
                    <>
                        <div>
                            
                                Logueado como: {user.Nombre}
                            
                        </div>
                        {!vendedor && (
                            <div className='cart-menu-btn'>
                                <Link className='navlink' to='/carrito'>
                                    <Icon icon={shoppingCart} size={20} />
                                </Link>
                                <span className='cart-indicator'>{prodTotal}</span> 
                            </div>
                        )}


                        {vendedor && (
                            <div>
                                <Link className='navlink' to='/add-product'>
                                    Agregar producto
                                </Link>
                            </div>
                        )}


                        <div className='btn btn-danger btn-md' onClick={handleLogout}>
                            LOGOUT
                        </div>
                    </>
                )}                    



               
            </div>
        </div>
    );
};
