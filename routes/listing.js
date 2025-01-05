const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../util/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

// Validation middleware for listings
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Routes for listings

// Index route - Display all listings
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// New route - Display form to create a new listing
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// Show route - Display details of a specific listing
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate("reviews")
      .populate("owner");
      

    if (!listing) {
      req.flash("error", "The listing you requested does not exist!");
      return res.redirect("/listings"); // Use return to prevent further execution
    }
    console.log(listing);
    res.render("listings/show", { listing });
  })
);

// Create route - Add a new listing to the database
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
  })
);

// Edit route - Display form to edit an existing listing
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "The listing you requested does not exist!");
      return res.redirect("/listings"); // Use return to prevent further execution
    }
    res.render("listings/edit", { listing });
  })
);

// Update route - Update an existing listing in the database
router.put(
  "/:id",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    await Listing.findByIdAndUpdate(req.params.id, req.body.listing);
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${req.params.id}`);
  })
);

// Delete route - Remove a listing from the database
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted!");

    res.redirect("/listings");
  })
);

module.exports = router;
