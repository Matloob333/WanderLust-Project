const nodemailer = require('nodemailer');
const crypto = require('crypto');

class EmailService {
  constructor() {
    // Only initialize transporter if environment variables are available
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS // Use app password for Gmail
        }
      });
      this.isConfigured = true;
    } else {
      console.warn('Email credentials not found. Email functionality will be disabled.');
      this.isConfigured = false;
    }
  }

  // Send welcome email for new signups
  async sendWelcomeEmail(user) {
    if (!this.isConfigured) {
      console.log('Email service not configured. Skipping welcome email.');
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Welcome to WanderLust! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #6366f1, #10b981); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to WanderLust!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Your journey begins here</p>
          </div>
          <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${user.username}!</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Thank you for joining WanderLust! We're excited to have you as part of our community of travelers and adventure seekers.
            </p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #6366f1; margin-top: 0;">What you can do now:</h3>
              <ul style="color: #666; line-height: 1.8;">
                <li>Explore amazing destinations and accommodations</li>
                <li>Book your next adventure with secure payments</li>
                <li>Read and write reviews from fellow travelers</li>
                <li>Manage your profile and preferences</li>
              </ul>
            </div>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.BASE_URL || 'http://localhost:8080'}" 
                 style="background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">
                Start Exploring
              </a>
            </div>
            <p style="color: #999; font-size: 14px; margin-top: 30px; text-align: center;">
              If you have any questions, feel free to reach out to our support team.
            </p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent successfully');
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }

  // Send login notification
  async sendLoginNotification(user, loginTime, ipAddress) {
    if (!this.isConfigured) {
      console.log('Email service not configured. Skipping login notification.');
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'New Login to Your WanderLust Account 🔐',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">New Login Detected</h1>
          </div>
          <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${user.username}!</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              We detected a new login to your WanderLust account. Here are the details:
            </p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Time:</strong> ${loginTime}</p>
              <p><strong>IP Address:</strong> ${ipAddress}</p>
              <p><strong>Device:</strong> Web Browser</p>
            </div>
            <p style="color: #666; line-height: 1.6;">
              If this was you, you can safely ignore this email. If you don't recognize this login, 
              please contact our support team immediately.
            </p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.BASE_URL || 'http://localhost:8080'}/profile" 
                 style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">
                View Account
              </a>
            </div>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Login notification sent successfully');
    } catch (error) {
      console.error('Error sending login notification:', error);
    }
  }

  // Send password change confirmation
  async sendPasswordChangeConfirmation(user) {
    if (!this.isConfigured) {
      console.log('Email service not configured. Skipping password change confirmation.');
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Changed Successfully 🔒',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Password Updated</h1>
          </div>
          <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${user.username}!</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Your WanderLust account password has been successfully changed. 
              This change was made at ${new Date().toLocaleString()}.
            </p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #666; margin: 0;">
                <strong>Security Tip:</strong> Use a strong, unique password and never share it with anyone.
              </p>
            </div>
            <p style="color: #666; line-height: 1.6;">
              If you didn't make this change, please contact our support team immediately.
            </p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.BASE_URL || 'http://localhost:8080'}/profile" 
                 style="background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">
                Manage Account
              </a>
            </div>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Password change confirmation sent successfully');
    } catch (error) {
      console.error('Error sending password change confirmation:', error);
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(user, resetToken) {
    if (!this.isConfigured) {
      console.log('Email service not configured. Skipping password reset email.');
      return false;
    }

    const resetUrl = `${process.env.BASE_URL || 'http://localhost:8080'}/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Reset Your WanderLust Password 🔑',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Password Reset Request</h1>
          </div>
          <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${user.username}!</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              You requested to reset your WanderLust account password. Click the button below to create a new password:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: #ef4444; color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; display: inline-block; font-size: 16px;">
                Reset Password
              </a>
            </div>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              This link will expire in 1 hour for security reasons. If you didn't request this password reset, 
              please ignore this email.
            </p>
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #856404; margin: 0; font-size: 14px;">
                <strong>Security Notice:</strong> Never share this link with anyone. Our team will never ask for your password.
              </p>
            </div>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return false;
    }
  }

  // Send booking confirmation
  async sendBookingConfirmation(booking, user, listing) {
    if (!this.isConfigured) {
      console.log('Email service not configured. Skipping booking confirmation.');
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Booking Confirmed! 🎉 Your WanderLust Adventure Awaits',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #6366f1, #10b981); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Booking Confirmed!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Your adventure awaits</p>
          </div>
          <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${user.username}!</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Your booking has been confirmed! Here are the details of your upcoming stay:
            </p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #6366f1; margin-top: 0;">Booking Details</h3>
              <p><strong>Property:</strong> ${listing.title}</p>
              <p><strong>Location:</strong> ${listing.location}</p>
              <p><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString()}</p>
              <p><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString()}</p>
              <p><strong>Guests:</strong> ${booking.numberOfGuests}</p>
              <p><strong>Total Amount:</strong> ₹${booking.totalAmount}</p>
              <p><strong>Booking ID:</strong> ${booking._id}</p>
            </div>
            <div style="background: #e8f5e8; border: 1px solid #c3e6c3; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #155724; margin: 0; font-size: 14px;">
                <strong>Payment Status:</strong> ${booking.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
              </p>
            </div>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.BASE_URL || 'http://localhost:8080'}/bookings/${booking._id}" 
                 style="background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">
                View Booking Details
              </a>
            </div>
            <p style="color: #999; font-size: 14px; margin-top: 30px; text-align: center;">
              Have a wonderful stay! If you need any assistance, our support team is here to help.
            </p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Booking confirmation email sent successfully');
    } catch (error) {
      console.error('Error sending booking confirmation:', error);
    }
  }

  // Send verification code for email verification
  async sendVerificationCode(user, verificationCode) {
    if (!this.isConfigured) {
      console.log('Email service not configured. Skipping verification code email.');
      return false;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Verify Your Email - WanderLust',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Email Verification</h1>
          </div>
          <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${user.username}!</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Please use the following verification code to complete your email verification:
            </p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <h1 style="color: #3b82f6; font-size: 32px; margin: 0; letter-spacing: 5px;">${verificationCode}</h1>
            </div>
            <p style="color: #666; line-height: 1.6;">
              This code will expire in 10 minutes. If you didn't request this verification, please ignore this email.
            </p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Verification code email sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending verification code:', error);
      return false;
    }
  }
}

module.exports = new EmailService(); 