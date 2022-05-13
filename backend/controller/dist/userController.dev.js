"use strict";

var catchAsyncError = require('../middleware/catchAsyncError');

var ErrorHander = require('../utils/errorHander');

var User = require('../models/userModel');

var sendToken = require('../utils/jwtToken');

var sendEmail = require('../utils/sendMail');

var crypto = require("crypto");

var cloudinary = require('cloudinary');

var userModel = require('../models/userModel'); //register user


exports.registerUser = catchAsyncError(function _callee(req, res, next) {
  var myCloud, _req$body, name, password, email, user;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale"
          }));

        case 2:
          myCloud = _context.sent;
          _req$body = req.body, name = _req$body.name, password = _req$body.password, email = _req$body.email;
          _context.next = 6;
          return regeneratorRuntime.awrap(User.create({
            name: name,
            password: password,
            email: email,
            avatar: {
              public_id: myCloud.public_id,
              url: myCloud.secure_url
            }
          }));

        case 6:
          user = _context.sent;
          sendToken(user, 201, res);

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
}); //login User

exports.loginUser = catchAsyncError(function _callee2(req, res, next) {
  var _req$body2, email, password, user, isPasswordMatched;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;

          if (!(!email || !password)) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", next(new ErrorHander("Please enter password & email", 400)));

        case 3:
          _context2.next = 5;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }).select("+password"));

        case 5:
          user = _context2.sent;

          if (user) {
            _context2.next = 8;
            break;
          }

          return _context2.abrupt("return", next(new ErrorHander("Invalid email or password", 401)));

        case 8:
          _context2.next = 10;
          return regeneratorRuntime.awrap(user.comparePassword(password));

        case 10:
          isPasswordMatched = _context2.sent;

          if (isPasswordMatched) {
            _context2.next = 13;
            break;
          }

          return _context2.abrupt("return", next(new ErrorHander("Invalid email or password", 401)));

        case 13:
          sendToken(user, 200, res);

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  });
}); //log out user

exports.logout = catchAsyncError(function _callee3(req, res, next) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true
          });
          res.status(200).json({
            success: true,
            message: "Logged Out"
          });

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  });
}); // forgot password

exports.forgotPassword = catchAsyncError(function _callee4(req, res, next) {
  var user, resetToken, resetPasswordUrl, message;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.body.email
          }));

        case 2:
          user = _context4.sent;

          if (user) {
            _context4.next = 5;
            break;
          }

          return _context4.abrupt("return", next(new ErrorHander("User not found", 404)));

        case 5:
          // Get ResetPassword Token
          resetToken = user.getResetPasswordToken();
          _context4.next = 8;
          return regeneratorRuntime.awrap(user.save({
            validateBeforeSave: false
          }));

        case 8:
          resetPasswordUrl = "".concat(req.protocol, "://").concat(req.get("host"), "/password/reset/").concat(resetToken);
          message = "Your password reset token is :- \n\n ".concat(resetPasswordUrl, " \n\nIf you have not requested this email then, please ignore it.");
          _context4.prev = 10;
          _context4.next = 13;
          return regeneratorRuntime.awrap(sendEmail({
            email: user.email,
            subject: "Ecommerce Password Recovery",
            message: message
          }));

        case 13:
          res.status(200).json({
            success: true,
            message: "Email sent to ".concat(user.email, " successfully")
          });
          _context4.next = 23;
          break;

        case 16:
          _context4.prev = 16;
          _context4.t0 = _context4["catch"](10);
          user.resetPasswordToken = undefined;
          user.resetPasswordExpire = undefined;
          _context4.next = 22;
          return regeneratorRuntime.awrap(user.save({
            validateBeforeSave: false
          }));

        case 22:
          return _context4.abrupt("return", next(new ErrorHander(_context4.t0.message, 500)));

        case 23:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[10, 16]]);
}); // Reset Password

