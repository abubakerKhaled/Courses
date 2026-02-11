import { loadData } from '../modules/data.js';


async function init() {
  const coursesGrid = document.getElementById('courses-grid');
  if (!coursesGrid) return;

  const courses = await loadData('../data/courses.json');

  if (!courses) {
    coursesGrid.innerHTML = '<p>Failed to load courses. Please try again later.</p>';
    return;
  }

  renderCourses(courses, coursesGrid);
}

function renderCourses(courses, container) {
  container.innerHTML = courses.map(course => createCourseCard(course)).join('');
}

function createCourseCard(course) {
  return `
    <article class="course-card">
      <div class="course-image">
        <img src="${course.image}" alt="${course.title}" loading="lazy">
      </div>
      <div class="course-content">
        <div class="course-meta">
          <span class="course-category">${course.category}</span>
          <span class="course-rating">⭐ ${course.rating}</span>
        </div>
        <h3 class="course-title">${course.title}</h3>
        <p class="course-instructor">By ${course.instructor}</p>
        <div class="course-footer">
          <span class="course-price">$${course.price}</span>
          <a href="course-details.html?id=${course.id}" class="btn btn-sm btn-primary">View Details</a>
        </div>
      </div>
    </article>
  `;
}

document.addEventListener('DOMContentLoaded', init);
