const mongoose = require("mongoose");
const { sampleListings } = require("./data.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

// Load environment variables
require('dotenv').config();

// Make sure the MONGO_URL is correctly loaded from the environment variable
const MONGO_URL = process.env.ATLASDB_URL;

if (!MONGO_URL) {
  console.error("MongoDB connection string is not defined. Please check your .env file.");
  process.exit(1);
}

// Connect to MongoDB and initialize data
main()
  .then(async () => {
    console.log("Connected to DB");
    await clearReviews(); 
    await initDB(); 
  })
  .catch((err) => {
    console.error("Error connecting to DB:", err);
  });

async function main() {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error("Error in main:", error);
    process.exit(1);
  }
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    const listingsWithOwner = sampleListings.map((obj) => ({
      ...obj,
      owner: "6797e29fec7d941e999531a9", 
    }));
    console.log("Processed listings:", listingsWithOwner.length);

    await Listing.insertMany(listingsWithOwner);
    console.log("Data was initialized successfully");
  } catch (error) {
    console.error("Error during database initialization:", error);
  }
};

const clearReviews = async () => {
  try {
    await Review.deleteMany({});
    console.log("Reviews cleared successfully");
  } catch (error) {
    console.error("Error clearing reviews:", error);
  }
};

// module.exports = { clearReviews, initDB };
initDB();

