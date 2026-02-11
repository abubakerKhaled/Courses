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
  setupModal(); // Initialize modal structure


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
    ${renderCurriculum(course.modules, course.id)}
  `;
}

function renderCurriculum(modules, courseId) {
  if (!modules || modules.length === 0) return '';
  
  const enrolled = isEnrolled(courseId);

  return `
    <div class="course-curriculum">
      <h2>Course Content</h2>
      <div class="course-modules">
        ${modules.map((module) => `
          <div class="module-item">
            <details open>
                <summary class="module-title">${module.title}</summary>
                <ul class="lesson-list">
                ${module.lessons.map((lesson) => {
                    const isLocked = !enrolled;
                    const icon = isLocked ? '🔒' : (lesson.type === 'video' ? '📺' : '📄');
                    const cssClass = isLocked ? 'lesson-item locked' : 'lesson-item unlocked';
                    
                    // We'll use data-attributes to store lesson info for simple retrieval
                    // In a real app, you might fetch lesson details by ID
                    const lessonData = enrolled ? `data-type="${lesson.type}" data-content="${lesson.content}" data-title="${lesson.title}"` : '';

                    return `
                    <li class="${cssClass}" ${lessonData}>
                    <span class="lesson-icon">${icon}</span>
                    <span class="lesson-title">${lesson.title}</span>
                    <span class="lesson-duration">${lesson.duration}</span>
                    </li>
                `}).join('')}
                </ul>
            </details>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function setupModal() {
  // Create modal HTML and append to body if it doesn't exist
  if (!document.getElementById('lesson-modal')) {
    const modalHtml = `
      <div id="lesson-modal" class="modal">
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <h2 id="modal-lesson-title"></h2>
          <div id="modal-lesson-body"></div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Close logic
    const modal = document.getElementById('lesson-modal');
    const closeBtn = modal.querySelector('.close-modal');
    
    closeBtn.onclick = () => {
        modal.style.display = "none";
        document.getElementById('modal-lesson-body').innerHTML = ''; // Stop video
    }
    
    window.onclick = (event) => {
      if (event.target == modal) {
        modal.style.display = "none";
        document.getElementById('modal-lesson-body').innerHTML = '';
      }
    }
  }

  // Add click listeners to unlocked lessons
  document.querySelectorAll('.lesson-item.unlocked').forEach(item => {
    item.addEventListener('click', () => {
      const type = item.getAttribute('data-type');
      const content = item.getAttribute('data-content');
      const title = item.getAttribute('data-title');
      openLessonModal(title, type, content);
    });
  });

  // Add click listeners to locked lessons
  document.querySelectorAll('.lesson-item.locked').forEach(item => {
    item.addEventListener('click', () => {
       alert('Please enroll in the course to access this content.');
       // Optionally scroll to enroll button
       document.querySelector('.enroll-btn')?.scrollIntoView({behavior: 'smooth'});
    });
  });
}

function openLessonModal(title, type, content) {
    const modal = document.getElementById('lesson-modal');
    const titleEl = document.getElementById('modal-lesson-title');
    const bodyEl = document.getElementById('modal-lesson-body');

    titleEl.textContent = title;
    bodyEl.innerHTML = '';

    if (type === 'video') {
        bodyEl.innerHTML = `
            <div class="video-container">
                <video controls autoplay name="media">
                    <source src="${content}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </div>
        `;
    } else if (type === 'text') {
        bodyEl.innerHTML = `<div class="text-content">${content}</div>`;
    }

    modal.style.display = "block";
}

document.addEventListener('DOMContentLoaded', init);
