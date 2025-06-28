const mongoose = require('mongoose');
const Booking = require('./models/booking');
require('dotenv').config();

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.ATLASDB_URL);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// List all bookings for a specific listing
async function listBookings(listingId) {
  try {
    const bookings = await Booking.find({ listing: listingId })
      .populate('user', 'username email')
      .populate('listing', 'title')
      .sort({ checkIn: 1 });

    console.log('\n=== Bookings for Listing ===');
    bookings.forEach((booking, index) => {
      console.log(`${index + 1}. Booking ID: ${booking._id}`);
      console.log(`   User: ${booking.user.username} (${booking.user.email})`);
      console.log(`   Dates: ${booking.checkIn.toLocaleDateString()} - ${booking.checkOut.toLocaleDateString()}`);
      console.log(`   Status: ${booking.bookingStatus}`);
      console.log(`   Payment: ${booking.paymentStatus}`);
      console.log(`   Amount: ₹${booking.totalAmount}`);
      console.log('   ---');
    });
  } catch (error) {
    console.error('Error listing bookings:', error);
  }
}

// Cancel a specific booking
async function cancelBooking(bookingId) {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      console.log('Booking not found');
      return;
    }

    booking.bookingStatus = 'cancelled';
    await booking.save();
    console.log(`Booking ${bookingId} cancelled successfully`);
  } catch (error) {
    console.error('Error cancelling booking:', error);
  }
}

// Main function
async function main() {
  await connectDB();
  
  const listingId = '685f30c83635417933a8b69c'; // Your listing ID
  
  console.log('Listing all bookings for the property...');
  await listBookings(listingId);
  
  // Close connection
  await mongoose.connection.close();
  console.log('Disconnected from MongoDB');
}

// Run the script
main().catch(console.error); 