import Project from '../models/Project.js';
import User from '../models/User.js';
import { validateProjectCreation } from '../validators/index.js';

/**
 * Project Controller
 * Handles project management operations
 */

/**
 * Create a new project
 * POST /api/projects
 * Required: title, description, clientId
 */
export const createProject = async (req, res) => {
  try {
    const { title, description, clientId, startDate, endDate, budget, location } = req.body;

    // Validation
    const validation = validateProjectCreation({ title, description, clientId });
    if (!validation.isValid) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: validation.errors,
      });
    }

    // Verify client exists
    const client = await User.findById(clientId);
    if (!client) {
      return res.status(404).json({
        status: 'error',
        message: 'Client not found',
      });
    }

    // Create project
    const project = new Project({
      title,
      description,
      architect: req.userId,
      client: clientId,
      startDate,
      endDate,
      budget,
      location,
    });

    await project.save();
    await project.populate(['architect', 'client']);

    res.status(201).json({
      status: 'success',
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create project',
      error: error.message,
    });
  }
};

/**
 * Get all projects (with filters)
 * GET /api/projects?status=planning&page=1&limit=10
 */
export const listProjects = async (req, res) => {
  try {
    const { status, phase, page = 1, limit = 10, search } = req.query;

    const query = {};

    // Filter by user role
    if (req.user.role === 'architect') {
      query.architect = req.userId;
    } else if (req.user.role === 'client') {
      query.client = req.userId;
    }
    // Admin can see all projects

    // Apply filters
    if (status) query.status = status;
    if (phase) query.phase = phase;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    const projects = await Project.find(query)
      .populate('architect', 'name email')
      .populate('client', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Project.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: projects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('List projects error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch projects',
      error: error.message,
    });
  }
};

/**
 * Get a single project by ID
 * GET /api/projects/:id
 */
export const getProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id)
      .populate('architect', 'name email phone company specialization')
      .populate('client', 'name email phone company')
      .populate('documents')
      .populate('meetings');

    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found',
      });
    }

    // Check authorization (user must be architect, client, or admin)
    const isAuthorized =
      req.user.role === 'admin' ||
      project.architect._id.equals(req.userId) ||
      project.client._id.equals(req.userId);

    if (!isAuthorized) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to view this project',
      });
    }

    res.status(200).json({
      status: 'success',
      data: project,
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch project',
      error: error.message,
    });
  }
};

/**
 * Update a project
 * PUT /api/projects/:id
 */
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, phase, startDate, endDate, budget, location, notes } =
      req.body;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found',
      });
    }

    // Check authorization (only architect or admin can update)
    const isAuthorized = req.user.role === 'admin' || project.architect.equals(req.userId);

    if (!isAuthorized) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this project',
      });
    }

    // Update fields
    if (title) project.title = title;
    if (description) project.description = description;
    if (status) project.status = status;
    if (phase) project.phase = phase;
    if (startDate) project.startDate = startDate;
    if (endDate) project.endDate = endDate;
    if (budget !== undefined) project.budget = budget;
    if (location) project.location = location;
    if (notes) project.notes = notes;

    await project.save();
    await project.populate(['architect', 'client']);

    res.status(200).json({
      status: 'success',
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update project',
      error: error.message,
    });
  }
};

/**
 * Delete a project
 * DELETE /api/projects/:id
 */
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found',
      });
    }

    // Check authorization (only architect or admin can delete)
    const isAuthorized = req.user.role === 'admin' || project.architect.equals(req.userId);

    if (!isAuthorized) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this project',
      });
    }

    await Project.findByIdAndDelete(id);

    res.status(200).json({
      status: 'success',
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete project',
      error: error.message,
    });
  }
};
