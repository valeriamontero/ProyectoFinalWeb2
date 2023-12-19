import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../Imagenes/logo.png';
import { Icon } from 'react-icons-kit';
import { shoppingCart } from 'react-icons-kit/fa/shoppingCart';
import {auth} from '../Config/Config'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
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
            Swal.fire ({
                icon: 'success',
                title: 'Ha cerrado sesion',
                showConfirmButton: false,
                timer: 1000,
            })
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
          <div className='navlink'>
            <Link className='navlink' to='/'>
              Inicio
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
                            <Link className='navlink' to="/perfil">
                            Bienvenido:  {user.Nombre}

                            </Link>
                            
                             
                            
                        </div>
                        {!vendedor && (
                    <div className='cart-menu-btn'>
                         <Link className='navlink' to='/orden'>
                            Mis Órdenes
                        </Link>
                        <Link className='navlink' to='/carrito'>
                            <Icon icon={shoppingCart} size={20} />
                        </Link>
                        <span className='cart-indicator'>{prodTotal}</span>
                    </div>

                    
                )}


                        {vendedor && (
                            <div>
                                <Link className='navlink' to='/panel-vendedor'>
                                    Panel de vendedores
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
