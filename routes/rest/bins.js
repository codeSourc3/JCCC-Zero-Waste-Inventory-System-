const express = require('express');
const router = express.Router();
const controller = require('../../controllers/bin-controller');

router.get('/out', controller.getOutBins);

router.get('/:binId', controller.getBin);

router.get('/', controller.getBins);

router.post('/', controller.addBin);

router.put('/:binId', controller.editBin);

router.delete('/:binId', controller.deleteBin);

module.exports = router;