/**
 * @module routes/rest/interns
 * @requires express
 */
const express = require('express');

const router = express.Router();
const controller = require('../../services/intern-controller');
const role = require('../../models/role');

const auth = require('../../services/auth-controller');
const permissions = require('../../utils/middlewares/auth-permission-middleware.js');
const validations = require('../../utils/middlewares/auth-validation-middleware.js');





// Gets all the tasks or one of the tasks of the intern.
router.get('/:internId/tasks/:taskId', permissions.authorizedFor(), permissions.onlySameUserOrAdmin, controller.getOneOrAllInternTasks);

router.get('/:internId/tasks', permissions.authorizedFor(), permissions.onlySameUserOrAdmin, controller.getOneOrAllInternTasks);

router.get('/:internId', permissions.authorizedFor(), permissions.onlySameUserOrAdmin, controller.lookupIntern, controller.getInternById);

router.get('/', permissions.authorizedFor(role.Admin), controller.getAllInterns);

// Adds a task to the interns task list.
router.post('/:internId/tasks', permissions.authorizedFor(), permissions.onlySameUserOrAdmin, controller.addInternTask);

// Creates a new intern
router.post('/', permissions.authorizedFor(role.Admin), controller.ensureUniqueUsername, controller.addIntern);

// Updates an interns' task.
router.put('/:internId/tasks/:taskId', permissions.authorizedFor(), permissions.onlySameUserOrAdmin, controller.updateInternTask);

router.patch('/:internId/tasks/:taskId', permissions.authorizedFor(), permissions.onlySameUserOrAdmin, controller.updateInternTask);

// Updates an intern
router.put('/:internId', permissions.authorizedFor(), permissions.onlySameUserOrAdmin, controller.updateIntern);

router.patch('/:internId', permissions.authorizedFor(), permissions.onlySameUserOrAdmin, controller.updateIntern);

// Removes an intern task.
router.delete('/:internId/tasks/:taskId', permissions.authorizedFor(), permissions.onlySameUserOrAdmin, controller.deleteInternTask);

// Removes an intern.
router.delete('/:internId', permissions.authorizedFor(role.Admin), permissions.sameUserCantDoThisAction, controller.deleteIntern);



module.exports = router;