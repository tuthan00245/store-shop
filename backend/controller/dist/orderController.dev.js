"use strict";

var Order = require("../models/orderModel");

var Product = require("../models/productModel");

var ErrorHander = require("../utils/errorHander");

var catchAsyncError = require("../middleware/catchAsyncError"); // Create new Order


exports.newOrder = catchAsyncError(function _callee(req, res, next) {
  var _req$body, shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice, order;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, shippingInfo = _req$body.shippingInfo, orderItems = _req$body.orderItems, paymentInfo = _req$body.paymentInfo, itemsPrice = _req$body.itemsPrice, taxPrice = _req$body.taxPrice, shippingPrice = _req$body.shippingPrice, totalPrice = _req$body.totalPrice;
          _context.next = 3;
          return regeneratorRuntime.awrap(Order.create({
            shippingInfo: shippingInfo,
            orderItems: orderItems,
            paymentInfo: paymentInfo,
            itemsPrice: itemsPrice,
            taxPrice: taxPrice,
            shippingPrice: shippingPrice,
            totalPrice: totalPrice,
            paidAt: Date.now(),
            user: req.user._id
          }));

        case 3:
          order = _context.sent;
          res.status(201).json({
            success: true,
            order: order
          });

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
}); // get Single Order

exports.getSingleOrder = catchAsyncError(function _callee2(req, res, next) {
  var order;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Order.findById(req.params.id).populate("user", "name email"));

        case 2:
          order = _context2.sent;

          if (order) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", next(new ErrorHander("Order not found with this Id", 404)));

        case 5:
          res.status(200).json({
            success: true,
            order: order
          });

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // get logged in user  Orders

exports.myOrders = catchAsyncError(function _callee3(req, res, next) {
  var orders;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Order.find({
            user: req.user._id
          }));

        case 2:
          orders = _context3.sent;
          res.status(200).json({
            success: true,
            orders: orders
          });

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
}); // get all Orders -- Admin

exports.getAllOrders = catchAsyncError(function _callee4(req, res, next) {
  var orders, totalAmount;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Order.find());

        case 2:
          orders = _context4.sent;
          totalAmount = 0;
          orders.forEach(function (order) {
            totalAmount += order.totalPrice;
          });
          res.status(200).json({
            success: true,
            totalAmount: totalAmount,
            orders: orders
          });

        case 6:
        case "end":
          return _context4.stop();
      }
    }
  });
}); // update Order Status -- Admin

exports.updateOrder = catchAsyncError(function _callee6(req, res, next) {
  var order;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(Order.findById(req.params.id));

        case 2:
          order = _context6.sent;

          if (order) {
            _context6.next = 5;
            break;
          }

          return _context6.abrupt("return", next(new ErrorHander("Order not found with this Id", 404)));

        case 5:
          if (!(order.orderStatus === "Delivered")) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", next(new ErrorHander("You have already delivered this order", 400)));

        case 7:
          if (req.body.status === "Shipped") {
            order.orderItems.forEach(function _callee5(o) {
              return regeneratorRuntime.async(function _callee5$(_context5) {
                while (1) {
                  switch (_context5.prev = _context5.next) {
                    case 0:
                      _context5.next = 2;
                      return regeneratorRuntime.awrap(updateStock(o.product, o.quantity));

                    case 2:
                    case "end":
                      return _context5.stop();
                  }
                }
              });
            });
          }

          order.orderStatus = req.body.status;

          if (req.body.status === "Delivered") {
            order.deliveredAt = Date.now();
          }

          _context6.next = 12;
          return regeneratorRuntime.awrap(order.save({
            validateBeforeSave: false
          }));

        case 12:
          res.status(200).json({
            success: true
          });

        case 13:
        case "end":
          return _context6.stop();
      }
    }
  });
});

function updateStock(id, quantity) {
  var product;
  return regeneratorRuntime.async(function updateStock$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(Product.findById(id));

        case 2:
          product = _context7.sent;
          product.Stock -= quantity;
          product.sold = quantity;
          _context7.next = 7;
          return regeneratorRuntime.awrap(product.save({
            validateBeforeSave: false
          }));

        case 7:
        case "end":
          return _context7.stop();
      }
    }
  });
} // delete Order -- Admin


exports.deleteOrder = catchAsyncError(function _callee7(req, res, next) {
  var order;
  return regeneratorRuntime.async(function _callee7$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return regeneratorRuntime.awrap(Order.findById(req.params.id));

        case 2:
          order = _context8.sent;

          if (order) {
            _context8.next = 5;
            break;
          }

          return _context8.abrupt("return", next(new ErrorHander("Order not found with this Id", 404)));

        case 5:
          _context8.next = 7;
          return regeneratorRuntime.awrap(order.remove());

        case 7:
          res.status(200).json({
            success: true
          });

        case 8:
        case "end":
          return _context8.stop();
      }
    }
  });
});
exports.deleteManyOrder = catchAsyncError(function _callee8(req, res, next) {
  var orderId;
  return regeneratorRuntime.async(function _callee8$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          orderId = req.body.id;

          if (!orderId) {
            _context9.next = 4;
            break;
          }

          _context9.next = 4;
          return regeneratorRuntime.awrap(Order.deleteMany({
            _id: {
              $in: orderId
            }
          }));

        case 4:
          return _context9.abrupt("return", res.status(200).json({
            success: true
          }));

        case 5:
        case "end":
          return _context9.stop();
      }
    }
  });
});
exports.groupOrders = catchAsyncError(function _callee9(req, res, next) {
  var orders;
  return regeneratorRuntime.async(function _callee9$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          Order.aggregate([{
            $group: {
              _id: "$user",
              total: {
                $sum: "$totalPrice"
              }
            }
          }]);
          _context10.next = 3;
          return regeneratorRuntime.awrap(Order.find());

        case 3:
          orders = _context10.sent;
          res.status(200).json({
            orders: orders
          });

        case 5:
        case "end":
          return _context10.stop();
      }
    }
  });
});