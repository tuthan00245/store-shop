"use strict";

var Product = require('../models/productModel');

var ErrorHander = require('../utils/errorHander');

var catchAsyncError = require('../middleware/catchAsyncError');

var ApiFeatures = require('../utils/apifeatures');

var cloudinary = require('cloudinary');

exports.createProduct = catchAsyncError(function _callee(req, res, next) {
  var images, imagesLinks, i, result, product;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          images = [];

          if (typeof req.body.images === "string") {
            images.push(req.body.images);
          } else {
            images = req.body.images;
          }

          imagesLinks = [];
          i = 0;

        case 4:
          if (!(i < images.length)) {
            _context.next = 12;
            break;
          }

          _context.next = 7;
          return regeneratorRuntime.awrap(cloudinary.v2.uploader.upload(images[i], {
            folder: "products"
          }));

        case 7:
          result = _context.sent;
          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
          });

        case 9:
          i++;
          _context.next = 4;
          break;

        case 12:
          req.body.images = imagesLinks;
          req.body.user = req.user.id;
          _context.next = 16;
          return regeneratorRuntime.awrap(Product.create(req.body));

        case 16:
          product = _context.sent;
          res.status(201).json({
            success: true,
            product: product
          });

        case 18:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.getAllProduct = catchAsyncError(function _callee2(req, res, next) {
  var resultPerPage, productsCount, apifeature, sort, sorter, products, filteredProductsCount;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          resultPerPage = 5;

          if (req.query.resultPerPage) {
            resultPerPage = req.query.resultPerPage;
          }

          _context2.next = 4;
          return regeneratorRuntime.awrap(Product.countDocuments());

        case 4:
          productsCount = _context2.sent;
          apifeature = new ApiFeatures(Product.find(), req.query).search().filter();
          sort = req.query.sort;
          sorter = {
            createdAt: -1
          };

          if (sort == -1 || sort == 1) {
            sorter = {
              price: sort
            };
          }

          if (sort == 5) {
            sorter = {
              ratings: -1
            };
          }

          if (sort == 'banchay') {
            sorter = {
              sold: -1
            };
          }

          _context2.next = 13;
          return regeneratorRuntime.awrap(apifeature.query.sort(sorter));

        case 13:
          products = _context2.sent;
          filteredProductsCount = products.length;
          apifeature.pagination(resultPerPage);
          _context2.next = 18;
          return regeneratorRuntime.awrap(apifeature.query.sort(sorter).clone());

        case 18:
          products = _context2.sent;

          if (products) {
            _context2.next = 21;
            break;
          }

          return _context2.abrupt("return", next(new ErrorHander("Product not found", 404)));

        case 21:
          res.status(200).json({
            success: true,
            products: products,
            productsCount: productsCount,
            resultPerPage: resultPerPage,
            filteredProductsCount: filteredProductsCount
          });

        case 22:
        case "end":
          return _context2.stop();
      }
    }
  });
});
exports.deleteProduct = catchAsyncError(function _callee3(req, res, next) {
  var product, i;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Product.findById(req.params.id));

        case 2:
          product = _context3.sent;

          if (product) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", next(new ErrorHander("Product not found", 404)));

        case 5:
          i = 0;

        case 6:
          if (!(i < product.images.length)) {
            _context3.next = 12;
            break;
          }

          _context3.next = 9;
          return regeneratorRuntime.awrap(cloudinary.v2.uploader.destroy(product.images[i].public_id));

        case 9:
          i++;
          _context3.next = 6;
          break;

        case 12:
          _context3.next = 14;
          return regeneratorRuntime.awrap(product.remove(product));

        case 14:
          return _context3.abrupt("return", res.status(200).json({
            success: true,
            product: product
          }));

        case 15:
        case "end":
          return _context3.stop();
      }
    }
  });
});
exports.deleteManyProduct = catchAsyncError(function _callee4(req, res, next) {
  var productId;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          productId = req.body.id;

          if (!productId) {
            _context4.next = 4;
            break;
          }

          _context4.next = 4;
          return regeneratorRuntime.awrap(Product.deleteMany({
            _id: {
              $in: productId
            }
          }));

        case 4:
          return _context4.abrupt("return", res.status(200).json({
            success: true
          }));

        case 5:
        case "end":
          return _context4.stop();
      }
    }
  });
});
exports.updateProduct = catchAsyncError(function _callee5(req, res, next) {
  var product, images, i, imagesLinks, _i, result;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(Product.findById(req.params.id));

        case 2:
          product = _context5.sent;

          if (product) {
            _context5.next = 5;
            break;
          }

          return _context5.abrupt("return", next(new ErrorHander("Product not found", 404)));

        case 5:
          // Images Start Here
          images = [];

          if (typeof req.body.images === "string") {
            images.push(req.body.images);
          } else {
            images = req.body.images;
          }

          if (!(images !== undefined)) {
            _context5.next = 26;
            break;
          }

          i = 0;

        case 9:
          if (!(i < product.images.length)) {
            _context5.next = 15;
            break;
          }

          _context5.next = 12;
          return regeneratorRuntime.awrap(cloudinary.v2.uploader.destroy(product.images[i].public_id));

        case 12:
          i++;
          _context5.next = 9;
          break;

        case 15:
          imagesLinks = [];
          _i = 0;

        case 17:
          if (!(_i < images.length)) {
            _context5.next = 25;
            break;
          }

          _context5.next = 20;
          return regeneratorRuntime.awrap(cloudinary.v2.uploader.upload(images[_i], {
            folder: "products"
          }));

        case 20:
          result = _context5.sent;
          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
          });

        case 22:
          _i++;
          _context5.next = 17;
          break;

        case 25:
          req.body.images = imagesLinks;

        case 26:
          _context5.next = 28;
          return regeneratorRuntime.awrap(Product.findByIdAndUpdate(req.params.id, req.body, {
            "new": true,
            runValidators: true,
            useFindAndModify: false
          }));

        case 28:
          product = _context5.sent;
          res.status(200).json({
            success: true,
            product: product
          });

        case 30:
        case "end":
          return _context5.stop();
      }
    }
  });
}); //get product detail

