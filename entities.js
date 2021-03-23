export const BinStatus = {
    IN_TRANSIT: 'In Transit',
    LOST: 'Lost',
    UNKNOWN: 'Unknown'
};

export class Bin {
    constructor(id, weight=0.0, status=BinStatus.IN_TRANSIT) {
        this.binId = id;
        this.binWeight = weight;
        this.binStatus = status;
    }

    static fromArray(array) {
        return new Bin(array[0],array[1],array[2]);
    }

    static fromObject(obj) {
        const {binId, binWeight=0.0, binStatus=BinStatus.IN_TRANSIT} = obj;
        return new Bin(binId,binWeight,binStatus);
    }

    set weight(value) {
        if (value > 0) {
            this.binWeight = value;
        } else {
            this.binWeight = 0.0;
        }
    }

    set status(value) {
        if (BinStatus[value]) {
            this.binStatus = value;
        } else {
            this.binStatus = BinStatus.UNKNOWN;
        }
    }

    get id() {
        return this.binId;
    }

    set id(value) {
        this.binId = value;
    }

    get weight() {
        return this.binWeight;
    }

    get status() {
        return this.binStatus;
    }

    static get propertiesLength() {
        const data = new Bin(1);
        return data.toArray().length;
    }

    toString() {
        return `${this.binId}, ${this.binWeight}, ${this.binStatus}`;
    }

    toArray() {
        return [this.binId, this.binWeight, this.binStatus];
    }
}

 export const TaskStatus = {
    COMPLETED: 'Completed',
    UNCOMPLETED: 'Uncompleted'
};

export class Task {
    constructor(id, description='No description', dateCreated=new Date(), status=TaskStatus.UNCOMPLETED) {
        this.taskId = id;
        this.taskDescription = description;
        this.createdOn = dateCreated;
        this.taskStatus = status;
        this.internId = -1;
    }

    static fromObject(obj) {
        const {taskId, taskDescription='No description', createdOn=new Date(), taskStatus=TaskStatus.UNCOMPLETED, internId=-1} = obj;
        const task = new Task(taskId,taskDescription,createdOn,taskStatus);
        if (internId !== -1) {
            task.status = internId;
        }
        return task;
    }

    static fromArray(array) {
        return new Task(array[0],array[1],array[2],array[3]);
    }

    static get propertiesLength() {
        const values = new Task(1);
        return values.toArray().length;
    }

    get id() {
        return this.taskId;
    }

    set id(value) {
        this.taskId = value;
    }

    set status(value) {
        if (TaskStatus[value]) {
            this.taskStatus = value;
        } else {
            this.taskStatus = TaskStatus.UNCOMPLETED;
        }
    }

    set description(value) {
        if (typeof (value) === 'string') {
            this.taskDescription = value;
        } else {
            this.taskDescription = String(value);
        }
    }

    get description() {
        return this.taskDescription;
    }

    set intern(internIdValue) {
        if (internIdValue < 0) {
            throw new Error('Intern id can\'t be negative');
        }
        this.internId = internIdValue;
    }

    get intern() {
        return this.internId;
    }

    get isAssigned() {
        return this.internId != -1;
    }

    toString() {
        return `Task Id: ${this.taskId}, Description: ${this.taskDescription}, Created: ${this.createdOn}, Status: ${this.taskStatus}, Intern Id: ${this.internId}`;
    }

    toArray() {
        return [this.taskId, this.taskDescription, this.createdOn, this.taskStatus, this.internId];
    }
}

export class Intern {
    constructor(id, first='', last='') {
        this.internId = id;
        this.firstName = first;
        this.lastName = last;
        //this.tasks = [];
    }

    static fromObject(obj) {
        const {internId, firstName='', lastName=''} = obj;
        return new Intern(internId,firstName,lastName);
    }

    get id() {
        return this.internId;
    }

    set id(value) {
        this.internId = value;
    }

    // /**
    //  * Can't claim a task that's already been claimed.
    //  * 
    //  * @param {Task} task the task to claim.
    //  */
    // claimTask(task) {
    //   if (task.intern == -1) {
    //     task.intern = this.internId;
    //     this.tasks.push(task);
    //   } 
    // }

    static get propertiesLength() {
        const intern = new Intern(1);
        return intern.toArray().length;
    }

    static fromArray(array) {
        return new Intern(array[0],array[1],array[2]);
    }

    toString() {
        return `Intern Id: ${this.internId}, First Name: ${this.firstName}, Last Name: ${this.lastName}`;
    }

    toArray() {
        return [this.internId, this.firstName, this.lastName]
    }

}
