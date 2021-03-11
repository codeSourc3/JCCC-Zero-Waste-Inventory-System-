'use strict';
const SERVICE_URL = '${{secrets.service_url}}';

function buildURL({table, id, action}) {
    let url = SERVICE_URL;
    if (table) {
        url += `?q=${table}`;
        if (id) {
            url += `/${id}`;
        }
        if (action) {
            url += `&action=${action.toLowerCase()}`;
        }
    }
    return url;
}

async function getData(table) {
    let url = buildURL({
        table
    });
    //console.log(`Get Request: ${url}`);
    let start = performance.now();
    const response = await fetch(url, {
        method: 'GET',

        redirect: 'follow'
    });
    const result = await response.json();
    let end = performance.now();
    const duration = end - start;
    const processedResult = JSON.stringify(result, 0, 2);
    //console.log(processedResult, ' Took: ' + duration);
    return processedResult;
}
//getData('interns');

async function getDataById(table, id) {
    let url = buildURL({
        table,
        id
    });
    const response = await fetch(url, {
        method: 'GET',
        redirect: 'follow'
    });
    const json = await response.json();
    return json;
}

async function postData(table, data) {
    let url = buildURL({
        table,
        action: 'post'
    });
    const response = await fetch(url, {
        method: 'POST',
        redirect: 'follow',
        body: JSON.stringify(data)
    });
    const result = await response.json();
    //console.log(result);
    return result;
}

async function processJSON(jsonString) {
    const results = JSON.parse(jsonString);
    return results;
}

async function displayInterns(results) {
    if (Array.isArray(results)) {
        let elements = [];
        results.forEach(intern => {
            const internCard = document.createElement('intern-card');
            internCard.internId = intern['internId'];
            internCard.firstName = intern['firstName'];
            internCard.lastName = intern['lastName'];
            elements.push(internCard);
        });
        document.body.append(...elements);
    } else {
        // Result must be singular.
    }
}

async function displayTasks(results) {
    if (Array.isArray(results)) {
        let elements = [];
        results.forEach(task => {
            const taskCard = document.createElement('task-card');
            taskCard.taskId = task['taskId'];
            taskCard.description = task['taskDescription'];
            taskCard.dateCreated = task['createdOn'];
            taskCard.taskStatus = task['taskStatus'];
            taskCard.internId = task['internId'];
            elements.push(taskCard);
        });
        document.body.append(...elements);
    } else {
        // Result must be singular.
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
        document.body.append(...elements);
    } else {
        // result must be singular.
    }
}

window.onload = function(e) {
    //getData('interns').then(processJSON).then(displayInterns);
    getDataById('interns', 1).then(result=>{
        displayInterns([result]);
    }
    );

    //postData('interns', {internId: 6, firstName: 'Lucas', lastName: 'Hohn'}).then(processJSON).then(e=>console.log(e));
    
}
;

//console.log(JSON.stringify({id: 4, firstName: 'Jonah', lastName: 'Jameson'}));
