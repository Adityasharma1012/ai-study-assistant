/**
 * Authentication Service
 * 
 * Provides a modular authentication abstraction designed for local development
 * and easily replaceable with Firebase Auth, Supabase Auth, or a custom REST backend.
 */

const LOCAL_STORAGE_USERS_KEY = 'study_assistant_auth_users';
const LOCAL_STORAGE_SESSION_KEY = 'study_assistant_auth_session';

// Pre-seeded default student account for instant demo access
const DEFAULT_DEMO_USER = {
  id: 'user_aditya_1',
  name: 'Aditya Sharma',
  email: 'aditya.sharma@university.edu',
  password: 'Password123!',
  avatarInitials: 'AS',
  major: 'B.Tech Computer Science & Engineering',
  semester: 'Semester 5',
  createdAt: '2026-08-15T00:00:00.000Z',
};

// Simulate realistic network delay
const simulateDelay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

function getUsers() {
  try {
    if (typeof localStorage === 'undefined') return [DEFAULT_DEMO_USER];
    const saved = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    if (!saved) {
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify([DEFAULT_DEMO_USER]));
      return [DEFAULT_DEMO_USER];
    }
    return JSON.parse(saved);
  } catch {
    return [DEFAULT_DEMO_USER];
  }
}

function saveUsers(users) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
    }
  } catch (e) {
    console.error('Failed to save users to localStorage', e);
  }
}

export const authService = {
  /**
   * Log in with Email and Password
   */
  async login(email, password) {
    await simulateDelay(500);

    const cleanEmail = email.trim().toLowerCase();
    const users = getUsers();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      throw new Error('No user account found with this email address.');
    }

    if (user.password !== password) {
      throw new Error('Incorrect password. Please try again.');
    }

    // Save session
    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarInitials: user.avatarInitials || user.name.slice(0, 2).toUpperCase(),
      major: user.major || 'Computer Science',
      semester: user.semester || 'Semester 5',
    };

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(sessionUser));
    }

    return sessionUser;
  },

  /**
   * Sign up a new user account
   */
  async signup(name, email, password, metadata = {}) {
    await simulateDelay(600);

    const cleanEmail = email.trim().toLowerCase();
    const users = getUsers();

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email address already exists. Please log in.');
    }

    const nameParts = name.trim().split(' ');
    const initials = nameParts.length >= 2
      ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();

    const newUser = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password: password,
      avatarInitials: initials,
      major: metadata.major || 'Computer Science & Engineering',
      semester: metadata.semester || 'Semester 1',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    // Save session
    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      avatarInitials: newUser.avatarInitials,
      major: newUser.major,
      semester: newUser.semester,
    };

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(sessionUser));
    }

    return sessionUser;
  },

  /**
   * Log out current user
   */
  async logout() {
    await simulateDelay(200);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
    }
    return true;
  },

  /**
   * Send Password Reset Instructions
   */
  async resetPassword(email) {
    await simulateDelay(600);
    const cleanEmail = email.trim().toLowerCase();
    const users = getUsers();
    const exists = users.some((u) => u.email.toLowerCase() === cleanEmail);

    if (!exists) {
      throw new Error('No user account found with this email.');
    }

    return {
      success: true,
      message: `Password reset instructions and verification link sent to ${cleanEmail}.`,
    };
  },

  /**
   * Get Currently Logged In User
   */
  getCurrentUser() {
    try {
      if (typeof localStorage === 'undefined') return null;
      const session = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  },

  /**
   * Quick Demo Login
   */
  async demoLogin() {
    return this.login(DEFAULT_DEMO_USER.email, DEFAULT_DEMO_USER.password);
  }
};
