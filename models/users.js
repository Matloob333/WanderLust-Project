const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

// User schema definition
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"], // Validation for email
      unique: true,                          // Ensures no duplicate emails
      trim: true,                            // Removes leading/trailing spaces
      lowercase: true,                       // Converts email to lowercase
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Adds username, hash, and salt fields to the schema and provides authentication methods
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email", // Use email as the username field for authentication
});

// Export the compiled model
module.exports = mongoose.model("User", userSchema);
