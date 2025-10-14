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
  
  const taskInfo = document.createElement("div");
  taskInfo.classList.add("task-info");

  menu.append(editOption, deleteOption);
  taskInfo.append(checkBox, nameSpan, menuButton, menu);
  taskElement.append(taskInfo);

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

  const projectInput = document.createElement("div");
  projectInput.classList.add("project-input");

  const projectTaskList = document.createElement("div");
  projectTaskList.classList.add("project-task-list");

  projectInput.append(inputField, addTaskButton);
  projectBody.append(projectInput, projectTaskList);
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
    projectElement.querySelector(".project-body").querySelector(".project-task-list").appendChild(taskElement);
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
    taskNameEl.textContent = taskElement.taskObj.name; // Save task name

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
    const subTaskEl = createSubTask(subTask);
    dialog.append(subTaskEl);
  });

  document.body.appendChild(dialog);
  dialog.showModal();
}



function createSubTask(subTaskObj) {
  const subTask = document.createElement("div");
  subTask.classList.add("sub-task");

  const subTaskCheck = document.createElement("input");
  subTaskCheck.type = "checkbox";
  subTaskCheck.checked = subTaskObj.completed;
  subTaskCheck.addEventListener("change", () => {
    subTaskObj.completed = subTaskCheck.checked;
  });

  const subTaskName = document.createElement("span");
  subTaskName.textContent = subTaskObj.name;
  subTaskName.contentEditable = false;
  subTaskName.addEventListener("click", () => {
    subTaskName.contentEditable = true;
    subTaskName.focus();
  });
  subTaskName.addEventListener("input", (e) => { // Change the name when editing
    subTaskObj.name = e.target.textContent;
  });
  subTaskName.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      subTaskName.contentEditable = false;
    }
  });
  // remove subtask if cleared and loses focus
  subTaskName.addEventListener("blur", () => {
    const name = subTaskName.textContent.trim();
    if (name === "") {
      // remove from data
      subTaskObj.parentTask.deleteSubTask(subTaskObj);

      // remove from screen
      subTaskName.parentElement.remove();
    }
  });

  subTask.append(subTaskCheck, subTaskName);

  return subTask
}



function addSubTaskToScreen(subTaskObj, container) {
  // Create the subTask
  const subTask = createSubTask(subTaskObj);

  // Make the sub-tasks in a separate list
  let subTaskList = container.querySelector(".sub-task-list");
  if (!subTaskList) {
    subTaskList = document.createElement("div");
    subTaskList.classList.add("sub-task-list");
    
    // start hidden only outside the edit modal
    if (!container.classList.contains("task-edit")) {
      subTaskList.style.display = "none";
    }
    
    container.append(subTaskList);

    // For adding the collapsable arrow
    if (container.classList.contains("task-edit")) {
      const taskElement = Array.from(document.querySelectorAll(".task"))
        .find(el => el.taskObj === subTaskObj.parentTask);
        
      const arrow = taskElement?.querySelector(".subtask-arrow");
      if (!arrow && taskElement) {
        const newArrow = document.createElement("span");
        // default closed
        newArrow.textContent = "▶";
        newArrow.classList.add("subtask-arrow");
        newArrow.addEventListener("click", () => {
          const subTaskList = taskElement.querySelector(".sub-task-list");
          const isHidden = subTaskList.style.display === "none";
          subTaskList.style.display = isHidden ? "block" : "none";
          newArrow.textContent = isHidden ? "▼" : "▶";
        });
        taskElement.querySelector(".task-info").prepend(newArrow);
      }
    }
  }

  // Link it to the same object
  subTask.subTaskObj = subTaskObj;

  subTaskList.append(subTask);
}



newProjectButton.addEventListener("click", addProjecttoScreen) // Add a new project
window.getProjects = tasks.getProjects; // For testing only