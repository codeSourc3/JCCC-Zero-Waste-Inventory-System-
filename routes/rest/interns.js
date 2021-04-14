/**
 * @module routes/rest/interns
 * @requires express
 */
const express = require('express');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const router = express.Router();
const db = require('../../persistence/db');
const controller = require('../../controllers/intern-controller');

// Gets all the tasks or one of the tasks of the intern.
router.get('/:internId/tasks/:taskId?', controller.getOneOrAllInternTasks);


router.get('/:internId?', controller.getOneOrAllInterns);

// Adds a task to the interns task list.
router.post('/:internId/tasks', controller.addInternTask);

// Creates a new intern
router.post('/', controller.addIntern);

// Updates an interns' task.
router.put('/:internId/tasks/:taskId', controller.updateInternTask);

// Updates an intern
router.put('/:internId', controller.updateIntern);

// Removes an intern.
router.delete('/:internId', controller.deleteIntern);

// Removes an intern task.
router.delete('/:internId/tasks/:taskId', controller.deleteInternTask);

module.exports = router;