const { model } = require("mongoose");
const User = require("../models/users");
const Listing = require("../models/listing");
const Review = require("../models/review");
const emailService = require("../services/emailService");
const crypto = require("crypto");

// Conditional cloudinary import
let cloudinary;
try {
  const cloudinaryConfig = require("../cloudConfig");
  cloudinary = cloudinaryConfig.cloudinary;
} catch (error) {
  console.warn('Cloudinary not configured, image upload functionality will be disabled');
  cloudinary = null;
}

// Helper function to generate avatar initials
const generateAvatarInitials = (username) => {
  if (!username) return 'U';
  return username.charAt(0).toUpperCase();
};

// Helper function to generate avatar color
const generateAvatarColor = (username) => {
  if (!username) return '#6366f1';
  const colors = [
    '#6366f1', '#10b981', '#f59e0b', '#ef4444', 
    '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
  ];
  const index = username.charCodeAt(0) % colors.length;
  return colors[index];
};

module.exports.renderSignUpForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signUp = async (req, res, next) => {
  try {
    console.log("Signup attempt:", req.body);
    let { username, email, password, confirmPassword, phone } = req.body;
    
    // Check if passwords match
    if (password !== confirmPassword) {
      req.flash("error", "Passwords do not match!");
      return res.redirect("/signup");
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      req.flash("error", "User with this email or username already exists!");
      return res.redirect("/signup");
    }
    
    const newUser = new User({ email, username, phone });
    const registeredUser = await User.register(newUser, password);
    
    // Generate verification code and send email
    const verificationCode = registeredUser.generateVerificationCode();
    await registeredUser.save();
    
    // Send welcome email with verification code
    await emailService.sendWelcomeEmail(registeredUser);
    await emailService.sendVerificationCode(registeredUser, verificationCode);
    
    console.log("User registered successfully:", registeredUser);
    req.logIn(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to WanderLust! Please check your email for verification code.");
      res.redirect("/verify-email");
    });
  } catch (e) {
    console.error("Signup error:", e);
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLogInForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.logIn = async (req, res) => {
  try {
    console.log("Login successful for user:", req.user);
    
    // Add login history
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    await req.user.addLoginHistory(ipAddress, userAgent);
    
    // Send login notification email
    if (req.user.settings?.notifications?.email) {
      await emailService.sendLoginNotification(
        req.user, 
        new Date().toLocaleString(), 
        ipAddress
      );
    }
    
    req.flash("success", "Welcome back to WanderLust!");
    res.redirect("/listings");
  } catch (err) {
    console.error("Login error:", err);
    req.flash("success", "Welcome back to WanderLust!");
    res.redirect("/listings");
  }
};

module.exports.logOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have logged out successfully!");
    res.redirect("/listings");
  });
};

// ===== EMAIL VERIFICATION =====

module.exports.renderEmailVerification = (req, res) => {
  res.render("users/verify-email");
};

module.exports.verifyEmail = async (req, res, next) => {
  try {
    const { verificationCode } = req.body;
    const user = await User.findById(req.user._id);
    
    if (user.verifyCode(verificationCode)) {
      await user.save();
      req.flash("success", "Email verified successfully!");
      res.redirect("/profile");
    } else {
      req.flash("error", "Invalid or expired verification code!");
      res.redirect("/verify-email");
    }
  } catch (err) {
    next(err);
  }
};

module.exports.resendVerificationCode = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const verificationCode = user.generateVerificationCode();
    await user.save();
    
    await emailService.sendVerificationCode(user, verificationCode);
    req.flash("success", "Verification code sent to your email!");
    res.redirect("/verify-email");
  } catch (err) {
    next(err);
  }
};

// ===== GOOGLE OAUTH =====

