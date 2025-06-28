require('dotenv').config();

// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/users");

// Import models and utilities
const ExpressError = require("./errorhandlers/ExpressError");

const listingsRouter = require("./routes/listing");
const reviewsRouter = require("./routes/review");
const userRouter = require("./routes/user");
const bookingRouter = require("./routes/booking");

// MongoDB connection string
const MONGO_Url = process.env.ATLASDB_URL;
if (!MONGO_Url) {
  console.error("MongoDB connection string is not defined. Please check your .env file.");
  process.exit(1); // Exit process if no MONGO_Url is defined
}

// Initialize Express app
const app = express();

// Connect to MongoDB
async function connectToDB() {
  try {
    await mongoose.connect(MONGO_Url, {
      // MongoDB connection options can be added here if needed
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1); // Exit the app if DB connection fails
  }
}
connectToDB();

// App configuration
app.use(express.json()); // Parse JSON request bodies

app.set("view engine", "ejs"); // Set EJS as the templating engine
app.set("views", path.join(__dirname, "views")); // Set the views directory
app.engine("ejs", ejsMate); // Use ejs-mate for layouts

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(methodOverride("_method")); // Support method override for PUT and DELETE
app.use(express.static(path.join(__dirname, "public"))); // Serve static files
app.use(cookieParser());

// Session and Flash configuration
const sessionOptions = {
  store: MongoStore.create({
    mongoUrl: MONGO_Url,
    crypto: {
      secret: process.env.SESSION_SECRET || "fallback-secret-key", // Ensure the session secret is set consistently
    },
    touchAfter: 24 * 3600, // Update only once in a 24-hour window
  }),
  secret: process.env.SESSION_SECRET || "fallback-secret-key", // Session secret
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
  },
};

app.use(session(sessionOptions));
app.use(flash());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Local Strategy
passport.use(new LocalStrategy({
  usernameField: "email",
  passwordField: "password"
}, async (email, password, done) => {
  try {
    console.log("Passport authentication attempt:", { email, password: password ? "***" : "undefined" });
    
    if (!email || !password) {
      console.log("Missing credentials");
      return done(null, false, { message: "Missing credentials" });
    }
    
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log("User not found:", email);
      return done(null, false, { message: "User not found" });
    }
    
    const isMatch = await user.authenticate(password);
    if (!isMatch) {
      console.log("Invalid password for user:", email);
      return done(null, false, { message: "Invalid password" });
    }
    
    console.log("Authentication successful for user:", email);
    return done(null, user);
  } catch (err) {
    console.error("Passport authentication error:", err);
    return done(err);
  }
}));

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ googleId: profile.id });
      
      if (user) {
        return done(null, user);
      }
      
      // Check if user exists with same email
      const existingUser = await User.findOne({ email: profile.emails[0].value });
      if (existingUser) {
        // Link Google account to existing user
        existingUser.googleId = profile.id;
        existingUser.googleEmail = profile.emails[0].value;
        existingUser.googleName = profile.displayName;
        existingUser.googlePicture = profile.photos[0]?.value;
        existingUser.isEmailVerified = true;
        await existingUser.save();
        return done(null, existingUser);
      }
      
      // Create new user
      const newUser = new User({
        email: profile.emails[0].value,
        username: profile.displayName,
        googleId: profile.id,
        googleEmail: profile.emails[0].value,
        googleName: profile.displayName,
        googlePicture: profile.photos[0]?.value,
        isEmailVerified: true
      });
      
      await newUser.save();
      return done(null, newUser);
    } catch (err) {
      return done(err, null);
    }
  }));
  console.log('Google OAuth strategy configured successfully');
} else {
  console.warn('Google OAuth credentials not found. Google login will be disabled.');
}

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash and current user middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success") || [];
  res.locals.error = req.flash("error") || [];
  res.locals.info = req.flash("info") || [];
  res.locals.warning = req.flash("warning") || [];
  res.locals.currUser = req.user;
  next();
});

// Routes
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/listings/:id/bookings", bookingRouter);
app.use("/bookings", bookingRouter);
app.use("/", userRouter);

// Google OAuth routes
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      // Successful authentication, redirect home.
      req.flash("success", `Welcome ${req.user.username}!`);
      res.redirect('/listings');
    }
  );
}

// Home route - Beautiful landing page
app.get("/", (req, res) => {
  res.render("home");
});

// Handle undefined routes
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong!" } = err;
  res.status(status).render("error", { message }); // Ensure 'error.ejs' exists in the 'views' folder
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
