const express = require('express');
const router = express.Router();
const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  addMedicalRecord,
  searchPatients,
} = require('../controllers/patientController');
const { adminMiddleware } = require('../middleware/auth');

// All routes are protected
router.use(adminMiddleware);

router.post('/', createPatient);
router.get('/', getPatients);
router.get('/search', searchPatients);
router.get('/:id', getPatientById);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);
router.post('/:id/medical-records', addMedicalRecord);

module.exports = router; 