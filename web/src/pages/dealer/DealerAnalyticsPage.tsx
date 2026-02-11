/**
 * Dealer Analytics Page
 * 
 * Self-service analytics dashboard for dealers
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from '@mui/material';
import { ProtectedRoute } from '../../components/guards/ProtectedRoute';
import { UserRole } from '../../types/auth.types';
import { useAuth } from '../../contexts/AuthContext';
import { webAnalyticsService } from '../../services/analyticsService';
import { DealerAnalytics } from '@shared/core/analytics/analyticsTypes';
import { KPICard } from '../../components/charts/KPICard';
import { logger } from '../../core/logger';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

const DealerAnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<DealerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  });
  const [endDate, setEndDate] = useState<Date>(new Date());

  useEffect(() => {
    if (user?.id) {
      loadAnalytics();
    }
  }, [user?.id, startDate, endDate]);

  const loadAnalytics = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await webAnalyticsService.getDealerAnalytics(user.id, startDate, endDate);
      setAnalytics(data);
    } catch (error) {
      logger.error('Failed to load dealer analytics', error as Error);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (newPeriod: '7d' | '30d' | '90d') => {
    setPeriod(newPeriod);
    const today = new Date();
    let days = 30;
    if (newPeriod === '7d') days = 7;
    else if (newPeriod === '30d') days = 30;
    else if (newPeriod === '90d') days = 90;

    const newStartDate = new Date(today);
    newStartDate.setDate(today.getDate() - days);
    setStartDate(newStartDate);
    setEndDate(today);
  };

  if (loading || !analytics) {
    return (
      <ProtectedRoute allowedRoles={[UserRole.DEALER]}>
        <Box sx={{ p: 3 }}>
          <Typography>Loading analytics...</Typography>
        </Box>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={[UserRole.DEALER]}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            My Analytics
          </Typography>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Period</InputLabel>
            <Select
              value={period}
              label="Period"
              onChange={(e) => handlePeriodChange(e.target.value as any)}
            >
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
              <MenuItem value="90d">Last 90 Days</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* KPI Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Profile Views"
              value={analytics.profileViews}
              subtitle={`${analytics.mapClicks} from map`}
              icon={<VisibilityOutlinedIcon sx={{ fontSize: 40 }} />}
              color="#1976d2"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Map Clicks"
              value={analytics.mapClicks}
              subtitle={`${Math.round((analytics.mapClicks / analytics.profileViews) * 100)}% of views`}
              icon={<MapOutlinedIcon sx={{ fontSize: 40 }} />}
              color="#2e7d32"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Enquiries Received"
              value={analytics.enquiriesReceived}
              subtitle={`${analytics.enquiriesResponded} responded`}
              icon={<EmailOutlinedIcon sx={{ fontSize: 40 }} />}
              color="#ed6c02"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Response Rate"
              value={`${analytics.responseRate.toFixed(1)}%`}
              subtitle={`Avg response: ${analytics.averageResponseTime.toFixed(1)}h`}
              icon={<EmailOutlinedIcon sx={{ fontSize: 40 }} />}
              color="#9c27b0"
            />
          </Grid>
        </Grid>

        {/* Performance Summary */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Performance Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Enquiry Response Rate
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {analytics.responseRate.toFixed(1)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {analytics.enquiriesResponded} of {analytics.enquiriesReceived} enquiries responded
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Average Response Time
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {analytics.averageResponseTime.toFixed(1)} hours
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Time to respond to enquiries
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Average Distance
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {analytics.averageDistance.toFixed(1)} km
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Distance from users who viewed profile
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Feedback Summary */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Feedback Summary
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {analytics.feedbackRating.toFixed(1)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Rating
                </Typography>
              </Box>
              <Box>
                <Typography variant="h5">
                  {analytics.feedbackCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Reviews
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </ProtectedRoute>
  );
};

export default DealerAnalyticsPage;

