'use strict';

// let habbits = [];
// let habbits = [{id: 1, name: "aaa", target: "3", icon: "sport", days: []}];
let habbits = [{ days: [] }];
const TODO_KEY = 'TODO_KEY';

/* page */
const page = {
  content: {
    daysContainer: document.getElementById('days'),
    nextDay: document.querySelector('.habbit__day')
  },

}

/* utils */
function loadData() {
  const habbitsString = localStorage.getItem(TODO_KEY);
  const habbitArray = JSON.parse(habbitsString);
  console.log(habbitArray)
  if (Array.isArray(habbitArray)) {
    console.log('first')
    habbits = habbitArray;
  }
}

function saveData() {
  localStorage.setItem(TODO_KEY, JSON.stringify(habbits));
}


function resetForm(form, fields) {
  for (const field of fields) {
    form[field].value = '';
  }
}

function validateAndGetFormData(form, fields) {
  const formData = new FormData(form);
  const res = {};
  for (const field of fields) {
    const fieldValue = formData.get(field);
    form[field].classList.remove('error');
    if (!fieldValue) {
      form[field].classList.add('error');
    }
    res[field] = fieldValue;
  }
  let isValid = true;
  for (const field of fields) {
    if (!res[field]) {
      isValid = false;
    }
  }
  if (!isValid) {
    return;
  }
  return res;
}

/* render */

function rerenderContent(activeHabbit) {
  page.content.daysContainer.innerHTML = '';
  for (const index in activeHabbit.days) {
    const element = document.createElement('div');
    element.classList.add('habbit');
    element.innerHTML = `<div class="habbit__day">День ${Number(index) + 1}</div>
              <div class="habbit__comment">${activeHabbit.days[index].comment}</div>
              <button class="habbit__delete" onclick="deleteDay(${index})">
                <img src="./images/delete.svg" alt="Удалить день ${index + 1}" />
              </button>`;
    page.content.daysContainer.appendChild(element);
  }
  page.content.nextDay.innerHTML = `День ${activeHabbit.days.length + 1}`;
}

function rerender() {
  rerenderContent(habbits[0]);

}

/* work with days */
function addDays(event) {
  event.preventDefault();
  const data = validateAndGetFormData(event.target, ['comment']);
  if (!data) {
    return;
  }
  habbits = habbits.map(habbit => {
    return {
      ...habbit,
      days: habbit.days.concat([{ comment: data.comment }])
    }
  });
  resetForm(event.target, ['comment']);
  rerender();
  saveData();
}

function deleteDay(index) {
  habbits = habbits.map(habbit => {
    habbit.days.splice(index, 1);
    return {
      ...habbit,
      days: habbit.days
    };
  });
  rerender();
  saveData();
}


/* init */
(() => {
  loadData();
  rerender();
})();