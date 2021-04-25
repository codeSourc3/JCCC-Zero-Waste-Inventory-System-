/**
 * @module routes/rest/interns
 * @requires express
 */
const express = require('express');

const router = express.Router();
const controller = require('../../controllers/intern-controller');
const role = require('../../models/role');
const authorize = require('../../utils/authorize.js');

router.param('internId', async (req, res, next, id) => {
    // Check if the current user has that Id or is an admin.
    const currentUser = req.user;
    console.dir(currentUser);
    if (id !== currentUser.sub && currentUser.role !== role.Admin) {
        return res.status(401).json({message: 'Unauthorized'});
    }
    // User has the right Id.
    next();
});


// Gets all the tasks or one of the tasks of the intern.
router.get('/:internId/tasks/:taskId', authorize(), controller.getOneOrAllInternTasks);

router.get('/:internId/tasks', authorize(), controller.getOneOrAllInternTasks);

router.get('/:internId', authorize(), controller.lookupIntern, controller.getInternById);

router.get('/', authorize(), controller.getAllInterns);

// Adds a task to the interns task list.
router.post('/:internId/tasks', authorize(), controller.addInternTask);

router.post('/authenticate', controller.authenticate);

// Creates a new intern
router.post('/', authorize(role.Admin), controller.addIntern);

// Updates an interns' task.
router.put('/:internId/tasks/:taskId', authorize(), controller.updateInternTask);

router.patch('/:internId/tasks/:taskId', authorize(), controller.updateInternTask);

// Updates an intern
router.put('/:internId', authorize(), controller.updateIntern);

router.patch('/:internId', authorize(), controller.updateIntern);

// Removes an intern task.
router.delete('/:internId/tasks/:taskId', authorize(),  controller.deleteInternTask);

// Removes an intern.
router.delete('/:internId', authorize(role.Admin), controller.deleteIntern);



module.exports = router;