/**
 * Admin Dashboard Page
 *
 * ERP-style dashboard with KPIs and recent activity
 * FINAL – production locked
 */

import React, { useEffect, useState } from 'react';
import { Grid, Box } from '@mui/material';

import { AdminLayout } from '../../components/layout/AdminLayout';
import { StatCard } from '../../components/dashboard/StatCard';
import { InfoCard } from '../../components/dashboard/InfoCard';
import { UserListItem } from '../../components/dashboard/UserListItem';
import { DealerListItem } from '../../components/dashboard/DealerListItem';
import { PartnerListItem } from '../../components/dashboard/PartnerListItem';
import { SkeletonLoader } from '../../components/dashboard/SkeletonLoader';

import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import StoreIcon from '@mui/icons-material/Store';
import InventoryIcon from '@mui/icons-material/Inventory';

interface DashboardStats {
  totalUsers: number;
  totalDealers: number;
  totalPartners: number;
  totalProducts: number;
  recentUsers: any[];
  recentDealers: any[];
  recentPartners: any[];
}

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Always use mock data for now (backend will be integrated later)
      setStats({
        totalUsers: 1000,
        totalDealers: 1000,
        totalPartners: 1000,
        totalProducts: 1000,
        recentUsers: [
          { id: 1, name: 'Alok Das', email: 'alok@gmail.com', phone: '+91-9876543210' },
          { id: 2, name: 'Rajesh Kumar', email: 'rajesh@gmail.com', phone: '+91-8765432109' },
          { id: 3, name: 'Priya Singh', email: 'priya@gmail.com', phone: '+91-7654321098' }
        ],
        recentDealers: [
          { id: 1, name: 'Serines Deals', location: { address: 'Nagpur' }, rating: 4.5, reviewCount: 12 },
          { id: 2, name: 'Modi Materials', location: { address: 'Mumbai' }, rating: 4.8, reviewCount: 25 },
          { id: 3, name: 'Excel Steel', location: { address: 'Pune' }, rating: 4.2, reviewCount: 8 }
        ],
        recentPartners: [
          { id: 1, name: 'Daniel John', category: 'Architecture' },
          { id: 2, name: 'Smith Construction', category: 'Construction' },
          { id: 3, name: 'Design Pro', category: 'Design' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Admin Dashboard">
      <Box sx={{ p: 3 }}>
        {/* KPI SECTION */}
        {loading ? (
          <SkeletonLoader variant="statCard" count={4} />
        ) : (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Users"
                value={stats?.totalUsers || 0}
                icon={<PeopleIcon />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Partners"
                value={stats?.totalPartners || 0}
                icon={<BusinessIcon />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Dealers"
                value={stats?.totalDealers || 0}
                icon={<StoreIcon />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Products"
                value={stats?.totalProducts || 0}
                icon={<InventoryIcon />}
              />
            </Grid>
          </Grid>
        )}

        {/* RECENT ACTIVITY */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <InfoCard title="Last 3 Users">
              {stats?.recentUsers.length ? (
                stats.recentUsers.map((u) => (
                  <UserListItem
                    key={u.id}
                    name={u.name}
                    email={u.email}
                    phone={u.phone}
                  />
                ))
              ) : (
                <Box sx={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
                  No recent users
                </Box>
              )}
            </InfoCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <InfoCard title="Last 3 Dealers">
              {stats?.recentDealers.length ? (
                stats.recentDealers.map((d) => (
                  <DealerListItem
                    key={d.id}
                    name={d.name}
                    location={d.location?.address || 'N/A'}
                    rating={d.rating}
                    email={d.email || 'N/A'}
                    phone={d.phone || 'N/A'}
                  />
                ))
              ) : (
                <Box sx={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
                  No recent dealers
                </Box>
              )}
            </InfoCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <InfoCard title="Last 3 Partners">
              {stats?.recentPartners.length ? (
                stats.recentPartners.map((p) => (
                  <PartnerListItem
                    key={p.id}
                    name={p.name}
                    category={p.category}
                    email={p.email || 'N/A'}
                    phone={p.phone || 'N/A'}
                    rating={p.rating || 0}
                  />
                ))
              ) : (
                <Box sx={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
                  No recent partners
                </Box>
              )}
            </InfoCard>
          </Grid>
        </Grid>
      </Box>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
