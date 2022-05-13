"use strict";

var express = require('express');

var _require = require('../controller/productController'),
    createProduct = _require.createProduct,
    getAllProduct = _require.getAllProduct,
    deleteProduct = _require.deleteProduct,
    updateProduct = _require.updateProduct,
    getProductDetail = _require.getProductDetail,
    createProductReview = _require.createProductReview,
    getProductReviews = _require.getProductReviews,
    deleteReview = _require.deleteReview,
    deleteManyProduct = _require.deleteManyProduct;

var _require2 = require('../middleware/auth'),
    isAuthenticatedUser = _require2.isAuthenticatedUser;

var _require3 = require('../middleware/auth'),
    authorizeRoles = _require3.authorizeRoles;

var router = express.Router();
router.route('/products').get(getAllProduct);
router.route('/product/:id').get(getProductDetail);
router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);
router.route('/admin/product/:id')["delete"](isAuthenticatedUser, authorizeRoles("admin"), deleteProduct).put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);
router.route('/admin/muitiple/product').post(isAuthenticatedUser, authorizeRoles("admin"), deleteManyProduct);
router.route('/review').put(isAuthenticatedUser, createProductReview);
router.route('/reviews').get(isAuthenticatedUser, getProductReviews)["delete"](isAuthenticatedUser, deleteReview);
module.exports = router;