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
    newReview.author = req.user._id; // Fixed typo from `req.User` to `req.user`
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New review created!");
    res.redirect(`/listings/${listing._id}`);
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
      { $pull: { reviews: reviewId } } // Removes reviewId from the reviews array
    );

    // Delete the review document
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(err);
  }
};
