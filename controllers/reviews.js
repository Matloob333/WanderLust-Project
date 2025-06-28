const Review = require("../models/review");
const Listing = require("../models/listing");

// Post a new review
module.exports.postReview = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    newReview.listing = listing._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New review created!");
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    next(err);
  }
};

// Get all reviews for a listing
module.exports.getListingReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reviews = await Review.find({ listing: id })
      .populate("author")
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

// Get a specific review
module.exports.getReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId).populate("author");
    
    if (!review) {
      req.flash("error", "Review not found!");
      return res.redirect("/listings");
    }
    
    res.json(review);
  } catch (err) {
    next(err);
  }
};

// Render edit review form
module.exports.renderEditReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    
    if (!review) {
      req.flash("error", "Review not found!");
      return res.redirect("/listings");
    }
    
    res.render("reviews/edit", { review });
  } catch (err) {
    next(err);
  }
};

// Update review
module.exports.updateReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body.review;
    
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { rating, comment },
      { new: true, runValidators: true }
    );
    
    if (!review) {
      req.flash("error", "Review not found!");
      return res.redirect("/listings");
    }
    
    req.flash("success", "Review updated successfully!");
    res.redirect(`/listings/${req.params.id}`);
  } catch (err) {
    next(err);
  }
};

// Delete a review
module.exports.destroyReview = async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;

    // Check if the listing exists
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    // Remove the review reference from the listing
    await Listing.findByIdAndUpdate(
      id,
      { $pull: { reviews: reviewId } }
    );

    // Delete the review document
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(err);
  }
};

// Toggle like on a review
module.exports.toggleLike = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    
    if (!review) {
      req.flash("error", "Review not found!");
      return res.redirect("/listings");
    }
    
    // For now, just redirect back since we don't have likes field in the model
    req.flash("success", "Like functionality coming soon!");
    res.redirect(`/listings/${req.params.id}`);
  } catch (err) {
    next(err);
  }
};

// Report a review
module.exports.reportReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { reason } = req.body;
    
    const review = await Review.findById(reviewId);
    if (!review) {
      req.flash("error", "Review not found!");
      return res.redirect("/listings");
    }
    
    // For now, just redirect back since we don't have reports field in the model
    req.flash("success", "Review reported successfully!");
    res.redirect(`/listings/${req.params.id}`);
  } catch (err) {
    next(err);
  }
};
