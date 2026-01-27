/**
 * Validation Functions
 */

// Validate User Registration
export const validateUserRegistration = (userData) => {
  const errors = [];

  if (!userData.name || userData.name.trim().length < 3) {
    errors.push('Name must be at least 3 characters');
  }

  if (!userData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    errors.push('Valid email is required');
  }

  if (!userData.password || userData.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (!userData.phone || userData.phone.length < 10) {
    errors.push('Valid phone number is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validate Project Creation
export const validateProjectCreation = (projectData) => {
  const errors = [];

  if (!projectData.title || projectData.title.trim().length < 3) {
    errors.push('Project title is required and must be at least 3 characters');
  }

  if (!projectData.description || projectData.description.trim().length < 10) {
    errors.push('Project description must be at least 10 characters');
  }

  if (!projectData.clientId) {
    errors.push('Client ID is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validate Meeting Creation
export const validateMeetingCreation = (meetingData) => {
  const errors = [];

  if (!meetingData.title || meetingData.title.trim().length < 3) {
    errors.push('Meeting title is required');
  }

  if (!meetingData.date || new Date(meetingData.date) < new Date()) {
    errors.push('Meeting date must be in the future');
  }

  if (!meetingData.participants || meetingData.participants.length === 0) {
    errors.push('At least one participant is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
