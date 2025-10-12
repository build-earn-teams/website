import nodemailer from "nodemailer";
import dotenv from 'dotenv'
dotenv.config()

export const sendEmail = async (email,message,subject)=>{
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    service:process.env.SMTP_SERVICE,
    port:process.env.SMTP_PORT,
    auth:{
      user:process.env.SMTP_MAIL,
      pass:process.env.SMTP_PASSWORD

    }
  })

  const options = {
    from:process.env.SMTP_MAIL,
    to:email,
    subject:subject,
    html:message
  }

  await transporter.sendMail(options)
}
