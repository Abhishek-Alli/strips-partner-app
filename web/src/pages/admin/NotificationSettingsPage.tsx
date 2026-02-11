/**
 * Admin Notification Settings Page
 * 
 * Configure notification channels and event preferences
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  Button,
  Grid,
  FormGroup,
  Alert,
  Divider,
  Snackbar
} from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { ProtectedRoute } from '../../components/guards/ProtectedRoute';
import { UserRole } from '../../types/auth.types';
import { adminNotificationService } from '../../services/admin/notificationService';
import { NotificationEvent, NotificationChannel } from '../../types/notification.types';
import { logger } from '../../core/logger';

const NotificationSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: ''
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await adminNotificationService.getSettings();
      setSettings(data);
    } catch (error) {
      logger.error('Failed to load notification settings', error as Error);
      setErrorSnackbar({ open: true, message: 'Failed to load notification settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      await adminNotificationService.updateSettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      logger.error('Failed to save notification settings', error as Error);
      setErrorSnackbar({ open: true, message: 'Failed to save notification settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleChannelToggle = (channel: 'emailEnabled' | 'smsEnabled' | 'pushEnabled' | 'inAppEnabled') => {
    setSettings((prev: any) => ({
      ...prev,
      [channel]: !prev[channel]
    }));
  };

  const handleEventToggle = (event: NotificationEvent, channel: NotificationChannel) => {
    setSettings((prev: any) => ({
      ...prev,
      events: {
        ...prev.events,
        [event]: {
          ...prev.events[event],
          [channel]: !prev.events[event]?.[channel]
        }
      }
    }));
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={[UserRole.ADMIN]} requiredPermission={{ resource: 'content', action: 'manage' }}>
        <Box sx={{ p: 3 }}>Loading...</Box>
      </ProtectedRoute>
    );
  }

  if (!settings) {
    return (
      <ProtectedRoute allowedRoles={[UserRole.ADMIN]} requiredPermission={{ resource: 'content', action: 'manage' }}>
        <Box sx={{ p: 3 }}>Failed to load settings</Box>
      </ProtectedRoute>
    );
  }

  const events: NotificationEvent[] = Object.values(NotificationEvent);

  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]} requiredPermission={{ resource: 'content', action: 'manage' }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Notification Settings
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Configure notification channels and event preferences
        </Typography>

        {saveSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Settings saved successfully
          </Alert>
        )}

        {/* Channel Toggles */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Notification Channels
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.emailEnabled}
                    onChange={() => handleChannelToggle('emailEnabled')}
                  />
                }
                label="Email Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.smsEnabled}
                    onChange={() => handleChannelToggle('smsEnabled')}
                  />
                }
                label="SMS Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.pushEnabled}
                    onChange={() => handleChannelToggle('pushEnabled')}
                  />
                }
                label="Push Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.inAppEnabled}
                    onChange={() => handleChannelToggle('inAppEnabled')}
                  />
                }
                label="In-App Notifications"
              />
            </FormGroup>
          </CardContent>
        </Card>

        {/* Event Preferences */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Event Preferences
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Configure which channels to use for each notification event
            </Typography>

            {events.map((event) => (
              <Box key={event} sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, textTransform: 'capitalize' }}>
                  {event.replace(/_/g, ' ')}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.events[event]?.email ?? false}
                          onChange={() => handleEventToggle(event, NotificationChannel.EMAIL)}
                          disabled={!settings.emailEnabled}
                          size="small"
                        />
                      }
                      label="Email"
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.events[event]?.sms ?? false}
                          onChange={() => handleEventToggle(event, NotificationChannel.SMS)}
                          disabled={!settings.smsEnabled}
                          size="small"
                        />
                      }
                      label="SMS"
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.events[event]?.push ?? false}
                          onChange={() => handleEventToggle(event, NotificationChannel.PUSH)}
                          disabled={!settings.pushEnabled}
                          size="small"
                        />
                      }
                      label="Push"
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.events[event]?.inApp ?? false}
                          onChange={() => handleEventToggle(event, NotificationChannel.IN_APP)}
                          disabled={!settings.inAppEnabled}
                          size="small"
                        />
                      }
                      label="In-App"
                    />
                  </Grid>
                </Grid>
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))}
          </CardContent>
        </Card>

        <Button
          variant="contained"
          startIcon={<SaveOutlinedIcon />}
          onClick={handleSave}
          disabled={saving}
        >
          Save Settings
        </Button>
      </Box>
      
      <Snackbar
        open={errorSnackbar.open}
        autoHideDuration={6000}
        onClose={() => setErrorSnackbar({ ...errorSnackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setErrorSnackbar({ ...errorSnackbar, open: false })} severity="error" sx={{ width: '100%' }}>
          {errorSnackbar.message}
        </Alert>
      </Snackbar>
    </ProtectedRoute>
  );
};

export default NotificationSettingsPage;

