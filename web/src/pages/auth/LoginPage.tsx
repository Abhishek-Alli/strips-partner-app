import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    } catch (err: any) {
      console.error('Login error:', err);

      let errorMessage = 'Login failed. Please try again.';
      const statusCode = err.status || err.response?.status;
      const errorCode = err.code || err.response?.data?.code;

      if (statusCode === 503 || errorCode === 'DATABASE_CONNECTION_ERROR' || errorCode === 'DATABASE_ERROR') {
        errorMessage = 'Database connection failed. Please check Supabase project status and restart the backend.';
      } else if (err.code === 'NETWORK_ERROR' || (!statusCode && !err.response)) {
        errorMessage = 'Cannot connect to server. Please ensure the backend is running.';
      } else if (err.message && err.message !== 'Login failed. Please try again.') {
        errorMessage = err.message;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left Panel - Branding */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '45%',
          background: 'linear-gradient(145deg, #1e2538 0%, #2D3142 60%, #3a4060 100%)',
          color: '#fff',
          p: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decoration */}
        <Box
          sx={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(255, 107, 53, 0.08)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -60,
            left: -60,
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: 'rgba(255, 107, 53, 0.06)',
          }}
        />

        {/* Logo & Brand */}
        <Box sx={{ textAlign: 'center', zIndex: 1 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #FF6B35, #e85a2b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              boxShadow: '0 8px 32px rgba(255, 107, 53, 0.35)',
            }}
          >
            <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
              SRJ
            </Typography>
          </Box>

          <Typography
            variant="h4"
            sx={{ fontWeight: 700, mb: 1, letterSpacing: '0.5px' }}
          >
            SRJ Strips & Pipes
          </Typography>
          <Typography
            sx={{ opacity: 0.65, fontSize: '0.95rem', mb: 6, letterSpacing: '0.3px' }}
          >
            Admin Management Portal
          </Typography>

          {/* Feature bullets */}
          {[
            'Manage dealers, partners & users',
            'Track products & market updates',
            'Analytics & reporting dashboard',
          ].map((text, i) => (
            <Box
              key={i}
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, opacity: 0.85 }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#FF6B35',
                  flexShrink: 0,
                }}
              />
              <Typography sx={{ fontSize: '0.9rem' }}>{text}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right Panel - Login Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F8F9FC',
          p: { xs: 3, sm: 6 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420 }}>
          {/* Mobile brand header */}
          <Box sx={{ display: { xs: 'block', md: 'none' }, textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #FF6B35, #e85a2b)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 1.5,
              }}
            >
              <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                SRJ
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1F2937' }}>
              SRJ Strips & Pipes
            </Typography>
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', mb: 0.5 }}>
            Welcome back
          </Typography>
          <Typography sx={{ color: '#6B7280', mb: 4, fontSize: '0.95rem' }}>
            Sign in to the admin portal
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: '10px',
                fontSize: '0.875rem',
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ color: '#9CA3AF', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fff',
                    borderRadius: '10px',
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF6B35',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#FF6B35',
                  },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: '#9CA3AF', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                        sx={{ color: '#9CA3AF' }}
                      >
                        {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fff',
                    borderRadius: '10px',
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF6B35',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#FF6B35',
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  mt: 1,
                  py: 1.5,
                  backgroundColor: '#FF6B35',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 4px 16px rgba(255, 107, 53, 0.35)',
                  '&:hover': {
                    backgroundColor: '#E85A2B',
                    boxShadow: '0 6px 20px rgba(255, 107, 53, 0.45)',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: '#FCA58A',
                    color: '#fff',
                  },
                }}
              >
                {isLoading ? (
                  <CircularProgress size={22} sx={{ color: '#fff' }} />
                ) : (
                  'Sign In'
                )}
              </Button>
            </Box>
          </form>

          <Typography
            sx={{ mt: 4, textAlign: 'center', fontSize: '0.8rem', color: '#9CA3AF' }}
          >
            SRJ Strips & Pipes © {new Date().getFullYear()}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
