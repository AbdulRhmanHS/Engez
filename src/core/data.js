import { format, differenceInCalendarDays, isSameYear } from "date-fns";

const projects = []; // Array to store projects


class Project {
    constructor(name) {
        this.name = name;
        this.tasks = [];
    }

    appendTask(task) {
        this.tasks.push(task);
    }

    deleteTaskObj(task) {
        const i = this.tasks.indexOf(task);
        if (i !== -1) this.tasks.splice(i, 1);
    }
}


class SubTask {
    constructor(name, parentTask) {
        this.name = name;
        this.completed = false;
        this.parentTask = parentTask;
    }
}


class Task {
    constructor(name) {
        this.name = name;
        this.completed = false;
        this.note = "";
        this.subTasks = [];
        this.dueDate = "";
        this.time = "";
        this.priority = 0;
    }

    addSubTask(name) {
        if (!name.trim()) return;
        const subTask = new SubTask(name, this);
        this.subTasks.push(subTask);
        return subTask;
    }

    deleteSubTask(subTask) {
        const i = this.subTasks.indexOf(subTask);
        if (i !== -1) this.subTasks.splice(i, 1);
    }
}

function getRemainingTime(task) {
    const today = new Date();
    const due = new Date(task.dueDate);

    const remaining = differenceInCalendarDays(due, today);
    return remaining;
}

export function addTask(name) {
    if (name == "") {
        return;
    }
    else {
        return new Task(name);
    }
}


export function addProject(name) {
    const newProject = new Project(name);
    projects.push(newProject);
    return newProject;
}


export function deleteProject(projectObj) {
    const index = projects.indexOf(projectObj);
    if (index !== -1) {
        projects.splice(index, 1);
        console.log(`Project "${projectObj.name}" deleted from data.`);
        return true;
    }
    return false;
}


export function getProjects() {
  return projects;
}


export function timePrint(task) {
    const remaining = getRemainingTime(task);
    const today = new Date();
    const due = new Date(task.dueDate);

    if (remaining === 0) return;
    if (remaining === 1) return "Tomorrow";
    if (remaining > 1 && remaining < 7) return format(due, "EEE");
    if (remaining >= 7 && isSameYear(due, today)) return format(due, "d MMM");
    return format(due, "yyyy-MM-dd");
}