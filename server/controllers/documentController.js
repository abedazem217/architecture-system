import Document from '../models/Document.js';
import Project from '../models/Project.js';

// Create/Upload a new document
export const uploadDocument = async (req, res) => {
  try {
    const { name, type, projectId, fileUrl, public: isPublic } = req.body;
    const userId = req.user._id;

    // Validate project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ status: 'error', message: 'Project not found' });
    }

    // Check authorization
    const isArchitect = project.architect.toString() === userId.toString();
    const isClient = project.client.toString() === userId.toString();
    if (!isArchitect && !isClient) {
      return res.status(403).json({ status: 'error', message: 'Not authorized to upload documents for this project' });
    }

    const document = new Document({
      name,
      type: type || 'other',
      project: projectId,
      uploader: userId,
      fileUrl,
      public: isPublic || false,
      mimeType: 'application/octet-stream',
      version: 1,
    });

    await document.save();
    await document.populate('uploader', 'name email avatar');
    await document.populate('project', 'title');

    res.status(201).json({
      status: 'success',
      message: 'Document uploaded successfully',
      data: document,
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Get all documents with filters
export const getDocuments = async (req, res) => {
  try {
    const { projectId, type, limit = 100, page = 1 } = req.query;
    const userId = req.user._id;

    const filter = {};
    if (projectId) filter.project = projectId;
    if (type) filter.type = type;

    const skip = (page - 1) * limit;
    const documents = await Document.find(filter)
      .populate('uploader', 'name email avatar')
      .populate('project', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Document.countDocuments(filter);

    res.json({
      status: 'success',
      data: documents,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Get document by ID
export const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const document = await Document.findById(id)
      .populate('uploader', 'name email avatar')
      .populate('project', 'title description');

    if (!document) {
      return res.status(404).json({ status: 'error', message: 'Document not found' });
    }

    // Check authorization - public documents or owner
    if (!document.public) {
      const project = await Project.findById(document.project);
      const isArchitect = project.architect.toString() === userId.toString();
      const isClient = project.client.toString() === userId.toString();
      
      if (!isArchitect && !isClient) {
        return res.status(403).json({ status: 'error', message: 'Not authorized to view this document' });
      }
    }

    res.json({ status: 'success', data: document });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Update document metadata
export const updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const updateData = req.body;

    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ status: 'error', message: 'Document not found' });
    }

    // Check authorization - only uploader can update
    if (document.uploader.toString() !== userId.toString()) {
      return res.status(403).json({ status: 'error', message: 'Not authorized to update this document' });
    }

    // Increment version on significant changes
    if (updateData.fileUrl && updateData.fileUrl !== document.fileUrl) {
      document.version = (document.version || 1) + 1;
    }

    Object.assign(document, updateData);
    await document.save();
    await document.populate('uploader', 'name email avatar');
    await document.populate('project', 'title');

    res.json({
      status: 'success',
      message: 'Document updated successfully',
      data: document,
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Delete document
export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ status: 'error', message: 'Document not found' });
    }

    // Check authorization - only uploader can delete
    if (document.uploader.toString() !== userId.toString()) {
      return res.status(403).json({ status: 'error', message: 'Not authorized to delete this document' });
    }

    await Document.findByIdAndDelete(id);

    res.json({
      status: 'success',
      message: 'Document deleted successfully',
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Get document versions
export const getDocumentVersions = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Document.findById(id)
      .populate('uploader', 'name email avatar');

    if (!document) {
      return res.status(404).json({ status: 'error', message: 'Document not found' });
    }

    // Return document with version info
    res.json({
      status: 'success',
      data: {
        _id: document._id,
        name: document.name,
        version: document.version || 1,
        updatedAt: document.updatedAt,
        uploader: document.uploader,
      },
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
