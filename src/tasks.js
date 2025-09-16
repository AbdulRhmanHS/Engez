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
