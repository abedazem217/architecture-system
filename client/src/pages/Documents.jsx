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
  IconButton,
  Tooltip,
} from '@mui/material';
import { Add, Delete, Download, Description, FileDownload } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext.jsx';
import { documentAPI, projectAPI } from '../services/api.js';

export default function Documents() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'blueprint',
    projectId: '',
    fileUrl: '',
    public: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [docsRes, projectsRes] = await Promise.all([
        documentAPI.getAll({ limit: 100 }),
        projectAPI.getAll({ limit: 100 }),
      ]);

      setDocuments(docsRes.data.data || []);
      setProjects(projectsRes.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load documents');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setFormData({
      name: '',
      type: 'blueprint',
      projectId: projects[0]?._id || '',
      fileUrl: '',
      public: false,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUploadDocument = async () => {
    try {
      if (!formData.name || !formData.projectId) {
        setError('Please fill in required fields');
        return;
      }

      const response = await documentAPI.create(formData);
      setDocuments([...documents, response.data.data]);
      handleCloseDialog();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload document');
    }
  };

  const handleDeleteDocument = async (id) => {
    if (!window.confirm('Delete this document?')) return;

    try {
      await documentAPI.delete(id);
      setDocuments(documents.filter((d) => d._id !== id));
    } catch (err) {
      setError('Failed to delete document');
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      blueprint: 'info',
      license: 'success',
      contract: 'warning',
      report: 'default',
      other: 'default',
    };
    return colors[type] || 'default';
  };

  const getTypeLabel = (type) => {
    const labels = {
      blueprint: 'Blueprint',
      license: 'License',
      contract: 'Contract',
      report: 'Report',
      other: 'Other',
    };
    return labels[type] || type;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const filteredDocuments = documents.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || d.type === typeFilter;

    return matchesSearch && matchesType;
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
          Documents
        </Typography>
        <Typography color="textSecondary">
          Upload and manage project documents, blueprints, and licenses
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
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              select
              label="Document Type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              size="small"
              SelectProps={{ native: true }}
            >
              <option value="all">All Types</option>
              <option value="blueprint">Blueprint</option>
              <option value="license">License</option>
              <option value="contract">Contract</option>
              <option value="report">Report</option>
              <option value="other">Other</option>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenDialog}
            >
              Upload Document
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Documents Table */}
      {filteredDocuments.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Description sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography color="textSecondary">No documents found</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Project</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Size</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Uploaded</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow key={doc._id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Description fontSize="small" color="primary" />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {doc.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getTypeLabel(doc.type)}
                      color={getTypeColor(doc.type)}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {projects.find((p) => p._id === doc.project)?.title || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{formatFileSize(doc.size)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Download">
                      <IconButton
                        size="small"
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FileDownload fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteDocument(doc._id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Upload Document Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Document Name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            select
            label="Document Type"
            name="type"
            value={formData.type}
            onChange={handleFormChange}
            margin="normal"
            SelectProps={{ native: true }}
          >
            <option value="blueprint">Blueprint</option>
            <option value="license">License</option>
            <option value="contract">Contract</option>
            <option value="report">Report</option>
            <option value="other">Other</option>
          </TextField>
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
          <TextField
            fullWidth
            label="File URL"
            name="fileUrl"
            value={formData.fileUrl}
            onChange={handleFormChange}
            margin="normal"
            placeholder="https://example.com/file.pdf"
            required
          />
          <Box mt={2}>
            <Typography variant="body2" color="textSecondary" mb={1}>
              Visibility
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <input
                type="checkbox"
                name="public"
                checked={formData.public}
                onChange={handleFormChange}
              />
              <Typography variant="body2">Make this document public</Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleUploadDocument} variant="contained">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
