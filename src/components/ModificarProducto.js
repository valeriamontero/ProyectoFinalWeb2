import React, { useState, useEffect } from 'react';
import { storage, fs, auth } from '../Config/Config';
import { Link, useParams } from 'react-router-dom';

export default function UpdateProduct() {
    const { productId } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [category, setCategory] = useState('');
    const [cantidad, setCantidad] = useState(''); 
    const [successMsg, setSuccessMsg] = useState('');
    const [uploadError, setUploadError] = useState('');
    const [imageError, setImageError] = useState('');

    const types = ['image/png', 'image/jpeg', 'image/jpg'];

    useEffect(() => {
        fs.collection('Products')
            .doc(productId)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    const productData = doc.data();
                    setTitle(productData.title);
                    setDescription(productData.description);
                    setPrice(productData.price);
                    setCategory(productData.category);
                    setCantidad(productData.cantidad || ''); 
                } else {
                    console.log('No product found');
                }
            })
            .catch((error) => {
                console.log('Error:', error);
            });
    }, [productId]);

    const handleProductImg = (e) => {
        let selectedFile = e.target.files[0];
        if (selectedFile && types.includes(selectedFile.type)) {
            setImage(selectedFile);
            setImageError('');
        } else {
            setImage(null);
            setImageError('Please select an image with a valid format');
        }
    };

    const handleUpdateProduct = (e) => {
        e.preventDefault();
        const currentUser = auth.currentUser;

        if (currentUser) {
            const titleLower = title.toLowerCase();

            if (image) {
                storage
                    .ref(`product-images/${image.name}`)
                    .put(image)
                    .then(() => {
                        return storage
                            .ref('product-images')
                            .child(image.name)
                            .getDownloadURL();
                    })
                    .then((url) => {
                        return fs.collection('Products')
                            .doc(productId)
                            .update({
                                title,
                                title_lower: titleLower,
                                description,
                                price,
                                url,
                                category,
                                cantidad,
                                addedBy: currentUser.uid,
                            });
                    })
                    .then(() => {
                        setSuccessMsg('Product updated successfully');
                    })
                    .catch((error) => {
                        setUploadError(error.message);
                    });
            } else {
                fs.collection('Products')
                    .doc(productId)
                    .update({
                        title,
                        title_lower: titleLower,
                        description,
                        price,
                        category,
                        cantidad, 
                        addedBy: currentUser.uid,
                    })
                    .then(() => {
                        setSuccessMsg('Product updated successfully');
                    })
                    .catch((error) => {
                        setUploadError(error.message);
                    });
            }
        } else {
            setUploadError('User not authenticated');
        }
    };

    return (
        <div className='container'>
            <h1>Update Product</h1>
            {uploadError && (
                <div className='error-msg'>{uploadError}</div>
            )}
            {successMsg && (
                <div className='success-msg'>{successMsg}</div>
            )}
            <form autoComplete='off' className='form-group' onSubmit={handleUpdateProduct}>
                <label>Product Title</label>
                <input
                    type='text'
                    className='form-control'
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                />
                <br />
                <label>Product Description</label>
                <input
                    type='text'
                    className='form-control'
                    required
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                />
                <br />
                <label>Product Price</label>
                <input
                    type='number'
                    className='form-control'
                    required
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                />
                <br />
                <label>Upload Product Image</label>
                <input
                    type='file'
                    id='file'
                    className='form-control'
                    onChange={handleProductImg}
                />
                <br />
                <label>Product Availability</label>
                <input
                    type='number'
                    className='form-control'
                    required
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^[1-9]\d*$/.test(value)) {
                            setCantidad(value);
                        }
                    }}
                    value={cantidad}
                />
                <br />
                <label>Product Category</label>
                <select
                    className='form-control'
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value=''>Select a category</option>
                    <option value='mountain'>Mountain Bike</option>
                    <option value='road'>Road Bike</option>
                    <option value='urban'>Urban Bike</option>
                </select>
                <br />
                {imageError && (
                    <div className='error-msg'>{imageError}</div>
                )}
                <br />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Link to='/panel-vendedor' className='btn btn-success btn-md'>
                        Back
                    </Link>
                    <button type='submit' className='btn btn-success btn-md'>
                        UPDATE
                    </button>
                </div>
            </form>
        </div>
    );
}
