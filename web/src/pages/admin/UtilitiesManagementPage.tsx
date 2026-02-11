/**
 * Admin Utilities & Content Management Page
 * 
 * Manage checklists, videos, visualization requests, and admin notes
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { ProtectedRoute } from '../../components/guards/ProtectedRoute';
import { UserRole } from '../../types/auth.types';
import { contentService, Checklist, Video, VisualizationRequest } from '../../services/admin/contentService';
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

const UtilitiesManagementPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [visualizationRequests, setVisualizationRequests] = useState<VisualizationRequest[]>([]);
  const [, setLoading] = useState(false);
  const [checklistModalOpen, setChecklistModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [tabValue]);

  const loadData = async () => {
    setLoading(true);
    try {
      switch (tabValue) {
        case 0:
          const checklistsRes = await contentService.getChecklists();
          setChecklists(checklistsRes.checklists);
          break;
        case 1:
          const videosRes = await contentService.getVideos();
          setVideos(videosRes.videos);
          break;
        case 2:
          const vizRes = await contentService.getVisualizationRequests();
          setVisualizationRequests(vizRes.requests);
          break;
      }
    } catch (error) {
      logger.error('Failed to load data', error as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]} requiredPermission={{ resource: 'content', action: 'manage' }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Utilities & Content Management
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
            <Tab label="Checklists" />
            <Tab label="Videos" />
            <Tab label="Visualization Requests" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Checklists</Typography>
            <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={() => setChecklistModalOpen(true)}>
              Add Checklist
            </Button>
          </Box>
          {checklists.map(checklist => (
            <Box key={checklist.id} sx={{ p: 2, mb: 2, border: 1, borderRadius: 1 }}>
              <Typography variant="h6">{checklist.title}</Typography>
              <Typography variant="body2" color="text.secondary">{checklist.category}</Typography>
              <Typography variant="body2">{checklist.items.length} items</Typography>
            </Box>
          ))}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Videos</Typography>
            <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={() => setVideoModalOpen(true)}>
              Add Video
            </Button>
          </Box>
          {videos.map(video => (
            <Box key={video.id} sx={{ p: 2, mb: 2, border: 1, borderRadius: 1 }}>
              <Typography variant="h6">{video.title}</Typography>
              <Typography variant="body2" color="text.secondary">{video.category}</Typography>
              <Typography variant="body2">YouTube ID: {video.youtubeId}</Typography>
            </Box>
          ))}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" sx={{ mb: 2 }}>Visualization Requests</Typography>
          {visualizationRequests.map(request => (
            <Box key={request.id} sx={{ p: 2, mb: 2, border: 1, borderRadius: 1 }}>
              <Typography variant="h6">{request.type} - {request.userName}</Typography>
              <Typography variant="body2">{request.description}</Typography>
              <Typography variant="body2" color="text.secondary">Status: {request.status}</Typography>
            </Box>
          ))}
        </TabPanel>

        {/* Add Checklist Modal */}
        <Dialog open={checklistModalOpen} onClose={() => setChecklistModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Checklist</DialogTitle>
          <DialogContent>
            <TextField fullWidth label="Title" sx={{ mt: 1 }} />
            <TextField fullWidth label="Category" sx={{ mt: 1 }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setChecklistModalOpen(false)}>Cancel</Button>
            <Button variant="contained">Save</Button>
          </DialogActions>
        </Dialog>

        {/* Add Video Modal */}
        <Dialog open={videoModalOpen} onClose={() => setVideoModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Video</DialogTitle>
          <DialogContent>
            <TextField fullWidth label="Title" sx={{ mt: 1 }} />
            <TextField fullWidth label="Category" sx={{ mt: 1 }} />
            <TextField fullWidth label="YouTube ID" sx={{ mt: 1 }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setVideoModalOpen(false)}>Cancel</Button>
            <Button variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ProtectedRoute>
  );
};

export default UtilitiesManagementPage;

