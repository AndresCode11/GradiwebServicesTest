require('dotenv').config()
const crypto = require('crypto');

class TokenValidator
{
    constructor() {
        
    }

    verifyWebhook(body, hmac) {
        const genHash = crypto
          .createHmac("sha256", process.env.API_SECRET)
          .update(body)
          .digest("base64");
          
        return genHash === hmac;
    }
}

module.exports = {
    TokenValidator
}