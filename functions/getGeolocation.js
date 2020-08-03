"use strict";

const axios = require('axios');

require('dotenv').config();

module.exports.handler = async function (event, context) {
  try {
    const key = process.env.MAPQUEST_API_KEY;
    const location = event.queryStringParameters.location;
    const data = await axios.get(`http://open.mapquestapi.com/geocoding/v1/address?location=${location}&key=${key}`);
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: data.data
      })
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        msg: "There was some error with our servers. Try later!"
      })
    };
  }
};