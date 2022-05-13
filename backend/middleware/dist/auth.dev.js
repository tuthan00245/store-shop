"use strict";

var jwt = require('jsonwebtoken');

var ErrorHander = require("../utils/errorHander");

var catchAsyncError = require("./catchAsyncError");

var User = require('../models/userModel');

exports.isAuthenticatedUser = catchAsyncError(function _callee(req, res, next) {
  var token, decodedData;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          token = req.cookies.token;

          if (token) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", next(new ErrorHander("Please Login to access this resource", 401)));

        case 3:
          decodedData = jwt.verify(token, process.env.JWT_SECRET);
          _context.next = 6;
          return regeneratorRuntime.awrap(User.findById(decodedData.id));

        case 6:
          req.user = _context.sent;
          next();

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
}); // exports.protect = catchAsyncError(async (req, res, next) => {
//     let token;
//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith("Bearer")
//     ) {
//       token = req.headers.authorization.split(" ")[1];
//     }
//     if (!token) {
//       return next(new ErrorResponse("Not authorized to access this route", 401));
//     }
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       const user = await User.findById(decoded.id);
//       if (!user) {
//         return next(new ErrorResponse("No user found with this id", 404));
//       }
//       req.user = user;
//       next();
//     } catch (err) {
//       return next(new ErrorResponse("Not authorized to access this router", 401));
//     }
//   })

exports.authorizeRoles = function () {
  for (var _len = arguments.length, roles = new Array(_len), _key = 0; _key < _len; _key++) {
    roles[_key] = arguments[_key];
  }

  return function (req, res, next) {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorHander("Role: ".concat(req.user.role, " is not allowed to access this resouce "), 403));
    }

    next();
  };
};