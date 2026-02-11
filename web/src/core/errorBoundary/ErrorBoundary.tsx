/**
 * Global Error Boundary
 * 
 * Catches React component errors and displays user-friendly fallback UI
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { logger } from '../logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to logging service
    logger.error('React Error Boundary caught an error', error, {
      componentStack: errorInfo.componentStack,
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
          <Box
            sx={{
              textAlign: 'center',
              p: 4,
              border: '1px solid',
              borderColor: 'error.main',
              borderRadius: 2,
            }}
          >
            <Typography variant="h4" gutterBottom color="error">
              Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </Typography>
            {import.meta.env.MODE === 'development' && this.state.error && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: 'grey.100',
                  borderRadius: 1,
                  textAlign: 'left',
                }}
              >
                <Typography variant="caption" component="pre" sx={{ fontSize: '0.75rem' }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </Typography>
              </Box>
            )}
            <Button
              variant="contained"
              onClick={this.handleReset}
              sx={{ mt: 3 }}
            >
              Try Again
            </Button>
            <Button
              variant="outlined"
              onClick={() => window.location.reload()}
              sx={{ mt: 2, ml: 2 }}
            >
              Refresh Page
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}






