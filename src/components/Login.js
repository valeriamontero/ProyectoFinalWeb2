import React,{useState} from "react"
import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { auth, fs } from '../Config/Config';




export default function Signup(){

    const history = useNavigate();


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('')
    const [exito, setExito] = useState('')



    const handleLogin=(e)=>{
        e.preventDefault()
        auth.signInWithEmailAndPassword(email,password).then(()=>{
            setExito('Inicio de Sesion Exitoso. Serás redirigido a la página de inicio en 5 segundos')
            setEmail('')
            setPassword('')
            setError('')
            setTimeout(()=>{
                setExito('')
                history('/')
            },5000)
        }).catch((error=>setError(error.message)))
       
    };


    return(
        <div className='container'>
            <br></br>
            <h1>Inicio de Sesion</h1>
            <hr></hr>
            {exito &&<> <div className='success-msg'>{exito}</div>
            </>}
            <form className='form=group' onSubmit={handleLogin}>
                <label>Email</label>
                <input type='text' className='form-control' placeholder='Nombre Completo' required onChange={(e)=>setEmail(e.target.value)} value={email}></input>
                <br/><br/>
                <label>Password</label>
                <input type='password' className='form-control' placeholder='Nombre Completo' required onChange={(e)=>setPassword(e.target.value)} value={password}></input>
                <br/><br/>


                <div className='btn-box'>
                    <span>No tienes una cuenta? Registrarse
                        <Link to='/signup'> Aqui</Link></span>
                    <button type="submit" className='btn btn-success btn-md'>Iniciar Sesion</button>
                </div>
                


            </form>
            {error && <> <div className='error-msg'>{error}</div>
            <br></br>
            </>}

        </div>
    )
}