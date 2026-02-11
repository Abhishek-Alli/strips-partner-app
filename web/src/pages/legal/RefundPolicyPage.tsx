/**
 * Refund and Cancellation Policy Page
 * 
 * Legal compliance page for refund policy
 */

import React from 'react';
import { Box, Typography, Container, Paper, Link } from '@mui/material';
import { AppLayout } from '../../components/layout/AppLayout';

const RefundPolicyPage: React.FC = () => {
  return (
    <AppLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Refund and Cancellation Policy
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Last Updated: {new Date().toLocaleDateString()}
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              1. General Policy
            </Typography>
            <Typography variant="body1" paragraph>
              All payments made through Shree Om are processed securely. This policy outlines the circumstances under which refunds may be issued.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              2. Eligible Services
            </Typography>
            <Typography variant="body1" paragraph>
              Refunds may be available for the following services:
            </Typography>
            <Typography component="ul" variant="body1" sx={{ pl: 4 }}>
              <li>Budget Estimation Reports</li>
              <li>Premium Calculator Access</li>
              <li>Visualization Services</li>
              <li>Featured Listings</li>
              <li>Subscription Plans</li>
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              3. Refund Eligibility
            </Typography>
            <Typography variant="body1" paragraph>
              Refunds may be issued in the following circumstances:
            </Typography>
            <Typography component="ul" variant="body1" sx={{ pl: 4 }}>
              <li>Service not delivered as described</li>
              <li>Technical failure preventing service access</li>
              <li>Duplicate payment</li>
              <li>Unauthorized transaction</li>
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              4. Non-Refundable Services
            </Typography>
            <Typography variant="body1" paragraph>
              The following are generally non-refundable:
            </Typography>
            <Typography component="ul" variant="body1" sx={{ pl: 4 }}>
              <li>Services already consumed or accessed</li>
              <li>Featured listings already displayed</li>
              <li>Subscription fees for periods already elapsed</li>
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              5. Refund Process
            </Typography>
            <Typography variant="body1" paragraph>
              To request a refund:
            </Typography>
            <Typography component="ol" variant="body1" sx={{ pl: 4 }}>
              <li>Contact us at <Link href="mailto:support@shreeom.com">support@shreeom.com</Link> within 7 days of purchase</li>
              <li>Provide your payment transaction ID and reason for refund</li>
              <li>We will review your request within 5-7 business days</li>
              <li>If approved, refunds will be processed to the original payment method within 10-14 business days</li>
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              6. Cancellation Policy
            </Typography>
            <Typography variant="body1" paragraph>
              Subscriptions can be cancelled at any time through your account settings. Cancellation will take effect at the end of the current billing period. No refunds will be issued for the current period.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              7. Disputes
            </Typography>
            <Typography variant="body1" paragraph>
              If you are not satisfied with a refund decision, you may contact us to escalate your case. We are committed to fair resolution of all disputes.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              8. Contact Us
            </Typography>
            <Typography variant="body1" paragraph>
              For refund requests or questions:
            </Typography>
            <Typography variant="body1">
              Email: <Link href="mailto:support@shreeom.com">support@shreeom.com</Link>
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Phone: [Support Phone Number]
            </Typography>
          </Box>
        </Paper>
      </Container>
    </AppLayout>
  );
};

export default RefundPolicyPage;






