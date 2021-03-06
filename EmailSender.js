require('dotenv').config()
const nodemailer = require('nodemailer')
//const EmailTemplate = require('email-templates').EmailTemplate
const hbs = require('express-handlebars')
const path = require('path')
const handlebars = require("handlebars")
const fs = require("fs")

class EmailSender {
    
    constructor() {

        // Create Conection 
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
              user: process.env.EMAIL,
              pass: process.env.EMAIL_PASSWORD
            }
        })

        console.log(process.env.EMAIL_PASSWORD)

    }

    sendEmail(email, customerData, host) {

        const {first_name, last_name, } = customerData

        const emailTemplateSource = fs.readFileSync(path.join(__dirname, "/templates/test.hbs"), "utf8")
        const template = handlebars.compile(emailTemplateSource)
        const htmlToSend = template({first_name, last_name, host})

        const emailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Activa tu cuenta !!',
            template: 'test',
            html: htmlToSend
        }
        this.transporter.sendMail(emailOptions, (err, data) => {
            console.log(err)
        })
        
    }

}

module.exports = {
    EmailSender
}