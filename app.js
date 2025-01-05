// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const cookieParser=require("cookie-parser");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const passportLocalMongoose=require("passport-local-mongoose");
const User=require("./models/users.js");


// Import models and utilities
const ExpressError = require("./util/ExpressError.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter=require("./routes/user.js");

// MongoDB connection string
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Initialize Express app
const app = express();

// Connect to MongoDB
async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("Database connection error:", err);
  });

// App configuration
app.set("view engine", "ejs"); // Set EJS as the templating engine
app.set("views", path.join(__dirname, "views")); // Set the views directory
app.engine("ejs", ejsMate); // Use ejs-mate for layouts

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(methodOverride("_method")); // Support method override for PUT and DELETE
app.use(express.static(path.join(__dirname, "/public"))); // Serve static files

const sessionOption={
  secret:"mysupersecretcode",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  }
};


// Root route
app.get("/", (req, res) => {
  res.send("Hi, I am the root");
});



























/// session flash message middleware
app.use(session(sessionOption));
app.use(flash());

//passport middlewares pbkdf2 hashing algo used
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware for flash messages
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
    next();
});



app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/",userRouter);

// Handle undefined routes
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong!" } = err;
  res.status(status).render("listings/error.ejs", { message });
});

// Start the server
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
