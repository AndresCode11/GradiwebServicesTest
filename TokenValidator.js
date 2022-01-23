require('dotenv').config()
const crypto = require('crypto');

class TokenValidator
{
    constructor() {
        
    }

    verifyWebhook(body, hmac) {
        const hash = crypto
        .createHmac('sha256', process.env.SHOPIFY_ACCESS_TOKEN)
        .update(body, 'utf8', 'hex')
        .digest('base64')

        // Compare our hash to Shopify's hash
        return hash === hmac
        // It's a match! All good
    }
}

module.exports = {
    TokenValidator
}