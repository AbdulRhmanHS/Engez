import "./styles.css";
import { getProjects } from "./core/data";
import { addProjecttoScreen } from "./dom/projectUI";


const newProjectButton = document.getElementById("new-project");
newProjectButton.addEventListener("click", addProjecttoScreen);
window.getProjects = getProjects; // For testing only