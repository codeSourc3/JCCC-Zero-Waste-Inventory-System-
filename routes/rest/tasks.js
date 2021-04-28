const express = require('express');
const router = express.Router();
const controller = require('../../services/task-controller');

router.get('/:taskId', controller.lookupTask, controller.getTask);

router.get('/', controller.getTasks);

router.post('/', controller.addTask);

router.put('/:taskId', controller.lookupTask, controller.editTask);

router.patch('/:taskId', controller.lookupTask, controller.editTask);

router.delete('/:taskId', controller.lookupTask, controller.deleteTask);

module.exports = router;