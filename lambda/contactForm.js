require('dotenv').config()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


module.exports.handler = async function(event, context) {
    console.log('hey')
    let data = event.body
    try{
        const msg = {
            to: 'milos.mladenovic.work@gmail.com',
            from: data.email,
            subject: data.package,
            html:`<h1>${data.package}</h1>
                <table>
                    <thead>
                        <tr>
                            <td>Selected Package</td>
                            <td>Email</td>
                            <td>First Name</td>
                            <td>Last Name</td>
                            <td>Message</td>
                        </tr>
                    </thead>
                    <tr>
                        <td>${data.selectedPackage}</td>
                        <td>${data.email}</td>
                        <td>${data.firstName}</td>
                        <td>${data.lastName}</td>
                        <td>${data.message}</td>
                    </tr>
                </table>                
            `
          }
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

module.exports.handler = async function(event, context){


    try{
        

        return {
            statusCode:200,
            body:JSON.stringify({
                status:'success',
                message:'Your message has been sent!'
            })  
        }
    }catch(e){
        return {
            statusCode:500,
            body: JSON.stringify({
                status:'error',
                message:"There was some error with our servers. Try later!"
            })
        }
    }
}