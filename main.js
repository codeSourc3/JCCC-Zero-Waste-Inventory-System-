import {Task, Intern, Bin} from './entities.js';
import {postData, putData, getData, getDataById, deleteData} from './webclient.js';
import {TaskCardElement, InternCardElement, BinCardElement} from './ui.js';
import { Logger } from './logger.js';

const resultsPanel = document.querySelector('#results-panel');
const log = document.querySelector('#log');
const dynamicForm = document.querySelector('#dynamic-form');
const logger = new Logger();

let currentTable;
let currentRequestType;

/**
 * Converts a string written in snake case to camel
 * case.
 * 
 * @param {String} str a string in snake case.
 * @returns a string converted to camel case.
 */
const snakeToCamel = str => {
    return str.toLowerCase().replace(/[-_][a-z]/g, (group) => {
        return group.slice(-1).toUpperCase();
    });
};

/**
 * Capitalizes the first letter of a string.
 * 
 * @param {String} str 
 * @returns 
 */
const capitalize = str => str.replace(str[0], str[0].toUpperCase());

/**
 * Converts an enum to a HTMLSelectElement element with options.
 * 
 * @param {Object} statusEnum 
 * @returns a completed HTMLSelectElement with Options.
 */
function fromEnum(statusEnum = {}) {
    const select = document.createElement('select');
    for (const key in statusEnum) {
        const option = new Option(statusEnum[key], key);
        select.add(option);
    }
    return select;
}

/**
 * 
 * @param {Object[]} results 
 */
async function displayInterns(results) {
    if (Array.isArray(results)) {
        let elements = [];
        results.forEach(intern => {
            const internCard = new InternCardElement();
            internCard.internId = intern['internId'];
            internCard.firstName = intern['firstName'];
            internCard.lastName = intern['lastName'];
            elements.push(internCard);
        });
        resultsPanel.append(...elements);
    } else {
        // Result must be singular.
        const internCard = new InternCardElement();
        internCard.internId = results['internId'];
        internCard.firstName = results['firstName'];
        internCard.lastName = results['lastName'];
        resultsPanel.append(internCard);
    }
}
//
async function displayTasks(results) {
    if (Array.isArray(results)) {
        let elements = [];
        results.forEach(task => {
            const taskCard = document.createElement('task-card');
            taskCard.taskId = task['taskId'];
            taskCard.description = task['taskDescription'];
            taskCard.dateCreated = task['createdOn'];
            logger.info(task['internId']);
            taskCard.taskStatus = task['taskStatus'];
            taskCard.internId = task['internId'];
            elements.push(taskCard);

            //console.info('For each task: ' + task['createdOn']);
        });
        resultsPanel.append(...elements);
    } else {
        // Result must be singular.
        const taskCard = document.createElement('task-card');
        taskCard.taskId = results['taskId'];
        taskCard.description = results['taskDescription'];
        taskCard.dateCreated = results['createdOn'];
        taskCard.taskStatus = results['taskStatus'];
        taskCard.internId = results['internId'];
        resultsPanel.append(taskCard);

        //console.info(enUSDateTime.format(Date.parse(results['createdOn'])));
    }

}

async function displayBins(results) {
    if (Array.isArray(results)) {
        let elements = [];
        results.forEach(bin => {
            const binCard = document.createElement('bin-card');
            binCard.binId = bin['binId'];
            binCard.weight = bin['binWeight'];
            binCard.status = bin['binStatus'];
            elements.push(binCard);
        });
        resultsPanel.append(...elements);
    } else {
        const binCard = document.createElement('bin-card');
        binCard.binId = results['binId'];
        binCard.weight = results['binWeight'];
        binCard.status = results['binStatus'];
        resultsPanel.append(binCard);
        // result must be singular.
    }
}

const form = document.querySelector('#query-form');
const tableSelection = document.querySelector('#table');
const requestOptions = document.querySelector('#request-set');

const requestTypes = Array.from(document.querySelectorAll('input[name=request-type]'));

