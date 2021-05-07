const express = require('express');
const router = express.Router();
const controller = require('../../services/bin-controller');
const authPerm = require('../../utils/middlewares/auth-permission-middleware.js');
const authValidate = require('../../utils/middlewares/auth-validation-middleware.js');
const Role = require('../../models/role.js');

router.get('/out', controller.getOutBins);

router.get('/:binId/weights', controller.lookupBin, controller.getWeightHistory);

router.get('/:binId', controller.lookupBin, controller.getBin);

router.get('/', controller.getBins);

router.post('/', authValidate.validJWTNeeded, authValidate.validRefreshNeeded, authPerm.authorizedFor(Role.Admin), controller.addBin);

// Would like to add middleware.
router.patch('/:binId', controller.lookupBin, controller.editBin);

router.put('/:binId', authValidate.validJWTNeeded, authValidate.validRefreshNeeded, authPerm.authorizedFor(Role.Admin), controller.lookupBin, controller.editBin);

router.delete('/:binId', authValidate.validJWTNeeded, authValidate.validRefreshNeeded, authPerm.authorizedFor(Role.Admin), controller.lookupBin, controller.deleteBin);

module.exports = router;