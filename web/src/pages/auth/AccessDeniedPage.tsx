import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const AccessDeniedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}
    >
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
        <LockOutlinedIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          You don't have permission to access this resource.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/dashboard')}
        >
          Go to Dashboard
        </Button>
      </Paper>
    </Box>
  );
};

export default AccessDeniedPage;

