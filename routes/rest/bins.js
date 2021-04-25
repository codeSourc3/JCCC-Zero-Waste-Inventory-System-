const express = require('express');
const router = express.Router();
const controller = require('../../controllers/bin-controller');
const authenticate = require('../../utils/authorize.js');
const Role = require('../../models/role.js');

router.get('/out', controller.getOutBins);

router.get('/:binId/weights', controller.lookupBin, controller.getWeightHistory);

router.get('/:binId', controller.lookupBin, controller.getBin);

router.get('/', controller.getBins);

router.post('/', authenticate(Role.Admin), controller.addBin);

// Would like to add middleware.
router.patch('/:binId', controller.lookupBin, controller.editBin);

router.put('/:binId', controller.lookupBin, controller.editBin);

router.delete('/:binId', authenticate(Role.Admin), controller.lookupBin, controller.deleteBin);

module.exports = router;