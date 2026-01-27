import express from 'express';
import auth from '../middlewares/auth.js';
import {
  uploadDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  getDocumentVersions,
} from '../controllers/documentController.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Upload a new document
router.post('/', uploadDocument);

// Get all documents with filters
router.get('/', getDocuments);

// Get document versions
router.get('/:id/versions', getDocumentVersions);

// Get a specific document by ID
router.get('/:id', getDocumentById);

// Update document metadata
router.put('/:id', updateDocument);

// Delete a document
router.delete('/:id', deleteDocument);

export default router;
