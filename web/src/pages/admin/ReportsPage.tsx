/**
 * Admin Reports Page
 *
 * Generate and export various reports
 * Refactored to use AdminLayout
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { webAnalyticsService } from '../../services/analyticsService';
import {
  UserActivityReport,
  EnquiryReport,
  PaymentReport,
} from '@shared/core/analytics/analyticsTypes';
import { logger } from '../../core/logger';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const ReportsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  });
  const [endDate, setEndDate] = useState<Date>(new Date());

  const [userActivityReports, setUserActivityReports] = useState<
    UserActivityReport[]
  >([]);
  const [enquiryReports, setEnquiryReports] = useState<EnquiryReport[]>([]);
  const [paymentReports, setPaymentReports] = useState<PaymentReport[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReports();
  }, [tabValue, startDate, endDate]);

  const loadReports = async () => {
    setLoading(true);
    setError(null);
    try {
      if (tabValue === 0) {
        const data = await webAnalyticsService.getUserActivityReport(
          startDate,
          endDate
        );
        setUserActivityReports(data);
      } else if (tabValue === 1) {
        const data = await webAnalyticsService.getEnquiryReport(
          startDate,
          endDate
        );
        setEnquiryReports(data);
      } else if (tabValue === 2) {
        const data = await webAnalyticsService.getPaymentReport(
          startDate,
          endDate
        );
        setPaymentReports(data);
      }
    } catch (err) {
      logger.error('Failed to load reports', err as Error);
      setError('Failed to load reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      let reportType: 'user-activity' | 'enquiries' | 'payments' =
        'user-activity';
      if (tabValue === 1) reportType = 'enquiries';
      else if (tabValue === 2) reportType = 'payments';

      const blob = await webAnalyticsService.exportReportAsCSV(
        reportType,
        startDate,
        endDate
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}_${startDate.toISOString().split('T')[0]}_${
        endDate.toISOString().split('T')[0]
      }.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      logger.error('Failed to export report', err as Error);
      setError('Failed to export report. Please try again.');
    }
  };

  const getStatusColor = (
    status: string
  ): 'success' | 'warning' | 'error' | 'default' => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
      case 'responded':
        return 'success';
      case 'pending':
      case 'processing':
        return 'warning';
      case 'failed':
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <AdminLayout
      title="Reports"
      requiredPermission={{ resource: 'analytics', action: 'view' }}
    >
      {/* Date Range and Export */}}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => newValue && setStartDate(newValue)}
              slotProps={{
                textField: {
                  size: 'small',
                  sx: {
                    width: 160,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                  },
                },
              }}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => newValue && setEndDate(newValue)}
              slotProps={{
                textField: {
                  size: 'small',
                  sx: {
                    width: 160,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
        </Box>
        <Button
          variant="contained"
          startIcon={<DownloadOutlinedIcon />}
          onClick={handleExportCSV}
          disabled={loading}
          sx={{
            backgroundColor: '#FF6B35',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': { backgroundColor: '#E85A2B' },
          }}
        >
          Export CSV
        </Button>
      </Box>

      {/* Tabs and Content */}
      <Paper
        elevation={0}
        sx={{ borderRadius: '12px', border: '1px solid #E5E7EB' }}
      >
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{
            borderBottom: '1px solid #E5E7EB',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.9375rem',
            },
            '& .Mui-selected': {
              color: '#FF6B35',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#FF6B35',
            },
          }}
        >
          <Tab label="User Activity" />
          <Tab label="Enquiries" />
          <Tab label="Payments" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
                  <TableCell sx={{ fontWeight: 600 }}>User ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Total Logins</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Total Searches</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    Total Enquiries
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Total Payments</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Total Spent</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 7 }).map((_, j) => (
                          <TableCell key={j}>
                            <Skeleton variant="text" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  : userActivityReports.map((report, index) => (
                      <TableRow key={report.userId || index} hover>
                        <TableCell>
                          {report.userId?.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          {report.role?.replace('_', ' ').toUpperCase() || '-'}
                        </TableCell>
                        <TableCell>{report.totalLogins || 0}</TableCell>
                        <TableCell>{report.totalSearches || 0}</TableCell>
                        <TableCell>{report.totalEnquiries || 0}</TableCell>
                        <TableCell>{report.totalPayments || 0}</TableCell>
                        <TableCell>
                          INR {report.totalSpent?.toLocaleString() || 0}
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Enquiry ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>User ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Entity Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created At</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Response Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 6 }).map((_, j) => (
                          <TableCell key={j}>
                            <Skeleton variant="text" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  : enquiryReports.map((report, index) => (
                      <TableRow key={report.enquiryId || index} hover>
                        <TableCell>
                          {report.enquiryId?.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          {report.userId?.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          {report.entityType?.toUpperCase() || '-'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={report.status || '-'}
                            color={getStatusColor(report.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {report.createdAt
                            ? new Date(report.createdAt).toLocaleString()
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {report.responseTime
                            ? `${report.responseTime.toFixed(1)}h`
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Payment ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>User ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Service Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 6 }).map((_, j) => (
                          <TableCell key={j}>
                            <Skeleton variant="text" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  : paymentReports.map((report, index) => (
                      <TableRow key={report.paymentId || index} hover>
                        <TableCell>
                          {report.paymentId?.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          {report.userId?.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          {report.serviceType?.replace(/_/g, ' ') || '-'}
                        </TableCell>
                        <TableCell>
                          {report.currency || 'INR'}{' '}
                          {report.amount?.toLocaleString() || 0}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={report.status || '-'}
                            color={getStatusColor(report.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {report.createdAt
                            ? new Date(report.createdAt).toLocaleString()
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>
    </AdminLayout>
  );
};

export default ReportsPage;
