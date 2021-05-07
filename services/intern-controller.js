const TaskRepository = require('../persistence/task-repository');
const InternRepository = require('../persistence/intern-repository');
const Codes = require('../utils/http-codes');
const {Task} = require('../models/tasks');
const {Intern, Admin} = require('../models/interns');
const crypto = require('crypto');
const role = require('../models/role');
const User = require('../models/users');


/**
 * Checks if the Intern with the Intern Id exists.
 * 
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
        res.status(Codes.ClientError.NOT_FOUND).json({success: false, message: 'Intern was not found.'});
    }
};


/** 
 * @module controllers/intern-controller
 * @param {import('express').Request} req the request object
 * @param {import('express').Response} res the response object
 * @example
 * GET /api/v1/interns?offset=${offset}&limit=${limit}
 */
module.exports.getAllInterns = async (req, res) => {
    const internRepo = await InternRepository.load();
        try {
            let results = await internRepo.getAll();
            const interns = results.map(intern => intern.toJSON());
            interns.forEach(intern => {
                delete intern.password;
            });
            res.status(200).json(interns);
        } catch (err) {
            res.status(Codes.ServerError.INTERNAL_SERVER_ERROR).json({success: false, message: err.message});
        }
    
};

/**
 * 
 * @param {import('express').Request} req the request object
 * @param {import('express').Response} res the response object
 * @example
 * GET /api/v1/interns/:internId
 */
module.exports.getInternById = async (req, res) => {
    const currentUser = req.jwt;
    console.log(currentUser);
    const id = Number(req.params.internId);

    // only allow admins to access other user records.
    if (id !== currentUser.internId && currentUser.role !== role.Admin) {
        return res.status(401).json({success: false, message: 'Unauthorized'});
    }

    const internRepo = await InternRepository.load();

    try {
        const intern = await internRepo.getById(id);
        const internObj = intern.toJSON();
        delete internObj.password;
        res.status(200).json(internObj);
    } catch (err) {
        res.status(400).json({success: false, message: err.message});
    }
}

/**
 * 
 * @param {import('express').Request} req the request object
 * @param {import('express').Response} res the response object
 * @example
 * GET /api/v1/interns/:internId/tasks/:taskId
 * GET /api/v1/interns/:internId/tasks
 */
module.exports.getOneOrAllInternTasks = async (req, res) => {
    const taskRepo = await TaskRepository.load();
    const { internId, taskId } = req.params;
    if (taskId) {
        try {
            const task = await taskRepo.getTaskOfIntern(internId, taskId);
            res.status(Codes.Success.OK).json(task);
        } catch (err) {
            res.status(Codes.ClientError.NOT_FOUND).json({success: false, message: err.message});
        }
    } else {
        // Getting all tasks
        const { limit = 10, offset = 0 } = req.query;
        try {
            const tasks = await taskRepo.getTasksOfIntern(internId);
            console.dir('Task Array: ', tasks);
            res.status(Codes.Success.OK).json(tasks);
        } catch (err) {
            res.status(Codes.ServerError.INTERNAL_SERVER_ERROR).json({success: false, message: err.message});
        }
    }
};

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @example
 * POST /api/v1/interns/:internId/tasks
 */
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
        res.status(Codes.ServerError.INTERNAL_SERVER_ERROR).json({success: false, message: err.message});
    }
};
const saltAndHashPassword = (plainTextPassword) => {
    let normalizedPassword = plainTextPassword.normalize();
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(normalizedPassword).digest('base64');
    let cipherTextPassword = salt + '$' + hash;
    return cipherTextPassword;
};

/**
 * Prevents duplicate users from being added.
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
module.exports.ensureUniqueUsername = async (req, res, next) => {
    // Prevent duplicate usernames. Not sure what to do when we find one though.
    const repo = await InternRepository.load();

    if (req.body.username) {
        let username = req.body.username;
        const user = await repo.findByUsername(username);
        if (!user) {
            // no user found. Good.
            next();
        } else {
            // Prevent user from being added.
            res.status(Codes.ClientError.NOT_ACCEPTABLE).json({success: false, message: 'Username taken.'});
        }
    } else {
        res.status(Codes.ClientError.BAD_REQUEST).json({success: false, message: 'Missing username'});
    }
};

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @example
 * POST /api/v1/interns
 */
module.exports.addIntern = async (req, res) => {
    const internRepo = await InternRepository.load();
    try {
        
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(req.body.password.normalize()).digest('base64');
        req.body.password = salt + '$' + hash;
        
        // try to add an intern.
        const requestBody = req.body;
        const intern = User.fromObject(requestBody);
        const index = await internRepo.add(intern);
        await internRepo.save();

        res.status(Codes.Success.OK).json({id: index});
    } catch (err) {
        console.error(err);
        res.status(Codes.ServerError.INTERNAL_SERVER_ERROR).json({success: false, message: err.message});
    }
};

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @example
 * PUT /api/v1/interns/:internId/tasks/:taskId
 * PATCH /api/v1/interns/:internId/tasks/:taskId
 */
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
        res.status(Codes.ServerError.INTERNAL_SERVER_ERROR).json({success: false, message: err.message});
    }
};

/**
 * @todo Implement update intern.
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @example
 * PUT /api/v1/interns/:internId
 * PATCH /api/v1/interns/:internId
 */
module.exports.updateIntern = async (req, res) => {
    const internRepo = await InternRepository.load();
    const {internId} = req.params;
    try {
        
        if (req.body.password) {
            let salt = crypto.randomBytes(16).toString('base64');
            let hash = crypto.createHmac('sha512', salt).update(req.body.password.normalize()).digest('base64');
            req.body.password = salt + '$' + hash;
        }
        
        const newIntern = req.body;
        const index = await internRepo.update(Number(internId), newIntern);
        await internRepo.save();
        res.status(Codes.Success.OK).json({id: index});
    } catch (err) {
        console.error('Error with update intern: ' + err);
        res.status(Codes.ServerError.INTERNAL_SERVER_ERROR).json({success: false, message: err.message});
    }
};

/**
 * @todo Implement delete intern.
 * @param {*} req 
 * @param {import('express').Response} res the response object
 * @example
 * DELETE /api/v1/interns/:internId
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
        res.status(Codes.ServerError.INTERNAL_SERVER_ERROR).json({success: false, message: err.message});
    }
};

/**
 * @todo Implement delete intern task.
 * @param {*} req 
 * @param {import('express').Response} res the response object
 * @example
 * DELETE /api/v1/interns/:internId/tasks/:taskId
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
        res.status(Codes.ServerError.INTERNAL_SERVER_ERROR).json(
            {success: false, message: err.message});
    }
};

