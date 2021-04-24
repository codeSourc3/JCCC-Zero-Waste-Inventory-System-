const TaskRepository = require('../persistence/task-repository');
const InternRepository = require('../persistence/intern-repository');
const Codes = require('../utils/http-codes');
const {Task} = require('../models/tasks');
const Intern = require('../models/interns');
const typeSafety = require('../utils/type-safety');

/**
 * Checks if the Intern with the Intern Id exists.
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
module.exports.lookupIntern = async (req, res, next) => {
    const internId = Number(req.params.internId);
    const repo = await InternRepository.load();
    try {
        const intern = await repo.getById(internId);
        next();
    } catch (err) {
        res.status(Codes.ClientError.NOT_FOUND).json({error: 'Intern was not found.'});
    }
};



/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
module.exports.validatePartialBody = (req, res, next) => {
    //
};

/** 
 * @module controllers/intern-controller
 * @requires express
 */

module.exports.getOneOrAllInterns = async (req, res) => {
    const internRepo = await InternRepository.load();
    if (req.params.internId) {
        console.log('Intern Id: ', typeof(req.params.internId));
        try {
            const intern = await internRepo.getById(req.params.internId);
            //console.dir(intern.toObject());
            res.status(200).json(intern);
        } catch(err) {
            console.error('Error: ', err);
            res.status(404).json({error: err});
        }
    } else {
        try {
            const interns = await internRepo.getAll();
            res.status(200).json(interns);
        } catch (err) {
            res.status(Codes.ServerError.INTERNAL_SERVER_ERROR).json({error: err});
        }
    }
};

module.exports.getOneOrAllInternTasks = async (req, res) => {
    const taskRepo = await TaskRepository.load();
    const { internId, taskId } = req.params;
    if (taskId) {
        try {
            const task = await taskRepo.getTaskOfIntern(internId, taskId);
            res.status(Codes.Success.OK).json(task);
        } catch (err) {
            res.status(Codes.ClientError.NOT_FOUND).json({error: err});
        }
    } else {
        // Getting all tasks
        const { limit = 10, offset = 0 } = req.query;
        try {
            const tasks = await taskRepo.getTasksOfIntern(internId);
            console.dir('Task Array: ', tasks);
            res.status(Codes.Success.OK).json(tasks);
        } catch (err) {
            res.status(Codes.ServerError.INTERNAL_SERVER_ERROR).json({error: err});
        }
    }
};

module.exports.addInternTask = async (req, res) => {
    console.log('Got body', req.body);
    const taskRepo = await TaskRepository.load();
    const internRepo = await InternRepository.load();
    const {internId} = req.params;
    try {
        // Will throw an exception if the intern couldn't be found.
        await internRepo.getById(Number(internId));
        const requestBody = req.body;
        requestBody.internId = Number(internId);
        console.dir('New body is: ', requestBody);
        const task = Task.fromObject(requestBody);
        const id = await taskRepo.add(task);
        await taskRepo.save();
        res.status(Codes.Success.OK).json({id});
    } catch (err) {
        console.error('Error encountered: ', err);
        res.status(Codes.ServerError.INTERNAL_SERVER_ERROR).json({error: err.message});
    }
};

module.exports.addIntern = async (req, res) => {
    const internRepo = await InternRepository.load();
    try {
        // try to add an intern.
        const requestBody = req.body;
        const intern = Intern.fromObject(requestBody);
        const index = await internRepo.add(intern);
        await internRepo.save();

        res.status(Codes.Success.OK).json({id: index});
    } catch (err) {
        console.error(err);
        res.status(Codes.ServerError.INTERNAL_SERVER_ERROR).json({error: err});
    }
};

// /:internId/tasks/:taskId
module.exports.updateInternTask = async (req, res) => {
    const taskRepo = await TaskRepository.load();
    const {internId, taskId} = req.params;
    try {
        // try to update the task of an intern.
        const newTask = req.body;
        const index = await taskRepo.update(taskId, newTask);
        
        await taskRepo.save();
        res.status(Codes.Success.OK).json({id: index});
    } catch (err) {
        console.error('Error with updateInternTask on intern-controller: ', err);
        res.status(Codes.ServerError.INTERNAL_SERVER_ERROR).json({error: err.message});
    }
};

/**
 * @todo Implement update intern.
 * @param {*} req 
 * @param {import('express').Response} res 
 */
module.exports.updateIntern = async (req, res) => {
    const internRepo = await InternRepository.load();
    const {internId} = req.params;
    try {
        const newIntern = req.body;
        const index = await internRepo.update(Number(internId), newIntern);
        await internRepo.save();
        res.status(Codes.Success.OK).json({id: index});
    } catch (err) {
        console.error('Error with update intern: ' + err);
        res.status(Codes.ServerError.INTERNAL_SERVER_ERROR).json({error: err.message});
    }
};

/**
 * @todo Implement delete intern.
 * @param {*} req 
 * @param {import('express').Response} res 
 */
module.exports.deleteIntern = async (req, res) => {
    const internRepo = await InternRepository.load();
    const {internId} = req.params;
    try {
        const didSucceed = await internRepo.delete(Number(internId));
        await internRepo.save();
        res.status(Codes.Success.OK).json({succeeded: didSucceed});
    } catch (err) {
        console.error('Error with delete intern: ' + err);
        res.status(Codes.ServerError.INTERNAL_SERVER_ERROR).json({error: err.message});
    }
};

/**
 * @todo Implement delete intern task.
 * @param {*} req 
 * @param {import('express').Response} res 
 */
module.exports.deleteInternTask = async (req, res) => {
    const taskRepo = await TaskRepository.load();
    const {taskId} = req.params;
    try {
        const didSucceed = await taskRepo.delete(Number(taskId));
        await internRepo.save();
        res.status(Codes.Success.OK).json({succeeded: didSucceed});
    } catch (err) {
        console.error('Error with delete intern task: ' + err);
        res.status(Codes.ServerError.INTERNAL_SERVER_ERROR).json({error: err.message});
    }
};

