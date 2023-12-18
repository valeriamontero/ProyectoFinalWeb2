const express = require('express');
const cors = require('cors');
const {v4: uuidv4} = require('uuid');
//secret key
const stripe = require('stripe')('sk_test_51OMbT7D66JOqoGT6wn3akoZM7xlaJEOesBxwkYir0EmJIKH6yOTtVIDOwImgxLXw8YEVKRTmxmr9rDZ6mMkhFQmr00wMZar15X')

const app = express();
app.use (cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Bienvenido a ecommerce ciclo dw');



})


app.post('/pago', async (req, res) => {
    let error;
    let estatus;
    try{
        const {token, carrito} = req.body;
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        });
        const key = uuidv4();
        const cargo = await stripe.charges.create({
            amount: carrito.precioTotalIva * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: 'test',
            shipping: {
                name: token.card.name,
                address: {
                    line1: token.card.address_line1,
                    line2: token.card.address_line2,
                    city: token.card.address_city,
                    country: token.card.address_country,
                    postal_code: token.card.address_zip
                }
            }

        },{idempotencyKey: key})
        estatus='success';
    }
    catch(error){
        console.error(error);
        estatus = "error";
    }
    res.json({estatus});

})

app.listen(8080, () => {
    console.log('servidor corriendo en puerto 8080');
})
