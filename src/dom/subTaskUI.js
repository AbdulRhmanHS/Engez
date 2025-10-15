export function createSubTask(subTaskObj) {
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


export function addSubTaskToScreen(subTaskObj, container) {
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