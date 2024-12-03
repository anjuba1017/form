// src/utils/session.js
import axios from 'axios';

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzOgroOV99-ZevoFdpcEf1EkKZzo1A-0zTpgfGBSefcOcFKfEvqEg8cXZO_Gs2SP94JYg/exec';

// Initialize session from URL
export const initializeSession = async (email) => {
  try {
    const existingSession = localStorage.getItem('formSession');
    if (existingSession) {
      return JSON.parse(existingSession);
    }

    const response = await axios.post(GOOGLE_APPS_SCRIPT_URL, {
      action: 'createSession',
      email: email
    });

    if (response.data.success) {
      const sessionData = {
        sessionId: response.data.sessionId,
        email: email,
        lastActive: new Date().toISOString()
      };
      localStorage.setItem('formSession', JSON.stringify(sessionData));
      return sessionData;
    }
  } catch (error) {
    console.error('Error initializing session:', error);
    throw error;
  }
};

// Auto-save form progress
export const saveFormProgress = async (formData) => {
  try {
    const session = JSON.parse(localStorage.getItem('formSession'));
    if (!session) throw new Error('No active session');

    await axios.post(GOOGLE_APPS_SCRIPT_URL, {
      action: 'saveProgress',
      sessionId: session.sessionId,
      email: session.email,
      formData: formData
    });
  } catch (error) {
    console.error('Error saving progress:', error);
    throw error;
  }
};

// Load saved progress
export const loadFormProgress = async () => {
  try {
    const session = JSON.parse(localStorage.getItem('formSession'));
    if (!session) return null;

    const response = await axios.get(`${GOOGLE_APPS_SCRIPT_URL}?sessionId=${session.sessionId}`);
    
    if (response.data.success) {
      return response.data.formData;
    }
    return null;
  } catch (error) {
    console.error('Error loading progress:', error);
    return null;
  }
};