exports.getProductDetail = catchAsyncError(function _callee6(req, res, next) {
  var product;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(Product.findById(req.params.id));

        case 2:
          product = _context6.sent;

          if (product) {
            _context6.next = 5;
            break;
          }

          return _context6.abrupt("return", next(new ErrorHander("Product not found", 404)));

        case 5:
          res.status(200).json({
            success: true,
            product: product
          });

        case 6:
        case "end":
          return _context6.stop();
      }
    }
  });
}); // Create New Review or Update the review

exports.createProductReview = catchAsyncError(function _callee7(req, res, next) {
  var _req$body, rating, comment, productId, review, product, isReviewed, avg;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _req$body = req.body, rating = _req$body.rating, comment = _req$body.comment, productId = _req$body.productId;
          review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment: comment
          };
          _context7.next = 4;
          return regeneratorRuntime.awrap(Product.findById(productId));

        case 4:
          product = _context7.sent;
          isReviewed = product.reviews.find(function (rev) {
            return rev.user.toString() === req.user._id.toString();
          });

          if (isReviewed) {
            product.reviews.forEach(function (rev) {
              if (rev.user.toString() === req.user._id.toString()) rev.rating = rating, rev.comment = comment, rev.name = req.user.name;
            });
          } else {
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length;
          }

          avg = 0;
          product.reviews.forEach(function (rev) {
            avg += rev.rating;
          });
          product.ratings = avg / product.reviews.length;
          _context7.next = 12;
          return regeneratorRuntime.awrap(product.save({
            validateBeforeSave: false
          }));

        case 12:
          res.status(200).json({
            success: true
          });

        case 13:
        case "end":
          return _context7.stop();
      }
    }
  });
}); // Get All Reviews of a product

exports.getProductReviews = catchAsyncError(function _callee8(req, res, next) {
  var product, isReviewed;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return regeneratorRuntime.awrap(Product.findById(req.query.id));

        case 2:
          product = _context8.sent;
          isReviewed = product.reviews.find(function (rev) {
            return rev.user.toString() === req.user._id.toString();
          });

          if (isReviewed) {
            product.reviews.forEach(function (rev) {
              if (rev.user.toString() === req.user._id.toString()) rev.name = req.user.name;
            });
          }

          _context8.next = 7;
          return regeneratorRuntime.awrap(product.save({
            validateBeforeSave: false,
            "new": true
          }));

        case 7:
          if (product) {
            _context8.next = 9;
            break;
          }

          return _context8.abrupt("return", next(new ErrorHander("Product not found", 404)));

        case 9:
          res.status(200).json({
            success: true,
            reviews: product.reviews
          });

        case 10:
        case "end":
          return _context8.stop();
      }
    }
  });
}); // Delete Review

exports.deleteReview = catchAsyncError(function _callee9(req, res, next) {
  var product, reviews, avg, ratings, numOfReviews;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.next = 2;
          return regeneratorRuntime.awrap(Product.findById(req.query.productId));

        case 2:
          product = _context9.sent;

          if (product) {
            _context9.next = 5;
            break;
          }

          return _context9.abrupt("return", next(new ErrorHander("Product not found", 404)));

        case 5:
          reviews = product.reviews.filter(function (rev) {
            return rev._id.toString() !== req.query.id.toString();
          });
          avg = 0;
          reviews.forEach(function (rev) {
            avg += rev.rating;
          });
          ratings = 0;

          if (reviews.length === 0) {
            ratings = 0;
          } else {
            ratings = avg / reviews.length;
          }

          numOfReviews = reviews.length;
          _context9.next = 13;
          return regeneratorRuntime.awrap(Product.findByIdAndUpdate(req.query.productId, {
            reviews: reviews,
            ratings: ratings,
            numOfReviews: numOfReviews
          }, {
            "new": true,
            runValidators: true,
            useFindAndModify: false
          }));

        case 13:
          res.status(200).json({
            success: true
          });

        case 14:
        case "end":
          return _context9.stop();
      }
    }
  });
});