
import dotenv from  "dotenv";
import nodemailer from "nodemailer";

//integrar nodemailer
 dotenv.config();

const transporter = nodemailer.createTransport(
    {
        service: "gmail", // servicio utilizado
        /*agregar el campo host: "milugar.com"
         si tengo un servidor de hosting*/

        port: 587, //puerto utilizado

        auth: {
            user: process.env.EMAIL , //correo de la cuenta
            pass: process.env.PASS_EMAIL //contraseña de la cuenta pero (contraseña de aplicaciones)
        }


    }
)


//enviar el email

export const sendEmail =  async (recipient, name) =>{

    return await transporter.sendMail({

        from: process.env.EMAIL, //correo de la cuenta

        to: recipient, //correo del destinatario

        subject:"Register",

        //text: "creamos un texto simple",
        html: `Hello ${name},Registered successfully` /*insertar html con el contenido del email*/ 
    })

}
 
//let result = await sendEmail("email@gmail.com", "Maria")

//console.log(result) 




