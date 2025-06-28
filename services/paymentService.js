const Razorpay = require('razorpay');
const crypto = require('crypto');

class PaymentService {
  constructor() {
    // Only initialize Razorpay if environment variables are available
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      this.razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
      });
      this.isConfigured = true;
    } else {
      console.warn('Razorpay credentials not found. Payment functionality will be disabled.');
      this.isConfigured = false;
    }
  }

  // Create a new order
  async createOrder(amount, currency = 'INR', receipt = null) {
    if (!this.isConfigured) {
      return {
        success: false,
        error: 'Payment service not configured'
      };
    }

    try {
      const options = {
        amount: amount * 100, // Razorpay expects amount in paise
        currency: currency,
        receipt: receipt || `receipt_${Date.now()}`,
        payment_capture: 1
      };

      const order = await this.razorpay.orders.create(options);
      return {
        success: true,
        order: order
      };
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify payment signature
  verifyPaymentSignature(orderId, paymentId, signature) {
    if (!this.isConfigured || !process.env.RAZORPAY_KEY_SECRET) {
      return false;
    }

    try {
      const text = `${orderId}|${paymentId}`;
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest('hex');

      return generatedSignature === signature;
    } catch (error) {
      console.error('Error verifying payment signature:', error);
      return false;
    }
  }

  // Get payment details
  async getPaymentDetails(paymentId) {
    if (!this.isConfigured) {
      return {
        success: false,
        error: 'Payment service not configured'
      };
    }

    try {
      const payment = await this.razorpay.payments.fetch(paymentId);
      return {
        success: true,
        payment: payment
      };
    } catch (error) {
      console.error('Error fetching payment details:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Refund payment
  async refundPayment(paymentId, amount = null, reason = 'Customer request') {
    if (!this.isConfigured) {
      return {
        success: false,
        error: 'Payment service not configured'
      };
    }

    try {
      const refundOptions = {
        payment_id: paymentId,
        reason: reason
      };

      if (amount) {
        refundOptions.amount = amount * 100; // Convert to paise
      }

      const refund = await this.razorpay.payments.refund(refundOptions);
      return {
        success: true,
        refund: refund
      };
    } catch (error) {
      console.error('Error processing refund:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Calculate booking amount
  calculateBookingAmount(pricePerNight, numberOfNights, numberOfGuests = 1) {
    const baseAmount = pricePerNight * numberOfNights;
    const guestSurcharge = numberOfGuests > 2 ? (numberOfGuests - 2) * 500 : 0; // Extra charge for additional guests
    const taxes = baseAmount * 0.18; // 18% GST
    const serviceCharge = baseAmount * 0.05; // 5% service charge
    
    return Math.round(baseAmount + guestSurcharge + taxes + serviceCharge);
  }

  // Generate payment form data
  generatePaymentFormData(order, user, booking) {
    if (!this.isConfigured) {
      return {
        key: 'test_key',
        amount: order.amount,
        currency: order.currency,
        name: 'WanderLust',
        description: `Booking for ${booking.listing.title || 'Property'}`,
        order_id: order.id,
        prefill: {
          name: user.username || '',
          email: user.email || '',
          contact: user.phone || ''
        },
        notes: {
          booking_id: booking._id.toString(),
          user_id: user._id.toString(),
          listing_id: booking.listing.toString()
        },
        theme: {
          color: '#6366f1'
        }
      };
    }

    return {
      key: process.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'WanderLust',
      description: `Booking for ${booking.listing.title || 'Property'}`,
      order_id: order.id,
      prefill: {
        name: user.username || '',
        email: user.email || '',
        contact: user.phone || ''
      },
      notes: {
        booking_id: booking._id.toString(),
        user_id: user._id.toString(),
        listing_id: booking.listing.toString()
      },
      theme: {
        color: '#6366f1'
      }
    };
  }
}

module.exports = new PaymentService(); 