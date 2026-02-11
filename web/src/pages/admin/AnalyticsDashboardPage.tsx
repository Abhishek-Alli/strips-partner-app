/**
 * Admin Analytics Dashboard
 *
 * ERP-grade analytics dashboard (FINAL)
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { ProtectedRoute } from '../../components/guards/ProtectedRoute';
import { UserRole } from '../../types/auth.types';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { StatCard } from '../../components/dashboard/StatCard';
import { InfoCard } from '../../components/dashboard/InfoCard';
import { LineChart } from '../../components/charts/LineChart';
import { BarChart } from '../../components/charts/BarChart';
import { SkeletonLoader } from '../../components/dashboard/SkeletonLoader';

import { webAnalyticsService } from '../../services/analyticsService';
import { AdminDashboardMetrics } from '@shared/core/analytics/analyticsTypes';

const AnalyticsDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | 'custom'>('30d');
  const [startDate, setStartDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d;
  });
  const [endDate, setEndDate] = useState<Date>(new Date());

  useEffect(() => {
    loadMetrics();
  }, [startDate, endDate]);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const data = await webAnalyticsService.getAdminDashboardMetrics(startDate, endDate);
      setMetrics(data);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (p: typeof period) => {
    setPeriod(p);
    if (p === 'custom') return;

    const days = p === '7d' ? 7 : p === '30d' ? 30 : 90;
    const today = new Date();
    const from = new Date();
    from.setDate(today.getDate() - days);
    setStartDate(from);
    setEndDate(today);
  };

  return (
    <ProtectedRoute
      allowedRoles={[UserRole.ADMIN]}
      requiredPermission={{ resource: 'analytics', action: 'view' }}
    >
      <AdminLayout title="Analytics Dashboard">

        {/* FILTER BAR */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Period</InputLabel>
            <Select
              value={period}
              label="Period"
              onChange={(e) => handlePeriodChange(e.target.value as any)}
            >
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
              <MenuItem value="90d">Last 90 Days</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </FormControl>

          {period === 'custom' && (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start"
                value={startDate}
                onChange={(v) => v && setStartDate(v)}
                slotProps={{ textField: { size: 'small' } }}
              />
              <DatePicker
                label="End"
                value={endDate}
                onChange={(v) => v && setEndDate(v)}
                slotProps={{ textField: { size: 'small' } }}
              />
            </LocalizationProvider>
          )}
        </Box>

        {/* KPI SECTION */}
        {loading || !metrics ? (
          <SkeletonLoader variant="table" count={4} />
        ) : (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Users"
                value={
                  metrics.totalUsers.general +
                  metrics.totalUsers.partner +
                  metrics.totalUsers.dealer
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Active Users (Monthly)"
                value={metrics.activeUsers.monthly}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Searches"
                value={metrics.searches.total}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Enquiries"
                value={metrics.enquiries.total}
              />
            </Grid>
          </Grid>
        )}

        {/* PAYMENT KPIs */}
        {metrics && (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <StatCard
                title="Revenue"
                value={`₹ ${metrics.payments.revenue.toLocaleString()}`}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard
                title="Payment Success Rate"
                value={`${metrics.payments.total
                  ? Math.round((metrics.payments.successful / metrics.payments.total) * 100)
                  : 0}%`}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard
                title="Total Payments"
                value={metrics.payments.total}
              />
            </Grid>
          </Grid>
        )}

        {/* CONVERSION FUNNEL */}
        {metrics && (
          <InfoCard title="Conversion Funnel">
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography variant="h6">{metrics.conversionFunnel.searches}</Typography>
                <Typography variant="caption">Searches</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="h6">{metrics.conversionFunnel.profileViews}</Typography>
                <Typography variant="caption">Profile Views</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="h6">{metrics.conversionFunnel.enquiries}</Typography>
                <Typography variant="caption">Enquiries</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="h6">{metrics.conversionFunnel.payments}</Typography>
                <Typography variant="caption">Payments</Typography>
              </Grid>
            </Grid>
          </InfoCard>
        )}

        {/* TIME SERIES */}
        {metrics && (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <InfoCard title="Active Users Over Time">
                <LineChart
                  data={metrics.timeSeries.users}
                  label="Users"
                />
              </InfoCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoCard title="Searches Over Time">
                <LineChart
                  data={metrics.timeSeries.searches}
                  label="Searches"
                />
              </InfoCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoCard title="Enquiries Over Time">
                <LineChart
                  data={metrics.timeSeries.enquiries}
                  label="Enquiries"
                />
              </InfoCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoCard title="Revenue Over Time">
                <LineChart
                  data={metrics.timeSeries.revenue}
                  label="Revenue"
                />
              </InfoCard>
            </Grid>
          </Grid>
        )}

        {/* USER DISTRIBUTION */}
        {metrics && (
          <InfoCard title="User Distribution by Role" sx={{ mt: 3 }}>
            <BarChart
              data={[
                { label: 'General', value: metrics.totalUsers.general },
                { label: 'Partners', value: metrics.totalUsers.partner },
                { label: 'Dealers', value: metrics.totalUsers.dealer },
                { label: 'Admins', value: metrics.totalUsers.admin }
              ]}
            />
          </InfoCard>
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default AnalyticsDashboardPage;
