/**
 * Admin Analytics Dashboard
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  Alert,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StoreIcon from '@mui/icons-material/Store';
import HandshakeIcon from '@mui/icons-material/Handshake';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { webAnalyticsService } from '../../services/analyticsService';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, color, loading }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: '14px',
      border: '1px solid #E5E7EB',
      display: 'flex',
      alignItems: 'center',
      gap: 2.5,
    }}
  >
    <Box
      sx={{
        width: 52,
        height: 52,
        borderRadius: '12px',
        backgroundColor: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {React.cloneElement(icon as React.ReactElement, { sx: { color, fontSize: 26 } })}
    </Box>
    <Box>
      <Typography sx={{ fontSize: '0.78rem', color: '#9CA3AF', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {title}
      </Typography>
      {loading ? (
        <Skeleton width={80} height={32} />
      ) : (
        <Typography sx={{ fontSize: '1.6rem', fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>
          {value}
        </Typography>
      )}
    </Box>
  </Paper>
);

const AnalyticsDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadMetrics();
  }, [period]);

  const loadMetrics = async () => {
    setLoading(true);
    setError('');
    try {
      const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);
      const data = await webAnalyticsService.getAdminDashboardMetrics(startDate, endDate);
      setMetrics(data);
    } catch (err) {
      setError('Could not load analytics data. Please ensure the backend is running.');
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  };

  const v = (path: string, fallback: any = 0) => {
    if (!metrics) return fallback;
    const parts = path.split('.');
    let val: any = metrics;
    for (const p of parts) {
      val = val?.[p];
      if (val === undefined || val === null) return fallback;
    }
    return val;
  };

  const totalUsers = v('totalUsers.general', 0) + v('totalUsers.partner', 0) + v('totalUsers.dealer', 0);
  const successRate = v('payments.total', 0)
    ? Math.round((v('payments.successful', 0) / v('payments.total', 1)) * 100)
    : 0;

  return (
    <AdminLayout title="Analytics Dashboard">
      {/* Period Filter */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Period</InputLabel>
          <Select
            value={period}
            label="Period"
            onChange={(e) => setPeriod(e.target.value as any)}
            sx={{ borderRadius: '10px', backgroundColor: '#fff' }}
          >
            <MenuItem value="7d">Last 7 Days</MenuItem>
            <MenuItem value="30d">Last 30 Days</MenuItem>
            <MenuItem value="90d">Last 90 Days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: '10px' }}>
          {error} Showing placeholder data.
        </Alert>
      )}

      {/* KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard title="Total Users" value={loading ? '—' : totalUsers} icon={<PeopleIcon />} color="#2D3142" loading={loading} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard title="Active Users" value={loading ? '—' : v('activeUsers.monthly', 0)} icon={<CheckCircleIcon />} color="#16a34a" loading={loading} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard title="Total Searches" value={loading ? '—' : v('searches.total', 0)} icon={<SearchIcon />} color="#0284c7" loading={loading} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard title="Total Enquiries" value={loading ? '—' : v('enquiries.total', 0)} icon={<ContactMailIcon />} color="#FF6B35" loading={loading} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard title="Revenue" value={loading ? '—' : `₹${v('payments.revenue', 0).toLocaleString()}`} icon={<CurrencyRupeeIcon />} color="#7c3aed" loading={loading} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard title="Payment Success" value={loading ? '—' : `${successRate}%`} icon={<TrendingUpIcon />} color="#d97706" loading={loading} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard title="Partners" value={loading ? '—' : v('totalUsers.partner', 0)} icon={<HandshakeIcon />} color="#0891b2" loading={loading} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard title="Dealers" value={loading ? '—' : v('totalUsers.dealer', 0)} icon={<StoreIcon />} color="#059669" loading={loading} />
        </Grid>
      </Grid>

      {/* User Distribution */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '14px', border: '1px solid #E5E7EB' }}>
            <Typography sx={{ fontWeight: 700, color: '#111827', mb: 2.5 }}>User Distribution</Typography>
            {[
              { label: 'General Users', value: v('totalUsers.general', 0), color: '#2D3142' },
              { label: 'Partners', value: v('totalUsers.partner', 0), color: '#FF6B35' },
              { label: 'Dealers', value: v('totalUsers.dealer', 0), color: '#059669' },
              { label: 'Admins', value: v('totalUsers.admin', 0), color: '#7c3aed' },
            ].map((item) => {
              const max = Math.max(totalUsers, 1);
              const pct = Math.round((item.value / max) * 100);
              return (
                <Box key={item.label} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ fontSize: '0.85rem', color: '#374151', fontWeight: 500 }}>{item.label}</Typography>
                    <Typography sx={{ fontSize: '0.85rem', color: '#6B7280' }}>
                      {loading ? '—' : item.value}
                    </Typography>
                  </Box>
                  <Box sx={{ height: 8, borderRadius: '4px', backgroundColor: '#F3F4F6', overflow: 'hidden' }}>
                    {!loading && (
                      <Box sx={{ width: `${pct}%`, height: '100%', backgroundColor: item.color, borderRadius: '4px', transition: 'width 0.5s ease' }} />
                    )}
                  </Box>
                </Box>
              );
            })}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '14px', border: '1px solid #E5E7EB' }}>
            <Typography sx={{ fontWeight: 700, color: '#111827', mb: 2.5 }}>Conversion Funnel</Typography>
            {[
              { label: 'Searches', value: v('conversionFunnel.searches', v('searches.total', 0)), color: '#0284c7' },
              { label: 'Profile Views', value: v('conversionFunnel.profileViews', 0), color: '#7c3aed' },
              { label: 'Enquiries', value: v('conversionFunnel.enquiries', v('enquiries.total', 0)), color: '#FF6B35' },
              { label: 'Payments', value: v('conversionFunnel.payments', v('payments.total', 0)), color: '#16a34a' },
            ].map((item, idx, arr) => {
              const max = Math.max(arr[0].value, 1);
              const pct = Math.round((item.value / max) * 100);
              return (
                <Box key={item.label} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography sx={{ fontSize: '0.85rem', color: '#374151', fontWeight: 500 }}>{item.label}</Typography>
                    <Typography sx={{ fontSize: '0.85rem', color: '#6B7280' }}>
                      {loading ? '—' : item.value}
                    </Typography>
                  </Box>
                  <Box sx={{ height: 8, borderRadius: '4px', backgroundColor: '#F3F4F6', overflow: 'hidden' }}>
                    {!loading && (
                      <Box sx={{ width: `${pct}%`, height: '100%', backgroundColor: item.color, borderRadius: '4px', transition: 'width 0.5s ease' }} />
                    )}
                  </Box>
                </Box>
              );
            })}
          </Paper>
        </Grid>

        {/* Payment Summary */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '14px', border: '1px solid #E5E7EB' }}>
            <Typography sx={{ fontWeight: 700, color: '#111827', mb: 2.5 }}>Payment Summary</Typography>
            <Grid container spacing={2}>
              {[
                { label: 'Total Payments', value: loading ? '—' : v('payments.total', 0) },
                { label: 'Successful', value: loading ? '—' : v('payments.successful', 0) },
                { label: 'Failed', value: loading ? '—' : v('payments.failed', 0) },
                { label: 'Total Revenue', value: loading ? '—' : `₹${v('payments.revenue', 0).toLocaleString()}` },
              ].map((stat) => (
                <Grid item xs={6} sm={3} key={stat.label}>
                  <Box sx={{ textAlign: 'center', p: 2, borderRadius: '10px', backgroundColor: '#F9FAFB' }}>
                    <Typography sx={{ fontSize: '1.4rem', fontWeight: 700, color: '#111827' }}>{stat.value}</Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#6B7280', mt: 0.5 }}>{stat.label}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default AnalyticsDashboardPage;
