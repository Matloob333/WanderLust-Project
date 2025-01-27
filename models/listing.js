const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review"); // Ensure the review model is properly exported

const listingSchema = new Schema({
  title: {
    type: String,
     // Add a custom error message for required validation
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    url: {
      type: String,
      required: [true, "Image URL is required"],
    },
    filename: {
      type: String,
      required: [true, "Image filename is required"],
    },
  },
  price: {
    type: Number,
    required: [true, "Price is required"], // Custom validation message
    min: [0, "Price must be a positive number"], // Ensures no negative prices
  },
  location: {
    type: String,
    trim: true,
    required: [true, "Location is required"],
  },
  country: {
    type: String,
    trim: true,
    required: [true, "Country is required"],
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review", // Reference to the Review model
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: [true, "Owner is required"], // Ensure every listing has an owner
  },
});

// Middleware to delete associated reviews after a listing is deleted
listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    try {
      // Delete all reviews associated with this listing
      await Review.deleteMany({ _id: { $in: listing.reviews } });
      console.log(`Successfully deleted reviews associated with listing ID: ${listing._id}`);
    } catch (error) {
      console.error(`Error deleting reviews for listing ID ${listing._id}:`, error);
    }
  }
});

// Compile the model
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
