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
        this.name = name
        this.completed = false;
        this.note = "";
        this.subTasks = [];
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

export function getProjects() {
  return projects;
}