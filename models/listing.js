const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review"); // Ensure the review model is correctly exported and imported

const listingSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"], // Validation for title
    trim: true, // Removes extra spaces
  },
  description: {
    type: String,
    trim: true, // Removes extra spaces
  },
  image: {
    type: String,
    default:
      "https://images.pexels.com/photos/45853/grey-crowned-crane-bird-crane-animal-45853.jpeg?auto=compress&cs=tinysrgb&w=600", // Default image URL
    set: function (v) {
      return v && v.trim() !== "" ? v : undefined; // Use undefined to trigger the default value
    },
  },
  price: {
    type: Number,
    required: [true, "Price is required"], // Validation for price
    min: [0, "Price cannot be negative"], // Ensures non-negative values
  },
  location: {
    type: String,
    trim: true, // Removes extra spaces
  },
  country: {
    type: String,
    trim: true, // Removes extra spaces
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review", // Correct model reference
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User", // Ensure "User" model is correctly registered
    // Validation for owner
  },
});

// Middleware to delete associated reviews after a listing is deleted
listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    try {
      await Review.deleteMany({ _id: { $in: listing.reviews } });
    } catch (error) {
      console.error("Error deleting associated reviews:", error);
    }
  }
});

// Compile the model
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
