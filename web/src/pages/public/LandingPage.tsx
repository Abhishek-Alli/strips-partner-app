/**
 * Landing Page - Public-facing homepage
 * 
 * SEO-friendly, fast-loading public page
 * No authentication required
 */

import React from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import AppleIcon from '@mui/icons-material/Apple';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Easy Access',
      description: 'Access your account anytime, anywhere with our mobile app'
    },
    {
      title: 'Secure Platform',
      description: 'Your data is protected with enterprise-grade security'
    },
    {
      title: '24/7 Support',
      description: 'Get help whenever you need it with our dedicated support team'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: { xs: 8, md: 12 },
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 3 }}
          >
            Welcome to Shree Om
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Your trusted platform for seamless digital experience
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<PhoneAndroidIcon />}
              sx={{
                bgcolor: 'background.paper',
                color: 'primary.main',
                '&:hover': { bgcolor: 'background.default' }
              }}
              href="https://play.google.com/store/apps"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get on Google Play
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<AppleIcon />}
              sx={{
                bgcolor: 'background.paper',
                color: 'primary.main',
                '&:hover': { bgcolor: 'background.default' }
              }}
              href="https://apps.apple.com/app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download on App Store
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ mb: 6 }}
        >
          Why Choose Us
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <CheckCircleIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'grey.100',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to Get Started?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Download our app today and experience the difference
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/contact')}
            >
              Contact Us
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
            >
              Admin Login
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;






