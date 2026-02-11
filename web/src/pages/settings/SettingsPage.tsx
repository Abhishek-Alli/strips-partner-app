import React from 'react';
import { Box, Typography, Paper, TextField, Button } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Profile Settings
        </Typography>
        <TextField
          fullWidth
          label="Name"
          defaultValue={user?.name}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Email"
          defaultValue={user?.email}
          margin="normal"
          disabled
        />
        <Button variant="contained" sx={{ mt: 2 }}>
          Save Changes
        </Button>
      </Paper>
    </Box>
  );
};

export default SettingsPage;








