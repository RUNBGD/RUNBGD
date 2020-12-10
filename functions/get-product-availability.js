"use strict";

require('dotenv').config();

const mongoose = require('mongoose');

var co = require('co');

let conn = null;
const {
  MONGODB_STRING
} = process.env;

exports.handler = function (event, context, callback) {
  const data = event.queryStringParameters;
  context.callbackWaitsForEmptyEventLoop = false;
  run(data).then(res => {
    callback(null, res);
  }).catch(error => callback(error));
};

const getProduct = async (uid, size, Model) => {
  let product = await Model.find({
    uid: uid,
    size: size
  });
  return product;
};

function run(data) {
  return co(function* () {
    if (conn == null) {
      conn = yield mongoose.createConnection(MONGODB_STRING, {
        bufferCommands: false,
        bufferMaxEntries: 0,
        useUnifiedTopology: true,
        useNewUrlParser: true
      });
      conn.model('products', new mongoose.Schema({
        uid: String,
        size: String,
        sold: Number
      }));
    }

    const Product = conn.model('products');
    let product = yield getProduct(data.uid, data.size, Product);
    let response;
    response = {
      statusCode: 200,
      body: JSON.stringify({
        status: 'success',
        product: product
      })
    };
    return response;
  });
}