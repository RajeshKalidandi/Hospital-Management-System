const bcrypt = require('bcrypt');
const supabase = require('./supabase');

async function seedAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin@2025', 10);

    // Check if admin already exists
    const { data: existingAdmin } = await supabase
      .from('admins')
      .select('*')
      .eq('email', 'admin@healthcareclinic.com')
      .single();

    if (!existingAdmin) {
      // Create admin if doesn't exist
      const { data, error } = await supabase
        .from('admins')
        .insert([
          {
            email: 'admin@healthcareclinic.com',
            password: hashedPassword,
            is_super_admin: true,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      console.log('Admin created successfully:', data.email);
    } else {
      console.log('Admin already exists');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
}

// Run the seed function
seedAdmin();
