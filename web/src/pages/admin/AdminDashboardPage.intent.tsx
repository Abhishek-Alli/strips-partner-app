/**
 * Intent-Driven Admin Dashboard
 * 
 * Focuses on what Admin needs to do RIGHT NOW
 */

import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { ProtectedRoute } from '../../components/guards/ProtectedRoute';
import { UserRole } from '../../types/auth.types';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../services/apiClient';
import { StatCard } from '../../components/core/StatCard';
import { PrimaryButton } from '../../components/core/PrimaryButton';
import { SkeletonLoader } from '../../components/core/SkeletonLoader';
import { theme } from '../../theme';
import { logger } from '../../core/logger';

interface DashboardStats {
  totalUsers: number;
  totalDealers: number;
  totalPartners: number;
  totalEnquiries: number;
  pendingApprovals: number;
  openReports: number;
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
          pendingApprovals: 5,
          openReports: 2,
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
        pendingApprovals: 0,
        openReports: 0,
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

  const hasPendingActions = stats.pendingApprovals > 0 || stats.openReports > 0;

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

        {/* PRIMARY CARD: Pending Actions (60% visual weight) */}
        {hasPendingActions ? (
          <Card
            variant="elevated"
            sx={{
              mb: theme.spacing[8],
              backgroundColor: theme.colors.primary[50],
              border: `2px solid ${theme.colors.primary[200]}`,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: theme.spacing[4] }}>
              <Box>
                <Typography
                  sx={{
                    fontSize: theme.typography.fontSize.lg,
                    fontWeight: theme.typography.fontWeight.semibold,
                    color: theme.colors.text.primary,
                    mb: theme.spacing[1],
                  }}
                >
                  Action Required
                </Typography>
                <Typography
                  sx={{
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.secondary,
                  }}
                >
                  {stats.pendingApprovals + stats.openReports} items need your attention
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={theme.spacing[4]}>
              {stats.pendingApprovals > 0 && (
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      p: theme.spacing[4],
                      backgroundColor: theme.colors.background.primary,
                      borderRadius: theme.radius.md,
                      border: `1px solid ${theme.colors.border.light}`,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: theme.typography.fontSize.base,
                        fontWeight: theme.typography.fontWeight.medium,
                        color: theme.colors.text.primary,
                        mb: theme.spacing[2],
                      }}
                    >
                      Pending Approvals
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: theme.typography.fontSize['2xl'],
                        fontWeight: theme.typography.fontWeight.bold,
                        color: theme.colors.primary[700],
                        mb: theme.spacing[4],
                      }}
                    >
                      {stats.pendingApprovals}
                    </Typography>
                    <PrimaryButton
                      fullWidth
                      onClick={() => window.location.href = '/admin/users'}
                    >
                      Review Applications
                    </PrimaryButton>
                  </Box>
                </Grid>
              )}

              {stats.openReports > 0 && (
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      p: theme.spacing[4],
                      backgroundColor: theme.colors.background.primary,
                      borderRadius: theme.radius.md,
                      border: `1px solid ${theme.colors.border.light}`,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: theme.typography.fontSize.base,
                        fontWeight: theme.typography.fontWeight.medium,
                        color: theme.colors.text.primary,
                        mb: theme.spacing[2],
                      }}
                    >
                      Open Reports
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: theme.typography.fontSize['2xl'],
                        fontWeight: theme.typography.fontWeight.bold,
                        color: theme.colors.error[500],
                        mb: theme.spacing[4],
                      }}
                    >
                      {stats.openReports}
                    </Typography>
                    <PrimaryButton
                      fullWidth
                      onClick={() => window.location.href = '/admin/reports'}
                    >
                      Review Reports
                    </PrimaryButton>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Card>
        ) : (
          <Card
            variant="elevated"
            sx={{
              mb: theme.spacing[8],
              backgroundColor: theme.colors.success[50],
              border: `1px solid ${theme.colors.success[500]}`,
            }}
          >
            <Box sx={{ textAlign: 'center', py: theme.spacing[4] }}>
              <Typography
                sx={{
                  fontSize: theme.typography.fontSize.lg,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.success[700],
                  mb: theme.spacing[2],
                }}
              >
                All systems operational
              </Typography>
              <Typography
                sx={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.secondary,
                }}
              >
                No pending actions. Platform is running smoothly.
              </Typography>
            </Box>
          </Card>
        )}

        {/* SUPPORTING CARDS: Platform KPIs (30% visual weight) */}
        <Grid container spacing={theme.spacing[4]} sx={{ mb: theme.spacing[8] }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Total Users"
              value={stats.totalUsers}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Total Dealers"
              value={stats.totalDealers}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Total Partners"
              value={stats.totalPartners}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Total Enquiries"
              value={stats.totalEnquiries}
            />
          </Grid>
        </Grid>

        {/* Recent Activity (Hidden if no data - Tertiary) */}
        {(stats.recentUsers.length > 0 || stats.recentDealers.length > 0 || stats.recentPartners.length > 0) && (
          <Grid container spacing={theme.spacing[4]}>
            {stats.recentUsers.length > 0 && (
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
                  {/* Simplified list - details hidden, accessible via "View All" */}
                  <Box sx={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
                    {stats.recentUsers.slice(0, 3).map((u: any) => (
                      <Box key={u.id} sx={{ mb: theme.spacing[2] }}>
                        {u.name} • {u.email}
                      </Box>
                    ))}
                  </Box>
                </Card>
              </Grid>
            )}

            {stats.recentDealers.length > 0 && (
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
                  <Box sx={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
                    {stats.recentDealers.slice(0, 3).map((d: any) => (
                      <Box key={d.id} sx={{ mb: theme.spacing[2] }}>
                        {d.name} • {d.status}
                      </Box>
                    ))}
                  </Box>
                </Card>
              </Grid>
            )}

            {stats.recentPartners.length > 0 && (
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
                  <Box sx={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
                    {stats.recentPartners.slice(0, 3).map((p: any) => (
                      <Box key={p.id} sx={{ mb: theme.spacing[2] }}>
                        {p.name} • {p.status}
                      </Box>
                    ))}
                  </Box>
                </Card>
              </Grid>
            )}
          </Grid>
        )}
      </Box>
    </ProtectedRoute>
  );
};

export default AdminDashboardPage;






