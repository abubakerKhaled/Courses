/**
 * Authentication State Management
 * Handles user authentication state and updates UI accordingly
 */

/**
 * Get the currently logged-in user from localStorage
 * @returns {Object|null} User object or null if not logged in
 */
export function getCurrentUser() {
  const userJSON = localStorage.getItem('currentUser');
  return userJSON ? JSON.parse(userJSON) : null;
}

/**
 * Check if a user is currently logged in
 * @returns {boolean} True if user is logged in
 */
export function isLoggedIn() {
  return getCurrentUser() !== null;
}

/**
 * Log out the current user
 */
export function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = window.location.pathname.includes('/pages/') 
    ? '../index.html' 
    : 'index.html';
}

/**
 * Update the auth buttons in the header based on authentication state
 */
export function updateAuthUI() {
  const authButtons = document.querySelector('.auth-buttons');
  if (!authButtons) return;

  const user = getCurrentUser();
  const themeToggle = document.getElementById('theme-toggle');
  
  console.log('UpdateAuthUI user:', user);
  console.log('UpdateAuthUI themeToggle:', themeToggle);

  if (themeToggle) {
    themeToggle.remove();
  }

  if (user) {
    // User is logged in - show inline profile
    authButtons.innerHTML = `
      <div class="user-profile">
        <span class="profile-username">${user.username}</span>
        <button id="logout-btn" class="btn btn-secondary">Logout</button>
      </div>
    `;
    
    // Add logout event listener
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', logout);
    }
  } else {
    // User is not logged in - show login/register buttons
    const isInPagesFolder = window.location.pathname.includes('/pages/');
    const loginPath = isInPagesFolder ? 'login.html' : 'pages/login.html';
    const registerPath = isInPagesFolder ? 'register.html' : 'pages/register.html';
    
    authButtons.innerHTML = `
      <a href="${loginPath}" class="btn btn-text">Login</a>
      <a href="${registerPath}" class="btn btn-primary">Register</a>
    `;
  }

  // Re-append theme toggle button to preserve event listeners
  if (themeToggle) {
    authButtons.appendChild(themeToggle);
  }
}

/**
 * Initialize auth state management
 * Call this on page load to set up the auth UI
 */
export function initAuth() {
  console.log('InitAuth called');
  updateAuthUI();
  
  // Redirect logged-in users away from login/register pages
  const currentPath = window.location.pathname;
  if (isLoggedIn() && (currentPath.includes('login.html') || currentPath.includes('register.html'))) {
    window.location.href = currentPath.includes('/pages/') ? '../index.html' : 'index.html';
  }
}
