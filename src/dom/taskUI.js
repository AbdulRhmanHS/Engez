import * as data from "../core/data";
import { showEditMenu } from "./editMenu";


/* ------------ Public API ------------ */

export function addTasktoScreen(input, projectElement) {
  const name = input.value.trim();
  if (!name) return;

  const task = data.addTask(name);
  const taskElement = createTaskElement(task, projectElement.projectObj);

  projectElement.projectObj.appendTask(task);

  const taskList = projectElement.querySelector(".project-task-list");
  taskList.appendChild(taskElement);

  input.value = "";
}

export function createTaskElement(task, projectObj) {
  const el = document.createElement("li");
  el.classList.add("task");
  el.taskObj = task;

  const info = createTaskInfo(task, projectObj, el);
  el.append(info);

  return el;
}


/* ------------ Internal Helpers ------------ */

function createTaskInfo(task, projectObj, taskElement) {
  const info = document.createElement("div");
  info.classList.add("task-info");

  const checkBox = createCheckbox(task);
  const name = createName(task);
  const menuWrapper = createMenuButton(task, projectObj, taskElement);

  info.append(checkBox, name, menuWrapper);
  return info;
}

function createCheckbox(task) {
  const box = document.createElement("input");
  box.type = "checkbox";
  box.classList.add("check-box");
  box.checked = task.completed;
  box.addEventListener("change", () => (task.completed = box.checked));
  return box;
}

function createName(task) {
  const name = document.createElement("span");
  name.classList.add("task-name");
  name.textContent = ` ${task.name} `;
  return name;
}

function createMenuButton(task, projectObj, taskElement) {
  const btn = document.createElement("button");
  btn.classList.add("task-menu-btn");
  btn.textContent = "⋮";

  const menu = buildMenu(task, projectObj, taskElement);
  btn.addEventListener("click", (e) => toggleMenu(e, menu));

  const wrapper = document.createElement("div");
  wrapper.classList.add("task-menu-wrapper");
  wrapper.append(btn, menu);

  return wrapper;
}

function buildMenu(task, projectObj, taskElement) {
  const menu = document.createElement("ul");
  menu.classList.add("task-menu");
  menu.style.display = "none";

  const edit = document.createElement("li");
  edit.textContent = "Edit";
  edit.addEventListener("click", () => {
    showEditMenu(taskElement);
    menu.style.display = "none";
  });

  const del = document.createElement("li");
  del.textContent = "Delete";
  del.addEventListener("click", () => {
    projectObj.deleteTaskObj(task);
    taskElement.remove();
    menu.style.display = "none";
  });

  menu.append(edit, del);
  return menu;
}

function toggleMenu(event, menu) {
  event.stopPropagation();

  // close others
  document.querySelectorAll(".task-menu").forEach((m) => {
    if (m !== menu) m.style.display = "none";
  });

  // toggle this one
  const open = menu.style.display === "block";
  menu.style.display = open ? "none" : "block";
}