/**
 * Privacy Policy Page
 * 
 * Legal compliance page for privacy policy
 */

import React from 'react';
import { Box, Typography, Container, Paper, Link } from '@mui/material';
import { AppLayout } from '../../components/layout/AppLayout';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <AppLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Privacy Policy
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Last Updated: {new Date().toLocaleDateString()}
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              1. Introduction
            </Typography>
            <Typography variant="body1" paragraph>
              Shree Om ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and web platform.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              2. Information We Collect
            </Typography>
            <Typography variant="body1" paragraph>
              We collect information that you provide directly to us, including:
            </Typography>
            <Typography component="ul" variant="body1" sx={{ pl: 4 }}>
              <li>Account information (name, email, phone number)</li>
              <li>Profile information (for Partners and Dealers)</li>
              <li>Payment information (processed securely through third-party payment gateways)</li>
              <li>Enquiry and communication data</li>
              <li>Usage data and analytics</li>
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              3. How We Use Your Information
            </Typography>
            <Typography variant="body1" paragraph>
              We use the information we collect to:
            </Typography>
            <Typography component="ul" variant="body1" sx={{ pl: 4 }}>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze trends and usage</li>
              <li>Detect, prevent, and address technical issues</li>
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              4. Information Sharing
            </Typography>
            <Typography variant="body1" paragraph>
              We do not sell your personal information. We may share your information only:
            </Typography>
            <Typography component="ul" variant="body1" sx={{ pl: 4 }}>
              <li>With service providers who assist us in operating our platform</li>
              <li>When required by law or to protect our rights</li>
              <li>In connection with a business transfer</li>
              <li>With your consent</li>
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              5. Data Security
            </Typography>
            <Typography variant="body1" paragraph>
              We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              6. Your Rights
            </Typography>
            <Typography variant="body1" paragraph>
              You have the right to:
            </Typography>
            <Typography component="ul" variant="body1" sx={{ pl: 4 }}>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your account</li>
              <li>Opt-out of certain communications</li>
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              7. Contact Us
            </Typography>
            <Typography variant="body1" paragraph>
              If you have questions about this Privacy Policy, please contact us at:
            </Typography>
            <Typography variant="body1">
              Email: <Link href="mailto:privacy@shreeom.com">privacy@shreeom.com</Link>
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Address: [Your Company Address]
            </Typography>
          </Box>
        </Paper>
      </Container>
    </AppLayout>
  );
};

export default PrivacyPolicyPage;






