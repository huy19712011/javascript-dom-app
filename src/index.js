
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
let todos = [];


// selectors
const form = document.forms.todos;
const input = form.elements.todo;

//functions
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

    console.log(todos);

    input.value='';
}

// init
function init() {
    // Add todo
    form.addEventListener('submit', addTodo);
}

init();