/**
 * Terms and Conditions Page
 * 
 * Legal compliance page for terms of service
 */

import React from 'react';
import { Box, Typography, Container, Paper, Link } from '@mui/material';
import { AppLayout } from '../../components/layout/AppLayout';

const TermsAndConditionsPage: React.FC = () => {
  return (
    <AppLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Terms and Conditions
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Last Updated: {new Date().toLocaleDateString()}
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              1. Acceptance of Terms
            </Typography>
            <Typography variant="body1" paragraph>
              By accessing and using Shree Om, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              2. Description of Service
            </Typography>
            <Typography variant="body1" paragraph>
              Shree Om is a platform connecting users with construction partners and dealers. We provide:
            </Typography>
            <Typography component="ul" variant="body1" sx={{ pl: 4 }}>
              <li>Search and discovery of construction partners and dealers</li>
              <li>Enquiry submission and communication tools</li>
              <li>Construction calculators and budget estimation services</li>
              <li>Payment processing for premium services</li>
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              3. User Accounts
            </Typography>
            <Typography variant="body1" paragraph>
              You are responsible for:
            </Typography>
            <Typography component="ul" variant="body1" sx={{ pl: 4 }}>
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and complete information</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              4. User Conduct
            </Typography>
            <Typography variant="body1" paragraph>
              You agree not to:
            </Typography>
            <Typography component="ul" variant="body1" sx={{ pl: 4 }}>
              <li>Use the service for any illegal purpose</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit harmful code or malware</li>
              <li>Harass, abuse, or harm other users</li>
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              5. Payments and Refunds
            </Typography>
            <Typography variant="body1" paragraph>
              Payments for premium services are processed through secure third-party payment gateways. Refund policies are outlined in our Refund Policy. All payments are final unless otherwise stated.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              6. Intellectual Property
            </Typography>
            <Typography variant="body1" paragraph>
              All content, features, and functionality of Shree Om are owned by us and protected by copyright, trademark, and other intellectual property laws.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              7. Limitation of Liability
            </Typography>
            <Typography variant="body1" paragraph>
              Shree Om is provided "as is" without warranties. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              8. Termination
            </Typography>
            <Typography variant="body1" paragraph>
              We reserve the right to terminate or suspend your account at any time for violation of these terms or for any other reason we deem necessary.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              9. Changes to Terms
            </Typography>
            <Typography variant="body1" paragraph>
              We may modify these terms at any time. Continued use of the service after changes constitutes acceptance of the modified terms.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              10. Contact Information
            </Typography>
            <Typography variant="body1" paragraph>
              For questions about these Terms, contact us at:
            </Typography>
            <Typography variant="body1">
              Email: <Link href="mailto:legal@shreeom.com">legal@shreeom.com</Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </AppLayout>
  );
};

export default TermsAndConditionsPage;

