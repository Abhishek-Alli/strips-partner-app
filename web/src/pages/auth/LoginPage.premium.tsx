/**
 * Premium Login Page
 * 
 * Clean, confident authentication interface
 */

import React, { useState } from 'react';
import { Box, Typography, Link, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/core/Card';
import { PrimaryButton } from '../../components/core/PrimaryButton';
import { TextInput } from '../../components/core/TextInput';
import { theme } from '../../theme';
import { logger } from '../../core/logger';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
      logger.error('Login failed', err as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background.secondary,
        padding: theme.spacing[4],
      }}
    >
      <Box sx={{ width: '100%', maxWidth: '400px' }}>
        {/* Logo/Brand */}
        <Box sx={{ textAlign: 'center', mb: theme.spacing[8] }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: theme.typography.fontSize['2xl'],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.primary,
              letterSpacing: theme.typography.letterSpacing.tight,
              mb: theme.spacing[2],
            }}
          >
            Welcome back
          </Typography>
          <Typography
            sx={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary,
            }}
          >
            Sign in to your account
          </Typography>
        </Box>

        {/* Login Form */}
        <Card>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[4] }}>
              <TextInput
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                autoFocus
              />

              <TextInput
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                error={!!error}
                helperText={error}
              />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  mb: theme.spacing[2],
                }}
              >
                <Link
                  href="/forgot-password"
                  sx={{
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.primary[700],
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Forgot password?
                </Link>
              </Box>

              <PrimaryButton
                type="submit"
                fullWidth
                disabled={loading || !email || !password}
                size="lg"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </PrimaryButton>
            </Box>
          </form>

          <Divider sx={{ my: theme.spacing[6] }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography
              sx={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.secondary,
              }}
            >
              Don't have an account?{' '}
              <Link
                href="/signup"
                sx={{
                  color: theme.colors.primary[700],
                  textDecoration: 'none',
                  fontWeight: theme.typography.fontWeight.medium,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default LoginPage;