function onFormChange(e) {
    //logger.log('form changed');
    let requestType = requestTypes.find(el => el.checked).value;
    let table = tableSelection.value;
    if (requestType !== currentRequestType || table !== currentTable) {
        dynamicForm.replaceChildren();
    }
    currentRequestType = requestType;
    currentTable = table;
    log.textContent = `${requestType} ${capitalize(table)}`;
    if (requestType === 'GET') {
        //console.info('Building a get form for ', table);
        buildGetForm(table);
    } else if (requestType === 'POST') {
        buildPostForm(table);
    } else if (requestType === 'PUT') {
        buildPutForm(table);
    } else if (requestType === 'DELETE') {
        //console.info('Building delete form for ', table);
        buildDeleteForm(table);
    }
}

tableSelection.addEventListener('change', onFormChange);
requestOptions.addEventListener('change', onFormChange);

function buildDeleteForm(table) {

    const fragment = new DocumentFragment();
    const idInput = document.createElement('input');
    idInput.type = 'number';
    const idLabel = buildLabel(`${capitalize(table)} Id: `, `${table}-id`, idInput);



    fragment.appendChild(idLabel);
    dynamicForm.appendChild(fragment);
}

function buildPostForm(table) {
    switch (table) {
        case 'interns':
            buildInternForm(false);
            break;
        case 'tasks':
            buildTaskForm(false);
            break;
        case 'bins':
            buildBinForm(false);
            break;
    }
}

function buildTaskForm(hasId = true) {
    const fragment = new DocumentFragment();
    if (hasId) {
        const idInput = document.createElement('input');
        idInput.type = 'number';
        const idLabel = buildLabel('Task Id: ', 'task-id', idInput);
        fragment.appendChild(idLabel);
    }
    //task description, created on, task status, intern
    const descriptionTextArea = document.createElement('textarea');
    descriptionTextArea.value = 'No Description';
    const descriptionLabel = buildLabel('Task Description', 'task-description', descriptionTextArea);

    const taskStatusSelect = document.createElement('select');
    const notCompletedOption = new Option('Uncompleted', 'UNCOMPLETED', true);
    const completedOption = new Option('Completed', 'COMPLETED');
    taskStatusSelect.add(notCompletedOption);
    taskStatusSelect.add(completedOption);
    const taskStatusLabel = buildLabel('Task Status', 'task-status', taskStatusSelect);

    const internInput = document.createElement('input');
    internInput.type = 'number';
    internInput.value = -1;
    const internLabel = buildLabel('Intern Id: ', 'intern-id', internInput);

    fragment.appendChild(descriptionLabel);
    fragment.appendChild(taskStatusLabel);
    fragment.appendChild(internLabel);
    dynamicForm.appendChild(fragment);

}

function buildBinForm(hasId = true) {
    //binId
    //binWeight
    //binStatus
    const fragment = new DocumentFragment();
    if (hasId) {
        const idInput = document.createElement('input');
        idInput.type = 'number';
        const idLabel = buildLabel('Bin Id: ', 'bin-id', idInput);
        fragment.appendChild(idLabel);
    }
    const weightInput = document.createElement('input');
    weightInput.type = 'number';
    weightInput.step = 0.01;
    weightInput.min = 0;
    const weightLabel = buildLabel('Bin Weight: ', 'bin-weight', weightInput);
    // bin status
    const statusSelect = fromEnum(BinStatus);
    statusSelect.item(0).defaultSelected = true;
    const statusLabel = buildLabel('Bin Status: ', 'bin-status', statusSelect);

    fragment.appendChild(weightLabel);
    fragment.appendChild(statusLabel);
    dynamicForm.appendChild(fragment);

}

function buildInternForm(hasId = true) {
    const fragment = new DocumentFragment();

    if (hasId) {
        const idInput = document.createElement('input');
        idInput.type = 'number';

        const idLabel = buildLabel('Intern Id: ', 'intern-id', idInput);
        fragment.appendChild(idLabel);
    }

    const firstNameInput = document.createElement('input');
    firstNameInput.type = 'text';
    const firstNameLabel = buildLabel('First Name: ', 'first-name', firstNameInput);

    const lastNameInput = document.createElement('input');
    lastNameInput.type = 'text';
    const lastNameLabel = buildLabel('Last Name: ', 'last-name', lastNameInput);

    fragment.appendChild(firstNameLabel);
    fragment.appendChild(lastNameLabel);
    dynamicForm.appendChild(fragment);
}

