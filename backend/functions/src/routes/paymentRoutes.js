"use strict";
const express = require('express');
const router = express.Router();
const { createPayment, getPayments, getPaymentById, updatePaymentStatus, generatePaymentReport, getPaymentsByPatient, } = require('../controllers/paymentController');
const { adminMiddleware } = require('../middleware/auth');
// Public routes
router.post('/', createPayment);
// Protected routes
router.get('/', adminMiddleware, getPayments);
router.get('/report', adminMiddleware, generatePaymentReport);
router.get('/patient/:patientId', adminMiddleware, getPaymentsByPatient);
router.get('/:id', adminMiddleware, getPaymentById);
router.put('/:id/status', adminMiddleware, updatePaymentStatus);
module.exports = router;
