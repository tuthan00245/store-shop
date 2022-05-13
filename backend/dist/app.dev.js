"use strict";

var express = require('express');

var cors = require('cors');

var path = require("path");

var fileUpload = require('express-fileupload');

var app = express();

var bodyParser = require('body-parser');

var cookiParser = require('cookie-parser');

var errorMiddleware = require('./middleware/error');

var dotenv = require('dotenv');

dotenv.config({
  path: __dirname + '/.env'
});

var product = require('./routes/productRoute');

var user = require('./routes/userRoute');

var order = require('./routes/orderRoute');

var cart = require('./routes/cartRoute');

app.use(express.json({
  limit: '50mb'
}));
app.use(cookiParser());
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 50000
}));
app.use(fileUpload());
app.use(cors()); //Middleware error hander 

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", cart);
app.all('/', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
app.use(express["static"](path.join(__dirname, "../frontend/build")));
app.get("*", function (req, res) {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});
app.use(errorMiddleware);
module.exports = app;