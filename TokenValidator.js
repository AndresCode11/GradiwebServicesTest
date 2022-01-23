require('dotenv').config()
const crypto = require('crypto');

class TokenValidator
{
    constructor() {
        
    }

    verifyWebhook(body, hmac) {
        const hash = crypto
        .createHmac('sha256', '7b0a666b10c36016806ab04594cc298ef0c7660499ae1a1dcca57350990e8ab5')
        .update(body, 'utf8', 'hex')
        .digest('base64')

        console.log(hash)
        console.log(hmac)
        console.log(process.env.WEBHOOK_SIGNATURE)
        // Compare our hash to Shopify's hash
        return hash === hmac
        // It's a match! All good
    }
}

module.exports = {
    TokenValidator
}