const Codes = require('../utils/http-codes');
const {Task, BinTask, toTask} = require('../models/tasks');
const TaskRepository = require('../persistence/task-repository');

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
module.exports.lookupTask = async (req, res, next) => {
    const taskId = Number(req.params.taskId);
    const repo = await TaskRepository.load();
    try {
        const task = await repo.getById(taskId);
        next();
    } catch (err) {
        res.status(Codes.ClientError.NOT_FOUND).json({error: 'Task was not found.'});
    }
};

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
module.exports.getUnassignedTasks = (req, res) => {
    const taskRepo = await TaskRepository.load();
    let {limit, offset} = req.query;
    try {
        //
        let unassignedTasks;
        if (limit && offset) {
            unassignedTasks = await taskRepo.getUnassignedTasks(limit, offset);
        } else {
            unassignedTasks = await taskRepo.getUnassignedTasks(offset);
        }
        res.status(Codes.Success.OK).json(unassignedTasks);
    } catch (err) {
        res.status(Codes.ServerError.INTERNAL_SERVER_ERROR).json({error: err.message});
    }
};

/**
 * 
 * @param {import('express').RequestHandler} req - the request. No body.
 * @param {import('express').Response} res 
 */
module.exports.getTasks = async (req, res) => {
    const taskRepo = await TaskRepository.load();
    const {limit, offset} = req.query;
    try {
        /**@type {(Task|BinTask)[]} */
        const tasks = await taskRepo.getAll(Number(offset), Number(limit));
        res.status(Codes.Success.OK).json(tasks);
    } catch (error) {
        res.status(Codes.ServerError.INTERNAL_SERVER_ERROR).json({error: error});
    }
};

/**
 * 
 * @param {Express.Request} req 
 * @param {import('express').Response} res 
 */
module.exports.getTask = async (req, res) => {
    const taskRepo = await TaskRepository.load();
    const taskId = Number(req.params.taskId);
    try {
        const task = await taskRepo.getById(taskId);
        res.status(Codes.Success.OK).json(task);
    } catch (error) {
        console.error('Error in getTask: ', error);
        res.status(Codes.ClientError.NOT_FOUND).json({error: error});
    }
};

/**
 * 
 * @param {Express.Request} req 
 * @param {import('express').Response} res 
 */
module.exports.addTask = async (req, res) => {
    const taskRepo = await TaskRepository.load();
    try {
        const requestBody = req.body;
        const newTask = toTask(requestBody);
        const index = await taskRepo.add(newTask);
        await taskRepo.save();
        res.status(Codes.Success.OK).json({id: index});
    } catch (error) {
        console.error('Error with adding task: ' + error);
        res.status(Codes.ClientError.BAD_REQUEST).json({error: error.message});
    }
};

/**
 * 
 * @param {Express.Request} req 
 * @param {import('express').Response} res 
 */
module.exports.editTask = async (req, res) => {
    const taskRepo = await TaskRepository.load();
    const {taskId} = req.params;
    try {
        const requestBody = req.body;
        const index = await taskRepo.update(Number(taskId), requestBody);
        await taskRepo.save();
        res.status(Codes.Success.OK).json({id: index});
    } catch (err) {
        console.error('Error with editing task: ' + err);
        res.status(Codes.ClientError.BAD_REQUEST).json({error: err.message});
    }
};

/**
 * 
 * @param {Express.Request} req 
 * @param {import('express').Response} res 
 */
module.exports.deleteTask = async (req, res) => {
    const taskRepo = await TaskRepository.load();
    const {taskId} = req.params;
    try {
        const didSucceed = await taskRepo.delete(Number(taskId));
        await taskRepo.save();
        res.status(Codes.Success.OK).json({succeeded: didSucceed});
    } catch (err) {
        console.error('Error with delete task: ' + err);
        res.status(Codes.ServerError.NOT_FOUND).json({error: err.message});
    }
};