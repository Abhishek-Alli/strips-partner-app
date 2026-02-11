/**
 * Footer Component
 * 
 * Site footer with legal links
 */

import React from 'react';
import { Box, Typography, Link, Container, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        py: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Shree Om
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Connecting construction professionals with clients.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/privacy-policy')}
                sx={{ textAlign: 'left', mb: 1 }}
              >
                Privacy Policy
              </Link>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/terms-and-conditions')}
                sx={{ textAlign: 'left', mb: 1 }}
              >
                Terms & Conditions
              </Link>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/refund-policy')}
                sx={{ textAlign: 'left', mb: 1 }}
              >
                Refund Policy
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Contact
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: <Link href="mailto:support@shreeom.com">support@shreeom.com</Link>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Phone: [Support Phone Number]
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Shree Om. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};






