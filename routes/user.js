const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/users");
const wrapAsync = require("../errorhandlers/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware");
const userController = require("../controllers/user");
const multer = require("multer");

// Configure multer for file uploads with fallback
let storage;
try {
  const { storage: cloudinaryStorage } = require("../cloudConfig");
  storage = cloudinaryStorage;
} catch (error) {
  console.warn('Cloudinary not configured, using memory storage');
  storage = multer.memoryStorage();
}

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// ===== AUTHENTICATION ROUTES =====

// Sign Up Route - Display sign-up form
router.route("/signup")
.get(userController.renderSignUpForm)
.post(wrapAsync(userController.signUp));

// Login Route - Display login form
router.route("/login")
.get(userController.renderLogInForm)
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

// ===== EMAIL VERIFICATION ROUTES =====

// Email verification
router.route("/verify-email")
.get(isLoggedIn, userController.renderEmailVerification)
.post(isLoggedIn, wrapAsync(userController.verifyEmail));

// Resend verification code
router.post("/resend-verification", isLoggedIn, wrapAsync(userController.resendVerificationCode));

// ===== USER PROFILE ROUTES =====

// User profile page
router.get("/profile", isLoggedIn, wrapAsync(userController.showProfile));

// Edit profile
router.route("/profile/edit")
.get(isLoggedIn, userController.renderEditProfile)
.put(isLoggedIn, upload.single('avatar'), wrapAsync(userController.updateProfile));

// Change password
router.route("/profile/change-password")
.get(isLoggedIn, userController.renderChangePassword)
.put(isLoggedIn, wrapAsync(userController.changePassword));

// User's reviews
router.get("/reviews", isLoggedIn, wrapAsync(userController.showUserReviews));

// ===== PASSWORD RESET ROUTES =====

// Forgot password
router.route("/forgot-password")
.get(userController.renderForgotPassword)
.post(wrapAsync(userController.forgotPassword));

// Reset password
router.route("/reset-password/:token")
.get(userController.renderResetPassword)
.post(wrapAsync(userController.resetPassword));

// ===== USER MANAGEMENT ROUTES =====

// Delete account
router.delete("/profile", isLoggedIn, wrapAsync(userController.deleteAccount));

// User settings
router.route("/settings")
.get(isLoggedIn, userController.renderSettings)
.put(isLoggedIn, wrapAsync(userController.updateSettings));

module.exports = router;
