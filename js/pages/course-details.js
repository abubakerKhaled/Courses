import { loadData } from '../modules/data.js';
import { initTheme } from '../modules/theme.js';

async function init() {
  initTheme();
  const contentContainer = document.getElementById('course-content');
  if (!contentContainer) return;

  const urlParams = new URLSearchParams(window.location.search);
  const courseId = parseInt(urlParams.get('id'));

  if (!courseId) {
    showError(contentContainer, 'No course ID provided.');
    return;
  }

  const courses = await loadData('../data/courses.json');

  if (!courses) {
    showError(contentContainer, 'Failed to load course data. Please try again later.');
    return;
  }

  const course = courses.find(c => c.id === courseId);

  if (!course) {
    showError(contentContainer, 'Course not found.');
    return;
  }

  renderCourseDetails(course, contentContainer);
}

function showError(container, message) {
  container.innerHTML = `<div class="error-message">${message}</div>`;
}

function renderCourseDetails(course, container) {
  container.innerHTML = `
    <div class="course-header">
      <div class="course-img">
        <img src="${course.image}" alt="${course.title}">
      </div>
      <div class="course-info">
        <div class="course-meta">
          <span class="category-badge">${course.category}</span>
          <span class="rating">⭐ ${course.rating} (${course.students.toLocaleString()} students)</span>
        </div>
        <h1>${course.title}</h1>
        <p class="instructor">By <strong>${course.instructor}</strong></p>
        <span class="price-tag">$${course.price}</span>
        <button class="btn btn-primary btn-lg">Enroll Now</button>
      </div>
    </div>
    <div class="course-description">
      <h2>About this course</h2>
      <p>${course.description}</p>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', init);
