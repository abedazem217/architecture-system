import mongoose from 'mongoose';

/**
 * User Schema
 * Represents Architects, Clients, and Admins
 */
const userSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      match: [/^[\d\s\-\+\(\)]+$/, 'Please provide a valid phone number'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },

    // Role-based
    role: {
      type: String,
      enum: ['admin', 'architect', 'client'],
      default: 'client',
    },

    // Profile Information
    profilePic: {
      type: String,
      default: null,
    },
    company: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    specialization: {
      type: String,
      trim: true,
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
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

// Index for faster lookups
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name (if needed)
userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Password hashing middleware (to be implemented in controller)
// userSchema.pre('save', async function(next) { ... })

export default mongoose.model('User', userSchema);
