const express = require("express");
const router = express.Router();
const wrapAsync = require("../errorhandlers/wrapAsync.js");

const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// ===== MAIN LISTING ROUTES =====

// Index route - Display all listings
router.get("/", wrapAsync(listingController.index));

// Search listings
router.get("/search", wrapAsync(listingController.searchListings));

// Explore by category
router.get("/category/:category", wrapAsync(listingController.exploreByCategory));

// Featured listings
router.get("/featured", wrapAsync(listingController.featuredListings));

// User's own listings
router.get("/my-listings", isLoggedIn, wrapAsync(listingController.myListings));

// Create new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.post(
  "/",
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.createListing)
);

// Show single listing
router.get("/:id", wrapAsync(listingController.showListing));

// Edit listing
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing)
);

// Delete listing
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);

module.exports = router;
