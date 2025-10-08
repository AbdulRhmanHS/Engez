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

function getUniqueName(baseName) { // Prevent Duplicate names
    // Filter only projects starting with the same base name
    const similar = projects
    .map(p => p.name)
    .filter(name => name.startsWith(baseName));

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

export function addTask(name) {
    if (name == "") {
        return;
    }
    else {
        return new Task(name);
    }
}

export function addProject(name) {
    const newProject = new Project(getUniqueName(name));
    projects.push(newProject);
    return newProject;
}

export function getProjects() {
  return projects;
}
