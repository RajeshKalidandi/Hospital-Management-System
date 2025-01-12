const supabase = require('../config/supabase');

const createPatient = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      age,
      gender,
      bloodGroup,
      address,
      medicalHistory,
      allergies,
    } = req.body;

    const { data, error } = await supabase
      .from('patients')
      .insert([
        {
          name,
          email,
          phone,
          age,
          gender,
          blood_group: bloodGroup,
          address,
          medical_history: medicalHistory,
          allergies,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Create patient error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPatients = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('patients')
      .select(`
        *,
        appointments (
          id,
          date,
          time,
          appointment_type,
          consultation_mode,
          status
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      age,
      gender,
      bloodGroup,
      address,
      medicalHistory,
      allergies,
    } = req.body;

    const { data, error } = await supabase
      .from('patients')
      .update({
        name,
        email,
        phone,
        age,
        gender,
        blood_group: bloodGroup,
        address,
        medical_history: medicalHistory,
        allergies,
        updated_at: new Date(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const addMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { diagnosis, prescription, notes, date } = req.body;

    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('medical_history')
      .eq('id', id)
      .single();

    if (patientError) throw patientError;
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const medicalHistory = patient.medical_history || [];
    medicalHistory.push({
      diagnosis,
      prescription,
      notes,
      date,
      recorded_at: new Date().toISOString(),
    });

    const { data, error } = await supabase
      .from('patients')
      .update({
        medical_history: medicalHistory,
        updated_at: new Date(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Add medical record error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const searchPatients = async (req, res) => {
  try {
    const { query } = req.query;

    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
      .order('name', { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Search patients error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  addMedicalRecord,
  searchPatients,
}; 