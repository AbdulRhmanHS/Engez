import { addProject, deleteProject } from "../core/data";
import { addTaskToScreen } from "./taskUI";
import { getUniqueName } from "../core/utils";
import emptyIllustration from "../assets/undraw_no-data_ig65.svg";


/* ------------ Public API ------------ */

export function addProjectToScreen() {
  const project = addProject(getUniqueName("Project"));
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

  projectElement.associatedTab = projectTab;

  sidebar.appendChild(projectTab);
  projectTab.addEventListener("click", () => showProject(projectTab, projectElement, taskArea));
  projectTab.click();
}

export function renderEmptyState() {
  const taskArea = document.querySelector(".task-area");
  taskArea.innerHTML = `
    <div class="empty-state">
      <img src="${emptyIllustration}" alt="No projects" />
      <h2>Barakah starts with a plan</h2>
      <p>Create a project to start your journey of Ihsan.</p>
      <button onclick="document.getElementById('new-project').click()">Create Project</button>
    </div>
  `;
}

/* ------------ Internal Helpers ------------ */

function createProjectTab(project, projectElement) {
  const el = document.createElement("div");
  el.classList.add("project-tab");

  const name = document.createElement("p");
  name.classList.add("project-name");
  name.textContent = project.name;

  const menu = createProjectMenuButton(project, projectElement);

  el.append(name, menu);
  return el;
}

function createProjectBody(projectElement) {
  const greeting = createGreeting();
  const input = createTaskInput(projectElement);
  const button = createAddButton(projectElement, input);

  const inputGroup = document.createElement("div");
  inputGroup.classList.add("project-input");
  inputGroup.append(input, button);

  const taskList = document.createElement("div");
  taskList.classList.add("project-task-list");

  projectElement.append(greeting ,inputGroup, taskList);
}

function createGreeting() {
  const el = document.createElement("h2");
  el.classList.add("greeting");
  el.textContent = "May Allah guide you to success!";

  return el;
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
      // Close all the other menus
      element.querySelector(".project-menu").style.display = "none";
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

  const rename = document.createElement("li");
  rename.textContent = "Rename";
  rename.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.style.display = "none";

    const tab = projectElement.associatedTab;
    const nameP = tab.querySelector(".project-name");
    
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.classList.add("edit-project-name");
    nameInput.value = nameP.textContent;

    nameP.replaceWith(nameInput);
    nameInput.focus();
    nameInput.select();

    // We use a flag to prevent the "Double Save"
    let isSaved = false;

    const saveName = () => {
      if (isSaved) return; // If already saved by Enter, don't do it again on Blur
      isSaved = true;

      const newName = nameInput.value.trim();
      if (newName !== "") {
        projectObj.name = newName;
        nameP.textContent = newName;
      }
      
      // Check if nameInput is still in the DOM before replacing
      if (nameInput.parentNode) {
        nameInput.replaceWith(nameP);
      }
    };

    nameInput.addEventListener("keydown", (k) => {
      if (k.key === "Enter") {
        saveName();
      }
      if (k.key === "Escape") {
        isSaved = true; // Mark as handled
        nameInput.replaceWith(nameP);
      }
    });

    nameInput.addEventListener("blur", saveName);
  });

  const del = document.createElement("li");
  del.textContent = "Delete";
  del.addEventListener("click", (e) => {
    e.stopPropagation();

    // Get all tabs from the sidebar BEFORE we remove the current one
    const sidebar = document.querySelector(".sidebar");
    const allTabs = Array.from(sidebar.querySelectorAll(".project-tab"));
    const currentIndex = allTabs.indexOf(projectElement.associatedTab);

    // 1. Delete from data and remove DOM elements
    deleteProject(projectObj);
    if (projectElement.associatedTab) {
      projectElement.associatedTab.remove();
    }
    projectElement.remove();
    menu.style.display = "none";

    // 2. A function to select the "previous" or "next" project
    selectPreviousProject(currentIndex);
  });

  menu.append(rename, del);
  return menu;
}

function toggleMenu(event, menu) {
  event.stopPropagation();

  // toggle this one
  const open = menu.style.display === "block";
  menu.style.display = open ? "none" : "block";
}

function selectPreviousProject(deletedIndex) {
  const sidebar = document.querySelector(".sidebar");
  const remainingTabs = sidebar.querySelectorAll(".project-tab");
  const taskArea = document.querySelector(".task-area");

  if (remainingTabs.length > 0) {
    // Use the index we saved before deletion
    const indexToSelect = Math.max(0, deletedIndex - 1);
    remainingTabs[indexToSelect].click();
  } else {
    if (taskArea) {
      taskArea.innerHTML = '';
      renderEmptyState();
    }
  }
}