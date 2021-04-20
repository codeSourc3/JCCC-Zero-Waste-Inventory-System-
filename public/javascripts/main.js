import {RestClient, Resources} from './api/rest-client.js';
import {Intern, InternRepository} from './api/intern-resource.js';

import {listAllInterns, addInternFromForm} from './ui/interns-ui.js';

import {Task, BinTask, TaskRepository} from './api/task-resource.js';


const output = document.querySelector('#output');

const addBin = document.querySelector('#add-intern');
addBin.addEventListener('submit', event => {
  addInternFromForm(addBin);
});

// Example code. Replace with actual implementation.
function displayInterns(result) {
  
    const list = listAllInterns(result);
    output.append(list);
}

function displayError(error) {
  document.body.insertAdjacentHTML('beforeend', `<p>Error: ${error}</p>`);
}

function displayTask(result) {
  if (Array.isArray(result)) {
    const list = listTasks(result);
    output.append(list);
  } else {
    const list = listTasks([result]);
    output.append(list);
  }
};





const internRepo = new InternRepository();
internRepo.getAll().then(displayInterns).catch(displayError);
const taskRepo = new TaskRepository();
taskRepo.getAll().then(displayTask).catch(displayError);


