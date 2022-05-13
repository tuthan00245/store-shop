"use strict";

var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Please enter product name"]
  },
  description: {
    type: String,
    required: [true, "Please Enter product Description"]
  },
  moneyShip: {
    type: Number,
    required: [true, "Please Enter product money for ship"]
  },
  sold: {
    type: Number,
    "default": 0
  },
  price: {
    type: Number,
    maxlength: [8, "Price cannot exceed 8 characters"]
  },
  sale: {
    type: Number,
    maxlength: [2, "sale cannot exceed 2 characters"]
  },
  ratings: {
    type: Number,
    "default": 0
  },
  images: [{
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }],
  category: {
    type: String,
    required: [true, "Please provide category"]
  },
  Stock: {
    type: Number,
    required: [true, "Please select product stocks"],
    maxlength: [4],
    "default": 1
  },
  numOfReview: {
    type: Number,
    "default": 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true
    },
    comment: {
      type: String,
      required: true
    }
  }],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    "default": Date.now
  }
});
module.exports = mongoose.model('Product', ProductSchema);