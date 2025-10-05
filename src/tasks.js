class project {
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
}
class task {
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
        const newTask = new task(name);
        return newTask;
    }
}

export function addProject(name) {
    const newProject = new project(name);
    projects.push(newProject);
    return newProject;
}
