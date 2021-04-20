import {checkPropertiesMatch} from '../types.js';
import { ResourceRepository } from './resource-repo.js';
import { Resources } from './rest-client.js';

const TaskStatus = {
    COMPLETED: 'Completed',
    UNCOMPLETED: 'Uncompleted',
    IN_PROGRESS: 'In Progress'
};

class Task {
    constructor(id, notes='', createdOn=new Date(), completionStatus=TaskStatus.UNCOMPLETED, internId=-1) {
        this.taskId = Number(id);
        this.notes = String(notes);
        this.createdOn = new Date(createdOn);
        this.completionStatus = String(completionStatus);
        this.internId = internId;
    }

    static fromObject(obj) {
        if (checkPropertiesMatch(obj, ...Task.properties())) {
            return new Task(obj.taskId, obj.notes, obj.createdOn, obj.completionStatus, obj.internId);
        } else {
            throw new TypeError(`Could not convert ${JSON.stringify(obj)} to Task.`);
        }
    }

    static properties() {
        return ['taskId', 'notes', 'createdOn', 'completionStatus', 'internId'];
    }
}

class BinTask extends Task {

    /**
     * 
     * @param {number} id 
     * @param {number} binId 
     * @param {string} requestor 
     * @param {Date} deliveryDate 
     * @param {string} location 
     * @param {string} notes 
     * @param {Date} createdOn 
     * @param {string} completionStatus 
     * @param {number} internId 
     */
    constructor(id, binId, requestor, deliveryDate, location, notes, createdOn, completionStatus, internId) {
        super(id, notes, createdOn, completionStatus, internId);
        this.binId = Number(binId);
        this.name = String(requestor);
        this.deliveryDate = new Date(deliveryDate);
        this.location = String(location);
    }

    /**
     * 
     * @param {Object} obj an object to construct a BinTask from.
     * @throws {TypeError} thrown if the object can't be constructed.
     * @returns {BinTask} if the object can be built.
     */
    static fromObject(obj) {
        if (checkPropertiesMatch(obj, ...BinTask.properties())) {
            return new BinTask(obj.taskId, obj.binId, obj.name, obj.deliveryDate, obj.location, obj.notes, obj.createdOn, obj.completionStatus, obj.internId);
        } else {
            console.dir(obj);
            throw new TypeError(`Could nto convert ${JSON.stringify(obj)} to BinTask.`);
        }
    }

    static properties() {
        return ['taskId', 'notes', 'createdOn', 'completionStatus', 'internId', 'binId', 'name', 'deliveryDate', 'location'];
    }
}

const objectToTask = (obj) => {
    if (checkPropertiesMatch(obj, ...BinTask.properties())) {
        return BinTask.fromObject(obj);
    } else if (checkPropertiesMatch(obj, ...Task.properties())) {
        return Task.fromObject(obj);
    } else {
        console.dir(obj);
        throw new Error(`Could not convert ${JSON.stringify(obj)} to a Task object.`);
    }
};

class TaskRepository extends ResourceRepository {
    constructor() {
        super(Resources.TASKS);
    }

    async get(taskId) {
        const id = Number(taskId);
        const result = await super.get(id);
        const task = objectToTask(result);
        return task;
    }

    async getAll(offset=0, limit=10, predicate=(row)=>true) {
        const results = await super.getAll(offset, limit);
        const tasks = results.filter(predicate).map(objectToTask);
        return tasks;
    }

    async add(task) {
        let id;
        if (task instanceof Task) {
            id = await super.add(task);
        } else if (checkPropertiesMatch(task, ...BinTask.properties()) || checkPropertiesMatch(task, ...Task.properties())) {
            id = await super.add(objectToTask(task));
        }
        return id;
    }

    async remove(taskId) {
        const id = Number(taskId);
        let succeeded = await super.remove(id);
        return succeeded;
    }

    async update(taskId, task) {
        const updateId = Number(taskId);
        const id = await super.update(updateId, task);
        return id;
    }
}

export {objectToTask, Task, BinTask, TaskStatus, TaskRepository};