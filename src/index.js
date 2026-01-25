import './styles.css';
import { getProjects, saveToDevice, loadFromDevice } from './core/data';
import {
  addProjectToScreen,
  createProjectElement,
  renderEmptyState,
} from './dom/projectUI';
import { createTaskElement } from './dom/taskUI';
import { addSubTaskToScreen } from './dom/subTaskUI';

// Saving data
async function initApp() {
  const data = await loadFromDevice();

  if (data && data.length > 0) {
    const taskArea = document.querySelector('.task-area');
    if (taskArea) taskArea.innerHTML = ''; // Clear empty state

    data.forEach((project) => {
      // 1. Create the project UI
      const projectElement = createProjectElement(project);

      // 2. Find where tasks live in this element
      const taskList = projectElement.querySelector('.project-task-list');

      // 3. Render each task inside it
      project.tasks.forEach((task) => {
        const taskElement = createTaskElement(task, project);
        taskList.appendChild(taskElement);

        task.subTasks.forEach((sub) =>
          addSubTaskToScreen(sub, taskElement, task),
        );
      });
    });

    const allTabs = document.querySelectorAll('.project-tab');
    if (allTabs.length > 0) {
      // Retrieve the saved index, or default to 0 (the first one)
      const savedIndex = localStorage.getItem('lastSelectedIndex');
      const indexToClick =
        savedIndex !== null && savedIndex < allTabs.length ? savedIndex : 0;

      allTabs[indexToClick].click();
    }
  } else {
    renderEmptyState();
  }
}

initApp();

// Save before closing or reloading
window.addEventListener('beforeunload', () => {
  saveToDevice(getProjects());
});

// Save every 30 seconds
setInterval(() => {
  saveToDevice(getProjects());
}, 30000);

// The ability to add new projects
const newProjectButton = document.getElementById('new-project');
newProjectButton.addEventListener('click', addProjectToScreen);

// Sidebar toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  const toggleSidebar = () => {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      sidebar.classList.remove('hidden');
      sidebar.classList.toggle('active-mobile');
      document.body.classList.toggle('mobile-sidebar-open');
    } else {
      sidebar.classList.toggle('hidden');
    }
  };

  toggleBtn.addEventListener('click', toggleSidebar);

  // Close sidebar when clicking the gray area (excellent UX!)
  overlay.addEventListener('click', toggleSidebar);
});

// Remove the sidebar overlay when the screen gets wide again
const cleanupMobileState = () => {
  const isMobile = window.innerWidth <= 768;

  if (!isMobile) {
    // 1. Remove the gray-out overlay class from body
    document.body.classList.remove('mobile-sidebar-open');

    // 2. Remove the mobile sliding class from sidebar
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.remove('active-mobile');
    }
  }
};

window.addEventListener('resize', cleanupMobileState);

cleanupMobileState();
