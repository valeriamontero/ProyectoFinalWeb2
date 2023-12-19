import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { auth, fs } from '../Config/Config';
import { Button, Card, CardBody, CardFooter, Container, Table } from 'reactstrap';

export default function Perfil() {
    const [user, setUser] = useState(null);
    const currentUser = auth.currentUser;
    const history = useNavigate();
    const [nuevaDireccion, setNuevaDireccion] = useState('');

    const cargarUsuario = () => {
        if (currentUser) {
            console.log("currentUser.uid:", currentUser.uid);
            fs.collection('users').doc(currentUser.uid).get()
                .then((doc) => {
                    if (doc.exists) {
                        const userData = doc.data();
                        userData.id = doc.id;
                        setUser(userData);
                    } else {
                        console.log('No se encontró el documento!');
                    }
                })
                .catch((error) => {
                    console.log('Error al obtener el documento:', error);
                });
        } else {
            console.log("No hay un usuario actualmente autenticado.");
        }
    };

    useEffect(() => {
        cargarUsuario();
    }, []);

    const handleDireccionClick = () => {
        // Mostrar campo de edición de dirección al hacer clic
        setNuevaDireccion(user.Direccion);
    };

    const handleDireccionChange = (event) => {
        setNuevaDireccion(event.target.value);
    };

    const actualizarDireccion = () => {
        if (currentUser) {
            fs.collection('users').doc(currentUser.uid).update({
                Direccion: nuevaDireccion,
            })
            .then(() => {
                console.log('Dirección actualizada correctamente.');
                setUser(prevUser => ({ ...prevUser, Direccion: nuevaDireccion }));
                setNuevaDireccion('');
            })
            .catch((error) => {
                console.error('Error al actualizar la dirección:', error);
            });
        }
    };

    const HandlerVolver = () => {
        history('/');
    }

    return (
        <Card className='mt-2 border-0 rounded-0 shadow-sm'>
            <CardBody>
                <h3 className='text-uppercase'>Información del usuario</h3>
                {user ? (
                    <Container className='text-center'>
                        <img
                            style={{ maxWidth: '200px', maxHeight: '200px' }}
                            src={user?.image ? user.image : 'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png'}
                            alt="Imagen de perfil"
                            className='img-fluid  rounded-circle'
                        />
                        <Table responsive striped hover bordered={true} className='text-center mt-5'>
                            <tbody>
                                <tr>
                                    <td>ID</td>
                                    <td>{user.id}</td>
                                </tr>
                                <tr>
                                    <td>Nombre completo</td>
                                    <td>{user.Nombre}</td>
                                </tr>
                                <tr>
                                    <td>Email</td>
                                    <td>{user.Email}</td>
                                </tr>
                                <tr>
                                    <td>Direccion</td>
                                    <td>
                                        <div onClick={handleDireccionClick}>
                                            {user.Direccion}
                                        </div>
                                        <input
                                            type='text'
                                            value={nuevaDireccion}
                                            onChange={handleDireccionChange}
                                            placeholder='Ingrese una nueva dirección'
                                            style={{ display: nuevaDireccion ? 'block' : 'none' }}
                                        />
                                        {nuevaDireccion && (
                                            <button onClick={actualizarDireccion}>Actualizar dirección</button>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Telefono</td>
                                    <td>{user.Telefono}</td>
                                </tr>
                                <tr>
                                    <td>Rol</td>
                                    <td>{user.Rol}</td>
                                </tr>
                            </tbody>
                        </Table>
                        {currentUser ? (currentUser.uid === user?.id) ? (
                            <CardFooter className='text-center'>
                                <Button color='warning' onClick={HandlerVolver}>Volver a la página principal</Button>
                            </CardFooter>
                        ) : null : null}
                    </Container>
                ) : (
                    <p>Cargando información...</p>
                )}
            </CardBody>
        </Card>
    );
    
}
