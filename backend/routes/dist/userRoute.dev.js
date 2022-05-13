"use strict";

var express = require('express');

var _require = require('../controller/userController'),
    registerUser = _require.registerUser,
    loginUser = _require.loginUser,
    logout = _require.logout,
    forgotPassword = _require.forgotPassword,
    resetPassword = _require.resetPassword,
    getUserDetails = _require.getUserDetails,
    updatePasswordUser = _require.updatePasswordUser,
    updateProfile = _require.updateProfile,
    getAllUsers = _require.getAllUsers,
    getSingleUser = _require.getSingleUser,
    updateUserRole = _require.updateUserRole,
    deleteUser = _require.deleteUser,
    updateUserAddress = _require.updateUserAddress,
    DeleteUserAddress = _require.DeleteUserAddress,
    deleteManyUser = _require.deleteManyUser;

var router = express.Router();

var _require2 = require('../middleware/auth'),
    isAuthenticatedUser = _require2.isAuthenticatedUser,
    authorizeRoles = _require2.authorizeRoles;

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/password/update").put(isAuthenticatedUser, updatePasswordUser);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
router.route("/me/update/address").post(isAuthenticatedUser, updateUserAddress);
router.route("/me/delete/address").post(isAuthenticatedUser, DeleteUserAddress);
router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router.route("/admin/user/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser).put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)["delete"](isAuthenticatedUser, authorizeRoles("admin"), deleteUser);
router.route('/admin/muitiple/user').post(isAuthenticatedUser, authorizeRoles("admin"), deleteManyUser);
module.exports = router;