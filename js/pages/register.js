/**
 * Registration Page Logic
 * Handles form validation and storage of user data in localStorage.
 */

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form');
  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');

  // Error display helper
  const showError = (input, message) => {
    const errorDiv = document.getElementById(`${input.id}-error`);
    if (errorDiv) {
      errorDiv.textContent = message;
    }
    input.classList.add('error');
  };

  const clearError = (input) => {
    const errorDiv = document.getElementById(`${input.id}-error`);
    if (errorDiv) {
      errorDiv.textContent = '';
    }
    input.classList.remove('error');
  };

  // Main Form Submission Handler
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // 1. clear previous errors
    [usernameInput, emailInput, passwordInput, confirmPasswordInput].forEach(clearError);

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    let isValid = true;

    // 2. Validation Logic
    if (password !== confirmPassword) {
      showError(confirmPasswordInput, 'Passwords do not match');
      isValid = false;
    }

    if (password.length < 6) {
        showError(passwordInput, 'Password must be at least 6 characters');
        isValid = false;
    }

    // Check if email already exists
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const emailExists = existingUsers.some(user => user.email === email);
    
    if (emailExists) {
        showError(emailInput, 'This email is already registered');
        isValid = false;
    }

    if (!isValid) return;

    // 3. Store User Data
    const newUser = {
      id: Date.now(),
      username: username,
      email: email,
      password: password // Note: In a real app, never store plain text passwords!
    };

    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    // 4. Success & Redirect
    window.location.href = '../index.html'; // Redirect to home/login
  });

  // Real-time validation (optional UX improvement)
  confirmPasswordInput.addEventListener('input', () => {
    if (confirmPasswordInput.value !== passwordInput.value) {
        // We could show error immediately, or just wait for submit. 
        // For now, let's just clear if they match.
    } else {
        clearError(confirmPasswordInput);
    }
  });
});
