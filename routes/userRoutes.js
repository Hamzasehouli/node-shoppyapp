const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/register").post(authController.register);
router.route("/login").post(authController.login);
router.route("/forget-password").post(authController.forgetPassword);
router.route("/reset-password/:resetToken").post(authController.resetPassword);

module.exports = router;
