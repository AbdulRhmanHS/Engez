import "./styles.css";
import { getProjects } from "./core/data";
import { addProjectToScreen } from "./dom/projectUI";

const newProjectButton = document.getElementById("new-project");
newProjectButton.addEventListener("click", addProjectToScreen);
window.getProjects = getProjects; // For testing only

// Default project at first load
addProjectToScreen();
const firstProject = document.querySelector(".project-tab");
firstProject.click();

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