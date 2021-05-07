const Codes = require('../utils/http-codes');
const {Task, BinTask, toTask} = require('../models/tasks');
const TaskRepository = require('../persistence/task-repository');

/**
 * Middleware function for checking if a task exists.
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
        res.status(Codes.ClientError.NOT_FOUND).json({success: false, message: 'Task was not found.'});
    }
};

/**
 * Gets all unassigned tasks.
 * 
 * @example
 * /api/v1/tasks/unassigned
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
module.exports.getUnassignedTasks = async (req, res) => {
    const taskRepo = await TaskRepository.load();
    let {limit, offset} = req.query;
    let limitParam = Number(limit);
    let offsetParam = Number(offset);
    try {
        //
        let unassignedTasks;
        if (limit && offset) {
            unassignedTasks = await taskRepo.getUnassignedTasks(limitParam, offsetParam);
        } else {
            unassignedTasks = await taskRepo.getUnassignedTasks(offsetParam);
        }
        res.status(Codes.Success.OK).json(unassignedTasks);
    } catch (err) {
        res.status(Codes.ServerError.INTERNAL_SERVER_ERROR).json({success: false, message: err.message});
    }
};

/**
 * Gets all tasks. Can be limited by the query parameters limit and offset.
 * @example /api/v1/tasks?offset=${offset}&limit=${limit}
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
        res.status(Codes.ServerError.INTERNAL_SERVER_ERROR).json({success: false, message: error.message});
    }
};

/**
 * Gets a task by id.
 * @example /api/v1/tasks/:taskId
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
        res.status(Codes.ClientError.NOT_FOUND).json({success: false, message: error.message});
    }
};

/**
 * Adds a task.
 * @example 
 * POST /api/v1/tasks
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
        res.status(Codes.ClientError.BAD_REQUEST).json({success: false, message: error.message});
    }
};

/**
 * Edits a task.
 * @example
 * PUT /api/v1/tasks/:taskId
 * PATCH /api/v1/tasks/:taskId
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
        res.status(Codes.ClientError.BAD_REQUEST).json({success: false, message: err.message});
    }
};

/**
 * 
 * @example
 * DELETE /api/v1/tasks
 * @param {Express.Request} req 
 * @param {import('express').Response} res 
 */
module.exports.deleteTask = async (req, res) => {
    const taskRepo = await TaskRepository.load();
    const {taskId} = req.params;
    try {
        const didSucceed = await taskRepo.delete(Number(taskId));
        await taskRepo.save();
        res.status(Codes.Success.OK).json({success: didSucceed});
    } catch (err) {
        console.error('Error with delete task: ' + err);
        res.status(Codes.ServerError.NOT_FOUND).json({success: false, message: err.message});
    }
};