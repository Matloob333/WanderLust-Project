const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"]
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^[0-9]{10}$/.test(v);
        },
        message: "Please enter a valid 10-digit phone number"
      }
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio cannot exceed 500 characters"]
    },
    favorites: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing"
    }],
    settings: {
      notifications: {
        email: {
          type: Boolean,
          default: true
        },
        booking: {
          type: Boolean,
          default: true
        },
        review: {
          type: Boolean,
          default: true
        }
      },
      privacy: {
        profileVisibility: {
          type: Boolean,
          default: true
        },
        showEmail: {
          type: Boolean,
          default: true
        }
      }
    },
    avatar: {
      url: String,
      filename: String
    },
    // Email verification fields
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    verificationCode: String,
    verificationCodeExpires: Date,
    
    // Password reset fields
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    
    // Google OAuth fields
    googleId: String,
    googleEmail: String,
    googleName: String,
    googlePicture: String,
    
    // Login tracking
    lastLogin: Date,
    loginHistory: [{
      timestamp: {
        type: Date,
        default: Date.now
      },
      ipAddress: String,
      userAgent: String
    }],
    
    // Account status
    isActive: {
      type: Boolean,
      default: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

// Use `passport-local-mongoose` plugin to handle user registration, login, and password hashing
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
  errorMessages: {
    MissingUsernameError: "Email is required for authentication",
    IncorrectPasswordError: "Password is incorrect",
    UserExistsError: "A user with the given email already exists",
  },
  usernameLowerCase: false,
});

// Virtual for user's display name
userSchema.virtual('displayName').get(function() {
  return this.username;
});

// Method to check if user has favorited a listing
userSchema.methods.hasFavorited = function(listingId) {
  return this.favorites.includes(listingId);
};

// Method to add a listing to favorites
userSchema.methods.addToFavorites = function(listingId) {
  if (!this.hasFavorited(listingId)) {
    this.favorites.push(listingId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove a listing from favorites
userSchema.methods.removeFromFavorites = function(listingId) {
  this.favorites = this.favorites.filter(id => !id.equals(listingId));
  return this.save();
};

// Method to generate verification code
userSchema.methods.generateVerificationCode = function() {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  this.verificationCode = code;
  this.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return code;
};

// Method to verify code
userSchema.methods.verifyCode = function(code) {
  if (this.verificationCode === code && this.verificationCodeExpires > new Date()) {
    this.isEmailVerified = true;
    this.verificationCode = undefined;
    this.verificationCodeExpires = undefined;
    return true;
  }
  return false;
};

// Method to add login history
userSchema.methods.addLoginHistory = function(ipAddress, userAgent) {
  this.loginHistory.push({ ipAddress, userAgent });
  if (this.loginHistory.length > 10) {
    this.loginHistory = this.loginHistory.slice(-10); // Keep only last 10 logins
  }
  this.lastLogin = new Date();
  return this.save();
};

// Handle unique index creation issues gracefully
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

// Pre-save middleware to update lastLogin
userSchema.pre('save', function(next) {
  if (this.isModified('lastLogin')) {
    this.lastLogin = new Date();
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
