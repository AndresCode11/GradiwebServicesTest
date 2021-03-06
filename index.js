require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const { TokenValidator } = require("./TokenValidator")
const { EmailSender } = require("./EmailSender")
const path = require('path')

// BODY PARSER
app.use(bodyParser.raw({ type: "application/json" }))
// CORS
app.use(cors())
// PUBLIC FOLDER
app.use(express.static('public'));


const headers = {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN
}

app.get('/banner-info', async (req, res) => {
    
    let orders = await fetch(process.env.SHOP + '/admin/api/2021-10/orders.json', {method: 'GET', headers: headers })
        .then(res => res.json())
        .then(data => {
            return data.orders.length
        });
    
    let customers = await fetch(process.env.SHOP + '/admin/api/2021-10/customers.json', {method: 'GET', headers: headers })
        .then(res => res.json())
        .then(data => {
            return data.customers.length;
        });
    
    res.json({
        customers: customers,
        orders: orders
    })
})

app.get('/create-webhook', async (req, res) => {
    
    let body = {
        "webhook": {
            "address": "https://gradiweb-services-test-fytu3.ondigitalocean.app/order-notify",
            "topic": "orders/create",
            "format": "json"
        }
    }

    fetch(process.env.SHOP + '/admin/api/2021-10/webhooks.json', {method: 'POST', headers: headers, body: JSON.stringify(body) })
        .then(res => res.json())
        .then(data => {
            console.log(data)
        });

})

// ORDER WEBHOOK
app.post('/order-notify', async (req, res) => {

    const hmac = req.header("X-Shopify-Hmac-Sha256");
    const tokenValidator = new TokenValidator();
    //const body = await getRawBody(req)
    const verified = tokenValidator.verifyWebhook(req.body, hmac);
    
    console.log(req.body.toString())
    if(verified) {
        console.log('OK')
        const data = req.body.toString();
        const payload = JSON.parse(data);

        // user Data
        const {email, state} = payload.customer

        // Validate State
        if(state == 'disabled') {
            const emailSender = new EmailSender();
            emailSender.sendEmail(email, payload.customer, 'https://' + req.header('host'))
            res.json({status: 'ok'})
        }

    } else {
        //console.log("NOT VALID")
    }
    
})

app.listen(8080, () => {
    console.log('ready')
    console.log(process.env.API_KEY)
})