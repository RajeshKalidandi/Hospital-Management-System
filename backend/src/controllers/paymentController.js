const supabase = require('../config/supabase');
const nodemailer = require('nodemailer');

// Configure nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const createPayment = async (req, res) => {
  try {
    const {
      appointmentId,
      patientId,
      amount,
      paymentMethod,
      currency = 'USD',
      description,
    } = req.body;

    const { data, error } = await supabase
      .from('payments')
      .insert([
        {
          appointment_id: appointmentId,
          patient_id: patientId,
          amount,
          payment_method: paymentMethod,
          currency,
          description,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Get patient email for notification
    const { data: patient } = await supabase
      .from('patients')
      .select('email, name')
      .eq('id', patientId)
      .single();

    // Send payment confirmation email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: patient.email,
      subject: 'Payment Confirmation',
      html: `
        <h1>Payment Confirmation</h1>
        <p>Dear ${patient.name},</p>
        <p>We have received your payment. Here are the details:</p>
        <ul>
          <li>Amount: ${currency} ${amount}</li>
          <li>Payment Method: ${paymentMethod}</li>
          <li>Description: ${description}</li>
          <li>Status: Pending</li>
        </ul>
      `,
    });

    res.status(201).json(data);
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPayments = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        patients (name, email),
        appointments (
          appointment_type,
          date,
          time
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        patients (name, email),
        appointments (
          appointment_type,
          date,
          time
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data, error } = await supabase
      .from('payments')
      .update({ status, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Get patient email for notification
    const { data: patient } = await supabase
      .from('patients')
      .select('email, name')
      .eq('id', data.patient_id)
      .single();

    // Send payment status update email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: patient.email,
      subject: 'Payment Status Update',
      html: `
        <h1>Payment Status Update</h1>
        <p>Dear ${patient.name},</p>
        <p>Your payment status has been updated to: ${status}</p>
        <p>Payment Details:</p>
        <ul>
          <li>Amount: ${data.currency} ${data.amount}</li>
          <li>Payment Method: ${data.payment_method}</li>
          <li>Description: ${data.description}</li>
        </ul>
      `,
    });

    res.json(data);
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const generatePaymentReport = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;

    let query = supabase
      .from('payments')
      .select(`
        *,
        patients (name),
        appointments (appointment_type)
      `);

    if (startDate && endDate) {
      query = query.gte('created_at', startDate).lte('created_at', endDate);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    // Calculate summary statistics
    const summary = {
      totalAmount: data.reduce((sum, payment) => sum + payment.amount, 0),
      totalPayments: data.length,
      paymentsByMethod: data.reduce((acc, payment) => {
        acc[payment.payment_method] = (acc[payment.payment_method] || 0) + 1;
        return acc;
      }, {}),
      paymentsByStatus: data.reduce((acc, payment) => {
        acc[payment.status] = (acc[payment.status] || 0) + 1;
        return acc;
      }, {}),
    };

    res.json({
      summary,
      payments: data,
    });
  } catch (error) {
    console.error('Generate payment report error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPaymentsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        appointments (
          appointment_type,
          date,
          time
        )
      `)
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Get payments by patient error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createPayment,
  getPayments,
  getPaymentById,
  updatePaymentStatus,
  generatePaymentReport,
  getPaymentsByPatient,
}; 