module.exports.googleAuth = async (req, res, next) => {
  try {
    const { id, displayName, emails, photos } = req.user;
    
    // Check if user exists
    let user = await User.findOne({ googleId: id });
    
    if (!user) {
      // Create new user
      const email = emails[0].value;
      const existingUser = await User.findOne({ email });
      
      if (existingUser) {
        // Link Google account to existing user
        existingUser.googleId = id;
        existingUser.googleEmail = email;
        existingUser.googleName = displayName;
        existingUser.googlePicture = photos[0]?.value;
        existingUser.isEmailVerified = true;
        await existingUser.save();
        user = existingUser;
      } else {
        // Create new user
        user = new User({
          email,
          username: displayName,
          googleId: id,
          googleEmail: email,
          googleName: displayName,
          googlePicture: photos[0]?.value,
          isEmailVerified: true
        });
        await user.save();
      }
    }
    
    // Add login history
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    await user.addLoginHistory(ipAddress, userAgent);
    
    req.logIn(user, (err) => {
      if (err) return next(err);
      req.flash("success", `Welcome ${user.username}!`);
      res.redirect("/listings");
    });
  } catch (err) {
    next(err);
  }
};

// ===== PROFILE MANAGEMENT =====

module.exports.showProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const userListings = await Listing.find({ owner: req.user._id });
    const userReviews = await Review.find({ author: req.user._id }).populate("listing");
    
    // Add avatar helpers to user object
    user.avatarInitials = generateAvatarInitials(user.username);
    user.avatarColor = generateAvatarColor(user.username);
    
    res.render("users/profile", { user, userListings, userReviews });
  } catch (err) {
    next(err);
  }
};

module.exports.renderEditProfile = (req, res) => {
  // Add avatar helpers to user object
  req.user.avatarInitials = generateAvatarInitials(req.user.username);
  req.user.avatarColor = generateAvatarColor(req.user.username);
  
  res.render("users/edit-profile", { currUser: req.user });
};

module.exports.updateProfile = async (req, res, next) => {
  try {
    console.log("=== UPDATE PROFILE DEBUG ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    console.log("Request files:", req.file);
    
    const { username, email, bio, phone, removeAvatar } = req.body;
    
    // Validate required fields
    if (!username || !email) {
      req.flash("error", "Username and email are required!");
      return res.redirect("/profile/edit");
    }
    
    // Validate phone number format if provided
    if (phone && !/^[0-9]{10}$/.test(phone)) {
      req.flash("error", "Please enter a valid 10-digit phone number!");
      return res.redirect("/profile/edit");
    }
    
    // Check if username or email already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }],
      _id: { $ne: req.user._id }
    });
    
    if (existingUser) {
      req.flash("error", "Username or email already taken!");
      return res.redirect("/profile/edit");
    }
    
    const updateData = { username, email, bio };
    
    // Only add phone if it's provided
    if (phone) {
      updateData.phone = phone;
    } else {
      updateData.phone = undefined; // Remove phone if empty
    }
    
    // Handle avatar removal
    if (removeAvatar === 'true') {
      try {
        // Delete old avatar from cloudinary if exists and cloudinary is configured
        if (req.user.avatar && req.user.avatar.filename && process.env.CLOUDINARY_CLOUD_NAME) {
          await cloudinary.uploader.destroy(req.user.avatar.filename);
        }
        
        // Remove avatar from user data
        updateData.avatar = undefined;
        console.log("Avatar removed successfully");
      } catch (removeError) {
        console.error('Avatar removal error:', removeError);
        // Continue with update even if cloudinary deletion fails
        updateData.avatar = undefined;
      }
    }
    // Handle avatar upload
    else if (req.file) {
      try {
        // Check if cloudinary is configured
        if (!process.env.CLOUDINARY_CLOUD_NAME) {
          req.flash("warning", "Image upload service not configured. Profile updated without image.");
          return res.redirect("/profile/edit");
        }
        
        // Delete old avatar if exists
        if (req.user.avatar && req.user.avatar.filename) {
          await cloudinary.uploader.destroy(req.user.avatar.filename);
        }
        
        // Upload new avatar
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'wanderlust/avatars',
          width: 300,
          height: 300,
          crop: 'fill',
          gravity: 'face'
        });
        
        updateData.avatar = {
          url: result.secure_url,
          filename: result.public_id
        };
        console.log("Avatar uploaded successfully");
      } catch (uploadError) {
        console.error('Avatar upload error:', uploadError);
        req.flash("error", "Failed to upload avatar. Please try again.");
        return res.redirect("/profile/edit");
      }
    }
    
    console.log("Update data:", JSON.stringify(updateData, null, 2));
    
    // Use findOneAndUpdate instead of findByIdAndUpdate for better error handling
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      req.flash("error", "Failed to update profile!");
      return res.redirect("/profile/edit");
    }
    
    req.flash("success", "Profile updated successfully!");
    res.redirect("/profile");
  } catch (err) {
    console.error('Profile update error:', err);
    
    // Handle specific validation errors
    if (err.name === 'ValidationError') {
      const errorMessages = Object.values(err.errors).map(e => e.message);
      req.flash("error", `Validation error: ${errorMessages.join(', ')}`);
    } else if (err.code === 11000) {
      req.flash("error", "Username or email already exists!");
    } else {
      req.flash("error", "Failed to update profile!");
    }
    
    res.redirect("/profile/edit");
  }
};