exports.resetPassword = catchAsyncError(function _callee5(req, res, next) {
  var resetPasswordToken, user;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          // creating token hash
          resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
          _context5.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            resetPasswordToken: resetPasswordToken,
            resetPasswordExpire: {
              $gt: Date.now()
            }
          }));

        case 3:
          user = _context5.sent;

          if (user) {
            _context5.next = 6;
            break;
          }

          return _context5.abrupt("return", next(new ErrorHander("Reset Password Token is invalid or has been expired", 400)));

        case 6:
          if (!(req.body.password !== req.body.confirmPassword)) {
            _context5.next = 8;
            break;
          }

          return _context5.abrupt("return", next(new ErrorHander("Password does not password", 400)));

        case 8:
          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpire = undefined;
          _context5.next = 13;
          return regeneratorRuntime.awrap(user.save());

        case 13:
          sendToken(user, 200, res);

        case 14:
        case "end":
          return _context5.stop();
      }
    }
  });
}); //get user details

exports.getUserDetails = catchAsyncError(function _callee6(req, res, next) {
  var user;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(User.findById(req.user.id));

        case 2:
          user = _context6.sent;
          res.status(200).json({
            success: true,
            user: user
          });

        case 4:
        case "end":
          return _context6.stop();
      }
    }
  });
}); // update password

exports.updatePasswordUser = catchAsyncError(function _callee7(req, res, next) {
  var user, isPasswordMatched;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(User.findById(req.user.id).select("+password"));

        case 2:
          user = _context7.sent;

          if (user) {
            _context7.next = 5;
            break;
          }

          return _context7.abrupt("return", next(new ErrorHander("Password does not password", 400)));

        case 5:
          _context7.next = 7;
          return regeneratorRuntime.awrap(user.comparePassword(req.body.oldPassword));

        case 7:
          isPasswordMatched = _context7.sent;

          if (isPasswordMatched) {
            _context7.next = 10;
            break;
          }

          return _context7.abrupt("return", next(new ErrorHander("Old password is not correct", 401)));

        case 10:
          if (!(req.body.confirmPassword !== req.body.newPassword)) {
            _context7.next = 12;
            break;
          }

          return _context7.abrupt("return", next(new ErrorHander("Password does not match", 401)));

        case 12:
          user.password = req.body.newPassword;
          _context7.next = 15;
          return regeneratorRuntime.awrap(user.save());

        case 15:
          sendToken(user, 200, res);

        case 16:
        case "end":
          return _context7.stop();
      }
    }
  });
}); // update profile 

exports.updateProfile = catchAsyncError(function _callee8(req, res, next) {
  var newUserData, _user, imageId, myCloud, user;

  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          newUserData = {
            name: req.body.name,
            email: req.body.email,
            sex: req.body.sex,
            phone: req.body.phone
          };

          if (!(req.body.avatar != "")) {
            _context8.next = 12;
            break;
          }

          _context8.next = 4;
          return regeneratorRuntime.awrap(User.findById(req.user.id));

        case 4:
          _user = _context8.sent;
          imageId = _user.avatar.public_id;
          _context8.next = 8;
          return regeneratorRuntime.awrap(cloudinary.v2.uploader.destroy(imageId));

        case 8:
          _context8.next = 10;
          return regeneratorRuntime.awrap(cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale"
          }));

        case 10:
          myCloud = _context8.sent;
          newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
          };

        case 12:
          _context8.next = 14;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user.id, newUserData, {
            "new": true,
            runValidators: true,
            useFindAndModify: false
          }));

        case 14:
          user = _context8.sent;
          res.status(200).json({
            success: true
          });

        case 16:
        case "end":
          return _context8.stop();
      }
    }
  });
}); //get All user 

exports.getAllUsers = catchAsyncError(function _callee9(req, res, next) {
  var users;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.next = 2;
          return regeneratorRuntime.awrap(User.find());

        case 2:
          users = _context9.sent;
          res.status(200).json({
            success: true,
            users: users
          });

        case 4:
        case "end":
          return _context9.stop();
      }
    }
  });
}); //get Single user

