import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Chip,
  Grid,
} from '@mui/material';
import { Add, Delete, Edit, Event } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext.jsx';
import { meetingAPI, projectAPI } from '../services/api.js';

export default function Meetings() {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    duration: '60',
    location: '',
    projectId: '',
    participants: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [meetingsRes, projectsRes] = await Promise.all([
        meetingAPI.getAll({ limit: 50 }),
        projectAPI.getAll({ limit: 100 }),
      ]);

      setMeetings(meetingsRes.data.data || []);
      setProjects(projectsRes.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      duration: '60',
      location: '',
      projectId: projects[0]?._id || '',
      participants: [user._id],
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateMeeting = async () => {
    try {
      if (!formData.title || !formData.date || !formData.projectId) {
        setError('Please fill in required fields');
        return;
      }

      const response = await meetingAPI.create(formData);
      setMeetings([...meetings, response.data.data]);
      handleCloseDialog();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create meeting');
    }
  };

  const handleDeleteMeeting = async (id) => {
    if (!window.confirm('Delete this meeting?')) return;

    try {
      await meetingAPI.delete(id);
      setMeetings(meetings.filter((m) => m._id !== id));
    } catch (err) {
      setError('Failed to delete meeting');
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await meetingAPI.update(id, { status: newStatus });
      setMeetings(
        meetings.map((m) => (m._id === id ? response.data.data : m))
      );
    } catch (err) {
      setError('Failed to update meeting');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'info',
      completed: 'success',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  const filteredMeetings = meetings.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Meetings
        </Typography>
        <Typography color="textSecondary">
          Schedule and manage meetings with clients and team members
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Search & Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              placeholder="Search meetings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              size="small"
              SelectProps={{ native: true }}
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenDialog}
            >
              Schedule Meeting
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Meetings Table */}
      {filteredMeetings.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Event sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography color="textSecondary">No meetings found</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date & Time</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Project</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMeetings.map((meeting) => (
                <TableRow key={meeting._id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {meeting.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(meeting.date).toLocaleDateString()} {' '}
                      {new Date(meeting.date).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  </TableCell>
                  <TableCell>{meeting.location || '-'}</TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {projects.find((p) => p._id === meeting.project)?.title || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={meeting.status}
                      color={getStatusColor(meeting.status)}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    {meeting.status === 'scheduled' && (
                      <Button
                        size="small"
                        onClick={() => handleUpdateStatus(meeting._id, 'completed')}
                      >
                        Complete
                      </Button>
                    )}
                    <Button
                      size="small"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => handleDeleteMeeting(meeting._id)}
                      sx={{ ml: 1 }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create Meeting Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule New Meeting</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Meeting Title"
            name="title"
            value={formData.title}
            onChange={handleFormChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="Date & Time"
            name="date"
            type="datetime-local"
            value={formData.date}
            onChange={handleFormChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            fullWidth
            label="Duration (minutes)"
            name="duration"
            type="number"
            value={formData.duration}
            onChange={handleFormChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleFormChange}
            margin="normal"
          />
          <TextField
            fullWidth
            select
            label="Project"
            name="projectId"
            value={formData.projectId}
            onChange={handleFormChange}
            margin="normal"
            SelectProps={{ native: true }}
            required
          >
            <option value="">Select a project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title}
              </option>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleCreateMeeting} variant="contained">
            Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
