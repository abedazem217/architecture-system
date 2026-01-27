import mongoose from 'mongoose';

/**
 * Document Schema
 * Represents files and documents associated with projects
 */
const documentSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, 'Please provide a document name'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
    },

    // Type
    type: {
      type: String,
      enum: ['blueprint', 'license', 'contract', 'report', 'other'],
      required: [true, 'Please specify document type'],
    },

    // File Information
    fileUrl: {
      type: String,
      required: [true, 'Please provide file URL or path'],
    },
    fileSize: {
      type: Number, // in bytes
      default: null,
    },
    mimeType: {
      type: String,
      default: 'application/octet-stream',
    },

    // Relations
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Please assign a project'],
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please specify who uploaded'],
    },

    // Content
    description: {
      type: String,
      trim: true,
    },

    // Versioning
    version: {
      type: Number,
      default: 1,
    },

    // Access Control
    isPublic: {
      type: Boolean,
      default: false,
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
documentSchema.index({ project: 1 });
documentSchema.index({ uploadedBy: 1 });
documentSchema.index({ type: 1 });
documentSchema.index({ createdAt: -1 });

export default mongoose.model('Document', documentSchema);
