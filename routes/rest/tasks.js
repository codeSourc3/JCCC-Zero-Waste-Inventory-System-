const express = require('express');
const router = express.Router();
const controller = require('../../controllers/task-controller');

router.get('/:taskId', controller.getTask);

router.get('/', controller.getTasks);

router.post('/', controller.addTask);

router.put('/:taskId', controller.editTask);

router.delete('/:taskId', controller.deleteTask);

module.exports = router;