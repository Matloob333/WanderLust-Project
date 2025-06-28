const express = require("express");
const router = express.Router({ mergeParams: true });
const bookingController = require("../controllers/booking");
const { isLoggedIn, isAdmin } = require("../middleware");

// Booking routes
router.get("/new", isLoggedIn, bookingController.showBookingForm);
router.post("/", isLoggedIn, bookingController.createBooking);

// Payment routes
router.post("/payment/success", isLoggedIn, bookingController.paymentSuccess);
router.post("/payment/failure", isLoggedIn, bookingController.paymentFailure);

// Booking management routes
router.get("/", isLoggedIn, bookingController.showUserBookings);
router.get("/:id", isLoggedIn, bookingController.showBooking);
router.delete("/:id", isLoggedIn, bookingController.cancelBooking);

// Admin routes
router.get("/admin/all", isLoggedIn, isAdmin, bookingController.showAllBookings);
router.patch("/admin/:id/status", isLoggedIn, isAdmin, bookingController.updateBookingStatus);
router.get("/admin/stats", isLoggedIn, isAdmin, bookingController.getBookingStats);

module.exports = router; 