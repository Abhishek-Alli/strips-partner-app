import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      // Small delay to ensure state is updated
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    } catch (err: any) {
      console.error('Login error:', err);
      console.error('Error details:', { 
        status: err.status, 
        code: err.code, 
        message: err.message,
        responseStatus: err.response?.status,
        responseData: err.response?.data
      });
      
      // Handle normalized API errors - check for ApiError structure
      let errorMessage = 'Login failed. Please try again.';
      
      // Check status code first (from error.response.status or err.status)
      const statusCode = err.status || err.response?.status;
      const errorCode = err.code || err.response?.data?.code;
      
      // Database connection error - check multiple indicators
      if (statusCode === 503 || errorCode === 'DATABASE_CONNECTION_ERROR' || errorCode === 'DATABASE_ERROR' || err.response?.status === 503) {
        // Database connection error - show detailed instructions
        errorMessage = 'Database connection failed. Please:\n' +
          '1. Check Supabase project status (may be paused)\n' +
          '   → Go to: https://supabase.com/dashboard\n' +
          '   → Find project: escmgtuixqydcofpguay\n' +
          '   → Click "Resume" if paused\n' +
          '2. Wait 1-2 minutes for project to resume\n' +
          '3. Restart backend: cd backend && npm start\n' +
          '4. Try login again';
      } else if (err.code === 'NETWORK_ERROR' || (!statusCode && !err.response)) {
        // Network error - backend not reachable (no response at all)
        errorMessage = 'Cannot connect to backend server. Please ensure:\n' +
          '1. Backend server is running (npm start in backend folder)\n' +
          '2. Server is accessible at http://localhost:3001\n' +
          '3. Check browser console for CORS errors';
      } else if (err.message && err.message !== 'Login failed. Please try again.') {
        // Use the error message from normalized error (includes backend's message field)
        errorMessage = err.message;
      } else if (err.response?.data?.message) {
        // Fallback to response message
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        // Fallback to response error
        errorMessage = err.response.data.error;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Admin Login
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;




