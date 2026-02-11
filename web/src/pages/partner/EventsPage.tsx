/**
 * Events Page (Partner/Dealer Web)
 * 
 * View and manage events
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Chip, Card, CardContent, Grid } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { ProtectedRoute } from '../../components/guards/ProtectedRoute';
import { UserRole } from '../../types/auth.types';
import { useAuth } from '../../contexts/AuthContext';
import { webBusinessService } from '../../services/business/businessService';
import { Event } from '../../../../shared/types/business.types';
import { DataTable } from '../../components/table/DataTable';
import { logger } from '../../core/logger';

const EventsPage: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await webBusinessService.getEvents({ organizerId: user?.id });
      setEvents(data);
    } catch (error) {
      logger.error('Failed to load events', error as Error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Title',
    },
    {
      key: 'eventType',
      label: 'Type',
      render: (value: string) => <Chip label={value} size="small" />,
    },
    {
      key: 'startDate',
      label: 'Start Date',
      render: (value: Date) => new Date(value).toLocaleString(),
    },
    {
      key: 'location',
      label: 'Location',
    },
  ];

  return (
    <ProtectedRoute allowedRoles={[UserRole.PARTNER, UserRole.DEALER]}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Events</Typography>
          <Button variant="contained" startIcon={<AddOutlinedIcon />}>
            Create Event
          </Button>
        </Box>

        <DataTable data={events} columns={columns} loading={loading} />
      </Box>
    </ProtectedRoute>
  );
};

export default EventsPage;

