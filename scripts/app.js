let todos = [];
let todosGreenIndexes = [];
let redactVariable = -1;
const TODO_KEY = 'TODO_KEY';


const todosContainer = document.getElementById('days');
const nextTodo = document.querySelector('.todo__day')


function loadData() {
  const todosString = localStorage.getItem(TODO_KEY);
  const todoArray = JSON.parse(todosString);
  if (Array.isArray(todoArray)) {
    todos = todoArray;
  }
}

function saveData() {
  localStorage.setItem(TODO_KEY, JSON.stringify(todos));
}

function rerender(redact=false) {
  todosContainer.innerHTML = '';
  for (const index in todos) {
    if (todosGreenIndexes.includes(Number(index))) {
      addedClassColor = 'todo__green'
      checkBoxImg = `<button class="todo__undo" onclick="undoTodo(${index})">
      <img class="img_button_no" src="./images/no.png" height=50px width=50px" />`
    } else {
      addedClassColor = 'todo'
      checkBoxImg = `<button class="todo__ok" onclick="okTodo(${index})">
      <img class="img_button_yes" src="./images/yes.png" height=50px width=50px" />`
    }
    
    if (redactVariable === Number(index)) {
      redactBox = `<form class="todo__form" onsubmit="redactConfirmTodo(event, ${index})">
      <input name="comment" class="input_icon" type="text" value="${todos[index]}" />
      <img class="input__icon" src="./images/comment.svg" alt="Иконка" />
      <button class="button" type="submit">Сохранить</button>
    </form>`
    } else {
      redactBox = `<div class="todo__comment">${todos[index]}</div>
      <button class="todo__redact" onclick="redactTodo(${index})">
        <img class="img_button_redact" src="./images/pen.png" height=50px width=50px" />
      ${checkBoxImg}
      <button class="todo__delete" onclick="deleteTodo(${index})">
        <img src="./images/delete.svg" alt="Удалить дело ${index + 1}" />
      </button>`
    }

    const element = document.createElement('div');
    element.classList.add(addedClassColor);
    element.innerHTML = `<div class="todo__day">Дело ${Number(index) + 1}</div>
              ${redactBox}`;
    todosContainer.appendChild(element);
  }
  nextTodo.innerHTML = `Дело ${todos.length + 1}`;
}


/* work with todos */
function addTodo(event) {
  event.preventDefault();
  
  const data = event.target['comment'].value
  if (!data) {
    return;
  }
  
  todos.push(data)
  event.target['comment'].value = '';

  rerender();
  saveData();
}

function redactConfirmTodo(event, index){
  event.preventDefault();
  
  const data = event.target['comment'].value;
  
  todos[index] = data;
  
  redactVariable = -1;

  rerender();
  saveData();
}


function redactTodo(index){
  redactVariable = Number(index);
  rerender();
  saveData();
}

function deleteTodo(index) {
  todos.splice(index, 1);
  todosGreenIndexes = todosGreenIndexes.filter(function(element) {
    return element !== index;
  })
  for (let i = 0; i < todosGreenIndexes.length; i++) {
    if (todosGreenIndexes[i] > Number(index)) {
      todosGreenIndexes[i] -= 1;
    }
  }
  rerender();
  saveData();
}

function okTodo(index) {
  todosGreenIndexes.push(index);
  rerender();
  saveData();
}

function undoTodo(index) {
  todosGreenIndexes = todosGreenIndexes.filter(function(element) {
    return element !== index;
  })
  rerender();
  saveData();
}

/* init */
(() => {
  loadData();
  rerender();
})();