import { createSubTask, addSubTaskToScreen } from "./subTaskUI"
import { makeEditable } from "../core/utils";


export function showEditMenu(taskElement) {
  const dialog = document.createElement("dialog");
  dialog.classList.add("task-edit");

  const taskNameEl = taskElement.querySelector(".task-name");
  const chekBox = taskElement.querySelector(".check-box")

  const name = document.createElement("span");
  name.textContent = taskElement.taskObj.name;
  name.contentEditable = true;
  makeEditable(name, taskElement.taskObj);

  const note = document.createElement("textarea");
  note.placeholder = "Note";
  note.value = taskElement.taskObj.note;
  note.addEventListener("input", () => {
    taskElement.taskObj.note = note.value;
  });

  const markAsComplete = document.createElement("button");
  markAsComplete.textContent = "Mark as complete";
  markAsComplete.addEventListener("click", () => {
    taskElement.taskObj.completed = true;
    chekBox.checked = true;
    dialog.close();
  });

  const addSubTaskButton = document.createElement("button");
  addSubTaskButton.textContent = "Add a sub-task";
  addSubTaskButton.addEventListener("click", () => {
    const subTaskObj = taskElement.taskObj.addSubTask("Sub-task name");
    addSubTaskToScreen(subTaskObj, dialog);
  });

  const close = document.createElement("button");
  close.textContent = "Close";
  close.addEventListener("click", () => {
    taskNameEl.textContent = taskElement.taskObj.name;

    // Clear the old subtasks first
    const existingList = taskElement.querySelector(".sub-task-list");
    if (existingList) existingList.innerHTML = "";

    // Rebuild subtasks in main window
    taskElement.taskObj.subTasks.forEach(subTask => {
      addSubTaskToScreen(subTask, taskElement);
    });

    dialog.close();
  });

  dialog.append(name, note, addSubTaskButton, markAsComplete, close);

  // repopulate sub-tasks if any exist
  taskElement.taskObj.subTasks.forEach(subTask => {
    const subTaskEl = createSubTask(subTask); // here
    dialog.append(subTaskEl);
  });

  document.body.appendChild(dialog);
  dialog.showModal();
}