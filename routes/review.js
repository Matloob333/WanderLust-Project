const express = require("express");
const { route } = require("./listing");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../errorhandlers/wrapAsync.js");
const ExpressError = require("../errorhandlers/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// ===== REVIEW CRUD ROUTES =====

// Create review - Add a review to a listing
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.postReview)
);

// Get all reviews for a listing (API endpoint)
router.get("/", wrapAsync(reviewController.getListingReviews));

// Get a specific review
router.get("/:reviewId", wrapAsync(reviewController.getReview));

// Edit review form
router.get(
  "/:reviewId/edit",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.renderEditReview)
);

// Update review
router.put(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  validateReview,
  wrapAsync(reviewController.updateReview)
);

// Delete review route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

// ===== REVIEW FEATURES =====

// Like/Unlike a review
router.post(
  "/:reviewId/like",
  isLoggedIn,
  wrapAsync(reviewController.toggleLike)
);

// Report a review
router.post(
  "/:reviewId/report",
  isLoggedIn,
  wrapAsync(reviewController.reportReview)
);

module.exports = router;
