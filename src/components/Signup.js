import React,{useState} from "react"
import { useNavigate } from 'react-router-dom';
import { auth, fs } from '../Config/Config';
import {Link} from 'react-router-dom'

export default function Signup() {
    const history = useNavigate();

    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState('');

    const [error, setError] = useState('');
    const [exito, setExito] = useState('');

    const handleSignup = (e) => {
        e.preventDefault();
        auth.createUserWithEmailAndPassword(email, password).then((credentials) => {
            fs.collection('users').doc(credentials.user.uid).set({
                Nombre: nombre,
                Email: email,
                Password: password,
            }).then(() => {
                setExito('Registro Exitoso. Serás redirigido a la página de inicio de sesión en 5 segundos');
                setNombre('');
                setEmail('');
                setPassword('');
                setRol('');
                setError('');
                setTimeout(() => {
                    setExito('');
                    history('/login'); 
                }, 5000);
            }).catch((error) => {
                setError(error.message);
            });
        }).catch((error) => {
            setError(error.message);
        });
    };

    return (
        <div className='container'>
             <br></br>
            <h1>Registro</h1>
            <hr></hr>
            {exito &&<> <div className='success-msg'>{exito}</div>
            </>}
            <br></br>
            <form className='form=group' onSubmit={handleSignup}>
                <label>Nombre Completo</label>
                <input type='text' className='form-control' placeholder='Nombre Completo' required onChange={(e)=>setNombre(e.target.value)} value={nombre}></input>
                <br/><br/>
                <label>Email</label>
                <input type='text' className='form-control' placeholder='Nombre Completo' required onChange={(e)=>setEmail(e.target.value)} value={email}></input>
                <br/><br/>
                <label>Password</label>
                <input type='password' className='form-control' placeholder='Nombre Completo' required onChange={(e)=>setPassword(e.target.value)} value={password}></input>
                <br/><br/>

                <div class="dropdown show">
                <a class="btn btn-secondary dropdown-toggle" href="#null" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Dropdown link
                </a>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                    <a class="dropdown-item" href="#Vendedor">Vendedor</a>
                    <a class="dropdown-item" href="#Comprador">Comprador</a>
                </div>
                </div>

                <br/><br/>
                <br/><br/>


                <div className='btn-box'>
                    <span>Ya tienes una cuenta? Ingresar
                        <Link to='/login'> Aqui</Link></span>
                    <button type="submit" className='btn btn-success btn-md'>Registrarse</button>
                </div>
                


            </form>
            {error && <> <div className='error-msg'>{error}</div>
            <br></br>
            </>}
        </div>
    );
}

