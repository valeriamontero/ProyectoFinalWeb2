import React, { useState } from "react";
import { storage, fs, auth } from '../Config/Config';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function AddProduct() {
    const [title, setTitle] = useState('');

    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [category, setCategory] = useState('');
    const [cantidad, setCantidad] = useState(''); 
    const [successMsg, setSuccessMsg] = useState('');
    const [uploadError, setUploadError] = useState('');
    const [imageError, setImageError] = useState('');
    const [isValidFormat, setIsValidFormat] = useState(false);

    const types = ['image/png', 'image/jpeg', 'image/jpg'];


    //verificacion de formato de imagen

    const handleProductImg = (e) => {
        let selectedFile = e.target.files[0];
        if (selectedFile && types.includes(selectedFile.type)) {
            setImage(selectedFile);
            setImageError('');
            setIsValidFormat(true);
        } else {
            setImage(null);
            setImageError('Por favor selecciona una imagen con formato valido');
            setIsValidFormat(false);
        }
    };

    //agregar productos a la base de datos

    const handleAddProducts = (e) => {
        e.preventDefault();
        const currentUser = auth.currentUser;
        if (currentUser) {
            const upload = storage.ref(`product-images/${image.name}`).put(image);
            upload.on('state_changed', snapshot => {
            }, error => setUploadError(error.message), () => {
                storage
                    .ref('product-images')
                    .child(image.name)
                    .getDownloadURL()               //obtener url de la imagen de la base de datos y agregarla a la coleccion de productos
                    .then(url => {
                        const titleLower = title.toLowerCase();
                        const priceNumero = Number(price);
                        fs.collection('Products')
                            .add({
                                title,
                                title_lower: titleLower,
                                description,
                                price: priceNumero,
                                url,
                                category,
                                cantidad, 
                                addedBy: currentUser.uid, 
                            })
                            .then(() => {
                                setSuccessMsg('Producto agregado con éxito');
                                setTitle('');
                                setDescription('');
                                setPrice('');
                                setCategory('');
                                setCantidad(''); 
                                document.getElementById('file').value = '';
                                setImage('');
                                setUploadError('');
                                setTimeout(() => {
                                    setSuccessMsg('');
                                }, 2000);
                            })
                            .catch(error => setUploadError(error.message));
                    });
            });
        } else {
            setUploadError('Usuario no autenticado');
        }
    };

    return (
        <div className='container'>
            <br></br>
            <br></br>
            <h1>Add Products</h1>
            <hr></hr>
            {successMsg && (
                <>
                    <div className='success-msg'>{successMsg}</div>
                    <br></br>
                </>
            )}
            <form autoComplete="off" className='form-group' onSubmit={handleAddProducts}>
                <label>Product Title</label>
                <input
                    type="text"
                    className='form-control'
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                ></input>
                <br></br>
                <label>Product Description</label>
                <input
                    type="text"
                    className='form-control'
                    required
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                ></input>
                <br></br>
                <label>Product Price</label>
                <input
                    type="number"
                    className='form-control'
                    required
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                ></input>
                <br></br>
                <label>Upload Product Image</label>
                <input
                    type="file"
                    id="file"
                    className='form-control'
                    required
                    onChange={handleProductImg}
                ></input>
                <br></br>
                <label>Product Availability</label>
                <input
                    type="number"
                    className='form-control'
                    required
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^[1-9]\d*$/.test(value)) {
                            setCantidad(value);
                        }
                    }}
                    value={cantidad}
                ></input>
                <br></br>
                <label>Product Category</label>
                <select
                    className='form-control'
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">Selecciona una categoría</option>
                    <option value="mountain">Bicicleta de montaña</option>
                    <option value="carretera">Bicicleta de carretera</option>
                    <option value="electricas">Bicicleta eléctrica</option>
                    <option value="infantil">Bicicleta infantil</option>
                    <option value="repuestos">Repuestos y accesorios</option>
                </select>
                <br></br>
                {imageError && (
                    <>
                        <br></br>
                        <div className='error-msg'>{imageError}</div>
                    </>
                )}
                <br></br>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Link to="/panel-vendedor" className='btn btn-success btn-md'>
                        Volver
                    </Link>
                     <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className='btn btn-success btn-md' disabled={!isValidFormat}>
                        SUBMIT
                    </button>
                </div>
                </div>
               
            </form>
            {uploadError && (
                <>
                    <br></br>
                    <div className='error-msg'>{uploadError}</div>
                </>
            )}
        </div>
    );
}
