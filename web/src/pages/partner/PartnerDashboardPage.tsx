/**
 * Partner Dashboard Page
 * 
 * Partner's own dashboard with profile overview and enquiries
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip } from '@mui/material';
import { ProtectedRoute } from '../../components/guards/ProtectedRoute';
import { UserRole } from '../../types/auth.types';
import { useAuth } from '../../contexts/AuthContext';
import { partnerManagementService } from '../../services/admin/partnerManagementService';
import { logger } from '../../core/logger';

const PartnerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Partner can only view their own profile
      const response = await partnerManagementService.getPartnerById(user.id);
      setProfile(response.partner);
    } catch (error) {
      logger.error('Failed to load partner profile', error as Error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Box sx={{ p: 3 }}>Loading...</Box>;
  }

  return (
    <ProtectedRoute allowedRoles={[UserRole.PARTNER]}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Partner Dashboard
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Profile Overview</Typography>
                {profile && (
                  <>
                    <Typography variant="body1" sx={{ mt: 2 }}>{profile.name}</Typography>
                    <Chip label={profile.category} sx={{ mt: 1 }} />
                    <Chip
                      label={profile.status}
                      color={profile.status === 'approved' ? 'success' : 'warning'}
                      sx={{ mt: 1, ml: 1 }}
                    />
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Rating: ⭐ {profile.rating?.toFixed(1)} ({profile.reviewCount} reviews)
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Quick Actions</Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  • Edit your profile
                </Typography>
                <Typography variant="body2">
                  • View enquiries
                </Typography>
                <Typography variant="body2">
                  • View feedback
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </ProtectedRoute>
  );
};

export default PartnerDashboardPage;






