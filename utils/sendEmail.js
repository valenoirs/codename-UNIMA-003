require('dotenv').config();
const nodemailer = require('nodemailer');

const sendEmail = async (email, balasan) => {
    try{
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.HOST_EMAIL_ADDRESS,
                pass: process.env.HOST_EMAIL_PASSWORD
            }
        });

        let mailOption = {
            from: process.env.HOST_EMAIL_ADDRESS,
            to: email,
            subject: 'Tiket WAILAN Diskominfo Kota Tomohon',
            text: balasan
        };

        transporter.sendMail(mailOption, (error, info) => {
            if(error) {
                console.error('send-mail-error', error);
            }
            else {
                console.log(`Email sent: ${info.response}`);
            }
        })
    }
    catch(error){
        console.error('send-mail-error', error);
        req.flash('error', 'Gagal mengirimkan email!');
        return res.redirect('back');
    }
}

module.exports = sendEmail;