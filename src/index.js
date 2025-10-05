import "./styles.css";
import * as tasks from "./tasks"

const newProjectButton = document.getElementById("new-project");
const taskArea = document.querySelector(".task-area");

function createTaskElement(task) {
  const taskElement = document.createElement("li");
  taskElement.classList.add("task");
  taskElement.taskObj = task;

  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";

  taskElement.appendChild(checkBox);
  taskElement.appendChild(document.createTextNode(" " + task.name));

  return taskElement;
}

function createProjectElement(project) {
  const projectElement = document.createElement("div");
  projectElement.classList.add("project");
  projectElement.projectObj = project;

  const projectName = document.createElement("p");
  projectName.textContent = project.name;
  projectName.contentEditable = true;
  project.changeableName(projectName);
  projectName.classList.add("project-name");

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

  return projectElement;
}

function addTasktoScreen(input, projectElement) {
  if (input.value == "") {
    return;
  }
  else {
    // Create the task
    const task = tasks.addTask(input.value);
    const taskElement = createTaskElement(task);

    // Add the task to the project
    projectElement.projectObj.appendTask(task);
    projectElement.querySelector(".project-body").appendChild(taskElement);
    input.value = "";
  }
}

function addProjecttoScreen() {
  const project = tasks.addProject("Default Project");
  createProjectElement(project);
}

newProjectButton.addEventListener("click", addProjecttoScreen) // Add a new project