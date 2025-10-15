/* ─── main entry ─────────────────────────────────────────── */

export function createSubTask(subTask) {
  const el = document.createElement("div");
  el.classList.add("sub-task");

  const check = createCheckbox(subTask);
  const name = createNameField(subTask);

  el.append(check, name);
  el.subTaskObj = subTask;

  return el;
}

export function addSubTaskToScreen(subTask, container) {
  const list = ensureSubTaskList(container, subTask);
  const el = createSubTask(subTask);
  list.append(el);
}


/* ─── helpers ────────────────────────────────────────────── */

function createCheckbox(subTask) {
  const check = document.createElement("input");
  check.type = "checkbox";
  check.checked = subTask.completed;

  check.addEventListener("change", () => {
    subTask.completed = check.checked;
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
    } else {
      name.contentEditable = false;
    }
  });

  return name;
}

/* ─── subtask list management ───────────────────────────── */

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

  const taskEl = findTaskElement(subTask);
  if (!taskEl || taskEl.querySelector(".subtask-arrow")) return;

  const arrow = document.createElement("span");
  arrow.textContent = "▶";
  arrow.classList.add("subtask-arrow");

  arrow.addEventListener("click", () => {
    const list = taskEl.querySelector(".sub-task-list");
    const hidden = list.style.display === "none";
    list.style.display = hidden ? "block" : "none";
    arrow.textContent = hidden ? "▼" : "▶";
  });

  taskEl.querySelector(".task-info").prepend(arrow);
}

function findTaskElement(subTask) {
  return Array.from(document.querySelectorAll(".task")).find(
    (el) => el.taskObj === subTask.parentTask
  );
}