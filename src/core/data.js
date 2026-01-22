import { format, differenceInCalendarDays, isSameYear } from "date-fns";
import { get, set } from "idb-keyval";

let projects = []; // Array to store projects


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


class Task {
    constructor(name) {
        this.name = name;
        this.completed = false;
        this.note = "";
        this.subTasks = [];
        this.dueDate = "";
        this.time = "";
        this.priority = 3;
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


class SubTask {
    constructor(name) {
        this.name = name;
        this.completed = false;
    }
}


function getRemainingTime(task) {
    const today = new Date();
    const due = new Date(task.dueDate);

    const remaining = differenceInCalendarDays(due, today);
    return remaining;
}


export async function saveToDevice(projectsArray) {
    await set("engez_projects", projectsArray);
    console.log("Data is now safe on the hard drive!");
}


export async function loadFromDevice() {
    const data = await get("engez_projects");
    
    if (!data) {
        projects = [];
        return [];
    }

    // REHYDRATION: Turn plain objects back into "Smart" Classes
    projects = data.map(pData => {
        const newProj = new Project(pData.name);
        // Important: Rebuild the tasks as Task class instances too!
        newProj.tasks = pData.tasks.map(tData => {
            const newTask = new Task(tData.name);
            // Copy all saved properties (completed, note, dates, etc.)
            Object.assign(newTask, tData);

            newTask.subTasks = (tData.subTasks || []).map(sData => {
                const newSubTask = new SubTask(sData.name);
                Object.assign(newSubTask, sData);
                return newSubTask;
            });
            return newTask;
        });
        return newProj;
    });
    return projects;
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