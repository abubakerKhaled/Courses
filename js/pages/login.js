/**
 * Login Page Logic
 * Handles form validation and authentication against localStorage.
 */
import { showError, clearError } from '../modules/error.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  // Main Form Submission Handler
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // 1. Clear previous errors
    [emailInput, passwordInput].forEach(clearError);

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    let isValid = true;

    // 2. Basic validation
    if (!email || !password) {
      showError(emailInput, 'Please fill in all fields');
      return;
    }

    // 3. Retrieve users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');

    // 4. Find user by email
    const user = existingUsers.find(u => u.email === email);

    if (!user) {
      showError(emailInput, 'No account found with this email');
      isValid = false;
    } else if (user.password !== password) {
      showError(passwordInput, 'Incorrect password');
      isValid = false;
    }

    if (!isValid) return;

    // 5. Successful login - Store logged-in user
    localStorage.setItem('currentUser', JSON.stringify(user));

    // 6. Success & Redirect
    window.location.href = '../index.html'; // Redirect to home
  });

  // Clear errors on input
  emailInput.addEventListener('input', () => clearError(emailInput));
  passwordInput.addEventListener('input', () => clearError(passwordInput));
});
