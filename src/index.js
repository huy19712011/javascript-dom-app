
const app = document.getElementById('app');

app.innerHTML = `
    <div class="todos">
        <div class="todos-header">
            <h3 class="todos-title">Todo List</h3>
            <div>
                <p>You have <span class="todos-count"></span> items</p>
                <button type="button" class="todos-clear" style="display: none;">
                    Clear Completed todos 
                </button>
            </div>
        </div>
        <form class="todos-form" name="todos">
            <input type="text" placeholder="What is next?" name="todo">
        </form>
        <ul class="todos-list"></ul>
    </div>
`;

//state
let todos = JSON.parse(localStorage.getItem('todos')) || [];


// selectors
const root = document.querySelector('.todos');
const list = root.querySelector('.todos-list');
const count = root.querySelector('.todos-count');
const clear = root.querySelector('.todos-clear');
const form = document.forms.todos;
const input = form.elements.todo;

//functions

function saveToStorage(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
}
function renderTodos(todos) {
    let todoString = '';

    todos.forEach((todo, index) =>{
        todoString += `
            <li data-id="${index}" ${todo.complete ? ' class="todos-complete"' : ''}>
                <input type="checkbox" ${todo.complete ? ' checked': '' }>
                <span>${todo.label}</span>
                <button type="button"></button>
            </li>
        `;
    });

    list.innerHTML = todoString;
    count.innerText = todos.filter(todo => !todo.complete).length;
    clear.style.display = todos.filter(todo => todo.complete).length ? 'block' : 'none';
}
function addTodo(event) {
    event.preventDefault();
    const label = input.value.trim();
    const complete = false;
    todos = [
        ...todos,
        {
            label,
            complete
        }
    ]

    renderTodos(todos);
    saveToStorage(todos);

    input.value='';
}

function updateTodo(event) {
    // console.log(event.target.parentElement.getAttribute('data-id'));
    const id = +event.target.parentElement.getAttribute('data-id');
    // console.log(id);
    const complete = event.target.checked;

    todos = todos.map((todo, index) => {
        if (index===id) {
            return {
                ...todo,
                complete
            };
        }

        return todo;
    });
    // console.log(todos);
    renderTodos(todos);
    saveToStorage(todos);
}

function editTodo(event) {
    if (event.target.nodeName.toLowerCase() !== 'span') {
        return;
    }
    const id = +event.target.parentElement.getAttribute('data-id');
    const todoLabel = todos[id].label;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = todoLabel;

    function handleEdit(event) {
        event.stopPropagation();

        const label = this.value;
        if (this.value !== todoLabel) {
            todos = todos.map((todo, index) => {
                if (index === id) {
                    return {
                        ...todo,
                        label
                    };
                }

                return todo;
            });

            renderTodos(todos);
            saveToStorage(todos);
        }
        // clean up
        event.target.style.display = '';
        this.removeEventListener('change', handleEdit);
        this.remove();
    }

    event.target.style.style = 'none';
    event.target.parentElement.append(input);
    input.addEventListener('change', handleEdit);
    input.focus();
}

function deleteTodo(event) {
    if (event.target.nodeName.toLowerCase() !== 'button')
        return;
    const id = +event.target.parentElement.getAttribute('data-id');
    const label = event.target.previousElementSibling.innerText;
    if (window.confirm(`Delete ${label}?`)) {
        todos = todos.filter((todo, index) => index !== id);
        renderTodos(todos);
        saveToStorage(todos);
    }
}

function clearCompleteTodos() {
    const count = todos.filter(todo => todo.complete).length;

    if (count === 0) {
        return;
    }
    if (window.confirm(`Delete ${count} items?`)) {
        todos = todos.filter(todo => !todo.complete);

        renderTodos(todos);
        saveToStorage(todos);
    }
}

// init
function init() {
    renderTodos(todos);

    // Add todo
    form.addEventListener('submit', addTodo);

    // Update Todo
    list.addEventListener('change', updateTodo);

    // Edit Todo
    list.addEventListener('dblclick', editTodo);

    // Delete Todo
    list.addEventListener('click', deleteTodo);

    // Complete all todos
    clear.addEventListener('click', clearCompleteTodos);
}

init();