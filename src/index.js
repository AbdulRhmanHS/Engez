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