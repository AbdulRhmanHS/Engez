import * as data from "../core/data"
import { showEditMenu } from "./editMenu";


export function createTaskElement(task, projectObj) {
  const taskElement = document.createElement("li");
  taskElement.classList.add("task");
  taskElement.taskObj = task; // Link the task object to the task element

  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.classList.add("check-box");
  checkBox.checked = task.completed;
  checkBox.addEventListener("change", () => {
    task.completed = checkBox.checked;
  });

  const nameSpan = document.createElement("span");
  nameSpan.classList.add("task-name");
  nameSpan.textContent = " " + task.name + " ";

  const menuButton = document.createElement("button");
  menuButton.classList.add("task-menu-btn");
  menuButton.textContent = "⋮";

  const menu = document.createElement("ul");
  menu.classList.add("task-menu");
  menu.style.display = "none";
  
  // Toggle menu visibility
  menuButton.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent bubbling up

    // Close all other open menus first
    document.querySelectorAll(".task-menu").forEach(otherMenu => {
      if (otherMenu !== menu) otherMenu.style.display = "none";
    });

    // Toggle this task's menu
    menu.style.display = menu.style.display === "none" ? "block" : "none";
  });

  const deleteOption = document.createElement("li");
  deleteOption.textContent = "Delete";
  deleteOption.addEventListener("click", () => {
    projectObj.deleteTaskObj(task);
    taskElement.remove();
    menu.style.display = "none";
  });

  const editOption = document.createElement("li");
  editOption.textContent = "Edit";
  editOption.addEventListener("click", () => {
    showEditMenu(taskElement);
    menu.style.display = "none";
  });
  
  const taskInfo = document.createElement("div");
  taskInfo.classList.add("task-info");

  menu.append(editOption, deleteOption);
  taskInfo.append(checkBox, nameSpan, menuButton, menu);
  taskElement.append(taskInfo);

  return taskElement;
}


export function addTasktoScreen(input, projectElement) {
  if (input.value == "") {
    return;
  }
  else {
    // Create the task
    const task = data.addTask(input.value);
    const taskElement = createTaskElement(task, projectElement.projectObj);

    // Add the task to the project
    projectElement.projectObj.appendTask(task);
    projectElement.querySelector(".project-body").querySelector(".project-task-list").appendChild(taskElement);
    input.value = "";
  }
}