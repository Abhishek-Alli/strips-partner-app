/**
 * Admin Inquiries Page
 *
 * Shows inquiries with conversation view
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  ButtonGroup,
  TextField,
  IconButton,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SendIcon from '@mui/icons-material/Send';
import { AdminLayout } from '../../components/layout/AdminLayout';

interface Inquiry {
  id: string;
  name: string;
  category: string;
  email: string;
  phone: string;
  message: string;
  type: 'partner' | 'dealer';
}

interface Message {
  id: string;
  sender: string;
  content: string;
  isAdmin: boolean;
  timestamp: string;
}

const mockInquiries: Inquiry[] = Array.from({ length: 6 }, (_, i) => ({
  id: `${i + 1}`,
  name: 'Denial jhon',
  category: 'Architecture',
  email: 'example@gmail.com',
  phone: '9123456780',
  message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  type: i % 2 === 0 ? 'partner' : 'dealer',
}));

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'Denial jhon',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    isAdmin: false,
    timestamp: '2 mins ago',
  },
  {
    id: '2',
    sender: 'Admin',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    isAdmin: true,
    timestamp: '1 min ago',
  },
];

const InquiriesPage: React.FC = () => {
  const [filter, setFilter] = useState<'partner' | 'dealer'>('partner');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(mockInquiries[0]);
  const [replyText, setReplyText] = useState('');

  const filteredInquiries = mockInquiries.filter((inq) => inq.type === filter);

  return (
    <AdminLayout title="Inquiries">
      <Box sx={{ display: 'flex', gap: 3, height: 'calc(100vh - 140px)' }}>
        {/* Left Panel - Inquiry List */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Filter Buttons */}
          <ButtonGroup sx={{ mb: 3 }}>
            <Button
              variant={filter === 'partner' ? 'contained' : 'outlined'}
              onClick={() => setFilter('partner')}
              sx={{
                backgroundColor: filter === 'partner' ? '#FF6B35' : 'transparent',
                borderColor: '#FF6B35',
                color: filter === 'partner' ? '#fff' : '#FF6B35',
                '&:hover': {
                  backgroundColor: filter === 'partner' ? '#E85A2B' : 'rgba(255, 107, 53, 0.1)',
                  borderColor: '#FF6B35',
                },
              }}
            >
              Partner
            </Button>
            <Button
              variant={filter === 'dealer' ? 'contained' : 'outlined'}
              onClick={() => setFilter('dealer')}
              sx={{
                backgroundColor: filter === 'dealer' ? '#FF6B35' : 'transparent',
                borderColor: '#FF6B35',
                color: filter === 'dealer' ? '#fff' : '#FF6B35',
                '&:hover': {
                  backgroundColor: filter === 'dealer' ? '#E85A2B' : 'rgba(255, 107, 53, 0.1)',
                  borderColor: '#FF6B35',
                },
              }}
            >
              Dealer
            </Button>
          </ButtonGroup>

          {/* Inquiry List */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {filteredInquiries.map((inquiry) => (
              <Paper
                key={inquiry.id}
                elevation={0}
                onClick={() => setSelectedInquiry(inquiry)}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: '12px',
                  border: selectedInquiry?.id === inquiry.id ? '2px solid #FF6B35' : '1px solid #E5E7EB',
                  cursor: 'pointer',
                  '&:hover': { borderColor: '#FF6B35' },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {inquiry.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Category: {inquiry.category}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                      <EmailIcon sx={{ fontSize: 14, color: '#9CA3AF' }} />
                      <Typography variant="caption" color="text.secondary">
                        {inquiry.email}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PhoneIcon sx={{ fontSize: 14, color: '#9CA3AF' }} />
                      <Typography variant="caption" color="text.secondary">
                        {inquiry.phone}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mb: 1,
                  }}
                >
                  {inquiry.message}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    size="small"
                    sx={{ color: '#FF6B35', textTransform: 'none' }}
                  >
                    Message back
                  </Button>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>

        {/* Right Panel - Conversation */}
        {selectedInquiry && (
          <Paper
            elevation={0}
            sx={{
              width: 350,
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <Box sx={{ p: 2, borderBottom: '1px solid #E5E7EB' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {selectedInquiry.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Subject: example
              </Typography>
            </Box>

            {/* Messages */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              {mockMessages.map((msg) => (
                <Box
                  key={msg.id}
                  sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: '8px',
                    backgroundColor: msg.isAdmin ? '#F3F4F6' : 'transparent',
                    border: msg.isAdmin ? 'none' : '1px solid #E5E7EB',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {msg.sender}
                  </Typography>
                  {!msg.isAdmin && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      Subject: example
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {msg.content}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Reply Input */}
            <Box sx={{ p: 2, borderTop: '1px solid #E5E7EB' }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Message here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                sx={{ mb: 1 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton
                  sx={{
                    backgroundColor: '#FF6B35',
                    color: '#fff',
                    '&:hover': { backgroundColor: '#E85A2B' },
                  }}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        )}
      </Box>
    </AdminLayout>
  );
};

export default InquiriesPage;
