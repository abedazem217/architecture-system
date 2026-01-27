import express from 'express';
import auth from '../middlewares/auth.js';
import {
  createMeeting,
  getMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
  addParticipant,
} from '../controllers/meetingController.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Create a new meeting
router.post('/', createMeeting);

// Get all meetings for the authenticated user
router.get('/', getMeetings);

// Get a specific meeting by ID
router.get('/:id', getMeetingById);

// Update a meeting
router.put('/:id', updateMeeting);

// Delete a meeting
router.delete('/:id', deleteMeeting);

// Add participant to meeting
router.post('/:id/participants', addParticipant);

export default router;
