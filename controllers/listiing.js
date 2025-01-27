const Listing = require("../models/listing");

// Index route - Fetch and display all listings
module.exports.index = async (req, res, next) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  } catch (err) {
    next(err); // Pass the error to the error-handling middleware
  }
};

// Render form to create a new listing
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

// Show a single listing
module.exports.showListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");

    if (!listing) {
      req.flash("error", "The listing you requested does not exist!");
      return res.redirect("/listings");
    }

    res.render("listings/show", { listing });
  } catch (err) {
    next(err);
  }
};

// Create a new listing
module.exports.createListing = async (req, res, next) => {
  try {
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "...", filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    console.log(newListing);
    Listing.create(newListing)
      .then((listing) => {
        console.log("Listing created:", listing);
      })
      .catch((error) => {
        console.error("Error creating listing:", error);
      }); // Check if the title is there

    req.flash("success", "New listing created!");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};

// Render form to edit a listing
module.exports.renderEditForm = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      req.flash("error", "The listing you requested does not exist!");
      return res.redirect("/listings");
    }
    let OriginalImageURl=  listing.image.url;
    OriginalImageURl=OriginalImageURl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit", { listing,OriginalImageURl });
  } catch (err) {
    next(err);
  }
};

// Update a listing
module.exports.updateListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, req.body.listing, {
      new: true,
      runValidators: true,
    });

    if (typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
      await listing.save();
    }

    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(err);
  }
};

// Delete a listing
module.exports.destroyListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};
