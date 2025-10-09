const projects = []; // Array to store projects

class Project {
    constructor(name) {
        this.name = name;
        this.tasks = [];
    }

    appendTask(task) {
        this.tasks.push(task);
    }

    setName(newName) {
        if (newName.trim() === "") return false; // Invalid input (empty or just spaces)
        this.name = newName.trim(); // Clean up whitespace and save it
        return true;
    }

    deleteTaskObj(task) {
        const i = this.tasks.indexOf(task);
        if (i !== -1) this.tasks.splice(i, 1);
    }
}

class Task {
    constructor(name) {
        this.name = name
        this.completed = false;
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
