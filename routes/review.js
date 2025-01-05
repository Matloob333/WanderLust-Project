const express=require("express");
const { route } = require("./listing");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../util/wrapAsync.js");
const ExpressError = require("../util/ExpressError.js");
const {reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing=require("../models/listing.js")


// Validation middleware for reviews
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };
  

// Routes for reviews

// Create review - Add a review to a listing
router.post(
    "/",
    validateReview,
    wrapAsync(async (req, res) => {
      let  listing = await Listing.findById(req.params.id);
      let newReview = new Review(req.body.review);
      listing.reviews.push(newReview);
      await newReview.save();
      await listing.save();
      req.flash("success","New review created!");
      res.redirect(`/listings/${listing._id}`);
    })
  );
  
  //Delete review route
  router.delete("/:reviewId", wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
  
    // Ensure Listing and Review models are properly named and imported
    await Listing.findByIdAndUpdate(
      id,
      { $pull: { reviews: reviewId } } // Removes the reviewId from the reviews array in Listing
    );
  
    await Review.findByIdAndDelete(reviewId); // Deletes the review from the Review model
    req.flash("success","Review deleted!");
    res.redirect(`/listings/${id}`); // Redirects back to the listing page
  }));

  module.exports=router;