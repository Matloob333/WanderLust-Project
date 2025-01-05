const mongoose = require("mongoose");
const initData = require("./data.js"); // Ensure the data is imported correctly
const Listing = require("../models/listing.js");
const Review = require("../models/review.js"); // Import the Review model

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Connect to MongoDB and initialize data
main()
  .then(async () => {
    console.log("Connected to DB");
    await initDB(); // Call the initDB function after the DB connection is established
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
    await Listing.deleteMany({}); // Clear existing listings
    initData.data=initData.data.map((obj)=>({...obj,owner:"677a34f6392a34c436e2d3c4"}))
    console.log(initData.data);
    await Listing.insertMany(initData.data); // Insert new data
    console.log("Data was initialized successfully");
  } catch (error) {
    console.error("Error during database initialization:", error);
  }
};

// Functions for test setup/teardown
const clearReviews = async () => {
  try {
    await Review.deleteMany({});
    console.log("Reviews cleared successfully");
  } catch (error) {
    console.error("Error clearing reviews:", error);
  }
};

// Use these functions in your test setup or teardown
// For example:
clearReviews(); // Call before or after each test
initDB();