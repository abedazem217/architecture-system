import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Delete,
  Save,
  Close,
  Info,
  FolderOpen,
  MoreVert,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext.jsx';
import { projectAPI } from '../services/api.js';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isArchitect } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'planning',
    phase: 'planning',
    startDate: '',
    endDate: '',
    budget: '',
    location: '',
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    loadProjectDetails();
  }, [id]);

  const loadProjectDetails = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getById(id);
      const proj = response.data.data;
      setProject(proj);
      setFormData({
        title: proj.title || '',
        description: proj.description || '',
        status: proj.status || 'planning',
        phase: proj.phase || 'planning',
        startDate: proj.startDate?.split('T')[0] || '',
        endDate: proj.endDate?.split('T')[0] || '',
        budget: proj.budget || '',
        location: proj.location || '',
      });
      setError('');
    } catch (err) {
      setError('Failed to load project');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProject = async () => {
    try {
      const response = await projectAPI.update(id, formData);
      setProject(response.data.data);
      setEditMode(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update project');
    }
  };

  const handleDeleteProject = async () => {
    try {
      await projectAPI.delete(id);
      navigate('/projects');
    } catch (err) {
      setError('Failed to delete project');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      planning: 'info',
      licensed: 'success',
      in_progress: 'warning',
      completed: 'success',
      on_hold: 'error',
    };
    return colors[status] || 'default';
  };

  const getPhaseColor = (phase) => {
    const colors = {
      planning: 'default',
      licensing: 'info',
      construction: 'warning',
      completion: 'success',
    };
    return colors[phase] || 'default';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!project) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">Project not found</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/projects')} sx={{ mt: 2 }}>
          Back to Projects
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/projects')}
          variant="text"
        >
          Back
        </Button>
        <Box flex={1}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {project.title}
          </Typography>
        </Box>
        {isArchitect && (
          <Box display="flex" gap={1}>
            <Button
              variant={editMode ? 'contained' : 'outlined'}
              startIcon={editMode ? <Close /> : <Edit />}
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? 'Cancel' : 'Edit'}
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={() => setOpenDeleteDialog(true)}
            >
              Delete
            </Button>
          </Box>
        )}
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Project Status */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Status
              </Typography>
              <Chip
                label={project.status?.toUpperCase()}
                color={getStatusColor(project.status)}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Phase
              </Typography>
              <Chip
                label={project.phase?.replace(/_/g, ' ').toUpperCase()}
                color={getPhaseColor(project.phase)}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Budget
              </Typography>
              <Typography variant="h6">
                ${Number(project.budget || 0).toLocaleString()}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Location
              </Typography>
              <Typography variant="body2">{project.location || 'N/A'}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Overview" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Details" id="tab-1" aria-controls="tabpanel-1" />
          <Tab label="Team" id="tab-2" aria-controls="tabpanel-2" />
        </Tabs>
      </Paper>

      {/* Overview Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Project Description
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {project.description || 'No description provided'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Timeline
                </Typography>
                <Box mb={2}>
                  <Typography variant="body2" color="textSecondary">
                    Start Date
                  </Typography>
                  <Typography variant="body2">
                    {project.startDate
                      ? new Date(project.startDate).toLocaleDateString()
                      : 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    End Date
                  </Typography>
                  <Typography variant="body2">
                    {project.endDate
                      ? new Date(project.endDate).toLocaleDateString()
                      : 'N/A'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Details Tab - Edit Mode */}
      <TabPanel value={tabValue} index={1}>
        {editMode ? (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Edit Project
            </Typography>
            <Box display="grid" gap={2} mt={2}>
              <TextField
                fullWidth
                label="Project Title"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                multiline
                rows={4}
              />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleFormChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="End Date"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleFormChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Budget"
                    name="budget"
                    type="number"
                    value={formData.budget}
                    onChange={handleFormChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleFormChange}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    SelectProps={{ native: true }}
                  >
                    <option value="planning">Planning</option>
                    <option value="licensed">Licensed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="on_hold">On Hold</option>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Phase"
                    name="phase"
                    value={formData.phase}
                    onChange={handleFormChange}
                    SelectProps={{ native: true }}
                  >
                    <option value="planning">Planning</option>
                    <option value="licensing">Licensing</option>
                    <option value="construction">Construction</option>
                    <option value="completion">Completion</option>
                  </TextField>
                </Grid>
              </Grid>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleUpdateProject}
                size="large"
              >
                Save Changes
              </Button>
            </Box>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Start Date
                  </Typography>
                  <Typography variant="body2">
                    {project.startDate
                      ? new Date(project.startDate).toLocaleDateString()
                      : 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    End Date
                  </Typography>
                  <Typography variant="body2">
                    {project.endDate
                      ? new Date(project.endDate).toLocaleDateString()
                      : 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </TabPanel>

      {/* Team Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Architect
                </Typography>
                <Typography variant="body2">
                  {project.architect?.name || 'N/A'}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {project.architect?.email}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Client
                </Typography>
                <Typography variant="body2">
                  {project.client?.name || 'N/A'}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {project.client?.email}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Delete Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Project?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this project? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteProject}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
