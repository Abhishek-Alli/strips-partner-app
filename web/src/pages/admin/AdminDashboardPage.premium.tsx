/**
 * Premium Admin Dashboard
 * 
 * Enterprise-grade dashboard with clean KPIs and data visualization
 */

import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { ProtectedRoute } from '../../components/guards/ProtectedRoute';
import { UserRole } from '../../types/auth.types';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../services/apiClient';
import { StatCard } from '../../components/core/StatCard';
import { Card } from '../../components/core/Card';
import { DataTable } from '../../components/table/DataTable';
import { SkeletonLoader, TableSkeleton } from '../../components/core/SkeletonLoader';
import { theme } from '../../theme';
import { logger } from '../../core/logger';

interface DashboardStats {
  totalUsers: number;
  totalDealers: number;
  totalPartners: number;
  totalEnquiries: number;
  recentUsers: any[];
  recentDealers: any[];
  recentPartners: any[];
}

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      if (apiClient.isMockMode()) {
        setStats({
          totalUsers: 1250,
          totalDealers: 45,
          totalPartners: 32,
          totalEnquiries: 890,
          recentUsers: [],
          recentDealers: [],
          recentPartners: [],
        });
      } else {
        const data = await apiClient.get<DashboardStats>('/admin/dashboard');
        if (data) {
          setStats(data);
        }
      }
    } catch (error) {
      logger.error('Failed to load dashboard data', error as Error);
      setStats({
        totalUsers: 0,
        totalDealers: 0,
        totalPartners: 0,
        totalEnquiries: 0,
        recentUsers: [],
        recentDealers: [],
        recentPartners: [],
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
        <Box sx={{ p: theme.spacing[6] }}>
          <SkeletonLoader variant="rectangular" width="200px" height={32} />
          <Grid container spacing={theme.spacing[4]} sx={{ mt: theme.spacing[2] }}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card>
                  <SkeletonLoader variant="rectangular" height={80} />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </ProtectedRoute>
    );
  }

  if (!stats) return null;

  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <Box
        sx={{
          p: theme.spacing[6],
          backgroundColor: theme.colors.background.secondary,
          minHeight: '100vh',
        }}
      >
        {/* Header */}
        <Box sx={{ mb: theme.spacing[8] }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: theme.typography.fontSize.xl,
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.primary,
              letterSpacing: theme.typography.letterSpacing.tight,
              mb: theme.spacing[2],
            }}
          >
            Dashboard
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary,
            }}
          >
            Welcome back, {user?.name}
          </Typography>
        </Box>

        {/* KPI Cards */}
        <Grid container spacing={theme.spacing[4]} sx={{ mb: theme.spacing[8] }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Total Users"
              value={stats.totalUsers}
              trend={{ value: 12, direction: 'up' }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Total Dealers"
              value={stats.totalDealers}
              trend={{ value: 5, direction: 'up' }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Total Partners"
              value={stats.totalPartners}
              trend={{ value: 3, direction: 'up' }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Total Enquiries"
              value={stats.totalEnquiries}
              trend={{ value: 8, direction: 'down' }}
            />
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <Grid container spacing={theme.spacing[4]}>
          <Grid item xs={12} md={4}>
            <Card>
              <Typography
                variant="h6"
                sx={{
                  fontSize: theme.typography.fontSize.lg,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.text.primary,
                  mb: theme.spacing[4],
                }}
              >
                Recent Users
              </Typography>
              {stats.recentUsers.length === 0 ? (
                <Typography
                  sx={{
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.tertiary,
                    textAlign: 'center',
                    py: theme.spacing[8],
                  }}
                >
                  No recent users
                </Typography>
              ) : (
                <DataTable
                  data={stats.recentUsers}
                  columns={[
                    { key: 'name', label: 'Name' },
                    { key: 'email', label: 'Email' },
                    { key: 'role', label: 'Role' },
                  ]}
                  pagination={false}
                />
              )}
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <Typography
                variant="h6"
                sx={{
                  fontSize: theme.typography.fontSize.lg,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.text.primary,
                  mb: theme.spacing[4],
                }}
              >
                Recent Dealers
              </Typography>
              {stats.recentDealers.length === 0 ? (
                <Typography
                  sx={{
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.tertiary,
                    textAlign: 'center',
                    py: theme.spacing[8],
                  }}
                >
                  No recent dealers
                </Typography>
              ) : (
                <DataTable
                  data={stats.recentDealers}
                  columns={[
                    { key: 'name', label: 'Name' },
                    { key: 'email', label: 'Email' },
                    { key: 'status', label: 'Status' },
                  ]}
                  pagination={false}
                />
              )}
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <Typography
                variant="h6"
                sx={{
                  fontSize: theme.typography.fontSize.lg,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.text.primary,
                  mb: theme.spacing[4],
                }}
              >
                Recent Partners
              </Typography>
              {stats.recentPartners.length === 0 ? (
                <Typography
                  sx={{
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.tertiary,
                    textAlign: 'center',
                    py: theme.spacing[8],
                  }}
                >
                  No recent partners
                </Typography>
              ) : (
                <DataTable
                  data={stats.recentPartners}
                  columns={[
                    { key: 'name', label: 'Name' },
                    { key: 'email', label: 'Email' },
                    { key: 'status', label: 'Status' },
                  ]}
                  pagination={false}
                />
              )}
            </Card>
          </Grid>
        </Grid>
      </Box>
    </ProtectedRoute>
  );
};

export default AdminDashboardPage;






