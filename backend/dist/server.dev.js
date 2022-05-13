"use strict";

var app = require('./app');

var connectDatabase = require('./config/database');

var cloudinary = require('cloudinary');

var path = require("path"); // Handling Uncaught Exception


process.on("uncaughtException", function (err) {
  console.log("Error: ".concat(err.message));
  console.log("Shutting down the server due to Uncaught Exception");
  process.exit(1);
}); //config

var dotenv = require('dotenv');

dotenv.config({
  path: __dirname + '/.env'
}); //connect database

connectDatabase();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
var server = app.listen(process.env.PORT || 5000, function () {
  console.log("Server is running on port: http://localhost:".concat(process.env.PORT));
}); // Unhandled Promise Rejection

process.on("unhandledRejection", function (err) {
  console.log("Error: ".concat(err.message));
  console.log("Shutting down the server due to Unhandled Promise Rejection");
  server.close(function () {
    process.exit(1);
  });
});