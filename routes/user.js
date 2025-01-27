const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/users");
const wrapAsync = require("../errorhandlers/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/user");

// Sign Up Route - Display sign-up form
router.route("/signup")
.get( userController.renderSignUpForm)
.post(
  wrapAsync(userController.signUp)
);

// Login Route - Display login form
router
.route("/login")
.get( userController.renderLogInForm)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
userController.logIn
);

// Logout Route - Log out the user and redirect to listings
router.get("/logout", userController.logOut);

module.exports = router;
