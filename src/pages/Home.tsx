import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper } from '@mui/material';
import { auth } from '../services/api';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await auth.verifyToken();
        if (!user) {
          navigate('/login');
        }
        setLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to Healthcare Clinic Management
          </Typography>
          <Typography variant="body1" paragraph>
            This is your dashboard for managing the healthcare clinic. Use the navigation menu to access different features.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Home;