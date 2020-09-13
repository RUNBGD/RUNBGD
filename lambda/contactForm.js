// require('dotenv').config()
require('dotenv').config()
const sgMail = require('@sendgrid/mail')

const {SENDGRID_API_KEY, SENDGRID_TO_EMAIL} = process.env

sgMail.setApiKey(SENDGRID_API_KEY)

module.exports.handler = async function(event, context) {

    const data = event.queryStringParameters

    const msg = {
        to: SENDGRID_TO_EMAIL,
        from: data.email,
        subject: data.package,
        html:`
        <h1>${data.package}</h1>
            <table>
                <thead>
                    <tr>
                        <td>Selected Package</td>
                        <td>Email</td>
                        <td>First Name</td>
                        <td>Last Name</td>
                    </tr>
                </thead>
                <tr>
                    <td>${data.selectedPackage}</td>
                    <td>${data.email}</td>
                    <td>${data.firstName}</td>
                    <td>${data.lastName}</td>
                    </tr>
                    </table>                
                <p>${data.message}</p>
        `
      }
    try{
          await sgMail.send(msg);
        return {
            statusCode:200,
            body:JSON.stringify({
                status:'success',
                message:'Your message has been sent!'
            })  
        }
    }catch(error){
        return {
            statusCode:500,
            body: JSON.stringify({
                status:'error',
                message:"There was some error with our servers. Try later!"
            })
        }
    }
}
