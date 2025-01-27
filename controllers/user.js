const { model } = require("mongoose");
const User=require("../models/users");

module.exports.renderSignUpForm=(req, res) => {
  res.render("users/signup.ejs");
}
module.exports.signUp=async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.logIn(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "Welcome to WanderLust!");
        res.redirect("/listings");
      });
     
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  };

  module.exports.renderLogInForm=(req, res) => {
    res.render("users/login.ejs");
  };
  module.exports.logIn= async(req, res) => {
    req.flash("success", "Welcome back to WanderLust!");
    res.redirect("/listings");
  };

  module.exports.logOut=(req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "You have logged out successfully!");
      res.redirect("/listings");
    });
  }