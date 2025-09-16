import "./styles.css";
import * as tasks from "./tasks"

const input = document.getElementById("task-input");
const addTaskButton = document.getElementById("add-task");
const taskList = document.querySelector(".task-list");

function createTaskElement(task) {
  const taskElement = document.createElement("li");
  taskElement.classList.add("task");

  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";

  taskElement.appendChild(checkBox);
  taskElement.appendChild(document.createTextNode(" " + task.name));

  taskList.appendChild(taskElement);
}

function addTasktoScreen() {
  const task = tasks.addTask(input.value);
  createTaskElement(task);
  input.value = "";
}

addTaskButton.addEventListener("click", addTasktoScreen); // Add task when button is clicked

input.addEventListener("keydown", (event) => { // Add task when enter is pressed
  if (event.key == "Enter") {
    addTasktoScreen();
  }
});