exports.getSingleUser = catchAsyncError(function _callee10(req, res, next) {
  var user;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return regeneratorRuntime.awrap(User.findById(req.params.id));

        case 2:
          user = _context10.sent;

          if (user) {
            _context10.next = 5;
            break;
          }

          return _context10.abrupt("return", next(new ErrorHander("Does not exist user with : ".concat(req.params.id))));

        case 5:
          res.status(200).json({
            success: true,
            user: user
          });

        case 6:
        case "end":
          return _context10.stop();
      }
    }
  });
}); //update userRole

exports.updateUserRole = catchAsyncError(function _callee11(req, res, next) {
  var newDataRole, email, isUserEmail, user;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          newDataRole = {
            role: req.body.role
          };
          email = req.body.email;
          _context11.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 4:
          isUserEmail = _context11.sent;

          if (isUserEmail) {
            _context11.next = 7;
            break;
          }

          return _context11.abrupt("return", next(new ErrorHander("Does not exits user with email: ".concat(req.body.email))));

        case 7:
          _context11.next = 9;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.params.id, newDataRole, {
            "new": true,
            useFindAndModify: false,
            runValidators: true
          }));

        case 9:
          user = _context11.sent;
          res.status(200).json({
            success: true,
            user: user
          });

        case 11:
        case "end":
          return _context11.stop();
      }
    }
  });
}); //update user address

exports.updateUserAddress = catchAsyncError(function _callee12(req, res, next) {
  var newDataAddress, user;
  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          newDataAddress = req.body.address; // let user = await User.findById(req.user.id)
          // if (!user) {
          //   return next(new ErrorHander("Password does not password", 400));
          // }

          _context12.next = 3;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user.id, {
            $push: {
              address: newDataAddress
            }
          }, {
            "new": true,
            useFindAndModify: false,
            runValidators: true
          }));

        case 3:
          user = _context12.sent;
          res.status(200).json({
            success: true,
            user: user
          });

        case 5:
        case "end":
          return _context12.stop();
      }
    }
  });
}); //delete an address

exports.DeleteUserAddress = catchAsyncError(function _callee13(req, res, next) {
  var dataAddress, user;
  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          dataAddress = req.body.addressDel; // let user = await User.findById(req.user.id)
          // if (!user) {
          //   return next(new ErrorHander("Password does not password", 400));
          // }

          _context13.next = 3;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user.id, {
            $pull: {
              address: dataAddress
            }
          }, {
            "new": true,
            useFindAndModify: false,
            runValidators: true
          }));

        case 3:
          user = _context13.sent;
          res.status(200).json({
            success: true,
            user: user
          });

        case 5:
        case "end":
          return _context13.stop();
      }
    }
  });
}); //delete user

exports.deleteUser = catchAsyncError(function _callee14(req, res, next) {
  var user;
  return regeneratorRuntime.async(function _callee14$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.next = 2;
          return regeneratorRuntime.awrap(User.findById(req.params.id));

        case 2:
          user = _context14.sent;

          if (user) {
            _context14.next = 5;
            break;
          }

          return _context14.abrupt("return", next(new ErrorHander("User does not exist with Id: ".concat(req.params.id), 400)));

        case 5:
          _context14.next = 7;
          return regeneratorRuntime.awrap(user.remove());

        case 7:
          res.status(200).json({
            success: true,
            message: "User Deleted Successfully"
          });

        case 8:
        case "end":
          return _context14.stop();
      }
    }
  });
});
exports.deleteManyUser = catchAsyncError(function _callee15(req, res, next) {
  var userId;
  return regeneratorRuntime.async(function _callee15$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          userId = req.body.id;

          if (!userId) {
            _context15.next = 4;
            break;
          }

          _context15.next = 4;
          return regeneratorRuntime.awrap(User.deleteMany({
            _id: {
              $in: userId
            }
          }));

        case 4:
          return _context15.abrupt("return", res.status(200).json({
            success: true
          }));

        case 5:
        case "end":
          return _context15.stop();
      }
    }
  });
});