const projects = []; // Array to store projects

class Project {
    constructor(name) {
        this.name = name;
        this.tasks = [];
    }

    appendTask(task) {
        this.tasks.push(task);
    }

    changeableName(projectNameElement) {
        
        // Change name with typing
        projectNameElement.addEventListener("input", (event) => {
            this.name = event.target.textContent
        });

        // Reset the default name when empty
        projectNameElement.addEventListener("blur", () => {
            if (this.name === "") {
            this.name = "Default Project";
            projectNameElement.textContent = this.name;
            }
        });

        // Prevent enter key from making a new line
        projectNameElement.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
            event.preventDefault();
            }
        });
    }

    static getUniqueName(baseName) { // Prevent Duplicate names
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
    const uniqueName = Project.getUniqueName(name);
    const newProject = new Project(uniqueName);
    projects.push(newProject);
    return newProject;
}

export function getProjects() {
  return projects;
}
