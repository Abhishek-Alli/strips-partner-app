/**
 * Human-Friendly Error Message Component
 * 
 * Converts technical errors to friendly, actionable messages
 */

import React from 'react';
import { Typography, Box } from '@mui/material';
import { theme } from '../../theme';

interface HumanErrorMessageProps {
  error: Error | string | unknown;
  context?: string;
}

const errorMessages: Record<string, string> = {
  // Network errors
  'Network Error': "We're having trouble connecting. Please check your internet and try again.",
  'timeout': "This is taking longer than expected. Please try again.",
  'Failed to fetch': "We can't reach our servers. Please try again in a moment.",
  
  // Auth errors
  'Unauthorized': "Your session has expired. Please sign in again.",
  'Forbidden': "You don't have permission to perform this action.",
  'Invalid credentials': "Your email or password is incorrect. Please try again.",
  
  // Validation errors
  'Validation error': "Please check your information and try again.",
  'Required field': "Please fill in all required fields.",
  
  // Generic
  'Internal server error': "Something went wrong on our end. We're working on it. Please try again later.",
  'Not found': "We couldn't find what you're looking for.",
};

export const HumanErrorMessage: React.FC<HumanErrorMessageProps> = ({
  error,
  context,
}) => {
  const getMessage = (): string => {
    if (typeof error === 'string') {
      return errorMessages[error] || error;
    }

    if (error instanceof Error) {
      // Check for known error messages
      for (const [key, message] of Object.entries(errorMessages)) {
        if (error.message.includes(key)) {
          return message;
        }
      }

      // Check for HTTP status codes
      if (error.message.includes('401')) {
        return "Your session has expired. Please sign in again.";
      }
      if (error.message.includes('403')) {
        return "You don't have permission to perform this action.";
      }
      if (error.message.includes('404')) {
        return "We couldn't find what you're looking for.";
      }
      if (error.message.includes('500')) {
        return "We're having technical difficulties. Please try again in a moment.";
      }

      // Fallback to generic friendly message
      return "Something went wrong. Please try again.";
    }

    return "Something went wrong. Please try again.";
  };

  return (
    <Box
      sx={{
        padding: theme.spacing[4],
        backgroundColor: theme.colors.error[50],
        borderRadius: theme.radius.md,
        border: `1px solid ${theme.colors.error[500]}`,
      }}
    >
      <Typography
        sx={{
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.error[700],
          lineHeight: theme.typography.lineHeight.normal,
        }}
      >
        {getMessage()}
      </Typography>
      {context && (
        <Typography
          sx={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.tertiary,
            marginTop: theme.spacing[2],
          }}
        >
          {context}
        </Typography>
      )}
    </Box>
  );
};






