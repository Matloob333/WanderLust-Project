const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"], // Email validation
      unique: true, // Ensures no duplicate emails
      trim: true, // Removes leading/trailing spaces
      lowercase: true, // Converts email to lowercase for uniformity
    },
    username: {
      type: String,
      required: [true, "Username is required"], // Username is optional, but still can be used
      unique: true, // Ensures no duplicate usernames
      trim: true, // Removes leading/trailing spaces
      lowercase: true, // Converts username to lowercase
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Use `passport-local-mongoose` plugin to handle user registration, login, and password hashing
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email", // Use email as the unique identifier
  errorMessages: {
    // Custom error messages for authentication failures
    MissingUsernameError: "Email is required for authentication",
    IncorrectPasswordError: "Password is incorrect",
    UserExistsError: "A user with the given email already exists",
  },
  usernameLowerCase: false, // Ensures email is not automatically lowercased
});

// Handle unique index creation issues gracefully (duplicate email check)
userSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    if (error.keyValue.email) {
      next(new Error("Email already exists"));
    } else if (error.keyValue.username) {
      next(new Error("Username already exists"));
    } else {
      next(error);
    }
  } else {
    next(error);
  }
});

module.exports = mongoose.model("User", userSchema);
