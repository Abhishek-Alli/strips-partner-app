/**
 * Admin CMS Page
 *
 * Content Management System with editable sections
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Avatar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AdminLayout } from '../../components/layout/AdminLayout';

interface CMSSection {
  id: string;
  header: string;
  content: string;
  hasImage: boolean;
}

interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

const mockSections: { [key: string]: CMSSection[] } = {
  aboutUs: [
    { id: '1', header: 'Main Header: type here...', content: 'Contene here...', hasImage: true },
  ],
  howItWorks: [
    { id: '1', header: 'Main Header: type here...', content: 'Contene here...', hasImage: true },
    { id: '2', header: 'Main Header: type here...', content: 'Contene here...', hasImage: true },
    { id: '3', header: 'Main Header: type here...', content: 'Contene here...', hasImage: true },
  ],
  help: [
    { id: '1', header: 'Main Header: type here...', content: 'Contene here...', hasImage: true },
  ],
};

const mockMessages: ContactMessage[] = Array.from({ length: 5 }, (_, i) => ({
  id: `${i + 1}`,
  name: 'Alok Das',
  phone: '9123456780',
  email: 'example@gmail.com',
  subject: 'Lorem ipsum dolor sit amet, consectetur',
  message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
}));

const CMSPage: React.FC = () => {
  const [sections] = useState(mockSections);

  const ImageUploadBox = () => (
    <Box
      sx={{
        width: '100%',
        height: 100,
        border: '2px dashed #E5E7EB',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        '&:hover': { borderColor: '#FF6B35' },
      }}
    >
      <AddIcon sx={{ fontSize: 32, color: '#9CA3AF' }} />
      <Typography variant="caption" color="text.secondary">
        add image
      </Typography>
    </Box>
  );

  const SectionCard = ({ section }: { section: CMSSection }) => (
    <Box sx={{ mb: 2 }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Main Header: type here..."
        value={section.header}
        sx={{ mb: 1 }}
      />
      <TextField
        fullWidth
        size="small"
        placeholder="Contene here..."
        value={section.content}
        sx={{ mb: 1 }}
      />
      <ImageUploadBox />
    </Box>
  );

  return (
    <AdminLayout title="CMS">
      <Grid container spacing={3}>
        {/* Left Side - CMS Sections */}
        <Grid item xs={12} md={7}>
          {/* About Us Section */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            About us
          </Typography>
          {sections.aboutUs.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}

          {/* How it Works Section */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, mt: 4 }}>
            How it Works
          </Typography>
          <Grid container spacing={2}>
            {sections.howItWorks.map((section) => (
              <Grid item xs={12} sm={4} key={section.id}>
                <SectionCard section={section} />
              </Grid>
            ))}
          </Grid>

          {/* Help Section */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, mt: 4 }}>
            Help
          </Typography>
          {sections.help.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
        </Grid>

        {/* Right Side - Contact Us Messages */}
        <Grid item xs={12} md={5}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Contact Us messages
          </Typography>
          <Box sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
            {mockMessages.map((msg) => (
              <Paper
                key={msg.id}
                elevation={0}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                }}
              >
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Avatar sx={{ width: 40, height: 40, backgroundColor: '#E5E7EB' }}>
                    {msg.name.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {msg.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {msg.phone}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {msg.email}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      Subject: {msg.subject}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {msg.message}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default CMSPage;
