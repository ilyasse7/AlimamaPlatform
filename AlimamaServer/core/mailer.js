const nodeMailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const transport = nodeMailer.createTransport({
    service: 'Gmail',
    auth: {
        user: "schoolrank1@gmail.com",
        pass: process.env.codeGmail,
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = transport;