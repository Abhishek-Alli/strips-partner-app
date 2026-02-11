/**
 * Admin Feedback Page
 *
 * Shows feedback list with report and delete options
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Avatar,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { AdminLayout } from '../../components/layout/AdminLayout';

interface Feedback {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  reportedBy?: string;
}

const mockFeedbacks: Feedback[] = Array.from({ length: 6 }, (_, i) => ({
  id: `${i + 1}`,
  name: 'Alok Das',
  email: 'example@gmail.com',
  phone: '9123456780',
  message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
}));

const FeedbackPage: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState(mockFeedbacks);

  const handleDelete = (id: string) => {
    setFeedbacks(feedbacks.filter((f) => f.id !== id));
  };

  return (
    <AdminLayout title="Feedback">
      <Box>
        {feedbacks.map((feedback) => (
          <Paper
            key={feedback.id}
            elevation={0}
            sx={{
              p: 3,
              mb: 2,
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                <Avatar sx={{ width: 48, height: 48, backgroundColor: '#E5E7EB' }}>
                  {feedback.name.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {feedback.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <EmailIcon sx={{ fontSize: 14, color: '#9CA3AF' }} />
                      <Typography variant="caption" color="text.secondary">
                        {feedback.email}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PhoneIcon sx={{ fontSize: 14, color: '#9CA3AF' }} />
                      <Typography variant="caption" color="text.secondary">
                        {feedback.phone}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {feedback.message}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                <Button
                  size="small"
                  sx={{ color: '#FF6B35', textTransform: 'none', whiteSpace: 'nowrap' }}
                >
                  Report feedback by: Partner or Dealer name
                </Button>
                <Button
                  size="small"
                  onClick={() => handleDelete(feedback.id)}
                  sx={{ color: '#EF4444', textTransform: 'none' }}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
    </AdminLayout>
  );
};

export default FeedbackPage;
