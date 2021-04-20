

/**
 * 
 * @param {Task[]} tasks 
 */
export const listTasks = (tasks) => {
    const ul = document.createElement('ul');
    for (const task of tasks) {
      const li = document.createElement('li');
      li.textContent = JSON.stringify(task);
      ul.appendChild(li);
    }
    return ul;
};
  


/**
 * 
 * @param {BinTask} binTask 
 * @param {HTMLLIElement} li 
 */
const buildBinTask = (binTask, li) => {
    const string = `Bin Id: ${binTask.taskId}, `;
};