"use strict";

var catchAsyncError = require('../middleware/catchAsyncError');

var Cart = require('../models/cartModel');

var ErrorHander = require('../utils/errorHander');

function runUpdate(condition, updateData) {
  return new Promise(function (resolve, reject) {
    Cart.findOneAndUpdate(condition, updateData, {
      "new": true
    }).then(function (result) {
      return resolve(result);
    })["catch"](function (err) {
      return reject(err);
    });
  });
}

exports.addItemToCart = catchAsyncError(function _callee(req, res) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          Cart.findOne({
            user: req.user._id
          }).exec(function (error, cart) {
            if (error) return res.status(400).json({
              error: error
            });

            if (cart) {
              //if cart already exists then update cart by quantity
              var promiseArray = [];
              req.body.cartItems.forEach(function (cartItem) {
                var product = cartItem.product;
                var item = cart.cartItems.find(function (c) {
                  return c.product == product;
                });
                var condition, update;

                if (item) {
                  condition = {
                    user: req.user._id,
                    "cartItems.product": product
                  };
                  update = {
                    $set: {
                      "cartItems.$": cartItem
                    }
                  };
                } else {
                  condition = {
                    user: req.user._id
                  };
                  update = {
                    $push: {
                      cartItems: cartItem
                    }
                  };
                }

                promiseArray.push(runUpdate(condition, update));
              });
              Promise.all(promiseArray).then(function (data) {
                return res.status(201).json({
                  data: data
                });
              })["catch"](function (error) {
                return res.status(400).json({
                  error: error
                });
              });
            } else {
              var _cart = new Cart({
                user: req.user._id,
                cartItems: req.body.cartItems
              });

              _cart.save(function (error, cart) {
                if (error) return res.status(400).json({
                  error: error
                });

                if (cart) {
                  return res.status(201).json({
                    cart: cart
                  });
                }
              });
            }
          });

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.getCartItems = catchAsyncError(function _callee2(req, res, next) {
  var cart, cartItems;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Cart.findOne({
            user: req.user._id
          }).populate("cartItems.product", "_id category name moneyShip price images description Stock sale"));

        case 2:
          cart = _context2.sent;

          if (cart) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", next(new ErrorHander("Card not found", 404)));

        case 5:
          cartItems = {};
          cart.cartItems.forEach(function (item, index) {
            cartItems[item.product._id.toString()] = {
              _id: item.product._id.toString(),
              name: item.product.name,
              images: item.product.images[0].url,
              price: item.product.price,
              quantity: item.quantity,
              description: item.product.description,
              Stock: item.product.Stock,
              sale: item.product.sale,
              selected: item.selected,
              moneyShip: item.product.moneyShip,
              category: item.product.category
            };
          });
          res.status(200).json({
            cartItems: cartItems
          });

        case 8:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // new update remove cart items

exports.removeCartItems = catchAsyncError(function _callee3(req, res, next) {
  var productId;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          productId = req.body.id;

          if (productId) {
            Cart.update({
              user: req.user._id
            }, {
              $pull: {
                cartItems: {
                  product: productId
                }
              }
            }).exec(function (error, result) {
              if (error) return res.status(400).json({
                error: error
              });

              if (result) {
                res.status(202).json({
                  result: result
                });
              }
            });
          }

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  });
});
exports.removeCardUser = catchAsyncError(function _callee4(req, res, next) {
  var card;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Cart.findOne(req.user._id));

        case 2:
          card = _context4.sent;

          if (card) {
            _context4.next = 5;
            break;
          }

          return _context4.abrupt("return", next(new ErrorHander("Card not found", 404)));

        case 5:
          _context4.next = 7;
          return regeneratorRuntime.awrap(card.remove());

        case 7:
          res.status(200).json({
            success: true
          });

        case 8:
        case "end":
          return _context4.stop();
      }
    }
  });
});
exports.updateSelectedAll = catchAsyncError(function _callee5(req, res, next) {
  var card;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(Cart.findOne(req.user._id));

        case 2:
          card = _context5.sent;

          if (card) {
            _context5.next = 5;
            break;
          }

          return _context5.abrupt("return", next(new ErrorHander("Card not found", 404)));

        case 5:
          card.cartItems.forEach(function (cartItem, i) {
            cartItem.selected = req.body.selected;
          });
          card.save();
          res.status(200).json({
            success: true
          });

        case 8:
        case "end":
          return _context5.stop();
      }
    }
  });
});