function buildPutForm(table) {
    switch (table) {
        case 'interns':
            buildInternForm(true);
            break;
        case 'tasks':
            buildTaskForm(true);
            break;
        case 'bins':
            buildBinForm(true);
            break;
    }
}

function buildGetForm(table) {
    const fragment = new DocumentFragment();
    const idInput = document.createElement('input');
    idInput.type = 'number';
    const idLabel = buildLabel(`${capitalize(table.substring(0, table.length - 1))} Id: `, `${table}-id`, idInput);

    fragment.appendChild(idLabel);
    dynamicForm.appendChild(fragment);
}
function buildLabel(text, htmlFor, inputElement) {
    const label = document.createElement('label');
    label.htmlFor = htmlFor;
    inputElement.id = htmlFor;
    const textNode = document.createTextNode(text);
    label.appendChild(textNode);
    label.appendChild(inputElement);
    return label;
}


function formatLiteral(table, object) {
    let result;
    if (table === 'interns') {
        result = Intern.fromObject(object);
    } else if (table === 'tasks') {
        result = Task.fromObject(object);
    } else if (table === 'bins') {
        result = Bin.fromObject(object);
    }
    return result;
}

window.addEventListener('DOMContentLoaded', e => {
    //getData('interns').then(processJSON).then(displayInterns);
    //     getDataById('interns', 1).then(result=>{
    //         displayInterns([result]);
    //     }
    //     );


    currentRequestType = requestTypes.find(e => e.checked).value;
    currentTable = tableSelection.value;

    log.textContent = `${currentRequestType} ${currentTable}`;
    //postData('interns', {internId: 6, firstName: 'Lucas', lastName: 'Hohn'}).then(processJSON).then(e=>console.log(e));
    form.onsubmit = (event) => {
        event.preventDefault();
        // Had problems with Chrome, so I'm a little salty.
        //return false;
        // grab all useful data.
        //console.log('Submitting data');
        resultsPanel.replaceChildren();
        let obj = {};
        let id = '';
        const inputElements = dynamicForm.querySelectorAll('input, textarea, select');
        inputElements.forEach(input => {
            //console.debug(`"${snakeToCamel(input.id)}", "${input.value}"`);
            obj[snakeToCamel(input.id)] = input.value;


        });
        if (obj[`${currentTable.substring(0, currentTable.length - 1)}Id`]) {
            id = Number(obj[`${currentTable.substring(0, currentTable.length - 1)}Id`]);

            logger.info('Id: ' + id + '');
        }

        if (currentTable === 'tasks') {
            obj['createdOn'] = new Date();
        }
        obj = formatLiteral(currentTable, obj);
        switch (currentRequestType) {
            case 'POST':
                //

                postData(currentTable, obj).then(() => logger.log('Post completed'));
                break;
            case 'GET':
                //
                if (id === '') {
                    const functionName = 'display' + (capitalize(currentTable));
                    //console.debug(functionName);
                    getData(currentTable).then(results => {
                        if (currentTable === 'interns') {
                            displayInterns(results);
                        } else if (currentTable === 'tasks') {
                            displayTasks(results);
                        } else if (currentTable === 'bins') {
                            console.debug(JSON.stringify(results, 0, 2));
                            displayBins(results);
                        }
                    });
                } else {
                    getDataById(currentTable, Number(id)).then(results => {
                        if (currentTable === 'interns') {
                            displayInterns(results);
                        } else if (currentTable === 'tasks') {
                            displayTasks(results);
                        } else if (currentTable === 'bins') {
                            displayBins(results);
                        }
                    });
                }
                break;
            case 'PUT':
                //
                if (id !== '') {
                    console.info(JSON.stringify(obj));
                    putData(currentTable, id, obj).then(response => {
                        logger.log(JSON.stringify(response, 0, 2));
                    }).catch(err => {
                        console.error(err);
                    });
                }
                break;
            case 'DELETE':
                if (id !== '') {
                    deleteData(currentTable, id).then(response => {
                        logger.log(JSON.stringify(response, 0, 2));
                    });
                }
                break;
        }

        //event.preventDefault();

    };
});