const Listing = require("../models/listing");


// Index route - Fetch and display all listings
module.exports.index = async (req, res, next) => {
  try {
    const { category, sort } = req.query;
    let query = {};
    let sortOption = {};

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Sort options
    if (sort === 'price-low') {
      sortOption = { price: 1 };
    } else if (sort === 'price-high') {
      sortOption = { price: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else {
      sortOption = { createdAt: -1 }; // Default sort by newest
    }

    const allListings = await Listing.find(query).sort(sortOption);
    
    // Get all categories for filter dropdown
    const categories = await Listing.distinct('category');
    
    res.render("listings/index", { 
      allListings, 
      categories,
      selectedCategory: category || 'All',
      selectedSort: sort || 'newest'
    });
  } catch (err) {
    next(err);
  }
};

// Search listings
module.exports.searchListings = async (req, res, next) => {
  try {
    const { q, location, price_min, price_max, category, sort } = req.query;
    let query = {};

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } }
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (price_min || price_max) {
      query.price = {};
      if (price_min) query.price.$gte = parseFloat(price_min);
      if (price_max) query.price.$lte = parseFloat(price_max);
    }

    let sortOption = {};
    if (sort === 'price-low') {
      sortOption = { price: 1 };
    } else if (sort === 'price-high') {
      sortOption = { price: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else {
      sortOption = { createdAt: -1 };
    }

    const listings = await Listing.find(query).populate("owner").sort(sortOption);
    
    // Get all categories for filter dropdown
    const categories = await Listing.distinct('category');
    
    res.render("listings/index", { 
      allListings: listings, 
      searchQuery: req.query,
      categories,
      selectedCategory: category || 'All',
      selectedSort: sort || 'newest'
    });
  } catch (err) {
    next(err);
  }
};

// Explore by category
module.exports.exploreByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { sort } = req.query;
    
    let query = { category };
    let sortOption = {};

    // Sort options
    if (sort === 'price-low') {
      sortOption = { price: 1 };
    } else if (sort === 'price-high') {
      sortOption = { price: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else {
      sortOption = { createdAt: -1 };
    }

    const listings = await Listing.find(query).populate("owner").sort(sortOption);
    const categories = await Listing.distinct('category');
    
    res.render("listings/index", { 
      allListings: listings, 
      categories,
      selectedCategory: category,
      selectedSort: sort || 'newest',
      categoryTitle: category
    });
  } catch (err) {
    next(err);
  }
};

// Featured listings
module.exports.featuredListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ featured: true }).populate("owner").sort({ rating: -1 });
    const categories = await Listing.distinct('category');
    
    res.render("listings/index", { 
      allListings: listings, 
      categories,
      selectedCategory: 'Featured',
      selectedSort: 'rating',
      categoryTitle: 'Featured Listings'
    });
  } catch (err) {
    next(err);
  }
};

// User's own listings
module.exports.myListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ owner: req.user._id });
    const categories = await Listing.distinct('category');
    
    res.render("listings/index", { 
      allListings: listings, 
      isMyListings: true,
      categories,
      selectedCategory: 'All',
      selectedSort: 'newest'
    });
  } catch (err) {
    next(err);
  }
};

// Render form to create a new listing
module.exports.renderNewForm = (req, res) => {
  const categories = [
    'Beach', 'Mountain', 'City', 'Forest', 'Desert', 'Lake', 'Island', 
    'Historic', 'Luxury', 'Budget', 'Family', 'Romantic', 'Adventure', 'Spa', 'Farm'
  ];
  
  const amenities = [
    'WiFi', 'Kitchen', 'Parking', 'Pool', 'Gym', 'AC', 'Heating', 'TV', 
    'Washing Machine', 'Balcony', 'Garden', 'BBQ', 'Fireplace', 'Hot Tub', 
    'Sauna', 'Spa', 'Restaurant', 'Bar', 'Concierge', 'Room Service'
  ];
  
  res.render("listings/new", { categories, amenities });
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

    // Get similar listings in the same category
    const similarListings = await Listing.find({ 
      category: listing.category, 
      _id: { $ne: listing._id } 
    }).limit(3).populate("owner");

    res.render("listings/show", { listing, similarListings });
  } catch (err) {
    next(err);
  }
};

