const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  getAppointmentsByDate,
  deleteAppointment,
} = require('../controllers/appointmentController');
const { adminMiddleware } = require('../middleware/auth');

// Public routes
router.post('/', createAppointment);

// Protected routes
router.get('/', adminMiddleware, getAppointments);
router.get('/date/:date', adminMiddleware, getAppointmentsByDate);
router.put('/:id/status', adminMiddleware, updateAppointmentStatus);
router.delete('/:id', adminMiddleware, deleteAppointment);

module.exports = router;
