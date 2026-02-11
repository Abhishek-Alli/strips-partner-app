import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, Button, Chip, Alert } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { StatCard } from '../../components/dashboard/StatCard';
import { InfoCard } from '../../components/dashboard/InfoCard';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { SkeletonLoader } from '../../components/dashboard/SkeletonLoader';
import { dashboardService, DealerDashboardStats } from '../../services/dashboardService';
import { ApiError } from '../../utils/apiError';

const DealerDashboard: React.FC = () => {
  const [stats, setStats] = useState<DealerDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getDealerStats();
      setStats(data);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Dealer Dashboard">
        <SkeletonLoader variant="statCard" count={4} />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Dealer Dashboard">
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

  // Mock recent orders - replace with API call
  const recentOrders = [
    { id: '1', customer: 'Customer A', status: 'processing' as const, amount: '₹12,345', time: '2 hours ago' },
    { id: '2', customer: 'Customer B', status: 'completed' as const, amount: '₹8,901', time: '5 hours ago' },
    { id: '3', customer: 'Customer C', status: 'pending' as const, amount: '₹15,678', time: '1 day ago' },
    { id: '4', customer: 'Customer D', status: 'processing' as const, amount: '₹9,234', time: '1 day ago' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'info';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  return (
    <DashboardLayout title="Dealer Dashboard">
      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Assigned Customers"
            value={stats.assignedCustomers}
            subtitle="Active accounts"
            icon={<PeopleIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Orders"
            value={stats.activeOrders}
            subtitle="In progress"
            icon={<ShoppingCartIcon />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed Today"
            value={stats.completedToday}
            subtitle="Orders"
            icon={<CheckCircleIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Tasks"
            value={stats.pendingTasks}
            subtitle="Requires attention"
            icon={<ScheduleIcon />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Daily & Weekly Activity */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <InfoCard title="Today's Activity">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1">Orders Received</Typography>
                <Typography variant="h6" color="primary">{stats.dailyActivity.ordersReceived}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1">Orders Processed</Typography>
                <Typography variant="h6" color="success.main">{stats.dailyActivity.ordersProcessed}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1">Customers Served</Typography>
                <Typography variant="h6">{stats.dailyActivity.customersServed}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1">Revenue</Typography>
                <Typography variant="h6" color="success.main" fontWeight="bold">
                  {stats.dailyActivity.revenue}
                </Typography>
              </Box>
            </Box>
          </InfoCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoCard title="This Week's Summary">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1">Total Orders</Typography>
                <Typography variant="h6">{stats.weeklyActivity.totalOrders}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1">Completed</Typography>
                <Typography variant="h6" color="success.main">{stats.weeklyActivity.completedOrders}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1">Pending</Typography>
                <Typography variant="h6" color="warning.main">{stats.weeklyActivity.pendingOrders}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1">Weekly Revenue</Typography>
                <Typography variant="h6" color="success.main" fontWeight="bold">
                  {stats.weeklyActivity.revenue}
                </Typography>
              </Box>
            </Box>
          </InfoCard>
        </Grid>
      </Grid>

      {/* Recent Orders */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <InfoCard title="Recent Orders" action={<Button size="small">View All Orders</Button>}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {recentOrders.map((order) => (
                <Box
                  key={order.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    bgcolor: 'background.default',
                    borderRadius: 1
                  }}
                >
                  <Box>
                    <Typography variant="body1" fontWeight="medium">{order.customer}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {order.time}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body1" fontWeight="medium">
                      {order.amount}
                    </Typography>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status) as any}
                      size="small"
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </InfoCard>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default DealerDashboard;

