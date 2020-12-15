const nodemailer = require('nodemailer');

const sendEmail = async (options) =>{
// create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth:{
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD
    }
  })

  //define the email option
  const mailOptions = {
    from : 'Ayobami <hello@ayobami >',
    to: options.email,
    subject: options.subject,
    text:options.message
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