module.exports.renderChangePassword = (req, res) => {
  res.render("users/change-password");
};

module.exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    // Check if new passwords match
    if (newPassword !== confirmPassword) {
      req.flash("error", "New passwords do not match!");
      return res.redirect("/profile/change-password");
    }
    
    const user = await User.findById(req.user._id);
    await user.changePassword(currentPassword, newPassword);
    
    // Send password change confirmation email
    await emailService.sendPasswordChangeConfirmation(user);
    
    req.flash("success", "Password changed successfully!");
    res.redirect("/profile");
  } catch (err) {
    req.flash("error", "Current password is incorrect!");
    res.redirect("/profile/change-password");
  }
};

// ===== REVIEWS =====

module.exports.showUserReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ author: req.user._id }).populate("listing");
    res.render("users/reviews", { reviews });
  } catch (err) {
    next(err);
  }
};

// ===== PASSWORD RESET =====

module.exports.renderForgotPassword = (req, res) => {
  res.render("users/forgot-password");
};

module.exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      req.flash("error", "No account found with that email address!");
      return res.redirect("/forgot-password");
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();
    
    // Send password reset email
    const emailSent = await emailService.sendPasswordResetEmail(user, resetToken);
    
    if (emailSent) {
      req.flash("success", "Password reset instructions sent to your email!");
    } else {
      req.flash("error", "Failed to send reset email. Please try again.");
    }
    res.redirect("/login");
  } catch (err) {
    next(err);
  }
};

module.exports.renderResetPassword = (req, res) => {
  const { token } = req.params;
  res.render("users/reset-password", { token });
};

module.exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
    
    // Check if passwords match
    if (password !== confirmPassword) {
      req.flash("error", "Passwords do not match!");
      return res.redirect(`/reset-password/${token}`);
    }
    
    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      req.flash("error", "Password reset token is invalid or has expired!");
      return res.redirect("/forgot-password");
    }
    
    // Set new password
    await user.setPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    req.flash("success", "Password reset successfully!");
    res.redirect("/login");
  } catch (err) {
    next(err);
  }
};

// ===== ACCOUNT MANAGEMENT =====

module.exports.deleteAccount = async (req, res, next) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user._id);
    
    // Verify password
    const isMatch = await user.authenticate(password);
    if (!isMatch) {
      req.flash("error", "Incorrect password!");
      return res.redirect("/profile");
    }
    
    // Delete user's listings and reviews
    await Listing.deleteMany({ owner: req.user._id });
    await Review.deleteMany({ author: req.user._id });
    
    // Delete user account
    await User.findByIdAndDelete(req.user._id);
    
    req.logout((err) => {
      if (err) return next(err);
      req.flash("success", "Account deleted successfully!");
      res.redirect("/");
    });
  } catch (err) {
    next(err);
  }
};

// ===== SETTINGS =====

module.exports.renderSettings = (req, res) => {
  res.render("users/settings", { currUser: req.user });
};

module.exports.updateSettings = async (req, res, next) => {
  try {
    const { notifications, privacy } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { settings: { notifications, privacy } },
      { new: true }
    );
    
    req.flash("success", "Settings updated successfully!");
    res.redirect("/settings");
  } catch (err) {
    next(err);
  }
};