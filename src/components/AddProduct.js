import React, { useState } from "react";
import { storage, fs, auth } from '../Config/Config';
import { Link } from 'react-router-dom';

export default function AddProduct() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [category, setCategory] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [uploadError, setUploadError] = useState('');
    const [imageError, setImageError] = useState('');

    const types = ['image/png', 'image/jpeg', 'image/jpg'];

    const handleProductImg = (e) => {
        let selectedFile = e.target.files[0];
        if (selectedFile && types.includes(selectedFile.type)) {
            setImage(selectedFile);
            setImageError('');
        } else {
            setImage(null);
            setImageError('Por favor selecciona una imagen con formato valido');
        }
    };

    const handleAddProducts = (e) => {
        e.preventDefault();
        const currentUser = auth.currentUser;
        if (currentUser) {
            const upload = storage.ref(`product-images/${image.name}`).put(image);
            upload.on('state_changed', snapshot => {
                // ... Código para monitorear la subida de la imagen
            }, error => setUploadError(error.message), () => {
                storage
                    .ref('product-images')
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        fs.collection('Products')
                            .add({
                                title,
                                description,
                                price,
                                url,
                                category,
                                addedBy: currentUser.uid, // Asignar el UID del usuario actual
                            })
                            .then(() => {
                                setSuccessMsg('Producto agregado con éxito');
                                setTitle('');
                                setDescription('');
                                setPrice('');
                                setCategory('');
                                document.getElementById('file').value = '';
                                setImage('');
                                setUploadError('');
                                setTimeout(() => {
                                    setSuccessMsg('');
                                }, 3000);
                            })
                            .catch(error => setUploadError(error.message));
                    });
            });
        } else {
            setUploadError('Usuario no autenticado');
        }
    };

    return(

        <div className='container'>
            <br></br>
            <br></br>
            <h1>Add Products</h1>
            <hr></hr>        
            {successMsg&&<>
                <div className='success-msg'>{successMsg}</div>
                <br></br>
            </>} 
            <form autoComplete="off" className='form-group' onSubmit={handleAddProducts}>
                <label>Product Title</label>
                <input type="text" className='form-control' required
                onChange={(e)=>setTitle(e.target.value)} value={title}></input>
                <br></br>
                <label>Product Description</label>
                <input type="text" className='form-control' required
                onChange={(e)=>setDescription(e.target.value)} value={description}></input>
                <br></br>
                <label>Product Price</label>
                <input type="number" className='form-control' required
                onChange={(e)=>setPrice(e.target.value)} value={price}></input>
                <br></br>
                <label>Upload Product Image</label>
                <input type="file" id="file" className='form-control' required
                onChange={handleProductImg}></input>
                <br></br>
                


                <label>Product Category</label>
                <select className='form-control'value={category} onChange={(e) => setCategory(e.target.value)} >
                <option value="">Selecciona una categoría</option>
                <option value="mountain">Bicicleta de montaña</option>
                <option value="road">Bicicleta de carretera</option>
                <option value="urban">Bicicleta urbana</option>
                </select>
                <br></br>






                
                {imageError&&<>
                    <br></br>
                    <div className='error-msg'>{imageError}</div>
                   
                </>}
                <br></br>     
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Link to="/panel-vendedor" className='btn btn-success btn-md'>
                Volver
            </Link>
            </div>
                <div style={{display:'flex', justifyContent:'flex-end'}}>
                    <button type="submit" className='btn btn-success btn-md'>
                        SUBMIT
                    </button>
                </div>
            </form>
            {uploadError&&<>
                    <br></br>
                    <div className='error-msg'>{uploadError}</div>
                    
                </>}

        </div>


        
    )
}