import express from 'express';
import auth from '../middlewares/auth.js';
import authorize from '../middlewares/authorize.js';
import {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';

const router = express.Router();

/**
 * All routes require authentication
 */
router.use(auth);

/**
 * GET Routes (Public for authenticated users)
 */
router.get('/', listProjects);
router.get('/:id', getProject);

/**
 * POST Routes (Architect & Admin only)
 */
router.post('/', authorize('admin', 'architect'), createProject);

/**
 * PUT Routes (Architect & Admin only)
 */
router.put('/:id', authorize('admin', 'architect'), updateProject);

/**
 * DELETE Routes (Architect & Admin only)
 */
router.delete('/:id', authorize('admin', 'architect'), deleteProject);

export default router;
