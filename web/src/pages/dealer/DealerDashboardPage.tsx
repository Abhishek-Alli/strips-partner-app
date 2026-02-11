/**
 * Dealer Dashboard Page (Web)
 * 
 * Dashboard with profile, stats, and notifications
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { ProtectedRoute } from '../../components/guards/ProtectedRoute';
import { UserRole } from '../../types/auth.types';
import { useAuth } from '../../contexts/AuthContext';
import { webDealerService } from '../../services/dealer/dealerService';
import { DealerStats } from '../../../../shared/types/dealer.types';
import { KPICard } from '../../components/charts/KPICard';
import { logger } from '../../core/logger';

const DealerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DealerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadStats();
    }
  }, [user?.id]);

  const loadStats = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await webDealerService.getDealerStats(user.id);
      setStats(data);
    } catch (error) {
      logger.error('Failed to load dealer stats', error as Error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <ProtectedRoute allowedRoles={[UserRole.DEALER]}>
        <Box sx={{ p: 3 }}>Loading...</Box>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={[UserRole.DEALER]}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dealer Dashboard
        </Typography>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard title="Total Products" value={stats.totalProducts} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard title="Active Products" value={stats.activeProducts} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard title="New Enquiries" value={stats.newEnquiries} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard title="Customers Contacted" value={stats.customersContacted} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard title="Total Enquiries" value={stats.totalEnquiries} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard title="Responded Enquiries" value={stats.respondedEnquiries} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard title="Average Rating" value={stats.averageRating.toFixed(1)} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard title="Total Feedbacks" value={stats.totalFeedbacks} />
          </Grid>
        </Grid>

        {/* Profile Summary */}
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Profile Summary
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {user?.name}
            </Typography>
            <Chip label="Dealer" color="primary" sx={{ mt: 1 }} />
            {stats.averageRating > 0 && (
              <Typography variant="body2" sx={{ mt: 2 }}>
                Rating: ⭐ {stats.averageRating.toFixed(1)} ({stats.totalFeedbacks} reviews)
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </ProtectedRoute>
  );
};

export default DealerDashboardPage;
