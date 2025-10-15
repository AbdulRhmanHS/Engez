import * as data from "../core/data";
import { addTasktoScreen } from "./taskUI";
import { makeEditable, getUniqueName } from "../core/utils";


/* ------------ Public API ------------ */

export function addProjecttoScreen() {
  const project = data.addProject(getUniqueName("Default Project"));
  createProjectElement(project);
}

export function createProjectElement(project) {
  const taskArea = document.querySelector(".task-area");

  // Base container
  const projectElement = document.createElement("div");
  projectElement.classList.add("project");
  projectElement.projectObj = project;

  // Name header
  const projectName = createEditableName(project);

  // Body (input + task list)
  const projectBody = createProjectBody(projectElement);

  projectElement.append(projectName, projectBody);
  taskArea.appendChild(projectElement);
}


/* ------------ Internal Helpers ------------ */

function createEditableName(project) {
  const el = document.createElement("p");
  el.classList.add("project-name");
  el.textContent = project.name;
  el.contentEditable = true;
  makeEditable(el, project);
  return el;
}

function createProjectBody(projectElement) {
  const body = document.createElement("div");
  body.classList.add("project-body");

  const input = createTaskInput(projectElement);
  const button = createAddButton(projectElement, input);

  const inputGroup = document.createElement("div");
  inputGroup.classList.add("project-input");
  inputGroup.append(input, button);

  const taskList = document.createElement("div");
  taskList.classList.add("project-task-list");

  body.append(inputGroup, taskList);
  return body;
}

function createTaskInput(projectElement) {
  const input = document.createElement("input");
  input.type = "text";
  input.name = "task-input";
  input.classList.add("task-input");
  input.placeholder = "Enter task name";
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTasktoScreen(input, projectElement);
  });
  return input;
}

function createAddButton(projectElement, input) {
  const btn = document.createElement("button");
  btn.classList.add("add-task-button");
  btn.textContent = "Add Task";
  btn.addEventListener("click", () => addTasktoScreen(input, projectElement));
  return btn;
}