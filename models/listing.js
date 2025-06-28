const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review"); // ✅ Ensure the Review model is properly imported

const listingSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"], // ✅ Fix: Required validation added
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
    required: [true, "Price is required"], // ✅ Fix: Custom validation message
    min: [0, "Price must be a positive number"], // ✅ Ensures no negative prices
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
  category: {
    type: String,
    enum: {
      values: ['Beach', 'Mountain', 'City', 'Forest', 'Desert', 'Lake', 'Island', 'Historic', 'Luxury', 'Budget', 'Family', 'Romantic', 'Adventure', 'Spa', 'Farm'],
      message: 'Category must be one of: Beach, Mountain, City, Forest, Desert, Lake, Island, Historic, Luxury, Budget, Family, Romantic, Adventure, Spa, Farm'
    },
    required: [true, "Category is required"],
  },
  amenities: [{
    type: String,
    enum: {
      values: ['WiFi', 'Kitchen', 'Parking', 'Pool', 'Gym', 'AC', 'Heating', 'TV', 'Washing Machine', 'Balcony', 'Garden', 'BBQ', 'Fireplace', 'Hot Tub', 'Sauna', 'Spa', 'Restaurant', 'Bar', 'Concierge', 'Room Service'],
      message: 'Invalid amenity value'
    }
  }],
  maxGuests: {
    type: Number,
    default: 4,
    min: [1, "Maximum guests must be at least 1"]
  },
  bedrooms: {
    type: Number,
    default: 1,
    min: [1, "Number of bedrooms must be at least 1"]
  },
  bathrooms: {
    type: Number,
    default: 1,
    min: [1, "Number of bathrooms must be at least 1"]
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review", // ✅ Reference to the Review model
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User", // ✅ Reference to the User model
    required: [true, "Owner is required"], // ✅ Ensure every listing has an owner
  },
  featured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  }
});

// ✅ Middleware to delete associated reviews after a listing is deleted
listingSchema.post("findOneAndDelete", async function (listing) {
  if (!listing || !listing.reviews || listing.reviews.length === 0) return; // ✅ Fix: Check for null/undefined

  try {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
    console.log(`✅ Successfully deleted ${listing.reviews.length} reviews for listing ID: ${listing._id}`);
  } catch (error) {
    console.error(`❌ Error deleting reviews for listing ID ${listing._id}:`, error);
  }
});

// ✅ Compile the model
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
