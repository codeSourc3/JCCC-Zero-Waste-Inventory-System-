import {RestClient, Resources} from './rest-client.js';

function showData(result) {
  
    document.body.insertAdjacentHTML('beforeend', `<p>Response: ${JSON.stringify(result)}</p>`);
    console.dir(result);
}

function showError(error) {
  document.body.insertAdjacentHTML('beforeend', `<p>Error: ${error}</p>`);
}
const internId = 1;
const task = {
  taskId: 2,
  notes: 'Task is updated',
  deliveryDate: new Date().toLocaleDateString(),
  location: 'A Location',
  completionStatus: 'Uncompleted',
  binId: 3
};
const taskId = 2;
const resourceURL = `${Resources.INTERNS}/${internId}/${Resources.TASKS}/${taskId}`;
RestClient.getInstance().put(resourceURL, task).then(showData).catch(showError);