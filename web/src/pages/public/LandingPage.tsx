/**
 * Landing Page - Public-facing homepage for SRJ Strips & Pipes
 */

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import AppleIcon from '@mui/icons-material/Apple';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import HandshakeIcon from '@mui/icons-material/Handshake';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#FF6B35' }} />,
      title: 'Live Market Rates',
      description: 'Stay updated with real-time steel strip and pipe market prices from across India.',
    },
    {
      icon: <HandshakeIcon sx={{ fontSize: 40, color: '#FF6B35' }} />,
      title: 'Dealer & Partner Network',
      description: 'Connect with our trusted network of authorised dealers and channel partners nationwide.',
    },
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 40, color: '#FF6B35' }} />,
      title: 'Quality Assured',
      description: 'Every product meets stringent quality standards with verified certifications.',
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 40, color: '#FF6B35' }} />,
      title: '24/7 Support',
      description: 'Dedicated support team available round the clock for all your business needs.',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8F9FC' }}>
      {/* Navbar */}
      <Box
        sx={{
          backgroundColor: '#fff',
          borderBottom: '1px solid #E5E7EB',
          px: { xs: 3, md: 6 },
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #FF6B35, #e85a2b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: '#fff' }}>
              SRJ
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#111827', lineHeight: 1.2 }}>
              SRJ Strips & Pipes
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: '#9CA3AF', lineHeight: 1 }}>
              Quality Steel Solutions
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate('/contact')}
            sx={{
              borderColor: '#E5E7EB',
              color: '#374151',
              textTransform: 'none',
              borderRadius: '8px',
              fontWeight: 500,
              '&:hover': { borderColor: '#FF6B35', color: '#FF6B35', backgroundColor: 'transparent' },
            }}
          >
            Contact Us
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<AdminPanelSettingsIcon />}
            onClick={() => navigate('/login')}
            sx={{
              backgroundColor: '#FF6B35',
              textTransform: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#E85A2B', boxShadow: 'none' },
            }}
          >
            Admin Login
          </Button>
        </Box>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(145deg, #1e2538 0%, #2D3142 55%, #3a4060 100%)',
          color: '#fff',
          py: { xs: 8, md: 14 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decorations */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 450,
            height: 450,
            borderRadius: '50%',
            background: 'rgba(255, 107, 53, 0.07)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 350,
            height: 350,
            borderRadius: '50%',
            background: 'rgba(255, 107, 53, 0.05)',
          }}
        />

        <Container maxWidth="md" sx={{ position: 'relative', textAlign: 'center' }}>
          {/* Badge */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              backgroundColor: 'rgba(255, 107, 53, 0.15)',
              border: '1px solid rgba(255, 107, 53, 0.35)',
              borderRadius: '20px',
              px: 2,
              py: 0.75,
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: '#FF6B35',
              }}
            />
            <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', letterSpacing: '0.5px' }}>
              India's Trusted Steel Partner
            </Typography>
          </Box>

          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              mb: 2.5,
              fontSize: { xs: '2rem', md: '3rem' },
              lineHeight: 1.2,
              letterSpacing: '-0.5px',
            }}
          >
            SRJ Strips & Pipes
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '1rem', md: '1.2rem' },
              opacity: 0.75,
              mb: 2,
              maxWidth: 560,
              mx: 'auto',
              lineHeight: 1.7,
            }}
          >
            Premium quality steel strips and pipes for construction, infrastructure,
            and industrial applications — delivered across India.
          </Typography>

          {/* Stats */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: { xs: 3, md: 6 },
              my: 5,
              flexWrap: 'wrap',
            }}
          >
            {[
              { value: '500+', label: 'Dealers' },
              { value: '50+', label: 'Cities' },
              { value: '10K+', label: 'Clients' },
            ].map((stat) => (
              <Box key={stat.label} sx={{ textAlign: 'center' }}>
                <Typography
                  sx={{ fontSize: '1.8rem', fontWeight: 800, color: '#FF6B35', lineHeight: 1 }}
                >
                  {stat.value}
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', opacity: 0.65, mt: 0.5 }}>
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* App Download Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<PhoneAndroidIcon />}
              href="https://play.google.com/store/apps"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                backgroundColor: '#fff',
                color: '#1F2937',
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1.5,
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                '&:hover': {
                  backgroundColor: '#F3F4F6',
                  boxShadow: '0 6px 24px rgba(0,0,0,0.25)',
                },
              }}
            >
              Get on Google Play
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<AppleIcon />}
              href="https://apps.apple.com/app"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                borderColor: 'rgba(255,255,255,0.4)',
                color: '#fff',
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1.5,
                '&:hover': {
                  borderColor: '#fff',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                },
              }}
            >
              Download on App Store
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 7, md: 10 } }}>
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{ fontWeight: 700, color: '#111827', mb: 1.5 }}
          >
            Why Choose SRJ?
          </Typography>
          <Typography sx={{ color: '#6B7280', maxWidth: 480, mx: 'auto', lineHeight: 1.7 }}>
            We bring together quality products, reliable partners, and powerful tools
            to grow your business.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: '16px',
                  border: '1px solid #E5E7EB',
                  backgroundColor: '#fff',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#FF6B35',
                    boxShadow: '0 8px 32px rgba(255, 107, 53, 0.12)',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '14px',
                      backgroundColor: 'rgba(255, 107, 53, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2.5,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{ fontWeight: 700, color: '#111827', mb: 1, fontSize: '1rem' }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: '#6B7280', lineHeight: 1.65, fontSize: '0.875rem' }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ backgroundColor: '#fff', borderTop: '1px solid #E5E7EB', py: { xs: 7, md: 10 } }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', mb: 1.5 }}>
            Ready to Get Started?
          </Typography>
          <Typography sx={{ color: '#6B7280', mb: 5, lineHeight: 1.7, maxWidth: 440, mx: 'auto' }}>
            Download our app today and experience seamless steel trading,
            market updates, and business management.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/contact')}
              sx={{
                borderColor: '#E5E7EB',
                color: '#374151',
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                '&:hover': { borderColor: '#FF6B35', color: '#FF6B35', backgroundColor: 'transparent' },
              }}
            >
              Contact Us
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<AdminPanelSettingsIcon />}
              onClick={() => navigate('/login')}
              sx={{
                backgroundColor: '#FF6B35',
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                boxShadow: '0 4px 16px rgba(255, 107, 53, 0.3)',
                '&:hover': { backgroundColor: '#E85A2B', boxShadow: 'none' },
              }}
            >
              Admin Portal
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          backgroundColor: '#2D3142',
          color: 'rgba(255,255,255,0.6)',
          py: 3,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 2, flexWrap: 'wrap' }}>
            <Button
              size="small"
              onClick={() => navigate('/privacy-policy')}
              sx={{ color: 'rgba(255,255,255,0.6)', textTransform: 'none', fontSize: '0.8rem', '&:hover': { color: '#FF6B35' } }}
            >
              Privacy Policy
            </Button>
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.15)' }} />
            <Button
              size="small"
              onClick={() => navigate('/terms')}
              sx={{ color: 'rgba(255,255,255,0.6)', textTransform: 'none', fontSize: '0.8rem', '&:hover': { color: '#FF6B35' } }}
            >
              Terms & Conditions
            </Button>
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.15)' }} />
            <Button
              size="small"
              onClick={() => navigate('/refund-policy')}
              sx={{ color: 'rgba(255,255,255,0.6)', textTransform: 'none', fontSize: '0.8rem', '&:hover': { color: '#FF6B35' } }}
            >
              Refund Policy
            </Button>
          </Box>
          <Typography sx={{ fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} SRJ Strips & Pipes. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
