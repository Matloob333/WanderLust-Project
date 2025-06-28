const Booking = require("../models/booking");
const Listing = require("../models/listing");
const User = require("../models/users");
const paymentService = require("../services/paymentService");
const emailService = require("../services/emailService");
const wrapAsync = require("../errorhandlers/wrapAsync");
const ExpressError = require("../errorhandlers/ExpressError");

// Show booking form
module.exports.showBookingForm = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate('owner');
  
  if (!listing) {
    throw new ExpressError(404, "Listing not found!");
  }

  // Check if user is trying to book their own listing
  if (req.user._id.equals(listing.owner._id)) {
    req.flash("error", "You cannot book your own listing!");
    return res.redirect(`/listings/${id}`);
  }

  res.render("bookings/new", { listing });
});

// Create booking and initiate payment
module.exports.createBooking = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const { checkIn, checkOut, numberOfGuests, specialRequests } = req.body;
  
  const listing = await Listing.findById(id).populate('owner');
  if (!listing) {
    throw new ExpressError(404, "Listing not found!");
  }

  // Check if user is trying to book their own listing
  if (req.user._id.equals(listing.owner._id)) {
    req.flash("error", "You cannot book your own listing!");
    return res.redirect(`/listings/${id}`);
  }

  // Validate dates
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (checkInDate < today) {
    throw new ExpressError(400, "Check-in date cannot be in the past!");
  }

  if (checkOutDate <= checkInDate) {
    throw new ExpressError(400, "Check-out date must be after check-in date!");
  }

  // Calculate number of nights and total amount
  const numberOfNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  const totalAmount = paymentService.calculateBookingAmount(
    listing.price, 
    numberOfNights, 
    numberOfGuests
  );

  // Check for existing bookings in the same date range
  const existingBooking = await Booking.findOne({
    listing: id,
    bookingStatus: { $in: ["confirmed", "pending"] },
    $or: [
      {
        checkIn: { $lte: checkOutDate },
        checkOut: { $gte: checkInDate }
      }
    ]
  });

  if (existingBooking) {
    throw new ExpressError(400, "This property is not available for the selected dates!");
  }

  // Create booking
  const booking = new Booking({
    listing: id,
    user: req.user._id,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    numberOfGuests: parseInt(numberOfGuests),
    totalAmount,
    specialRequests: specialRequests || ""
  });

  await booking.save();

  // Create Razorpay order
  const orderResult = await paymentService.createOrder(
    totalAmount,
    'INR',
    `booking_${booking._id}`
  );

  if (!orderResult.success) {
    // If payment service is not configured, create a mock order for demo purposes
    if (orderResult.error === 'Payment service not configured') {
      const mockOrder = {
        id: `mock_order_${Date.now()}`,
        amount: totalAmount * 100,
        currency: 'INR'
      };
      
      // Update booking with mock order ID
      booking.razorpayOrderId = mockOrder.id;
      await booking.save();

      // Populate listing data for payment form
      await booking.populate('listing');

      // Generate payment form data with mock order
      const paymentData = paymentService.generatePaymentFormData(
        mockOrder,
        req.user,
        booking
      );

      req.flash("warning", "Payment service is not configured. This is a demo booking.");
      res.render("bookings/payment", { 
        booking, 
        listing, 
        paymentData,
        numberOfNights 
      });
      return;
    }
    
    throw new ExpressError(500, "Failed to create payment order!");
  }

  // Update booking with order ID
  booking.razorpayOrderId = orderResult.order.id;
  await booking.save();

  // Populate listing data for payment form
  await booking.populate('listing');

  // Generate payment form data
  const paymentData = paymentService.generatePaymentFormData(
    orderResult.order,
    req.user,
    booking
  );

  res.render("bookings/payment", { 
    booking, 
    listing, 
    paymentData,
    numberOfNights 
  });
});

