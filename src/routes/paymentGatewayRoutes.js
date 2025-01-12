const express = require('express');
const router = express.Router();
const {
  createStripePayment,
  handleStripeWebhook,
  createRazorpayPayment,
  verifyRazorpayPayment,
} = require('../controllers/paymentGatewayController');

// Stripe routes
router.post('/stripe/create-payment', createStripePayment);
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Razorpay routes
router.post('/razorpay/create-payment', createRazorpayPayment);
router.post('/razorpay/verify-payment', verifyRazorpayPayment);

module.exports = router; 