import { getCurrentUser } from './auth.js';

/**
 * Check if the current user is enrolled in a specific course
 * @param {number} courseId - The ID of the course to check
 * @returns {boolean} True if enrolled, false otherwise
 */
export function isEnrolled(courseId) {
  const user = getCurrentUser();
  if (!user || !user.enrolledCourses) return false;
  return user.enrolledCourses.includes(courseId);
}

/**
 * Enroll the current user in a course
 * @param {number} courseId - The ID of the course to enroll in
 * @returns {boolean} True if enrollment was successful, false otherwise
 */
export function enrollInCourse(courseId) {
  const user = getCurrentUser();
  if (!user) return false;

  // Initialize enrolledCourses if it doesn't exist (handle legacy users)
  if (!user.enrolledCourses) {
    user.enrolledCourses = [];
  }

  // Avoid duplicate enrollment
  if (user.enrolledCourses.includes(courseId)) {
    return true;
  }

  user.enrolledCourses.push(courseId);

  // Update localStorage for currentUser
  localStorage.setItem('currentUser', JSON.stringify(user));

  // Update localStorage for users array
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const updatedUsers = users.map(u => {
    if (u.email === user.email) {
      return user;
    }
    return u;
  });
  localStorage.setItem('users', JSON.stringify(updatedUsers));

  return true;
}
