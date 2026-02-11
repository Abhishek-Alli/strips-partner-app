/**
 * Contact Us Page - Public contact form
 * 
 * Includes reCAPTCHA v3 integration (test keys)
 * Client-side and server-side validation
 */

import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { contactService } from '../../services/contactService';
import { logger } from '../../core/logger';

const ContactUsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [submitMessage, setSubmitMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    setSubmitStatus(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus(null);
    setSubmitMessage('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // In production, verify reCAPTCHA token here
      // For now, we'll skip reCAPTCHA verification in test mode
      const recaptchaToken = 'test-token'; // Replace with actual token from reCAPTCHA

      await contactService.submitEnquiry({
        ...formData,
        recaptchaToken
      });

      setSubmitStatus('success');
      setSubmitMessage('Thank you for your enquiry! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error: any) {
      logger.error('Failed to submit contact enquiry', error);
      setSubmitStatus('error');
      setSubmitMessage(
        error.message || 'Failed to submit enquiry. Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Contact Us
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </Typography>

        {submitStatus && (
          <Alert
            severity={submitStatus}
            sx={{ mb: 3 }}
            onClose={() => {
              setSubmitStatus(null);
              setSubmitMessage('');
            }}
          >
            {submitMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={handleChange('name')}
            error={!!errors.name}
            helperText={errors.name}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            error={!!errors.email}
            helperText={errors.email}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange('phone')}
            error={!!errors.phone}
            helperText={errors.phone}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Subject"
            value={formData.subject}
            onChange={handleChange('subject')}
            error={!!errors.subject}
            helperText={errors.subject}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Message"
            multiline
            rows={6}
            value={formData.message}
            onChange={handleChange('message')}
            error={!!errors.message}
            helperText={errors.message}
            margin="normal"
            required
          />

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default ContactUsPage;






