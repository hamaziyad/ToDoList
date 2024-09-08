// SELECTORS
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector(".filter-todo");

document.addEventListener("DOMContentLoaded", getTodos);
// EVENT LISTENER
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheck);
filterOption.addEventListener('change', filterTodo);

// FUNCTIONS
function addTodo(event) {
    event.preventDefault();
    // Todo div
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    // Create li
    const newTodo = document.createElement("li");
    newTodo.innerText = todoInput.value;
    newTodo.classList.add('todo-item');
    todoDiv.appendChild(newTodo);
    // ADD TODO to local storage with completion state
    saveLocalTodos(todoInput.value, false); // Assuming initially not completed
    // CHECKMARK BUTTON
    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class = "fas fa-check"></i>'
    completedButton.classList.add("completed-btn");
    todoDiv.appendChild(completedButton);
    // CHECK TRASH BUTTON
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class = "fas fa-trash"></i>'
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);
    // APPEND TODO LIST
    todoList.appendChild(todoDiv);
    // Clear Todo input value
    todoInput.value = "";
}

function deleteCheck(e) {
    const item = e.target;
    // DELETE TODO
    if (item.classList[0] === "trash-btn") {
        const todo = item.parentElement;
        // Animation
        todo.classList.add("fall");
        // Remove todos
        removeLocalTodos(todo, todo.classList.contains("completed")); // Pass completion state
        todo.addEventListener('transitionend', function () {
            todo.remove();
        });
    }

    // CHECKMARK
    if (item.classList[0] === "completed-btn") {
        const todo = item.parentElement;
        todo.classList.toggle('completed');
        // Update completion state in local storage
        updateLocalTodos(todo, todo.classList.contains("completed"));
    }
}

function filterTodo(e) {
    const todos = todoList.childNodes;
    todos.forEach(function (todo) {
        if (todo.nodeType === 1) { // Check if the node is an element node
            switch (e.target.value) {
                case "all":
                    todo.style.display = "flex";
                    break;
                case "completed":
                    if (todo.classList.contains("completed")) {
                        todo.style.display = "flex";
                    } else {
                        todo.style.display = "none";
                    }
                    break;
                case "uncompleted":
                    if (!todo.classList.contains("completed")) {
                        todo.style.display = "flex";
                    } else {
                        todo.style.display = "none";
                    }
                    break;
            }
        }
    });
}

function saveLocalTodos(todo, completed) {
    // To check if I already have things there
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    todos.push({ text: todo, completed: completed });
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
    todoList.innerHTML = ''; // Clear existing todos

    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    todos.forEach(function (todo) {
        if (todo && todo.text) {  // Check if 'todo' exists and has a 'text' property
            const todoDiv = document.createElement("div");
            todoDiv.classList.add("todo");
            // Create li
            const newTodo = document.createElement("li");
            newTodo.innerText = todo.text;
            newTodo.classList.add('todo-item');
            todoDiv.appendChild(newTodo);
            // CHECKMARK BUTTON
            const completedButton = document.createElement('button');
            completedButton.innerHTML = '<i class = "fas fa-check"></i>'
            completedButton.classList.add("completed-btn");
            todoDiv.appendChild(completedButton);
            // CHECK TRASH BUTTON
            const trashButton = document.createElement('button');
            trashButton.innerHTML = '<i class = "fas fa-trash"></i>'
            trashButton.classList.add("trash-btn");
            todoDiv.appendChild(trashButton);
            // Set completed state
            if (todo.completed) {
                todoDiv.classList.add('completed');
            }
            // APPEND TODO LIST
            todoList.appendChild(todoDiv);
        }
    });
}


function removeLocalTodos(todo, completed) {
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    const todoIndex = todos.findIndex(t => t.text === todo.children[0].innerText && t.completed === completed);
    if (todoIndex !== -1) {
        todos.splice(todoIndex, 1);
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}

function updateLocalTodos(todo, completed) {
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    const todoIndex = todos.findIndex(t => t.text === todo.children[0].innerText);
    if (todoIndex !== -1) {
        todos[todoIndex].completed = completed;
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}
