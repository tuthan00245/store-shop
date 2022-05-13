"use strict";

var ErrorHandler = require("../utils/errorHander");

module.exports = function (err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error"; // Wrong Mongodb Id error

  if (err.name === "CastError") {
    var message = "Resource not found. Invalid: ".concat(err.path);
    err = new ErrorHandler(message, 400);
  } // Mongoose duplicate key error


  if (err.code === 11000) {
    var _message = "Duplicate ".concat(Object.keys(err.keyValue), " Entered");

    err = new ErrorHandler(_message, 400);
  } // Wrong JWT error


  if (err.name === "JsonWebTokenError") {
    var _message2 = "Json Web Token is invalid, Try again ";
    err = new ErrorHandler(_message2, 400);
  } // JWT EXPIRE error


  if (err.name === "TokenExpiredError") {
    var _message3 = "Json Web Token is Expired, Try again ";
    err = new ErrorHandler(_message3, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message
  });
};