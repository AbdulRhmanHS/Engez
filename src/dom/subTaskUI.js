import { findTaskElement } from "../core/utils";

/* ------------ Public API ------------ */

export function createSubTask(subTask, taskObj) {
  const el = document.createElement("div");
  el.classList.add("sub-task");
  el.subTaskObj = subTask;

  const check = createCheckbox(subTask, taskObj);
  const name = createNameField(subTask, taskObj);

  el.append(check, name);

  return el;
}


export function addSubTaskToScreen(subTask, container, taskObj) {
  const list = ensureSubTaskList(container, taskObj);
  const el = createSubTask(subTask, taskObj);
  const subTaskArea = container.querySelector(".dialog-sub-tasks");
  if (subTaskArea) {
    subTaskArea.append(el);
  }
  else {
    list.append(el);
  }
}


/* ------------ Internal Helpers ------------ */

function createCheckbox(subTask, taskObj) {
  const check = document.createElement("input");
  check.classList.add("sub-check");
  check.type = "checkbox";
  check.checked = subTask.completed;

  check.addEventListener("change", () => {
    subTask.completed = check.checked;
    ensureCompletion(taskObj);
  });

  return check;
}


function createNameField(subTask, taskObj) {
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
      // 1. Delete from Data
      if (taskObj && typeof taskObj.deleteSubTask === 'function') {
        taskObj.deleteSubTask(subTask);
      } else if (taskObj && taskObj.subTasks) {
        const index = taskObj.subTasks.indexOf(subTask);
        if (index !== -1) taskObj.subTasks.splice(index, 1);
      }

      // 2. Delete from UI - THE FIX
      const subTaskContainer = name.closest(".sub-task");
      if (subTaskContainer) {
        subTaskContainer.remove();
      }

      // 3. Update the arrow
      removeArrow(taskObj);
    } else {
      name.contentEditable = false;
    }
  });

  return name;
}


function ensureSubTaskList(container, taskObj) {
  let list = container.querySelector(".sub-task-list");

  if (!list) {
    list = document.createElement("div");
    list.classList.add("sub-task-list");
    // Explicitly set to 0 for the animation to work later
    list.style.maxHeight = "0px"; 
    list.style.overflow = "hidden"; 

    container.append(list);
    maybeAddArrow(container, taskObj);
  }

  return list;
}


function maybeAddArrow(container, taskObj) {
  const isMainTask = container.classList.contains("task");
  const isDialog = container.classList.contains("task-edit");

  if (!isMainTask && !isDialog) return;

  const taskEl = findTaskElement(taskObj, container.closest('.project') || container);
  if (!taskEl || taskEl.querySelector(".subtask-arrow")) return;

  const arrow = document.createElement("span");
  arrow.innerHTML = "<span>▶</span>"; 
  arrow.classList.add("subtask-arrow");

  arrow.addEventListener("click", (e) => {
    e.stopPropagation();
    arrowTransition(taskEl);
  });

  const info = taskEl.querySelector(".task-info");
  if (info) info.prepend(arrow);
}


function ensureCompletion(taskObj) {
  const taskEl = findTaskElement(taskObj);
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


function removeArrow(taskObj) {
  if (!taskObj || !taskObj.subTasks) return;

  const hasSubTasks = taskObj.subTasks.length > 0;
  
  const taskEl = findTaskElement(taskObj);
  if (!taskEl) return;

  const arrow = taskEl.querySelector(".subtask-arrow");

  if (!hasSubTasks && arrow) {
    arrow.remove();
  }
}


function arrowTransition(taskEl) {
  const list = taskEl.querySelector(".sub-task-list");
  if (!list) return;

  const isExpanding = !taskEl.classList.contains("is-expanded");
  const height = list.scrollHeight;
  
  const baseSpeed = 200; // The minimum time in ms
  const variableSpeed = height * 0.5; // Add only 0.5ms per pixel
  
  let duration = baseSpeed + variableSpeed;
  
  // Cap it so it doesn't get ridiculously slow for huge lists
  duration = Math.min(duration, 400); 

  list.style.transition = `max-height ${duration}ms ease-in-out`;

  if (isExpanding) {
    list.style.maxHeight = height + "px";
    taskEl.classList.add("is-expanded");
  } else {
    // To avoid the "slow start" on shrink, we set it to 0
    list.style.maxHeight = "0px";
    taskEl.classList.remove("is-expanded");
  }
}