import mongoose from 'mongoose';

/**
 * Project Schema
 * Represents an architectural project
 */
const projectSchema = new mongoose.Schema(
  {
    // Basic Information
    title: {
      type: String,
      required: [true, 'Please provide a project title'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      minlength: [10, 'Description must be at least 10 characters'],
    },

    // Status & Phase
    status: {
      type: String,
      enum: ['planning', 'licensed', 'in_progress', 'completed', 'on_hold'],
      default: 'planning',
    },
    phase: {
      type: String,
      enum: ['planning', 'licensing', 'construction', 'completion'],
      default: 'planning',
    },

    // People Involved
    architect: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please assign an architect'],
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please assign a client'],
    },

    // Project Details
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    budget: {
      type: Number,
      default: null,
    },
    location: {
      type: String,
      trim: true,
    },

    // Relations
    documents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
      },
    ],
    meetings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meeting',
      },
    ],

    // Notes
    notes: {
      type: String,
      trim: true,
    },

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
projectSchema.index({ architect: 1 });
projectSchema.index({ client: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ phase: 1 });
projectSchema.index({ createdAt: -1 });

export default mongoose.model('Project', projectSchema);
