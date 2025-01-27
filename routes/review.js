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
// Routes for reviews

// Create review - Add a review to a listing
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.postReview)
);

//Delete review route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
