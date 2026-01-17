import { findTaskElement } from "../core/utils";

/* ------------ Public API ------------ */

export function createSubTask(subTask) {
  const el = document.createElement("div");
  el.classList.add("sub-task");
  el.subTaskObj = subTask;

  const check = createCheckbox(subTask);
  const name = createNameField(subTask);

  el.append(check, name);

  return el;
}

export function addSubTaskToScreen(subTask, container) {
  const list = ensureSubTaskList(container, subTask);
  const el = createSubTask(subTask);
  const subTaskArea = container.querySelector(".dialog-sub-tasks");
  if (subTaskArea) {
    subTaskArea.append(el);
  }
  else {
    list.append(el);
  }
}


/* ------------ Internal Helpers ------------ */

function createCheckbox(subTask) {
  const check = document.createElement("input");
  check.classList.add("sub-check");
  check.type = "checkbox";
  check.checked = subTask.completed;

  check.addEventListener("change", () => {
    subTask.completed = check.checked;
    ensureCompletion(subTask);
  });

  return check;
}

function createNameField(subTask) {
  const name = document.createElement("span");
  name.textContent = subTask.name;

  name.addEventListener("click", () => {
    name.contentEditable = true;
    name.focus();
  });

  name.addEventListener("input", (e) => {
    subTask.name = e.target.textContent;
  });

  name.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      name.contentEditable = false;
    }
  });

  name.addEventListener("blur", () => {
    const trimmed = name.textContent.trim();
    if (!trimmed) {
      subTask.parentTask.deleteSubTask(subTask);
      name.parentElement.remove();
      removeArrow(subTask);
    } else {
      name.contentEditable = false;
    }
  });

  return name;
}

function ensureSubTaskList(container, subTask) {
  let list = container.querySelector(".sub-task-list");

  if (!list) {
    list = document.createElement("div");
    list.classList.add("sub-task-list");

    // hidden by default (except in modal)
    if (!container.classList.contains("task-edit")) {
      list.style.display = "none";
    }

    container.append(list);
    maybeAddArrow(container, subTask);
  }

  return list;
}

function maybeAddArrow(container, subTask) {
  if (!container.classList.contains("task-edit")) return;

  const taskEl = findTaskElement(subTask.parentTask);
  // Check if arrow already exists to prevent duplicates
  if (!taskEl || taskEl.querySelector(".subtask-arrow")) return;

  const arrow = document.createElement("span");
  arrow.innerHTML = "<span>▶</span>"; // Wrapping for better rotation control
  arrow.classList.add("subtask-arrow");

  arrow.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent triggering the main task click
    
    // Toggle the 'is-expanded' class on the parent task
    taskEl.classList.toggle("is-expanded");
  });

  taskEl.querySelector(".task-info").prepend(arrow);
}

function ensureCompletion(subTask) {
  const taskEl = findTaskElement(subTask.parentTask);
  const subElements = Array.from(taskEl.querySelectorAll(".sub-task"));
  let isChecked = false;

  if (subElements.every(el => el.subTaskObj.completed === true)) isChecked = true;

  if (isChecked) {
    taskEl.taskObj.completed = true;
    taskEl.querySelector(".task-info").querySelector(".check-box").checked = true;
  } else {
    taskEl.taskObj.completed = false;
    taskEl.querySelector(".task-info").querySelector(".check-box").checked = false;
  }
}

function removeArrow(subTask) {
  const hasSubTasks = subTask.parentTask.subTasks.length > 0;
  const taskEl = findTaskElement(subTask.parentTask);
  const arrow = taskEl.querySelector(".subtask-arrow");

  if (!hasSubTasks && arrow) arrow.remove();
}