// Handle payment success
module.exports.paymentSuccess = wrapAsync(async (req, res) => {
  const { 
    razorpay_order_id, 
    razorpay_payment_id, 
    razorpay_signature 
  } = req.body;

  // Verify payment signature
  const isValidSignature = paymentService.verifyPaymentSignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );

  if (!isValidSignature) {
    throw new ExpressError(400, "Invalid payment signature!");
  }

  // Update booking
  const booking = await Booking.findOne({ razorpayOrderId: razorpay_order_id });
  if (!booking) {
    throw new ExpressError(404, "Booking not found!");
  }

  booking.paymentStatus = "completed";
  booking.razorpayPaymentId = razorpay_payment_id;
  booking.razorpaySignature = razorpay_signature;
  await booking.save();

  // Send confirmation email
  const listing = await Listing.findById(booking.listing);
  const user = await User.findById(booking.user);
  
  await emailService.sendBookingConfirmation(booking, user, listing);

  req.flash("success", "Payment successful! Your booking has been confirmed.");
  res.redirect(`/bookings/${booking._id}`);
});

// Handle payment failure
module.exports.paymentFailure = wrapAsync(async (req, res) => {
  const { razorpay_order_id } = req.body;

  const booking = await Booking.findOne({ razorpayOrderId: razorpay_order_id });
  if (booking) {
    booking.paymentStatus = "failed";
    await booking.save();
  }

  req.flash("error", "Payment failed! Please try again.");
  res.redirect(`/listings/${booking?.listing || req.params.id}`);
});

// Show booking details
module.exports.showBooking = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const booking = await Booking.findById(id)
    .populate("listing")
    .populate("user");

  if (!booking) {
    throw new ExpressError(404, "Booking not found!");
  }

  // Check if user is authorized to view this booking
  if (!req.user._id.equals(booking.user._id) && !req.user.isAdmin) {
    throw new ExpressError(403, "You are not authorized to view this booking!");
  }

  res.render("bookings/show", { booking });
});

// Show user's bookings
module.exports.showUserBookings = wrapAsync(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("listing")
    .sort({ createdAt: -1 });

  res.render("bookings/index", { bookings });
});

// Cancel booking
module.exports.cancelBooking = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const booking = await Booking.findById(id);

  if (!booking) {
    throw new ExpressError(404, "Booking not found!");
  }

  if (!req.user._id.equals(booking.user) && !req.user.isAdmin) {
    throw new ExpressError(403, "You are not authorized to cancel this booking!");
  }

  if (booking.bookingStatus === "cancelled") {
    throw new ExpressError(400, "Booking is already cancelled!");
  }

  // Check if booking is within cancellation period (24 hours before check-in)
  const checkInDate = new Date(booking.checkIn);
  const now = new Date();
  const hoursUntilCheckIn = (checkInDate - now) / (1000 * 60 * 60);

  if (hoursUntilCheckIn < 24) {
    throw new ExpressError(400, "Bookings can only be cancelled at least 24 hours before check-in!");
  }

  booking.bookingStatus = "cancelled";
  await booking.save();

  // Process refund if payment was completed
  if (booking.paymentStatus === "completed" && booking.razorpayPaymentId) {
    const refundResult = await paymentService.refundPayment(
      booking.razorpayPaymentId,
      booking.totalAmount,
      "Booking cancelled by customer"
    );

    if (refundResult.success) {
      booking.paymentStatus = "refunded";
      await booking.save();
    }
  }

  req.flash("success", "Booking cancelled successfully!");
  res.redirect("/bookings");
});

// Admin: Show all bookings
module.exports.showAllBookings = wrapAsync(async (req, res) => {
  const bookings = await Booking.find({})
    .populate("listing")
    .populate("user")
    .sort({ createdAt: -1 });

  res.render("bookings/admin", { bookings });
});

// Admin: Update booking status
module.exports.updateBookingStatus = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const booking = await Booking.findById(id);
  if (!booking) {
    throw new ExpressError(404, "Booking not found!");
  }

  booking.bookingStatus = status;
  await booking.save();

  req.flash("success", "Booking status updated successfully!");
  res.redirect("/admin/bookings");
});

// Get booking statistics
module.exports.getBookingStats = wrapAsync(async (req, res) => {
  const totalBookings = await Booking.countDocuments();
  const completedBookings = await Booking.countDocuments({ bookingStatus: "confirmed" });
  const cancelledBookings = await Booking.countDocuments({ bookingStatus: "cancelled" });
  const totalRevenue = await Booking.aggregate([
    { $match: { paymentStatus: "completed" } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } }
  ]);

  const stats = {
    totalBookings,
    completedBookings,
    cancelledBookings,
    totalRevenue: totalRevenue[0]?.total || 0
  };

  res.json(stats);
}); 