import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, Button, Alert } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { StatCard } from '../../components/dashboard/StatCard';
import { InfoCard } from '../../components/dashboard/InfoCard';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { SkeletonLoader } from '../../components/dashboard/SkeletonLoader';
import { dashboardService, PartnerDashboardStats } from '../../services/dashboardService';
import { ApiError } from '../../utils/apiError';

const PartnerDashboard: React.FC = () => {
  const [stats, setStats] = useState<PartnerDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getPartnerStats();
      setStats(data);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Partner Dashboard">
        <SkeletonLoader variant="statCard" count={4} />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Partner Dashboard">
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
        <Button onClick={loadDashboardData} variant="contained">
          Retry
        </Button>
      </DashboardLayout>
    );
  }

  if (!stats) {
    return null;
  }

  const topDealers = [
    { id: 1, name: 'Dealer A', performance: '98%', revenue: '₹2,34,567' },
    { id: 2, name: 'Dealer B', performance: '95%', revenue: '₹1,89,234' },
    { id: 3, name: 'Dealer C', performance: '92%', revenue: '₹1,56,789' }
  ];

  return (
    <DashboardLayout title="Partner Dashboard">
      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Assigned Dealers"
            value={stats.assignedDealers}
            subtitle="Active partnerships"
            icon={<PeopleIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={stats.totalRevenue}
            subtitle="All time"
            icon={<BusinessIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Monthly Growth"
            value={stats.monthlyGrowth}
            subtitle="vs last month"
            icon={<TrendingUpIcon />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Projects"
            value={stats.activeProjects}
            subtitle="In progress"
            icon={<AssessmentIcon />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Monthly Metrics & Top Dealers */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <InfoCard title="This Month's Performance">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1">Revenue</Typography>
                <Typography variant="h6" color="success.main">{stats.monthlyMetrics.revenue}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1">Transactions</Typography>
                <Typography variant="h6">{stats.monthlyMetrics.transactions}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1">New Dealers</Typography>
                <Typography variant="h6" color="primary">{stats.monthlyMetrics.newDealers}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1">Completed Projects</Typography>
                <Typography variant="h6" color="info.main">{stats.monthlyMetrics.completedProjects}</Typography>
              </Box>
            </Box>
          </InfoCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoCard title="Top Performing Dealers" action={<Button size="small">View All</Button>}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {topDealers.map((dealer) => (
                <Box key={dealer.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body1" fontWeight="medium">{dealer.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Performance: {dealer.performance}
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="success.main" fontWeight="medium">
                    {dealer.revenue}
                  </Typography>
                </Box>
              ))}
            </Box>
          </InfoCard>
        </Grid>
      </Grid>

      {/* Reports Preview */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <InfoCard title="Recent Reports" action={<Button size="small">View All Reports</Button>}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography variant="body2" color="text.secondary">
                Sales Report - November 2024
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dealer Performance Summary - Q4 2024
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Revenue Analysis - October 2024
              </Typography>
            </Box>
          </InfoCard>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default PartnerDashboard;

