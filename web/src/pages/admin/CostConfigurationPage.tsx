/**
 * Admin Cost Configuration Page
 * 
 * Configure cost constants for budget estimation
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, Grid, Tabs, Tab, Alert, Snackbar } from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { ProtectedRoute } from '../../components/guards/ProtectedRoute';
import { UserRole } from '../../types/auth.types';
import { costConfigurationService } from '../../services/admin/costConfigurationService';
import { logger } from '../../core/logger';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const CostConfigurationPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Form state
  const [baseCosts, setBaseCosts] = useState({
    basic: '',
    standard: '',
    premium: ''
  });
  const [locationMultipliers, setLocationMultipliers] = useState<Record<string, string>>({});
  const [breakdown, setBreakdown] = useState({
    foundation: '',
    structure: '',
    finishing: '',
    electrical: '',
    plumbing: '',
    miscellaneous: ''
  });

  useEffect(() => {
    loadConstants();
  }, []);

  const loadConstants = async () => {
    setLoading(true);
    try {
      const response = await costConfigurationService.getCostConstants();
      
      // Populate form
      setBaseCosts({
        basic: response.constants.baseCostPerSqFt.basic.toString(),
        standard: response.constants.baseCostPerSqFt.standard.toString(),
        premium: response.constants.baseCostPerSqFt.premium.toString()
      });
      
      const multipliers: Record<string, string> = {};
      Object.entries(response.constants.locationMultipliers).forEach(([key, value]) => {
        multipliers[key] = value.toString();
      });
      setLocationMultipliers(multipliers);
      
      setBreakdown({
        foundation: response.constants.costBreakdownPercentages.foundation.toString(),
        structure: response.constants.costBreakdownPercentages.structure.toString(),
        finishing: response.constants.costBreakdownPercentages.finishing.toString(),
        electrical: response.constants.costBreakdownPercentages.electrical.toString(),
        plumbing: response.constants.costBreakdownPercentages.plumbing.toString(),
        miscellaneous: response.constants.costBreakdownPercentages.miscellaneous.toString()
      });
    } catch (error) {
      logger.error('Failed to load cost constants', error as Error);
      setSnackbar({ open: true, message: 'Failed to load cost configuration', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBaseCosts = async () => {
    setSaving(true);
    try {
      await costConfigurationService.updateCostConstants({
        baseCostPerSqFt: {
          basic: parseFloat(baseCosts.basic),
          standard: parseFloat(baseCosts.standard),
          premium: parseFloat(baseCosts.premium)
        }
      });
      setSnackbar({ open: true, message: 'Base costs updated successfully', severity: 'success' });
      loadConstants();
    } catch (error) {
      logger.error('Failed to save base costs', error as Error);
      setSnackbar({ open: true, message: 'Failed to save base costs', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveLocationMultipliers = async () => {
    setSaving(true);
    try {
      const multipliers: Record<string, number> = {};
      Object.entries(locationMultipliers).forEach(([key, value]) => {
        multipliers[key] = parseFloat(value) || 1.0;
      });
      
      await costConfigurationService.updateCostConstants({
        locationMultipliers: multipliers
      });
      setSnackbar({ open: true, message: 'Location multipliers updated successfully', severity: 'success' });
      loadConstants();
    } catch (error) {
      logger.error('Failed to save location multipliers', error as Error);
      setSnackbar({ open: true, message: 'Failed to save location multipliers', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBreakdown = async () => {
    setSaving(true);
    try {
      const total = Object.values(breakdown).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
      if (Math.abs(total - 100) > 0.1) {
        setSnackbar({ open: true, message: `Breakdown percentages must total 100% (currently ${total.toFixed(1)}%)`, severity: 'error' });
        setSaving(false);
        return;
      }
      
      await costConfigurationService.updateCostBreakdown({
        foundation: parseFloat(breakdown.foundation),
        structure: parseFloat(breakdown.structure),
        finishing: parseFloat(breakdown.finishing),
        electrical: parseFloat(breakdown.electrical),
        plumbing: parseFloat(breakdown.plumbing),
        miscellaneous: parseFloat(breakdown.miscellaneous)
      });
      setSnackbar({ open: true, message: 'Cost breakdown updated successfully', severity: 'success' });
      loadConstants();
    } catch (error) {
      logger.error('Failed to save breakdown', error as Error);
      setSnackbar({ open: true, message: 'Failed to save cost breakdown', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={[UserRole.ADMIN]} requiredPermission={{ resource: 'content', action: 'manage' }}>
        <Box sx={{ p: 3 }}>Loading...</Box>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]} requiredPermission={{ resource: 'content', action: 'manage' }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Cost Configuration
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Configure cost constants for budget estimation. Changes will affect future calculations only.
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
            <Tab label="Base Costs" />
            <Tab label="Location Multipliers" />
            <Tab label="Cost Breakdown" />
          </Tabs>
        </Box>

        {/* Base Costs Tab */}
        <TabPanel value={tabValue} index={0}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Base Cost per Square Foot</Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Basic Quality"
                    type="number"
                    value={baseCosts.basic}
                    onChange={(e) => setBaseCosts({ ...baseCosts, basic: e.target.value })}
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Standard Quality"
                    type="number"
                    value={baseCosts.standard}
                    onChange={(e) => setBaseCosts({ ...baseCosts, standard: e.target.value })}
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Premium Quality"
                    type="number"
                    value={baseCosts.premium}
                    onChange={(e) => setBaseCosts({ ...baseCosts, premium: e.target.value })}
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>
                    }}
                  />
                </Grid>
              </Grid>
              <Button
                variant="contained"
                startIcon={<SaveOutlinedIcon />}
                onClick={handleSaveBaseCosts}
                disabled={saving}
                sx={{ mt: 2 }}
              >
                Save Base Costs
              </Button>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Location Multipliers Tab */}
        <TabPanel value={tabValue} index={1}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Location Multipliers</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Multipliers applied to base cost based on location (e.g., 1.3 = 30% higher)
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {Object.entries(locationMultipliers).map(([location, multiplier]) => (
                  <Grid item xs={12} sm={6} md={4} key={location}>
                    <TextField
                      fullWidth
                      label={location.charAt(0).toUpperCase() + location.slice(1)}
                      type="number"
                      value={multiplier}
                      onChange={(e) => setLocationMultipliers({
                        ...locationMultipliers,
                        [location]: e.target.value
                      })}
                      inputProps={{ step: 0.1, min: 0.1, max: 5 }}
                    />
                  </Grid>
                ))}
              </Grid>
              <Button
                variant="contained"
                startIcon={<SaveOutlinedIcon />}
                onClick={handleSaveLocationMultipliers}
                disabled={saving}
                sx={{ mt: 2 }}
              >
                Save Location Multipliers
              </Button>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Cost Breakdown Tab */}
        <TabPanel value={tabValue} index={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Cost Breakdown Percentages</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Percentage distribution of total cost (must total 100%)
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Foundation (%)"
                    type="number"
                    value={breakdown.foundation}
                    onChange={(e) => setBreakdown({ ...breakdown, foundation: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Structure (%)"
                    type="number"
                    value={breakdown.structure}
                    onChange={(e) => setBreakdown({ ...breakdown, structure: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Finishing (%)"
                    type="number"
                    value={breakdown.finishing}
                    onChange={(e) => setBreakdown({ ...breakdown, finishing: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Electrical (%)"
                    type="number"
                    value={breakdown.electrical}
                    onChange={(e) => setBreakdown({ ...breakdown, electrical: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Plumbing (%)"
                    type="number"
                    value={breakdown.plumbing}
                    onChange={(e) => setBreakdown({ ...breakdown, plumbing: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Miscellaneous (%)"
                    type="number"
                    value={breakdown.miscellaneous}
                    onChange={(e) => setBreakdown({ ...breakdown, miscellaneous: e.target.value })}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="body2">
                  Total: {Object.values(breakdown).reduce((sum, val) => sum + (parseFloat(val) || 0), 0).toFixed(1)}%
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<SaveOutlinedIcon />}
                onClick={handleSaveBreakdown}
                disabled={saving}
                sx={{ mt: 2 }}
              >
                Save Cost Breakdown
              </Button>
            </CardContent>
          </Card>
        </TabPanel>
      </Box>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ProtectedRoute>
  );
};

export default CostConfigurationPage;

