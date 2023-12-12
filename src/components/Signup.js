import React,{useState} from "react"
import { useNavigate } from 'react-router-dom';
import { auth, fs } from '../Config/Config';
import {Link} from 'react-router-dom'

export default function Signup() {
    const history = useNavigate();

    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [telefono, setTelefono] = useState('');   
    const [direccion, setDireccion] = useState('');
    const [rol, setRol] = useState('');

    const [error, setError] = useState('');
    const [exito, setExito] = useState('');

    //menu desplegable
    const [activo, setActivo] = useState(false);
    const [tipoCuenta, setTipoCuenta] = useState('');

    const handleSignup = (e) => {
        e.preventDefault();
        auth.createUserWithEmailAndPassword(email, password).then((credentials) => {
            fs.collection('users').doc(credentials.user.uid).set({
                Nombre: nombre,
                Email: email,
                Password: password,
                Telefono: telefono,
                Direccion: direccion,
                Rol: rol,

            }).then(() => {
                setExito('Registro Exitoso. Serás redirigido a la página de inicio de sesión en 3 segundos');
                setNombre('');
                setEmail('');
                setPassword('');
                setTelefono('');
                setDireccion('');
                setRol('');
                setError('');
                setTimeout(() => {
                    setExito('');
                    history('/login'); 
                }, 3000);
            }).catch((error) => {
                setError(error.message);
            });
        }).catch((error) => {
            setError(error.message);
        });
    };




    //menu desplegable
    const activarMenu = () => {
        setActivo(!activo); 
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
                <label>Telefono</label>
                <input type='text' className='form-control' placeholder='Telefono' required onChange={(e)=>setTelefono(e.target.value)} value={telefono}></input>
                <br/><br/>
                <label>Direccion</label>
                <input type='text' className='form-control' placeholder='Direccion' required onChange={(e)=>setDireccion(e.target.value)} value={direccion}></input>
                <br/><br/>
                <label>Email</label>
                <input type='text' className='form-control' placeholder='Email' required onChange={(e)=>setEmail(e.target.value)} value={email}></input>
                <br/><br/>
                <label>Password</label>
                <input type='password' className='form-control' placeholder='Password' required onChange={(e)=>setPassword(e.target.value)} value={password}></input>
                <br/><br/>



                <div className="row">
                    <div className="col-md-6">
                        <div className="dropdown show">
                            <a
                                className="btn btn-secondary dropdown-toggle"
                                href="#null"
                                role="button"
                                id="dropdownMenuLink"
                                onClick={activarMenu}
                                aria-haspopup="true"
                                aria-expanded={activo ? 'true' : 'false'}
                                style={{ width: '200px' }}>
                                Tipo de cuenta
                            </a>
                            <div className={`dropdown-menu${activo ? ' show' : ''}`} aria-labelledby="dropdownMenuLink" style={{ width: '200px' }}>
                                <button className="dropdown-item" onClick={() => { setRol('Vendedor'); activarMenu(); setTipoCuenta('Vendedor') }}>Vendedor</button>
                                <button className="dropdown-item" onClick={() => { setRol('Comprador'); activarMenu(); setTipoCuenta('Comprador') }}>Comprador</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        {/* Mostrar la selección del dropdown */}
                        {tipoCuenta && (
                            <label style={{ marginTop: '10px' }}>Seleccionaste: {tipoCuenta}</label>
                        )}
                    </div>
                </div>
                <br/><br/>


                <div className='btn-box'>
                    <span>Ya tienes una cuenta? Ingresar
                        <Link to='/login'> Aqui</Link></span>
                    <button type="submit" className='btn btn-success btn-md'>Registrarse</button>
                </div>
                <br></br>  <br></br>
                


            </form>
            {error && <> <div className='error-msg'>{error}</div>
            <br></br>
            </>}
        </div>
    );
}

