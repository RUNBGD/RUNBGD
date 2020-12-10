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
  console.log(MONGODB_STRING, data);
  context.callbackWaitsForEmptyEventLoop = false;
  run(data).then(res => {
    callback(null, res);
  }).catch(error => callback(error));
};

const getAndUpdateProduct = async (uid, size, quantity, Model) => {
  let product = await Model.findOne({
    uid: uid,
    size: size
  });

  if (product) {
    product = await Model.updateOne({
      uid: uid,
      size: size
    }, {
      sold: product.sold + Number(quantity)
    });
  } else {
    product = new Model({
      uid,
      size,
      sold: quantity
    });
    product.save();
  }

  return 'updated product';
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
    let product = yield getAndUpdateProduct(data.uid, data.size, data.quantity, Product);
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