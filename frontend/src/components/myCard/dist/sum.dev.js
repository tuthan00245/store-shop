"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkProductSelected = exports.sumMoneyShip = exports.sumMoneyProduct = void 0;

var sumMoneyProduct = function sumMoneyProduct(productCart, key) {
  if (key.length > 0) {
    var sum = key.reduce(function (sum, acc, index) {
      if (productCart[acc].selected === true) {
        return sum + (productCart[acc].price - productCart[acc].price * productCart[acc].sale / 100) * productCart[acc].quantity;
      }

      return sum;
    }, 0);
    return sum;
  }

  return 0;
};

exports.sumMoneyProduct = sumMoneyProduct;

var sumMoneyShip = function sumMoneyShip(productCart, key) {
  if (key.length > 0) {
    var sum = key.reduce(function (sum, acc, index) {
      if (productCart[acc].selected === true) {
        return sum + productCart[acc].moneyShip;
      }

      return sum;
    }, 0);
    return sum;
  }

  return 0;
};

exports.sumMoneyShip = sumMoneyShip;

var checkProductSelected = function checkProductSelected(productCart, key) {
  if (key.length > 0) {
    var sum = key.reduce(function (sum, acc, index) {
      if (productCart[acc].selected === true) {
        return sum + productCart[acc].quantity;
      }

      return sum;
    }, 0);
    return sum;
  }

  return 0;
};

exports.checkProductSelected = checkProductSelected;