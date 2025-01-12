const { stripe, razorpay } = require('../config/payment');
const supabase = require('../config/supabase');

// Stripe Payment Integration
const createStripePayment = async (req, res) => {
  try {
    const { amount, currency, appointmentId, patientId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency,
      metadata: {
        appointmentId,
        patientId,
      },
    });

    // Create payment record in database
    const { data, error } = await supabase
      .from('payments')
      .insert([
        {
          appointment_id: appointmentId,
          patient_id: patientId,
          amount,
          currency,
          payment_method: 'stripe',
          status: 'pending',
          transaction_id: paymentIntent.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: data.id,
    });
  } catch (error) {
    console.error('Stripe payment error:', error);
    res.status(500).json({ message: 'Payment initialization failed' });
  }
};

const handleStripeWebhook = async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      
      // Update payment status in database
      await supabase
        .from('payments')
        .update({ 
          status: 'completed',
          updated_at: new Date(),
        })
        .eq('transaction_id', paymentIntent.id);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Razorpay Payment Integration
const createRazorpayPayment = async (req, res) => {
  try {
    const { amount, currency, appointmentId, patientId } = req.body;

    const options = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Create payment record in database
    const { data, error } = await supabase
      .from('payments')
      .insert([
        {
          appointment_id: appointmentId,
          patient_id: patientId,
          amount,
          currency,
          payment_method: 'razorpay',
          status: 'pending',
          transaction_id: order.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.json({
      orderId: order.id,
      paymentId: data.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Razorpay payment error:', error);
    res.status(500).json({ message: 'Payment initialization failed' });
  }
};

const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Update payment status in database
      await supabase
        .from('payments')
        .update({ 
          status: 'completed',
          updated_at: new Date(),
        })
        .eq('transaction_id', razorpay_order_id);

      res.json({ status: 'success' });
    } else {
      res.status(400).json({ message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Razorpay verification error:', error);
    res.status(500).json({ message: 'Payment verification failed' });
  }
};

module.exports = {
  createStripePayment,
  handleStripeWebhook,
  createRazorpayPayment,
  verifyRazorpayPayment,
}; 