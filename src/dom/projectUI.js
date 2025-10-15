import * as data from "../core/data"
import { addTasktoScreen } from "./taskUI";
import { makeEditable, getUniqueName } from "../core/utils";


export function createProjectElement(project) {
  const taskArea = document.querySelector(".task-area");

  const projectElement = document.createElement("div");
  projectElement.classList.add("project");
  projectElement.projectObj = project; // Link the project object to the project element

  const projectName = document.createElement("p");
  projectName.classList.add("project-name");
  projectName.textContent = project.name;
  projectName.contentEditable = true;

  const projectBody = document.createElement("div");
  projectBody.classList.add("project-body");

  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.name = "task-input";
  inputField.classList.add("task-input");
  inputField.placeholder = "Enter task name";
  inputField.addEventListener("keydown", (event) => { // Add task when enter is pressed
    if (event.key == "Enter") {
      addTasktoScreen(inputField, projectElement);
    }
  });

  const addTaskButton = document.createElement("button");
  addTaskButton.classList.add("add-task-button");
  addTaskButton.textContent = "Add Task";
  addTaskButton.addEventListener("click", ()=> { // Add task when button is clicked
    addTasktoScreen(inputField, projectElement);
  });

  const projectInput = document.createElement("div");
  projectInput.classList.add("project-input");

  const projectTaskList = document.createElement("div");
  projectTaskList.classList.add("project-task-list");

  projectInput.append(inputField, addTaskButton);
  projectBody.append(projectInput, projectTaskList);
  projectElement.append(projectName, projectBody);
  taskArea.appendChild(projectElement);
  makeEditable(projectName, project);
}

export function addProjecttoScreen() {
  const project = data.addProject(getUniqueName("Default Project"));
  createProjectElement(project);
}