"use strict";

var sendToken = function sendToken(user, statusCode, res) {
  var token = user.getJWTToken();
  var options = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user: user,
    token: token
  });
}; // const sendToken = (user, statusCode, res) => {
//     const token = user.getSignedJwtToken();
//     res.status(statusCode).json({
//       success: true,
//       token
//     });
//   };


module.exports = sendToken;