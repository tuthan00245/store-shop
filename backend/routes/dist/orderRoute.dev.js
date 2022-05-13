"use strict";

var express = require("express");

var _require = require("../controller/orderController"),
    newOrder = _require.newOrder,
    getSingleOrder = _require.getSingleOrder,
    myOrders = _require.myOrders,
    getAllOrders = _require.getAllOrders,
    updateOrder = _require.updateOrder,
    deleteOrder = _require.deleteOrder,
    deleteManyOrder = _require.deleteManyOrder,
    groupOrders = _require.groupOrders;

var router = express.Router();

var _require2 = require("../middleware/auth"),
    isAuthenticatedUser = _require2.isAuthenticatedUser,
    authorizeRoles = _require2.authorizeRoles;

router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
router.route("/orders/me").get(isAuthenticatedUser, myOrders);
router.route("/admin/orders").get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);
router.route("/admin/order/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)["delete"](isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);
router.route('/admin/muitiple/order').post(isAuthenticatedUser, authorizeRoles("admin"), deleteManyOrder);
router.route('/group/orders').get(isAuthenticatedUser, authorizeRoles("admin"), groupOrders);
module.exports = router;