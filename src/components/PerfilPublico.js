import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { auth, fs } from '../Config/Config';
import { Button, Card, CardBody, CardFooter, Container, Table } from 'reactstrap';
import { useParams } from 'react-router-dom';

export default function PerfilPublico() {
    const [user, setUser] = useState(null);
    const { userId } = useParams(); 
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            fs.collection('users')
                .doc(userId) 
                .get()
                .then((doc) => {
                    if (doc.exists) {
                        const userData = doc.data();
                        userData.id = doc.id;
                        setUser(userData);
                    } else {
                        console.log('No se encontró el documento del usuario');
                    }
                })
                .catch((error) => {
                    console.log('Error al obtener el documento:', error);
                });
        }
    }, [userId]);

    const handlerVolver = () => {
        navigate('/'); // Redirigir a la página principal
    };


    const handleCalificar = () => {
        navigate(`/calificacion/${userId}`);
    }

    return (
        <Card className='mt-2 border-0 rounded-0 shadow-sm'>
            <CardBody>
                <h3 className='text-uppercase'>Información del vendedor</h3>
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
                                    <td>Nombre</td>
                                    <td>{user.Nombre}</td>
                                </tr>
                                <tr>
                                    <td>Email</td>
                                    <td>{user.Email}</td>
                                </tr>
                                <tr>
                                    <td>Direccion</td>
                                    <td>{user.Direccion}</td>
                                </tr>
                                <tr>
                                    <td>Telefono</td>
                                    <td>{user.Telefono}</td>
                                </tr>
                            </tbody>
                        </Table>
                        <CardFooter className='text-center'>
                            <Button color='warning' onClick={handlerVolver}>Volver a la pagina principal</Button>
                            <Button color='primary' onClick={handleCalificar}>Calificar vendedor</Button>
                        </CardFooter>
                    </Container>
                ) : (
                    <p>Cargando información...</p>
                )}
            </CardBody>
        </Card>
    );
};