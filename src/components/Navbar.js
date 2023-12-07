import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../Imagenes/logo.png';
import { Icon } from 'react-icons-kit';
import { shoppingCart } from 'react-icons-kit/fa/shoppingCart';
import {auth} from '../Config/Config'
import { useNavigate } from 'react-router-dom';
import {Swal} from 'sweetalert2';


export default function Navbar({user}) {

    const navigate = useNavigate();
    const vendedor = user && user.Rol ==='Vendedor';

    const handleLogout = () => {
        auth.signOut().then(()=>{
            console.log('Ha cerrado sesion');
            navigate('/login');
        })
    }

  


    const navbarStyle = {
        backgroundColor: '#F1EFE7' // Color hexadecimal deseado
    };

    return (
        <div className='navbar' style={navbarStyle}>
            <div className='leftside'>
                <div className='logo'>
                    <img src={logo} alt='logo' />
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
                            <Link className='navlink' to='/'>
                                {user.Nombre}
                            </Link>
                        </div>
                        {!vendedor && (
                            <div className='cart-menu-btn'>
                                <Link className='navlink' to='/cart'>
                                    <Icon icon={shoppingCart} size={20} />
                                </Link>
                                {/* <span className='cart-indicator'>{totalQty}</span> */}
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
