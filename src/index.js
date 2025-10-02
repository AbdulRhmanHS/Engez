import "./styles.css";
import * as tasks from "./tasks"

const input = document.getElementById("task-input");
const addTaskButton = document.getElementById("add-task");
const newProjectButton = document.getElementById("new-project");
const taskArea = document.querySelector(".task-area");

function createTaskElement(task) {
  const taskElement = document.createElement("li");
  taskElement.classList.add("task");

  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";

  taskElement.appendChild(checkBox);
  taskElement.appendChild(document.createTextNode(" " + task.name));

  taskArea.appendChild(taskElement);
}

function createProjectElement(project) {
  const projectElement = document.createElement("div");
  projectElement.classList.add("project");

  const projectName = document.createElement("p");
  projectName.textContent = project.name;
  projectName.contentEditable = true;
  project.changeableName(projectName);
  projectName.classList.add("project-name");

  const projectBody = document.createElement("div");
  projectBody.classList.add("project-body");

  projectElement.append(projectName, projectBody);
  taskArea.appendChild(projectElement);
}

function addTasktoScreen() {
  if (input.value == "") {
    return;
  }
  else {
    const task = tasks.addTask(input.value);
    createTaskElement(task);
    input.value = "";
  }
}

function addProjecttoScreen() {
  const project = tasks.addProject("Default Project");
  createProjectElement(project);
}

addTaskButton.addEventListener("click", addTasktoScreen); // Add task when button is clicked

newProjectButton.addEventListener("click", addProjecttoScreen) // Add a new project

input.addEventListener("keydown", (event) => { // Add task when enter is pressed
  if (event.key == "Enter") {
    addTasktoScreen();
  }
});