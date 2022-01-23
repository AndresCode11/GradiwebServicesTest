require('dotenv').config()
const crypto = require('crypto');

class TokenValidator
{
    constructor() {
        
    }

    verifyWebhook(payload, hmac) {
        const message = payload.toString();
        const genHash = crypto
          .createHmac("sha256", process.env.API_SECRET)
          .update(message)
          .digest("base64");
          
        return genHash === hmac;
    }
}

module.exports = {
    TokenValidator
}