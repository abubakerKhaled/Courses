

export const showError = (input, message) => {
  const errorDiv = document.getElementById(`${input.id}-error`);
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
  }
  input.classList.add('error');
};

export const clearError = (input) => {
  const errorDiv = document.getElementById(`${input.id}-error`);
  if (errorDiv) {
    errorDiv.textContent = '';
    errorDiv.style.display = 'none';
  }
  input.classList.remove('error');
};