import Meeting from '../models/Meeting.js';
import Project from '../models/Project.js';

// Create a new meeting
export const createMeeting = async (req, res) => {
  try {
    const { title, description, date, duration, location, projectId, participants } = req.body;
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
      return res.status(403).json({ status: 'error', message: 'Not authorized to create meeting for this project' });
    }

    const meeting = new Meeting({
      title,
      description,
      date,
      duration: duration || 60,
      location,
      project: projectId,
      creator: userId,
      participants: participants?.length > 0 ? participants : [userId],
      status: 'scheduled',
    });

    await meeting.save();
    await meeting.populate('creator', 'name email avatar');
    await meeting.populate('project', 'title');

    res.status(201).json({
      status: 'success',
      message: 'Meeting created successfully',
      data: meeting,
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Get all meetings with filters
export const getMeetings = async (req, res) => {
  try {
    const { projectId, status, limit = 50, page = 1 } = req.query;
    const userId = req.user._id;

    const filter = { participants: userId };
    if (projectId) filter.project = projectId;
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const meetings = await Meeting.find(filter)
      .populate('creator', 'name email avatar')
      .populate('project', 'title')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Meeting.countDocuments(filter);

    res.json({
      status: 'success',
      data: meetings,
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

// Get meeting by ID
export const getMeetingById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const meeting = await Meeting.findById(id)
      .populate('creator', 'name email avatar')
      .populate('project', 'title description')
      .populate('participants', 'name email avatar');

    if (!meeting) {
      return res.status(404).json({ status: 'error', message: 'Meeting not found' });
    }

    // Check authorization
    const isParticipant = meeting.participants.some(p => p._id.toString() === userId.toString());
    if (!isParticipant) {
      return res.status(403).json({ status: 'error', message: 'Not authorized to view this meeting' });
    }

    res.json({ status: 'success', data: meeting });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Update meeting
export const updateMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const updateData = req.body;

    const meeting = await Meeting.findById(id);
    if (!meeting) {
      return res.status(404).json({ status: 'error', message: 'Meeting not found' });
    }

    // Check authorization - only creator can update
    if (meeting.creator.toString() !== userId.toString()) {
      return res.status(403).json({ status: 'error', message: 'Not authorized to update this meeting' });
    }

    Object.assign(meeting, updateData);
    await meeting.save();
    await meeting.populate('creator', 'name email avatar');
    await meeting.populate('project', 'title');

    res.json({
      status: 'success',
      message: 'Meeting updated successfully',
      data: meeting,
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Delete meeting
export const deleteMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const meeting = await Meeting.findById(id);
    if (!meeting) {
      return res.status(404).json({ status: 'error', message: 'Meeting not found' });
    }

    // Check authorization - only creator can delete
    if (meeting.creator.toString() !== userId.toString()) {
      return res.status(403).json({ status: 'error', message: 'Not authorized to delete this meeting' });
    }

    await Meeting.findByIdAndDelete(id);

    res.json({
      status: 'success',
      message: 'Meeting deleted successfully',
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Add participant to meeting
export const addParticipant = async (req, res) => {
  try {
    const { id } = req.params;
    const { participantId } = req.body;
    const userId = req.user._id;

    const meeting = await Meeting.findById(id);
    if (!meeting) {
      return res.status(404).json({ status: 'error', message: 'Meeting not found' });
    }

    // Check authorization
    if (meeting.creator.toString() !== userId.toString()) {
      return res.status(403).json({ status: 'error', message: 'Not authorized' });
    }

    if (!meeting.participants.includes(participantId)) {
      meeting.participants.push(participantId);
      await meeting.save();
    }

    await meeting.populate('participants', 'name email avatar');

    res.json({
      status: 'success',
      message: 'Participant added',
      data: meeting,
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};
