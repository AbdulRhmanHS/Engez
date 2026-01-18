import { addProject, deleteProject } from "../core/data";
import { addTaskToScreen } from "./taskUI";
import { makeEditable, getUniqueName } from "../core/utils";


/* ------------ Public API ------------ */

export function addProjectToScreen() {
  const project = addProject(getUniqueName("Default Project"));
  createProjectElement(project);
}

export function createProjectElement(project) {
  const sidebar = document.querySelector(".sidebar");
  const taskArea = document.querySelector(".task-area");

  // Base container
  const projectElement = document.createElement("div");
  projectElement.classList.add("project");
  projectElement.projectObj = project;
  createProjectBody(projectElement);

  const projectTab = createProjectTab(project, projectElement);

  sidebar.appendChild(projectTab);
  projectTab.addEventListener("click", () => showProject(projectTab, projectElement, taskArea));
}


/* ------------ Internal Helpers ------------ */

function createProjectTab(project, projectElement) {
  const el = document.createElement("div");
  el.classList.add("project-tab");

  const name = document.createElement("p");
  name.classList.add("project-name");
  name.textContent = project.name;
  name.addEventListener("dblclick", () => {
    makeEditable(el, project);
  });

  const menu = createProjectMenuButton(project, projectElement);

  el.append(name, menu);
  return el;
}

function createProjectBody(projectElement) {
  const input = createTaskInput(projectElement);
  const button = createAddButton(projectElement, input);

  const inputGroup = document.createElement("div");
  inputGroup.classList.add("project-input");
  inputGroup.append(input, button);

  const taskList = document.createElement("div");
  taskList.classList.add("project-task-list");

  projectElement.append(inputGroup, taskList);
}

function createTaskInput(projectElement) {
  const input = document.createElement("input");
  input.type = "text";
  input.name = "task-input";
  input.classList.add("task-input");
  input.placeholder = "Enter task name";
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTaskToScreen(input, projectElement);
  });
  return input;
}

function createAddButton(projectElement, input) {
  const btn = document.createElement("button");
  btn.classList.add("add-task-button");
  btn.textContent = "Add Task";
  btn.addEventListener("click", () => addTaskToScreen(input, projectElement));
  return btn;
}

function showProject(projectTab, projectElement, taskArea) {

  const projectMenuButton = projectTab.querySelector(".project-menu-btn");

  if (taskArea) {
    taskArea.innerHTML = '';
    // Remove selection
    Array.from(document.querySelectorAll(".project-tab"), element => {
      element.classList.remove("selected-project");
      // Remove the menu
      element.querySelector(".project-menu-btn").style.display = "none";
    });
  }

  projectMenuButton.style.display = "block"; // Add the menu only when the tab is selected
  projectTab.classList.add("selected-project");
  taskArea.append(projectElement);
}

function createProjectMenuButton(projectObj, projectElement) {
  const btn = document.createElement("button");
  btn.classList.add("project-menu-btn");
  btn.textContent = "⋮";
  btn.style.display = "none"; // Hidden by default

  const menu = buildProjectMenu(projectObj, projectElement);
  btn.addEventListener("click", (e) => toggleMenu(e, menu));

  const wrapper = document.createElement("div");
  wrapper.classList.add("project-menu-wrapper");
  wrapper.append(btn, menu);

  return wrapper;
}

function buildProjectMenu(projectObj, projectElement) {
  const menu = document.createElement("ul");
  menu.classList.add("project-menu");
  menu.style.display = "none";

  const del = document.createElement("li");
  del.textContent = "Delete";
  
  del.addEventListener("click", (e) => {
    e.stopPropagation();
    deleteProject(projectObj);

    const allTabs = document.querySelectorAll(".project-tab");
    allTabs.forEach(tab => {

        if (tab.querySelector(".project-name").textContent === projectObj.name) {
            tab.remove();
        }
    });

    const taskArea = document.querySelector(".task-area");
      if (taskArea && taskArea.contains(projectElement)) {
          taskArea.innerHTML = '';
      }

    projectElement.remove();
    menu.style.display = "none";

  });

  menu.append(del);
  return menu;
}

function toggleMenu(event, menu) {
  event.stopPropagation();

  // close others
  document.querySelectorAll(".project-menu").forEach((m) => {
    if (m !== menu) m.style.display = "none";
  });

  // toggle this one
  const open = menu.style.display === "block";
  menu.style.display = open ? "none" : "block";
}