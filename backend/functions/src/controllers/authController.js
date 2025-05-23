const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!admin) {
      console.error('Admin not found for email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Admin found:', { id: admin.id, email: admin.email });

    const isValidPassword = await bcrypt.compare(password, admin.password);
    console.log('Password validation result:', isValidPassword);

    if (!isValidPassword) {
      console.error('Invalid password for email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful for:', email);
    res.json({ token, admin: { id: admin.id, email: admin.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.user.id;

    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('id', adminId)
      .single();

    if (error || !admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isValidPassword = await bcrypt.compare(currentPassword, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const { error: updateError } = await supabase
      .from('admins')
      .update({ password: hashedPassword })
      .eq('id', adminId);

    if (updateError) {
      throw updateError;
    }

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  login,
  changePassword
}; 