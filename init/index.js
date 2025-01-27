const mongoose = require("mongoose");
const initData = require("./data.js"); // Ensure the data is imported correctly
const Listing = require("../models/listing.js");
const Review = require("../models/review.js"); // Import the Review model

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Connect to MongoDB and initialize data
main()
  .then(async () => {
    console.log("Connected to DB");
    await clearReviews(); // Clear reviews after DB connection
    await initDB(); // Call the initDB function after clearing reviews
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
    process.exit(1); // Exit process with a failure code
  }
}

const initDB = async () => {
  try {
    await Listing.deleteMany({}); // Clear existing listings
    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner: "679502fe2535ba48ea3d29b4", // Update the owner field in the data
    }));
    console.log(initData.data);
    
    await Listing.insertMany(initData.data); // Insert new data
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

// If you want to call these functions during your test setup or teardown
// Ensure to export them if necessary
module.exports = { clearReviews, initDB };
initDB();