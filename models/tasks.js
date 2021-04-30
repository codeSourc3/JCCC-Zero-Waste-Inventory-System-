const typeSafety = require('../utils/type-safety');

/**
 * Enum for the status of tasks.
 * @readonly
 * @enum {string}
 */
const TaskStatus = {
    COMPLETED: 'Completed',
    UNCOMPLETED: 'Uncompleted',
    IN_PROGRESS: 'In Progress'
};

/**
 * Class respresenting a Task.
 * 
 */
class Task {

    /**
     * Constructs a new Task.
     * 
     * @param {Number} id 
     * @param {String} notes 
     * @param {Date} createdOn 
     * @param {TaskStatus} completionStatus 
     * @param {Number} internNr 
     */
    constructor(id, notes='', createdOn=new Date(), completionStatus=TaskStatus.UNCOMPLETED, internNr=-1) {
        this._taskId = Number(id);
        this._notes = String(notes);
        this._createdOn = createdOn;
        this._completionStatus = completionStatus;
        this._internId = Number(internNr);
    }

    static properties() {
        return ['taskId', 'notes', 'createdOn', 'completionStatus', 'internId'];
    }

    /**
     * Gets the task id.
     * 
     * @returns {Number} the task id.
     */
    get taskId() {
        return this._taskId;
    }

    set taskId(value) {
        this._taskId = Number(value);
    }

    /**
     * @returns {String} the notes of the task.
     */
    get notes() {
        return this._notes;
    }

    set notes(value) {
        this._notes = String(value);
    }

    /**
     * @returns {Date} the date the task was created on.
     */
    get createdOn() {
        return this._createdOn;
    }

    set createdOn(value) {
        if (value instanceof Date) {
            this._createdOn = value;
        }
    }

    /**
     * @returns {String} the completion status.
     */
    get completionStatus() {
        return this._completionStatus;
    }

    set completionStatus(value) {
        if (Object.values(TaskStatus).includes(value)) {
            this._completionStatus = String(value);
        }
    }

    /**
     * @returns {Number} the intern id.
     */
    get intern() {
        return this._internId;
    }

    get isAssigned() {
        return this._internId !== -1;
    }

    set intern(value) {
        this._internId = Number(value);
    }

    /**
     * Constructs a Task from an object.
     * 
     * @param {Object} obj any object to find properties for.
     * @returns {Task} a task from the object.
     */
    static fromObject(obj) {
        let {taskId, notes, createdOn, completionStatus, internId} = obj;
        if (typeSafety.isString(createdOn)) {
            createdOn = new Date(createdOn);
        }
        return new Task(taskId, notes, createdOn, completionStatus, internId);
    }

    /**
     * @todo Implement this function.
     * @param {Object} obj - the object to test for equality.
     * @returns {boolean} true if the object equals the Task object,
     * false otherwise.
     */
    equals(obj) {
        let isEqual = false;
        if (obj instanceof Task || typeSafety.hasProperties(obj, 'taskId', 'completionStatus', 'notes', 'createdOn', 'internId')) {
            isEqual = obj.taskId === this._taskId;
            isEqual = obj.completionStatus === this._completionStatus;
            isEqual = obj.notes === this._notes;
            isEqual = obj.createdOn === this._createdOn;
            isEqual = obj.internId === this._internId;
        }
        return isEqual;
    }

    /**
     * Changes the status of the task to a valid status.
     * @param {TaskStatus} newStatus 
     */
    changeStatus(newStatus) {
        if (newStatus && TaskStatus[newStatus]) {
            this._completionStatus = newStatus;
        }
    }

    /**
     * 
     * @returns an object literal for persistence.
     */
    toJSON() {
        const self = this;
        return {
            taskId: self._taskId,
            notes: self._notes,
            createdOn: self._createdOn.toLocaleDateString(),
            completionStatus: self._completionStatus,
            internId: self._internId
        };
    }
}

/**
 * Class representing a bin task.
 * @extends Task
 */
class BinTask extends Task {

    /**
     * Constructs a BinTask.
     * 
     * @param {Number} id 
     * @param {Number} binId 
     * @param {String} requestor 
     * @param {Date} deliveryDate 
     * @param {String} location 
     * @param {String} notes 
     * @param {Date} createdOn 
     * @param {TaskStatus} completionStatus 
     * @param {Number} internId 
     */
    constructor(id, binId, requestor, deliveryDate, location, notes, createdOn, completionStatus, internId) {
        super(id, notes, createdOn, completionStatus, internId);
        this._binId = binId;
        this._name = requestor;
        this._deliveryDate = deliveryDate;
        this._location = location;
    }
    
    static properties() {
        return [...super.properties(), 'binId', 'name', 'deliveryDate', 'location'];
    }

    /**
     * Gets the bin id.
     * @returns {Number} the bin id.
     */
    get binId() {
        return this._binId;
    }

    set binId(value) {
        if (typeSafety.isNumber(value)) {
            if (value > 0) {
                this._binId = value;
            }
        } else {
            this._binId = Number(value);
        }
    }

    /**
     * @returns {String} returns the name.
     */
    get name() {
        return this._name;
    }

    /**
     * @param {String} value - the value to set the name to.
     */
    set name(value) {
        this._name = String(value);
    }

    /**
     * @returns {Date} - returns the date.
     */
    get deliveryDate() {
        return this._deliveryDate;
    }

    set deliveryDate(value) {
        if (value instanceof Date) {
            this._deliveryDate = value;
        }
    }

    /**
     * @returns {String} the location.
     */
    get location() {
        return this._location;
    }

    set location(value) {
        this._location = String(value);
    }

    /**
     * 
     * 
     * @override
     * @param {Object} obj - the object to test for equality. 
     * @returns {boolean} True if the object equals this object, false otherwise.
     */
    equals(obj) {
        if (!super.equals(obj)) return false;
        if (this._binId !== obj.binId) return false;
        if (this._deliveryDate !== obj.deliveryDate) return false;
        if (this._location !== obj.location) return false;
        if (this._name !== obj.name) return false;
        return true;
    }


    /**
     * Constructs a BinTask from an object.
     * 
     * @param {Object} obj an object to create a bin task from.
     * @returns {BinTask} creates a BinTask from an object.
     */
    static fromObject(obj) {
        let {taskId, binId, name, deliveryDate, location, notes, createdOn, completionStatus, internId} = obj;
        if (typeSafety.isString(deliveryDate)) {
            deliveryDate = new Date(deliveryDate);
        }

        if (typeSafety.isString(createdOn)) {
            createdOn = new Date(createdOn);
        }
        return new BinTask(Number(taskId), Number(binId), name, deliveryDate, location, notes, createdOn, completionStatus, Number(internId));
    }


    /**
     * 
     * @returns {Object} the object literal version of the bin task.
     */
    toJSON() {
        const obj = super.toJSON();
        obj.binId = this._binId;
        obj.name = this._name;
        obj.deliveryDate = this._deliveryDate.toLocaleDateString();
        obj.location = this._location;
        return obj;
    }
}

const toTask = (obj) => {
    if (typeSafety.checkPropertiesMatch(obj, ...BinTask.properties())) {
        return BinTask.fromObject(obj);
    } else if (typeSafety.checkPropertiesMatch(obj, ...Task.properties())) {
        return Task.fromObject(obj);
    } else {
        throw new Error(`Error from server: Could not convert ${JSON.stringify(obj)} to a Task object.`);
    }
};

module.exports = {TaskStatus, Task, BinTask, toTask};