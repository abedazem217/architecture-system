import mongoose from 'mongoose';

/**
 * Meeting Schema
 * Represents meetings between architect and client
 */
const meetingSchema = new mongoose.Schema(
  {
    // Basic Information
    title: {
      type: String,
      required: [true, 'Please provide a meeting title'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
    },
    description: {
      type: String,
      trim: true,
    },

    // Date & Time
    date: {
      type: Date,
      required: [true, 'Please provide a meeting date'],
    },
    duration: {
      type: Number, // in minutes
      default: 60,
    },

    // Location
    location: {
      type: String,
      trim: true,
    },

    // Status
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled',
    },

    // Relations
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Please assign a project'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please specify who created the meeting'],
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    // Content
    notes: {
      type: String,
      trim: true,
    },
    attachments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
      },
    ],

    // Metadata
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
meetingSchema.index({ project: 1 });
meetingSchema.index({ createdBy: 1 });
meetingSchema.index({ date: 1 });
meetingSchema.index({ status: 1 });

export default mongoose.model('Meeting', meetingSchema);