// Create a new listing
module.exports.createListing = async (req, res, next) => {
  try {
    console.log("=== CREATE LISTING DEBUG ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    console.log("Request files:", req.file);
    
    if (!req.body.listing) {
      console.error("No listing data in request body");
      req.flash("error", "No listing data received");
      return res.redirect("/listings/new");
    }
    
    if (!req.file) {
      console.error("No file uploaded");
      req.flash("error", "Please upload an image");
      return res.redirect("/listings/new");
    }
    
    let url = req.file.path;
    let filename = req.file.filename;
    console.log("File info:", { url, filename });
    
    // Extract and validate listing data
    const listingData = {
      title: req.body.listing.title?.trim(),
      description: req.body.listing.description?.trim(),
      price: parseFloat(req.body.listing.price) || 0,
      location: req.body.listing.location?.trim(),
      country: req.body.listing.country?.trim(),
      category: req.body.listing.category?.trim(),
      maxGuests: parseInt(req.body.listing.maxGuests) || 4,
      bedrooms: parseInt(req.body.listing.bedrooms) || 1,
      bathrooms: parseInt(req.body.listing.bathrooms) || 1,
      amenities: Array.isArray(req.body.listing.amenities) ? req.body.listing.amenities : [],
      featured: req.body.listing.featured === 'true',
      owner: req.user._id,
      image: { url, filename }
    };
    
    console.log("Processed listing data:", JSON.stringify(listingData, null, 2));
    
    // Validate required fields
    if (!listingData.title || !listingData.description || !listingData.price || 
        !listingData.location || !listingData.country || !listingData.category) {
      req.flash("error", "Please fill in all required fields");
      return res.redirect("/listings/new");
    }
    
    // Validate category
    const validCategories = ['Beach', 'Mountain', 'City', 'Forest', 'Desert', 'Lake', 'Island', 'Historic', 'Luxury', 'Budget', 'Family', 'Romantic', 'Adventure', 'Spa', 'Farm'];
    if (!validCategories.includes(listingData.category)) {
      req.flash("error", `Invalid category. Must be one of: ${validCategories.join(', ')}`);
      return res.redirect("/listings/new");
    }
    
    const newListing = new Listing(listingData);
    
    // Validate the listing before saving
    const validationError = newListing.validateSync();
    if (validationError) {
      console.error("Validation error:", validationError);
      const errorMessages = Object.values(validationError.errors).map(e => e.message).join(', ');
      req.flash("error", `Validation failed: ${errorMessages}`);
      return res.redirect("/listings/new");
    }
    
    await newListing.save();
    console.log("Listing created successfully:", newListing._id);

    req.flash("success", "New listing created!");
    res.redirect("/listings");
  } catch (err) {
    console.error("=== CREATE LISTING ERROR ===");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("Full error:", err);
    
    if (err.name === 'ValidationError') {
      const errorMessages = Object.values(err.errors).map(e => e.message).join(', ');
      req.flash("error", `Validation failed: ${errorMessages}`);
    } else if (err.code === 11000) {
      req.flash("error", "A listing with this title already exists");
    } else {
      req.flash("error", `Failed to create listing: ${err.message}`);
    }
    res.redirect("/listings/new");
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
    
    let OriginalImageUrl = listing.image.url;
    OriginalImageUrl = OriginalImageUrl.replace(
      "/upload",
      "/upload/h_300,w_250  "
    );
    
    const categories = [
      'Beach', 'Mountain', 'City', 'Forest', 'Desert', 'Lake', 'Island', 
      'Historic', 'Luxury', 'Budget', 'Family', 'Romantic', 'Adventure', 'Spa', 'Farm'
    ];
    
    const amenities = [
      'WiFi', 'Kitchen', 'Parking', 'Pool', 'Gym', 'AC', 'Heating', 'TV', 
      'Washing Machine', 'Balcony', 'Garden', 'BBQ', 'Fireplace', 'Hot Tub', 
      'Sauna', 'Spa', 'Restaurant', 'Bar', 'Concierge', 'Room Service'
    ];
    
    res.render("listings/edit", { listing, OriginalImageUrl, categories, amenities });
  } catch (err) {
    next(err);
  }
};

// Update a listing
module.exports.updateListing = async (req, res, next) => {
  try {
    console.log("=== UPDATE LISTING DEBUG ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    console.log("Request files:", req.file);
    
    const { id } = req.params;
    
    if (!req.body.listing) {
      console.error("No listing data in request body");
      req.flash("error", "No listing data received");
      return res.redirect(`/listings/${id}/edit`);
    }
    
    // Extract and validate listing data
    const listingData = {
      title: req.body.listing.title?.trim(),
      description: req.body.listing.description?.trim(),
      price: parseFloat(req.body.listing.price) || 0,
      location: req.body.listing.location?.trim(),
      country: req.body.listing.country?.trim(),
      category: req.body.listing.category?.trim(),
      maxGuests: parseInt(req.body.listing.maxGuests) || 4,
      bedrooms: parseInt(req.body.listing.bedrooms) || 1,
      bathrooms: parseInt(req.body.listing.bathrooms) || 1,
      amenities: Array.isArray(req.body.listing.amenities) ? req.body.listing.amenities : [],
      featured: req.body.listing.featured === 'true'
    };
    
    console.log("Processed listing data:", JSON.stringify(listingData, null, 2));
    
    // Validate required fields
    if (!listingData.title || !listingData.description || !listingData.price || 
        !listingData.location || !listingData.country || !listingData.category) {
      req.flash("error", "Please fill in all required fields");
      return res.redirect(`/listings/${id}/edit`);
    }
    
    // Validate category
    const validCategories = ['Beach', 'Mountain', 'City', 'Forest', 'Desert', 'Lake', 'Island', 'Historic', 'Luxury', 'Budget', 'Family', 'Romantic', 'Adventure', 'Spa', 'Farm'];
    if (!validCategories.includes(listingData.category)) {
      req.flash("error", `Invalid category. Must be one of: ${validCategories.join(', ')}`);
      return res.redirect(`/listings/${id}/edit`);
    }
    
    // Update the listing
    let listing = await Listing.findByIdAndUpdate(id, listingData, {
      new: true,
      runValidators: true,
    });

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    // Handle image upload if provided
    if (req.file) {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
      await listing.save();
    }

    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error("=== UPDATE LISTING ERROR ===");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("Full error:", err);
    
    if (err.name === 'ValidationError') {
      const errorMessages = Object.values(err.errors).map(e => e.message).join(', ');
      req.flash("error", `Validation failed: ${errorMessages}`);
    } else if (err.code === 11000) {
      req.flash("error", "A listing with this title already exists");
    } else {
      req.flash("error", `Failed to update listing: ${err.message}`);
    }
    res.redirect(`/listings/${req.params.id}/edit`);
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
