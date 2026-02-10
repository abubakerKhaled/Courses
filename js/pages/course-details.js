import { loadData } from '../modules/data.js';
import { initTheme } from '../modules/theme.js';
import { isLoggedIn } from '../modules/auth.js';
import { enrollInCourse, isEnrolled } from '../modules/enrollment.js';

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

  const enrollBtn = contentContainer.querySelector('.enroll-btn');
  if (enrollBtn) {
    enrollBtn.addEventListener('click', () => {
      if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
      }

      if (enrollInCourse(course.id)) {
        enrollBtn.textContent = 'Enrolled';
        enrollBtn.disabled = true;
      }
    });

    // If already enrolled, disable the button (double check in case render logic missed it or for safety)
    if (isEnrolled(course.id)) {
        enrollBtn.textContent = 'Enrolled';
        enrollBtn.disabled = true;
    }
  }
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
        <button class="btn btn-primary btn-lg enroll-btn" ${isEnrolled(course.id) ? 'disabled' : ''}>
          ${isEnrolled(course.id) ? 'Enrolled' : 'Enroll Now'}
        </button>
      </div>
    </div>
    <div class="course-description">
      <h2>About this course</h2>
      <p>${course.description}</p>
    </div>
    ${renderCurriculum(course.modules)}
  `;
}

function renderCurriculum(modules) {
  if (!modules || modules.length === 0) return '';

  return `
    <div class="course-curriculum">
      <h2>Course Content</h2>
      <div class="course-modules">
        ${modules.map((module) => `
          <div class="module-item">
            <details open>
                <summary class="module-title">${module.title}</summary>
                <ul class="lesson-list">
                ${module.lessons.map((lesson) => `
                    <li class="lesson-item">
                    <span class="lesson-icon">📺</span>
                    <span class="lesson-title">${lesson.title}</span>
                    <span class="lesson-duration">${lesson.duration}</span>
                    </li>
                `).join('')}
                </ul>
            </details>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', init);
