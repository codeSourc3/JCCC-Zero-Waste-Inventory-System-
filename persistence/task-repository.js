

const db = require('./db');
const { Task, TaskStatus, BinTask, toTask } = require("../models/tasks");
const { GoogleSpreadsheet, GoogleSpreadsheetWorksheet, GoogleSpreadsheetRow } = require('google-spreadsheet');

/**
 * 
 * @class
 */
 class TaskRepository {

    constructor(doc) {
        /**
         * @private
         */
        this._doc = doc;
        /** 
         * @type {GoogleSpreadsheetWorksheet}
         * @private
         */
        this._sheet = this._doc.sheetsByTitle['Tasks'];
        /**
         * @type {GoogleSpreadsheetRow[]} 
         * @private
        */
        this._unsavedRows = [];
    }
    
    static async load() {
        const database = await db;
        return new TaskRepository(database);
    }

    /**
     * Gets a list of Tasks offset by a parameter and 
     * limited by another parameter.
     * 
     * @param {Number} offset the offset rows to be retrieved.
     * @param {Number} limit the maximum amount of rows to be retrieved.
     * @returns {Promise<Task[]>} a Promise containing an array of Task objects.
     */
    async getAll(offset = 0, limit = 10) {
        // assert offset >= 0 && limit > 0

        const results = await this._sheet.getRows({offset, limit});
        const tasks = results.map(row => toTask(row));
        console.dir(tasks);
        return tasks;
    }

    /**
     * Gets an Task by id.
     * 
     * @param {Number} id the id starting at 1
     * @returns {Promise<Task>} a Promise containing an Task.
     */
    async getById(id) {
        const taskId = Number(id);
        // Gets a single Task
        const tasks = (await this.getAll());
        let task;
        if (tasks.length > 0) {
            task = tasks.find(task => task.taskId === taskId);
        } else {
            throw new Error(`Task could not be found at ${taskId}`);
        }
        return task;
    }

    /**
     * Adds an Task to the end of the sheet.
     * 
     * @param {Task} task the Task to add.
     * @returns {Promise<number>}
     */
    async add(task) {
        // Validates the task before adding it.
        const taskId = this._sheet.rowCount + 1;
        if (task instanceof Task) {
            task.taskId = taskId;
            let addedRow = await this._sheet.addRow(task.toJSON());
            this._unsavedRows.push(addedRow);
            return addedRow.rowIndex;
        } else {
            throw new TypeError(`Expected a class or subclass of Task, not ${task}`);
        }
    }

    /**
     * Finds all the tasks of an intern.
     * 
     * @param {Number} internId - the id of the intern.
     * @returns {Promise<(Task|BinTask)[]> a promise resolving to an array of tasks of both Task and BinTask objects.
     */
    async getTasksOfIntern(internId) {
        const rows = await this._sheet.getRows();
        /**@type {<Task | BinTask>[]} */
        let tasks = [];
        if (rows.length > 0) {
            const taskRows = rows.filter(row => Number(row.internId) === Number(internId));
            this._unsavedRows.push(taskRows);
            tasks = taskRows.map(row => {
                if ('binId' in row && row.binId) {
                    return BinTask.fromObject(row);
                } else {
                    return Task.fromObject(row);
                }
            });
        }
        return tasks;
    }

    /**
     * Updates an existing task. Adds to 
     * the list of unsaved changes.
     * 
     * @param {number} taskId 
     * @param {Task | Object} newTask 
     * @returns {Promise<number>}
     */
    async update(taskId, newTask) {
        const rows = await this._sheet.getRows();
        // find task.
        const row = rows.find(row => Number(row.taskId) === Number(taskId));
        if (!row) {
            throw new Error('Task of ' + taskId + ' does not exist or has been deleted');
        }
        // for each attribute in the newTask, update the row's attribute accordingly.
        if (!newTask) {
            throw new Error(`New task is undefined or null.`);
        }
        let object = newTask;
        if (newTask instanceof Task) {
            object = newTask.toObject();
        }
        for (const key in object) {
            if (key !== 'taskId' && object[key]) {
                row[key] = object[key];
            }
        }
        this._unsavedRows.push(row);
        return row.rowIndex;
    }

    /**
     * 
     * @param {number} internId 
     * @param {number} taskId 
     * @returns {Promise<Task | BinTask>} the task of the intern.
     */
    async getTaskOfIntern(internId, taskId) {
        const rows = await this._sheet.getRows();
        let task;
        if (rows.length > 0) {
            const taskRows = rows.filter(row => Number(row.internId) === Number(internId));
            const taskRow = taskRows.find(taskRow => Number(taskRow.taskId) === Number(taskId));
            if (!taskRow) {
                // No rows could be found.
                throw new Error(`No results found at Intern Id: ${internId} Task Id: ${taskId}`)
            }
            this._unsavedRows.push(taskRow);
            task = toTask(taskRow);
        }
        //const task = tasks.find(task => task.task.taskId === Number(taskId));
        return task;
    }

    /**
     * Attempts to delete a task by its id.
     * 
     * @param {number} taskId the id of the task to delete, starting at 1.
     * @returns {Promise<boolean>} true if the task was deleted,
     * false otherwise.
     */
    async delete(taskId) {
        const rows = await this._sheet.getRows();
        const targetRow = rows.find(row => Number(row.taskId) === Number(taskId));
        if (targetRow) {
            // row with task id exists.
            await targetRow.delete();
            return true;
        } else {
            return false;
        }
    }

    

    /**
     * Saves all changes since the last save to the sheet.
     */
    async save() {
        for (const row of this._unsavedRows) {
            await row.save();
        }
        this._unsavedRows = [];
    }
}


module.exports = TaskRepository;