require('dotenv').config()
const crypto = require('crypto');

class TokenValidator
{
    constructor() {
        
    }

    verifyWebhook(body, hmac) {
        const hash = crypto
        .createHmac('sha256', process.env.WEBHOOK_SIGNATURE)
        .update(body, 'utf8', 'hex')
        .digest('base64')

        return hash === hmac
        // It's a match! All good
    }
}

module.exports = {
    TokenValidator
}