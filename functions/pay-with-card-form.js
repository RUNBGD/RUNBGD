"use strict";

require('dotenv').config();

const sgMail = require('@sendgrid/mail');

var Twocheckout = require('2checkout-node');

const {
  SENDGRID_API_KEY,
  SENDGRID_TO_EMAIL_ORDERS,
  GATSBY_2CHECKOUT_SELLER_ID,
  GATSBY_2CHECKOUT_PRIVATE_KEY,
  GATSBY_2CHECKOUT_PUBLISHABLE_KEY
} = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);

exports.handler = async function (event, context) {
  console.log(GATSBY_2CHECKOUT_SELLER_ID);
  const {
    email,
    firstName,
    lastName,
    address,
    phoneNumber,
    country,
    city,
    zipCode,
    message,
    token,
    price,
    products,
    state
  } = event.queryStringParameters;
  const msgToSeller = {
    to: SENDGRID_TO_EMAIL_ORDERS,
    from: SENDGRID_TO_EMAIL_ORDERS,
    subject: 'Order',
    html: `
            <table style='margin-bottom:15px; border:1px dotted #959595;border-collapse: collapse'>
            <tr>
                <th style='padding:2.5px; border:1px dotted #959595; text-align:center;background: #626262; color: white'>First Name</th>
                <td style='padding:2.5px; border:1px dotted #959595; text-align:center;'>${firstName}</td>
            </tr>
            <tr>
                <th style='padding:2.5px; border:1px dotted #959595; text-align:center;background: #626262; color: white'>Last Name</th>
                <td style='padding:2.5px; border:1px dotted #959595; text-align:center;'>${lastName}</td>
            </tr>
            <tr>
                <th style='padding:2.5px; border:1px dotted #959595; text-align:center;background: #626262; color: white'>Email</th>
                <td style='padding:2.5px; border:1px dotted #959595; text-align:center;'>${email}</td>
            </tr>
            <tr>
                <th style='padding:2.5px; border:1px dotted #959595; text-align:center;background: #626262; color: white'>Phone Number</th>
                <td style='padding:2.5px; border:1px dotted #959595; text-align:center;'>${phoneNumber}</td>
            </tr>
            <tr>
                <th style='padding:2.5px; border:1px dotted #959595; text-align:center;background: #626262; color: white'>Country</th>
                <td style='padding:2.5px; border:1px dotted #959595; text-align:center;'>${country}</td>
            </tr>
            <tr>
                <th style='padding:2.5px; border:1px dotted #959595; text-align:center;background: #626262; color: white'>State</th>
                <td style='padding:2.5px; border:1px dotted #959595; text-align:center;'>${state}</td>
            </tr>
            <tr>
                <th style='padding:2.5px; border:1px dotted #959595; text-align:center;background: #626262; color: white'>City</th>
                <td style='padding:2.5px; border:1px dotted #959595; text-align:center;'>${city}</td>
            </tr>
            <tr>
                <th style='padding:2.5px; border:1px dotted #959595; text-align:center;background: #626262; color: white;'>Address</th>
                <td style='padding:2.5px; border:1px dotted #959595; text-align:center;'>${address}</td>
            </tr>
            <tr>
                <th style='padding:2.5px; border:1px dotted #959595; text-align:center;background: #626262; color: white;'>ZIP code</th>
                <td style='padding:2.5px; border:1px dotted #959595; text-align:center;'>${zipCode}</td>
            </tr>
            </table>
            <table style='margin-bottom:15px; border:1px dotted #959595;border-collapse: collapse'>
                <tr>
                   <th style='padding:2.5px; border:1px dotted #959595; text-align:center;background: #626262; color: white'>Quantity</th>
                   <th style='padding:2.5px; border:1px dotted #959595; text-align:center;background: #626262; color: white'>Product</th>
                   <th style='padding:2.5px; border:1px dotted #959595; text-align:center;background: #626262; color: white'>Size</th>
                   <th style='padding:2.5px; border:1px dotted #959595; text-align:center;background: #626262; color: white'>UID</th> 
                </tr>
                ${JSON.parse(products).map(product => {
      return `<tr>
                        <td style='padding:2.5px; border:1px dotted #959595; text-align:center;'>${product.quantity}</td>
                        <td style='padding:2.5px; border:1px dotted #959595; text-align:center;'>${product.title}</td>
                        <td style='padding:2.5px; border:1px dotted #959595; text-align:center;'>${product.color}</td>
                        <td style='padding:2.5px; border:1px dotted #959595; text-align:center;'>${product.size}</td>
                        <td style='padding:2.5px; border:1px dotted #959595; text-align:center;'>${product.uid}</td>
                    </tr>`;
    })}
                <tr style='width:100%'><th colspan='5' style='padding:2.5px; border:1px dotted #959595; text-align:center;background: #626262; color: white'>Total</th></tr>                
                <tr style='width:100%'><td colspan='5' style='padding:2.5px; border:1px dotted #959595; text-align:center;'>€${price}</td></tr>                
            </table>
            <p>Message: ${message}</p>
        `
  };
  const msgToBuyer = {
    to: email,
    from: SENDGRID_TO_EMAIL_ORDERS,
    subject: 'Order from RUNBGD',
    html: `
            <table style='margin-bottom:15px; border:1px dotted #959595;border-collapse: collapse'>
            <tr>
                <th style='padding:2.5px; border:1px dotted #959595; text-align:center;background: #626262; color: white'>First Name</th>
                <td style='padding:2.5px; border:1px dotted #959595; text-align:center;'>${firstName}</td>
            </tr>
            <tr>
                <th style='padding:2.5px; border:1px dotted #959595; text-align:center;background: #626262; color: white'>Last Name</th>
                <td style='padding:2.5px; border:1px dotted #959595; text-align:center;'>${lastName}</td>
            </tr>
            <tr>
                <th style='padding:2.5px; border:1px dotted #959595; text-align:center;background: #626262; color: white'>Email</th>
                <td style='padding:2.5px; border:1px dotted #959595; text-align:center;'>${email}</td>
            </tr>
            <tr>
                <th style='padding:2.5px; border:1px dotted #959595; text-align:center;background: #626262; color: white'>Phone Number</th>
                <td style='padding:2.5px; border:1px dotted #959595; text-align:center;'>${phoneNumber}</td>
            </tr>
            <tr>
                <th style='padding:2.5px; border:1px dotted #959595; text-align:center;background: #626262; color: white'>Country</th>
                <td style='padding:2.5px; border:1px dotted #959595; text-align:center;'>${country}</td>
            </tr>
            <tr>
                <th style='padding:2.5px; border:1px dotted #959595; text-align:center;background: #626262; color: white'>State</th>
                <td style='padding:2.5px; border:1px dotted #959595; text-align:center;'>${state}</td>
            </tr>
            <tr>
                <th style='padding:2.5px; border:1px dotted #959595; text-align:center;background: #626262; color: white'>City</th>
                <td style='padding:2.5px; border:1px dotted #959595; text-align:center;'>${city}</td>
            </tr>
            <tr>
                <th style='padding:2.5px; border:1px dotted #959595; text-align:center;background: #626262; color: white;'>Address</th>
                <td style='padding:2.5px; border:1px dotted #959595; text-align:center;'>${address}</td>
            </tr>
            <tr>
                <th style='padding:2.5px; border:1px dotted #959595; text-align:center;background: #626262; color: white;'>ZIP code</th>
                <td style='padding:2.5px; border:1px dotted #959595; text-align:center;'>${zipCode}</td>
            </tr>
        </table>
        <table style='margin-bottom:15px; border:1px dotted #959595;border-collapse: collapse'>
            <tr>
            <th style='padding:2.5px; border:1px dotted #959595; text-align:center;background: #626262; color: white'>Quantity</th>
            <th style='padding:2.5px; border:1px dotted #959595; text-align:center;background: #626262; color: white'>Product</th>
            <th style='padding:2.5px; border:1px dotted #959595; text-align:center;background: #626262; color: white'>Size</th>
            <th style='padding:2.5px; border:1px dotted #959595; text-align:center;background: #626262; color: white'>UID</th> 
            </tr>
            ${JSON.parse(products).map(product => {
      return `<tr>
                    <td style='padding:2.5px; border:1px dotted #959595; text-align:center;'>${product.quantity}</td>
                    <td style='padding:2.5px; border:1px dotted #959595; text-align:center;'>${product.title}</td>
                    <td style='padding:2.5px; border:1px dotted #959595; text-align:center;'>${product.color}</td>
                    <td style='padding:2.5px; border:1px dotted #959595; text-align:center;'>${product.size}</td>
                    <td style='padding:2.5px; border:1px dotted #959595; text-align:center;'>${product.uid}</td>
                </tr>`;
    })}
            <tr style='width:100%'><th colspan='5' style='padding:2.5px; border:1px dotted #959595; text-align:center;background: #626262; color: white'>Total</th></tr>                
            <tr style='width:100%'><td colspan='5' style='padding:2.5px; border:1px dotted #959595; text-align:center;'>€${price}</td></tr>                
        </table>
            <p>Please respond to this email if you have any questions regarding your order, thanks!</p>
        `
  };

  try {
    const tco = new Twocheckout({
      sellerId: GATSBY_2CHECKOUT_SELLER_ID,
      // Seller ID, required for all non Admin API bindings 
      privateKey: GATSBY_2CHECKOUT_PRIVATE_KEY,
      publishableKey: GATSBY_2CHECKOUT_PUBLISHABLE_KEY // Payment API private key, required for checkout.authorize binding
      // Uses 2Checkout sandbox URL for all bindings

    });
    const params = {
      "sellerId": GATSBY_2CHECKOUT_SELLER_ID,
      "privateKey": GATSBY_2CHECKOUT_PRIVATE_KEY,
      "merchantOrderId": "123",
      "token": token,
      "currency": "EUR",
      "total": price,
      "billingAddr": {
        "name": `${firstName} ${lastName}`,
        "addrLine1": address,
        "city": city,
        "state": state,
        "zipCode": zipCode,
        "country": country,
        "email": email,
        "phoneNumber": phoneNumber
      },
      "demo": true
    };
    const data = new Promise((resolve, reject) => {
      tco.checkout.authorize(params, function (error, data) {
        if (error) {
          reject(error.message);
        } else {
          resolve(data.response.responseMsg);
        }
      });
    });
    let tcoResponse = await data;
    await sgMail.send(msgToSeller);
    await sgMail.send(msgToBuyer);
    let successBody = JSON.stringify({
      status: 'success',
      message: 'Order successfuly placed, wait for email for details!'
    });
    return {
      statusCode: 200,
      body: successBody
    };
  } catch (error) {
    let errorBody = JSON.stringify({
      status: 'error',
      message: error
    });
    return {
      statusCode: 500,
      body: errorBody
    };
  }
};