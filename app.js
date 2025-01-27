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
const User = require("./models/users");

// Import models and utilities
const ExpressError = require("./errorhandlers/ExpressError");

const listingsRouter = require("./routes/listing");
const reviewsRouter = require("./routes/review");
const userRouter = require("./routes/user");

// MongoDB connection string
const MONGO_Url = process.env.ATLASDB_URL ||"mongodb+srv://matloobahmad6386:hEUuwdy2xgQhNdOg@cluster0.5yqco.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Initialize Express app
const app = express();

// Connect to MongoDB
async function connectToDB() {
  try {
    await mongoose.connect(MONGO_Url, {
    
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Database connection error:", err);
  }
}
connectToDB();

// App configuration
app.set("view engine", "ejs"); // Set EJS as the templating engine
app.set("views", path.join(__dirname, "views")); // Set the views directory
app.engine("ejs", ejsMate); // Use ejs-mate for layouts

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(methodOverride("_method")); // Support method override for PUT and DELETE
app.use(express.static(path.join(__dirname, "public"))); // Serve static files
app.use(cookieParser());

// Session store
const store = MongoStore.create({
  mongoUrl: MONGO_Url,
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 3600, // Update only once in a 24-hour window
});

store.on("error", (err) => {
  console.log("Error in MongoDB session store:", err);
});

// Session and Flash configuration
const sessionOptions = {
  store,
  secret: process.env.SESSION_SECRET || "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash and current user middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Routes
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

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
