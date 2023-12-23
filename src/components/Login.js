import React,{useState} from "react"
import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { auth, fs } from '../Config/Config';
import '../estilos/login.css'




export default function Signup(){

    const history = useNavigate();


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('')
    const [exito, setExito] = useState('')



    const handleLogin=(e)=>{
        e.preventDefault()
        auth.signInWithEmailAndPassword(email,password).then(()=>{
            setExito('Inicio de Sesion Exitoso. Serás redirigido a la página de inicio')
            setEmail('')
            setPassword('')
            setError('')
            setTimeout(()=>{
                setExito('')
                history('/')
            },1000)
        }).catch((error=>setError(error.message)))
       
    };

    const handleVolver = () => { 
        history('/'); // Redirigir a la página principal
    }


    return(
        <div className='container'>
            <br></br>
            <h1>Inicio de Sesion</h1>
            <hr></hr>
            {exito &&<> <div className='success-msg'>{exito}</div>
            </>}
            <form className='form=group' onSubmit={handleLogin}>
                <label>Correo</label>
                <input type='text' className='form-control' placeholder='Correo electrónico' required onChange={(e)=>setEmail(e.target.value)} value={email}></input>
                <br/><br/>
                <label>Contraseña</label>
                <input type='password' className='form-control' placeholder='Contraseña' required onChange={(e)=>setPassword(e.target.value)} value={password}></input>
                <br/><br/>


                <div className='btn-box'>
                    <span>No tienes una cuenta? Registrarse
                        <Link to='/signup'> Aqui</Link></span>
                        <button className='btn btn-danger btn-md'onClick= {handleVolver}>Volver a Inicio</button>
                    <button type="submit" className='btn btn-success btn-md'>Iniciar Sesion</button>
                    
                </div>
                


            </form>
            {error && <> <div className='error-msg'>{error}</div>
            <br></br>
            </>}

        </div>
    )
}