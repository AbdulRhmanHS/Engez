import "./styles.css"
import * as data from "./core/data"
import { addProjecttoScreen } from "./dom/projectUI";

const newProjectButton = document.getElementById("new-project");
newProjectButton.addEventListener("click", addProjecttoScreen) // Add a new project
window.getProjects = data.getProjects; // For testing only