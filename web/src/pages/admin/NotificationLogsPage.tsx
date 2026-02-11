/**
 * Admin Notification Logs Page
 * 
 * View and filter notification logs
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Chip
} from '@mui/material';
import { ProtectedRoute } from '../../components/guards/ProtectedRoute';
import { UserRole } from '../../types/auth.types';
import { adminNotificationService } from '../../services/admin/notificationService';
import { NotificationEvent, NotificationChannel, NotificationLog } from '../../types/notification.types';
import { DataTable } from '../../components/table/DataTable';
import { logger } from '../../core/logger';

const NotificationLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<{
    event?: NotificationEvent;
    channel?: NotificationChannel;
    status?: 'pending' | 'sent' | 'failed' | 'delivered';
    userId?: string;
    limit: number;
    offset: number;
  }>({
    limit: 50,
    offset: 0
  });

  useEffect(() => {
    loadLogs();
  }, [filters]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const response = await adminNotificationService.getLogs(filters);
      setLogs(response.logs);
      setTotal(response.total);
    } catch (error) {
      logger.error('Failed to load notification logs', error as Error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'event',
      label: 'Event',
      render: (value: NotificationEvent) => (
        <Chip label={value.replace(/_/g, ' ')} size="small" />
      )
    },
    {
      key: 'channel',
      label: 'Channel',
      render: (value: NotificationChannel) => (
        <Chip label={value.toUpperCase()} size="small" color="primary" variant="outlined" />
      )
    },
    {
      key: 'recipient',
      label: 'Recipient',
      render: (value: NotificationLog['recipient']) => (
        <Box>
          {value.email && <Typography variant="body2">{value.email}</Typography>}
          {value.phone && <Typography variant="body2">{value.phone}</Typography>}
          {value.userId && (
            <Typography variant="caption" sx={{ fontFamily: 'monospace', fontSize: '0.7rem', display: 'block' }}>
              User: {value.userId.substring(0, 8)}...
            </Typography>
          )}
          {value.role && (
            <Typography variant="caption" sx={{ textTransform: 'capitalize', display: 'block' }}>
              Role: {value.role}
            </Typography>
          )}
        </Box>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const color = value === 'sent' ? 'success' : value === 'failed' ? 'error' : value === 'pending' ? 'warning' : 'default';
        return <Chip label={value} size="small" color={color as any} />;
      }
    },
    {
      key: 'createdAt',
      label: 'Created At',
      render: (value: Date) => new Date(value).toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    {
      key: 'sentAt',
      label: 'Sent At',
      render: (_: any, row: NotificationLog) => row.sentAt ? new Date(row.sentAt).toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : '-'
    },
    {
      key: 'error',
      label: 'Error',
      render: (value?: string) => value ? (
        <Typography variant="body2" color="error" sx={{ fontSize: '0.75rem' }}>{value}</Typography>
      ) : null
    }
  ];

  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]} requiredPermission={{ resource: 'content', action: 'manage' }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Notification Logs
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          View and filter notification delivery logs
        </Typography>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Event</InputLabel>
                <Select
                  value={filters.event || ''}
                  label="Event"
                  onChange={(e) => setFilters({ ...filters, event: e.target.value as NotificationEvent || undefined })}
                >
                  <MenuItem value="">All Events</MenuItem>
                  {Object.values(NotificationEvent).map((event) => (
                    <MenuItem key={event} value={event}>
                      {event.replace(/_/g, ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Channel</InputLabel>
                <Select
                  value={filters.channel || ''}
                  label="Channel"
                  onChange={(e) => setFilters({ ...filters, channel: (e.target.value || undefined) as NotificationChannel })}
                >
                  <MenuItem value="">All Channels</MenuItem>
                  {Object.values(NotificationChannel).map((channel) => (
                    <MenuItem key={channel} value={channel}>
                      {channel.toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || ''}
                  label="Status"
                  onChange={(e) => setFilters({ ...filters, status: (e.target.value || undefined) as any })}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="sent">Sent</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                </Select>
              </FormControl>

              <TextField
                size="small"
                label="User ID"
                value={filters.userId || ''}
                onChange={(e) => setFilters({ ...filters, userId: e.target.value || undefined })}
                sx={{ minWidth: 200 }}
              />

              <Button variant="outlined" onClick={() => setFilters({
                limit: 50,
                offset: 0
              })}>
                Clear Filters
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <DataTable
          data={logs}
          columns={columns}
          loading={loading}
          pagination={{
            total,
            page: Math.floor(filters.offset / filters.limit),
            pageSize: filters.limit,
            onPageChange: (page) => setFilters({ ...filters, offset: page * filters.limit }),
            onPageSizeChange: (pageSize) => setFilters({ ...filters, limit: pageSize, offset: 0 })
          }}
        />
      </Box>
    </ProtectedRoute>
  );
};

export default NotificationLogsPage;

