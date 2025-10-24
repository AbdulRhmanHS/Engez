import { timePrint } from "../core/data";
import { createSubTask, addSubTaskToScreen } from "./subTaskUI";
import { findTaskElement, makeEditable } from "../core/utils";
import { ensureCompletion } from "./taskUI";
import { format } from "date-fns";


/* ------------ Public API ------------ */

export function showEditMenu(taskEl) {
  const dialog = createDialog();
  const task = taskEl.taskObj;

  const elements = {
    name: createNameField(task),
    note: createNoteField(task),
    dueDate: createDateField(task),
    time: createTimeField(task),
    priority: createPriorityField(task),
    addSubTaskBtn: createAddSubTaskBtn(task, dialog),
    completeBtn: createCompleteBtn(task, taskEl, dialog),
    closeBtn: createCloseBtn(task, taskEl, dialog),
  };

  // main body
  dialog.append(
    elements.name,
    elements.note,
    elements.dueDate,
    elements.time,
    elements.priority,
    elements.addSubTaskBtn,
    elements.completeBtn,
    elements.closeBtn
  );

  // existing subtasks
  populateSubTasks(dialog, task);

  document.body.appendChild(dialog);
  dialog.showModal();
}


/* ------------ Internal Helpers ------------ */

function createDialog() {
  const d = document.createElement("dialog");
  d.classList.add("task-edit");
  return d;
}

function createNameField(task) {
  const el = document.createElement("span");
  el.textContent = task.name;
  el.contentEditable = true;
  makeEditable(el, task);
  return el;
}

function createNoteField(task) {
  const el = document.createElement("textarea");
  el.placeholder = "Note";
  el.value = task.note;
  el.addEventListener("input", () => {
    task.note = el.value;
  });
  return el;
}

function createDateField(task) {
  const el = document.createElement("input");
  el.type = "date";
  el.addEventListener("input", () => {
    task.dueDate = el.value;

    const taskElement = findTaskElement(task);
    const date = taskElement.querySelector(".task-info").querySelector(".task-date");
    date.textContent = timePrint(task);
  });
  return el;
}

function createTimeField(task) {
  const el = document.createElement("input");
  el.type = "time";
  el.addEventListener("input", () => {
    task.time = el.value;

    const [hours, minutes] = el.value.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);

    const taskElement = findTaskElement(task);
    const timeText = taskElement.querySelector(".task-info").querySelector(".task-time");
    timeText.textContent = format(date, "h:mm a");
  });

  return el;
}

function createPriorityField(task) {
  const el = document.createElement("div");
  el.classList.add("priority");

  const label = document.createElement("label");
  label.textContent = "Set priority ";
  label.for = "priority";

  const sel = document.createElement("select");
  sel.id = "priority";

  const op0 = document.createElement("option");
  const op1 = document.createElement("option");
  const op2 = document.createElement("option");
  const op3 = document.createElement("option");
  const op4 = document.createElement("option");

  op0.value = 0;
  op1.value = 1;
  op2.value = 2;
  op3.value = 3;
  op4.value = 4;

  op0.textContent = "Select";
  op1.textContent = "1";
  op2.textContent = "2";
  op3.textContent = "3";
  op4.textContent = "4";

  sel.addEventListener("change", (e) => {
    task.priority = e.target.value;
  });

  sel.append(op0, op1, op2, op3, op4);
  el.append(label, sel);

  return el;
}

function createAddSubTaskBtn(task, dialog) {
  const btn = document.createElement("button");
  btn.textContent = "Add a sub-task";
  btn.addEventListener("click", () => {
    const sub = task.addSubTask("Sub-task name");
    addSubTaskToScreen(sub, dialog);
  });
  return btn;
}

function createCompleteBtn(task, taskEl, dialog) {
  const btn = document.createElement("button");
  btn.textContent = "Mark as complete";
  btn.addEventListener("click", () => {
    task.completed = true;
    taskEl.querySelector(".check-box").checked = true;
    closeAndSave(task, taskEl);
    ensureCompletion(taskEl);
    dialog.close();
  });
  return btn;
}

function createCloseBtn(task, taskEl, dialog) {
  const btn = document.createElement("button");
  btn.textContent = "Close";
  btn.addEventListener("click", () => {
    taskEl.querySelector(".task-name").textContent = task.name;
    closeAndSave(task, taskEl);
    dialog.close();
  });
  return btn;
}

function populateSubTasks(dialog, task) {
  task.subTasks.forEach(sub => {
    const subEl = createSubTask(sub);
    dialog.append(subEl);
  });
}

function closeAndSave(task, taskEl) {
    const list = taskEl.querySelector(".sub-task-list");
    if (list) list.innerHTML = "";

    task.subTasks.forEach(sub => addSubTaskToScreen(sub, taskEl));
}