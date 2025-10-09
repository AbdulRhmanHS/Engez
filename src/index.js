import "./styles.css";
import * as tasks from "./tasks"

const newProjectButton = document.getElementById("new-project");
const taskArea = document.querySelector(".task-area");

function createTaskElement(task, projectObj) {
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

  menu.append(editOption, deleteOption);
  taskElement.append(checkBox, nameSpan, menuButton, menu);

  return taskElement;
}

function createProjectElement(project) {
  const projectElement = document.createElement("div");
  projectElement.classList.add("project");
  projectElement.projectObj = project; // Link the project object to the project element

  const projectName = document.createElement("p");
  projectName.classList.add("project-name");
  projectName.textContent = project.name;
  projectName.contentEditable = true;

  const projectBody = document.createElement("div");
  projectBody.classList.add("project-body");

  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.name = "task-input";
  inputField.classList.add("task-input");
  inputField.placeholder = "Enter task name";
  inputField.addEventListener("keydown", (event) => { // Add task when enter is pressed
    if (event.key == "Enter") {
      addTasktoScreen(inputField, projectElement);
    }
  });

  const addTaskButton = document.createElement("button");
  addTaskButton.classList.add("add-task-button");
  addTaskButton.textContent = "Add Task";
  addTaskButton.addEventListener("click", ()=> { // Add task when button is clicked
    addTasktoScreen(inputField, projectElement);
  });

  projectBody.append(inputField, addTaskButton);
  projectElement.append(projectName, projectBody);
  taskArea.appendChild(projectElement);
  makeEditable(projectName, project);
}

function addTasktoScreen(input, projectElement) {
  if (input.value == "") {
    return;
  }
  else {
    // Create the task
    const task = tasks.addTask(input.value);
    const taskElement = createTaskElement(task, projectElement.projectObj);

    // Add the task to the project
    projectElement.projectObj.appendTask(task);
    projectElement.querySelector(".project-body").appendChild(taskElement);
    input.value = "";
  }
}

function addProjecttoScreen() {
  const project = tasks.addProject(getUniqueName("Default Project"));
  createProjectElement(project);
}

// Prevent Duplicate names
function getUniqueName(baseName) {
    // Filter only project names starting with the same base name
    const similar = tasks.getProjects().map(p => p.name).filter(name => name.startsWith(baseName));

    if (similar.length === 0) return baseName;

    // Extract numbers from names like "Default Project (2)"
    let maxNumber = 1;
    similar.forEach(name => {
      const match = name.match(/\((\d+)\)$/);
      if (match) {
          const num = parseInt(match[1]);
          if (num > maxNumber) maxNumber = num;
      } else if (name === baseName) {
          // plain base name counts as (1)
          maxNumber = Math.max(maxNumber, 1);
      }
    });

    return `${baseName} (${maxNumber + 1})`;
}

function makeEditable(editableEl, targetObj, property = "name") {
  let previousValue = targetObj[property];

  // Update the object as user types
  editableEl.addEventListener("input", (e) => {
    targetObj[property] = e.target.textContent;
  });

  // Restore last valid value if field is empty
  editableEl.addEventListener("blur", () => {
    const trimmed = targetObj[property].trim();

    if (trimmed === "") {
      targetObj[property] = previousValue;
      editableEl.textContent = previousValue;
    } else {
      targetObj[property] = trimmed;
      previousValue = trimmed;
    }
  });

  // Prevent new lines, confirm edit with Enter
  editableEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (editableEl.textContent.trim() !== "") editableEl.blur();
    }
  });
}

function showEditMenu(taskElement) {
  const dialog = document.createElement("dialog");
  dialog.classList.add("task-edit");

  const taskNameEl = taskElement.querySelector(".task-name");

  const chekBox = taskElement.querySelector(".check-box")

  const name = document.createElement("span");
  name.textContent = taskElement.taskObj.name;
  name.contentEditable = true;
  makeEditable(name, taskElement.taskObj);

  const markAsComplete = document.createElement("button");
  markAsComplete.textContent = "Mark as complete";
  markAsComplete.addEventListener("click", () => {
    taskElement.taskObj.completed = true;
    chekBox.checked = true;
    dialog.close();
  });

  const close = document.createElement("button");
  close.textContent = "Close";
  close.addEventListener("click", () => {
    taskNameEl.textContent = taskElement.taskObj.name;
    dialog.close();
  });

  dialog.append(name, markAsComplete, close);
  document.body.appendChild(dialog);
  dialog.showModal();
}

newProjectButton.addEventListener("click", addProjecttoScreen) // Add a new project