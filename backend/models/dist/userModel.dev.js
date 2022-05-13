"use strict";

var mongoose = require('mongoose');

var validator = require('validator');

var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

var crypto = require('crypto');

var UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxlength: [30, "Name cannot exceed 30 characters"],
    minlength: [4, "Name should have more than 4 characters"]
  },
  phone: {
    type: String,
    maxlength: [10, "Phone number cannot exceed 10 characters"],
    minlength: [9, "Phone number should have more than 9 characters"]
  },
  sex: {
    type: Number
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Name"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"]
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Name"],
    minlength: [8, "Password should be greater than 8 characters"],
    select: false
  },
  address: [{
    type: String
  }],
  avatar: {
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  role: {
    type: String,
    "default": "user"
  },
  createAt: {
    type: Date,
    "default": Date.now()
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
});
UserSchema.pre("save", function _callee(next) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!this.isModified("password")) {
            next();
          }

          _context.next = 3;
          return regeneratorRuntime.awrap(bcrypt.hash(this.password, 10));

        case 3:
          this.password = _context.sent;

        case 4:
        case "end":
          return _context.stop();
      }
    }
  }, null, this);
}); //JWT token 

UserSchema.methods.getJWTToken = function () {
  return jwt.sign({
    id: this.id
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

UserSchema.methods.comparePassword = function _callee2(password) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(bcrypt.compare(password, this.password));

        case 2:
          return _context2.abrupt("return", _context2.sent);

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  }, null, this);
};

UserSchema.methods.getResetPasswordToken = function () {
  var resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model('User', UserSchema);