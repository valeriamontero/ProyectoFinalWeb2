import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {auth, fs } from '../Config/Config';
import { Button, Card, CardBody, CardFooter, Container, Table } from 'reactstrap';
import { useParams } from 'react-router-dom';
import {doc, updateDoc, getFirestore, arrayUnion } from 'firebase/firestore';


export default function PerfilPublico() {
    const [user, setUser] = useState(null);
    const { userId } = useParams(); 
    const navigate = useNavigate();
    const [calificado, setCalificado] = useState(false);
    const currentUser = auth.currentUser;
    const [newCalificacion, setNewCalificacion] = useState(0);
    const [selectedRating, setSelectedRating] = useState(0);

    // Obtener la calificación del usuario actual del localStorage al cargar el componente
    useEffect(() => {
        const savedCalificacion = localStorage.getItem(`calificacion_${userId}`);
        if (savedCalificacion) {
            setCalificado(true);
        }

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
        navigate('/');
    };

    const updateUserRating = (newCalificacion) => {
        if (currentUser) {
            const userRef = fs.collection('users').doc(userId);
            userRef.get().then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    let calificaciones = userData.calificaciones || [];
                    calificaciones = calificaciones.filter(calif => calif.userId !== currentUser.uid);
                    calificaciones.push({ userId: currentUser.uid, rating: newCalificacion });
                    userRef.update({
                        calificaciones
                    }).then(() => {
                        console.log('Calificación actualizada exitosamente en Firestore');
                        setCalificado(true);
                        localStorage.setItem(`calificacion_${userId}`, newCalificacion.toString());
                        setSelectedRating(newCalificacion); // Establecer la calificación seleccionada
                    }).catch((error) => {
                        console.error('Error al actualizar la calificación en Firestore:', error);
                    });
                } else {
                    console.log('No se encontró el documento del usuario');
                }
            }).catch((error) => {
                console.log('Error al obtener el documento:', error);
            });
        } else {
            console.log('Usuario no autenticado');
        }
    };
    
    const renderCalificacionButton = (value) => {
        const hasRated = user && user.calificaciones && user.calificaciones.some(calif => calif.userId === currentUser.uid);

        return (
            <Button
                color={hasRated && selectedRating === value ? 'danger' : 'success'} // Usar selectedRating en lugar de newCalificacion
                onClick={() => {
                    setSelectedRating(value); // Establecer la calificación seleccionada
                    setCalificado(true);
                    updateUserRating(value);
                }}
                disabled={hasRated && selectedRating === value}
            >
                {value}
            </Button>
        );
    };
const calcularPromedioCalificacion = () => {
    if (user && user.calificaciones && user.calificaciones.length > 0) {
        const sum = user.calificaciones.reduce((acc, ratingObj) => acc + ratingObj.rating, 0);
        const average = sum / user.calificaciones.length;
        return average.toFixed(1); 
    }
    return 0;
};



const vendedor = user && user.rol === 'vendedor';
  


    

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
                                <tr>
                                    <td>Calificación</td>
                                    <td>{calcularPromedioCalificacion()} de 5</td>
                                </tr>
                                {vendedor && ( 
                                <tr>
                                    <td>Calificar</td>
                                    <td>
                                        {renderCalificacionButton(1)}{' '}
                                        {renderCalificacionButton(2)}{' '}
                                        {renderCalificacionButton(3)}{' '}
                                        {renderCalificacionButton(4)}{' '}
                                        {renderCalificacionButton(5)}
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </Table>
                        <CardFooter className='text-center'>
                            <Button color='warning' onClick={handlerVolver}>Volver a la página principal</Button>
                        </CardFooter>
                    </Container>
                ) : (
                    <p>Cargando información...</p>
                )}
            </CardBody>
        </Card>
    );
};