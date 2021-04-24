const express = require('express');
const router = express.Router();
const controller = require('../../controllers/bin-controller');

router.get('/out', controller.getOutBins);

router.get('/:binId/weights', controller.lookupBin, controller.getWeightHistory);

router.get('/:binId', controller.lookupBin, controller.getBin);

router.get('/', controller.getBins);

router.post('/', controller.addBin);

// Would like to add middleware.
router.patch('/:binId', controller.lookupBin, controller.editBin);

router.put('/:binId', controller.lookupBin, controller.editBin);

router.delete('/:binId', controller.lookupBin, controller.deleteBin);

module.exports = router;