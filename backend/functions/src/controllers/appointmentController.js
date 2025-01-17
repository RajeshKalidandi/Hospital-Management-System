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

const createAppointment = async (req, res) => {
  try {
    const { patientName, email, phone, appointmentType, date, time, consultationMode } = req.body;

    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          patient_name: patientName,
          email,
          phone,
          appointment_type: appointmentType,
          date,
          time,
          consultation_mode: consultationMode,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Send confirmation email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Appointment Confirmation',
      html: `
        <h1>Appointment Booking Confirmation</h1>
        <p>Dear ${patientName},</p>
        <p>Your appointment has been successfully booked. Here are the details:</p>
        <ul>
          <li>Date: ${date}</li>
          <li>Time: ${time}</li>
          <li>Type: ${appointmentType}</li>
          <li>Mode: ${consultationMode}</li>
        </ul>
        <p>We will confirm your appointment shortly.</p>
      `,
    });

    // Emit real-time notification
    const io = req.app.get('io');
    io.to(`doctor-${data.doctorId}`).emit('new-appointment', {
      type: 'new-appointment',
      appointment: data,
    });

    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Error creating appointment' });
  }
};

const getAppointments = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data, error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Send status update email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: data.email,
      subject: 'Appointment Status Update',
      html: `
        <h1>Appointment Status Update</h1>
        <p>Dear ${data.patient_name},</p>
        <p>Your appointment status has been updated to: ${status}</p>
        <p>Appointment Details:</p>
        <ul>
          <li>Date: ${data.date}</li>
          <li>Time: ${data.time}</li>
          <li>Type: ${data.appointment_type}</li>
          <li>Mode: ${data.consultation_mode}</li>
        </ul>
      `,
    });

    // Emit real-time status update
    const io = req.app.get('io');
    io.to(`appointment-${id}`).emit('appointment-status-update', {
      type: 'status-update',
      appointmentId: id,
      status: status,
    });

    res.json({ message: 'Appointment status updated successfully' });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ message: 'Error updating appointment status' });
  }
};

const getAppointmentsByDate = async (req, res) => {
  try {
    const { date } = req.params;

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('date', date)
      .order('time', { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Get appointments by date error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: appointment } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();

    const { error } = await supabase.from('appointments').delete().eq('id', id);

    if (error) throw error;

    // Send cancellation email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: appointment.email,
      subject: 'Appointment Cancelled',
      html: `
        <h1>Appointment Cancellation</h1>
        <p>Dear ${appointment.patient_name},</p>
        <p>Your appointment has been cancelled.</p>
        <p>Cancelled Appointment Details:</p>
        <ul>
          <li>Date: ${appointment.date}</li>
          <li>Time: ${appointment.time}</li>
          <li>Type: ${appointment.appointment_type}</li>
          <li>Mode: ${appointment.consultation_mode}</li>
        </ul>
        <p>If you wish to reschedule, please book a new appointment.</p>
      `,
    });

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  getAppointmentsByDate,
  deleteAppointment,
};
