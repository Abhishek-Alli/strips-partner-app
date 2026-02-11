/**
 * Signup Step 2: User Type Selection (Web Version)
 * 
 * User selects their account type during signup
 * FIXED: Correct import path using @ alias
 */

import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService'; // ✅ CORRECT: Using @ alias
import { UserRole } from '@/types/auth.types';

const SignupStep2_UserType: React.FC = () => {
  const [selectedType, setSelectedType] = useState<UserRole>(UserRole.GENERAL_USER);
  const navigate = useNavigate();

  const handleContinue = async () => {
    try {
      // Navigate to next step with selected user type
      navigate('/signup/form', { state: { userType: selectedType } });
    } catch (error) {
      console.error('Error in signup flow:', error);
    }
  };

  const userTypes = [
    {
      role: UserRole.GENERAL_USER,
      title: 'General User',
      description: 'Access all app features and services',
      icon: '👤'
    },
    {
      role: UserRole.PARTNER,
      title: 'Partner',
      description: 'Manage works, events, and business profile',
      icon: '🤝'
    },
    {
      role: UserRole.DEALER,
      title: 'Dealer',
      description: 'Manage products, offers, and dealer services',
      icon: '🏪'
    }
  ];

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Create Account
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Select your account type
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
        {userTypes.map((type) => (
          <Card
            key={type.role}
            sx={{
              cursor: 'pointer',
              border: selectedType === type.role ? 2 : 1,
              borderColor: selectedType === type.role ? 'primary.main' : 'divider',
              '&:hover': {
                borderColor: 'primary.main',
                borderWidth: 2
              }
            }}
            onClick={() => setSelectedType(type.role)}
          >
            <CardContent>
              <Typography variant="h6">{type.icon} {type.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {type.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={handleContinue}
        sx={{ mt: 2 }}
      >
        Continue
      </Button>
    </Container>
  );
};

export default SignupStep2_UserType;

