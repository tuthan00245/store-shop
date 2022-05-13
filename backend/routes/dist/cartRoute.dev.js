"use strict";

var express = require('express');

var _require = require('../controller/cartController'),
    addItemToCart = _require.addItemToCart,
    getCartItems = _require.getCartItems,
    removeCartItems = _require.removeCartItems,
    updateSelectedAll = _require.updateSelectedAll;

var router = express.Router();

var _require2 = require('../middleware/auth'),
    isAuthenticatedUser = _require2.isAuthenticatedUser;

router.route('/cart').post(isAuthenticatedUser, addItemToCart);
router.route('/cart/items').get(isAuthenticatedUser, getCartItems).post(isAuthenticatedUser, removeCartItems);
router.route('/cart/items/update').post(isAuthenticatedUser, updateSelectedAll);
module.exports = router;