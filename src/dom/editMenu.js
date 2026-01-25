import { timePrint } from '../core/data';
import { createSubTask, addSubTaskToScreen } from './subTaskUI';
import { findTaskElement, getUniqueName, makeEditable } from '../core/utils';
import { ensureCompletion } from './taskUI';
import { format } from 'date-fns';

/* ------------ Public API ------------ */

export function showEditMenu(taskEl) {
  const dialog = createDialog();
  const task = taskEl.taskObj;
  const left = createLeftSection(task, dialog);
  const right = createRightSection(task, taskEl, dialog);

  // main body
  dialog.append(left, right);

  // existing subtasks
  populateSubTasks(dialog, task);

  document.body.appendChild(dialog);
  dialog.showModal();
}

/* ------------ Internal Helpers ------------ */

function createDialog() {
  const d = document.createElement('dialog');
  d.classList.add('task-edit');
  return d;
}

function createLeftSection(task, dialog) {
  const el = document.createElement('div');
  el.classList.add('dialog-left');

  const name = createNameField(task);
  const note = createNoteField(task);
  const sub = createSubTaskField(task, dialog);

  el.append(name, note, sub);
  return el;
}

function createRightSection(task, taskEl, dialog) {
  const el = document.createElement('div');
  el.classList.add('dialog-right');

  const date = createDateField(task);
  const time = createTimeField(task);
  const priority = createPriorityField(task, taskEl);
  const btns = createSaveBtns(task, taskEl, dialog);

  el.append(date, time, priority, btns);
  return el;
}

function createNameField(task) {
  const el = document.createElement('span');
  el.classList.add('dialog-name');
  el.textContent = task.name;
  el.addEventListener('click', () => makeEditable(el, task));
  return el;
}

function createNoteField(task) {
  const el = document.createElement('textarea');
  el.classList.add('note');
  el.placeholder = 'Note';
  el.value = task.note;
  el.addEventListener('input', () => {
    task.note = el.value;
  });

  el.addEventListener('input', OnInput, false);

  function OnInput() {
    this.style.height = 'auto'; // Reset height to get accurate scrollHeight
    this.style.height = this.scrollHeight + 'px'; // Set to content height
  }
  return el;
}

function createDateField(task) {
  const text = document.createElement('p');
  text.textContent = 'Date';

  const dateEl = document.createElement('input');
  dateEl.type = 'date';
  dateEl.value = task.dueDate;
  dateEl.addEventListener('input', () => {
    task.dueDate = dateEl.value;

    const taskElement = findTaskElement(task);
    const date = taskElement
      .querySelector('.task-info')
      .querySelector('.task-date');
    task.dueDate
      ? (date.textContent = timePrint(task))
      : (date.textContent = '');
  });

  const el = document.createElement('div');
  el.classList.add('date-field');
  el.append(text, dateEl);
  return el;
}

function createTimeField(task) {
  const text = document.createElement('p');
  text.textContent = 'Time';

  const TimeEl = document.createElement('input');
  TimeEl.type = 'time';
  TimeEl.value = task.time;
  TimeEl.addEventListener('input', () => {
    task.time = TimeEl.value;

    const [hours, minutes] = TimeEl.value.split(':');
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);

    const taskElement = findTaskElement(task);
    const timeText = taskElement
      .querySelector('.task-info')
      .querySelector('.task-time');
    task.time
      ? (timeText.textContent = format(date, 'h:mm a'))
      : (timeText.textContent = '');
  });

  const el = document.createElement('div');
  el.classList.add('time-field');
  el.append(text, TimeEl);

  return el;
}

function createPriorityField(task, taskEl) {
  const el = document.createElement('div');
  el.classList.add('priority');

  const label = document.createElement('label');
  label.textContent = 'Priority ';
  label.setAttribute('for', 'priority'); // Use setAttribute for 'for'

  const sel = document.createElement('select');
  sel.id = 'priority';

  // Index 0: P1, Index 1: P2, Index 2: P3, Index 3: P4
  const priorities = ['🟥 P1', '🟧 P2', '🟦 P3', '⬛ P4'];

  priorities.forEach((p, i) => {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = p;
    sel.appendChild(option);
  });

  // CHANGE HERE: Fallback to '3' (P4) if task.priority is null/undefined
  sel.value = String(task.priority ?? 3);

  sel.addEventListener('change', (e) => {
    task.priority = Number(e.target.value);

    switch (task.priority) {
      case 0:
        taskEl.querySelector('.task-name').style.color = 'red';
        break;
      case 1:
        taskEl.querySelector('.task-name').style.color = 'orange';
        break;
      case 2:
        taskEl.querySelector('.task-name').style.color = 'blue';
        break;
      case 3:
        taskEl.querySelector('.task-name').style.color = 'black';
        break;
    }
  });

  el.append(label, sel);
  return el;
}

function createSubTaskField(task, dialog) {
  const btn = document.createElement('button');
  btn.textContent = '+ Add a sub-task';
  btn.addEventListener('click', () => {
    const existingSubtaskNames = task.subTasks.map((s) => s.name);
    const uniqueName = getUniqueName('Sub-task', existingSubtaskNames);
    const sub = task.addSubTask(uniqueName);
    addSubTaskToScreen(sub, dialog, task);
  });

  const el = document.createElement('div');
  el.classList.add('dialog-sub-tasks');
  el.append(btn);

  return el;
}

function createSaveBtns(task, taskEl, dialog) {
  const el = document.createElement('div');
  el.classList.add('save-buttons');

  const markAsComplete = createCompleteBtn(task, taskEl, dialog);
  const close = createCloseBtn(task, taskEl, dialog);

  el.append(markAsComplete, close);
  return el;
}

function createCompleteBtn(task, taskEl, dialog) {
  const btn = document.createElement('button');
  btn.textContent = 'Mark as complete';
  btn.addEventListener('click', () => {
    task.completed = true;
    taskEl.querySelector('.check-box').checked = true;
    closeAndSave(task, taskEl, dialog);
    ensureCompletion(taskEl);
  });
  return btn;
}

function createCloseBtn(task, taskEl, dialog) {
  const btn = document.createElement('button');
  btn.textContent = 'Close';
  btn.addEventListener('click', () => {
    closeAndSave(task, taskEl, dialog);
  });
  return btn;
}

/* ------------ More utilities ------------ */

function populateSubTasks(dialog, task) {
  const subTaskArea = dialog.querySelector('.dialog-sub-tasks');
  task.subTasks.forEach((sub) => {
    const subEl = createSubTask(sub);
    subTaskArea.append(subEl);
  });
}

function closeAndSave(task, taskEl, dialog) {
  taskEl.querySelector('.task-name').textContent = task.name;

  const list = taskEl.querySelector('.sub-task-list');
  if (list) list.innerHTML = '';

  task.subTasks.forEach((sub) => addSubTaskToScreen(sub, taskEl, task));

  dialog.close();
  dialog.remove();
}
