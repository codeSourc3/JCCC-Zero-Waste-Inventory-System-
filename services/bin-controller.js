const Codes = require('../utils/http-codes');
const BinRepository = require('../persistence/bin-repository');
const typeSafety = require('../utils/type-safety');
const {Bin} = require('../models/bins');
const WeightHistoryRepository = require('../persistence/weight-history-repository');

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
module.exports.lookupBin = async (req, res, next) => {
    const binId = Number(req.params.binId);
    const repo = await BinRepository.load();
    try {
        const bin = await repo.getById(binId);
        next();
    } catch (err) {
        res.status(Codes.ClientError.NOT_FOUND).json({success: false, message: 'Bin was not found'});
    }
};


/**
 * 
 * @param {Express.Request} req 
 * @param {import('express').Response} res 
 * @example
 * GET /api/v1/bins/out
 */
module.exports.getOutBins = async (req, res) => {
    const binRepo = await BinRepository.load();
    try {
        const bins = await binRepo.getOutBins();
        res.status(Codes.Success.OK).json({success: true, data: bins});
    } catch (err) {
        //console.error('Error getting out bins %s', error);
        res.status(Codes.ServerError.INTERNAL_SERVER_ERROR).json({success: false, message: err.message});
    }
};


module.exports.getWeightHistory = async (req, res) => {
    const weightRepo = await WeightHistoryRepository.load();
    const {binId} = req.params;
    try {
        const weightHistory = await weightRepo.getByBinId(Number(binId));
        res.status(Codes.Success.OK).json({success: true, data: weightHistory});
    } catch (err) {
        res.status(Codes.ClientError.BAD_REQUEST).json({success: false, message: err.message});
    }
};

/**
 * Gets all the bins based on the search
 * params.
 * 
 * @param {Express.Request} req the HTTP request.
 * @param {import('express').Response} res the HTTP response.
 */
module.exports.getBins = async (req, res) => {
    const binRepo = await BinRepository.load();
    const {limit, offset} = req.query;
    try {
        let bins={};
        if ('limit' in req.query && 'offset' in req.query) {
            bins = await binRepo.getAll(Number(req.query.offset), Number(req.query.limit));
            //
        } else if ('offset' in req.query) {
            bins = await binRepo.getAll(Number(req.query.offset));
            //
        } else {
            bins = await binRepo.getAll();
        }
        console.log(bins);
        res.status(Codes.Success.OK).json({success: true, data: bins});
    } catch (err) {
        console.error(err);
        res.status(Codes.ServerError.INTERNAL_SERVER_ERROR).json({success: false, message: err.message});
    }
};

/**
 * 
 * @param {Express.Request} req 
 * @param {import('express').Response} res 
 */
module.exports.addBin = async (req, res) => {
    const binRepo = await BinRepository.load();
    try {
        const bin = Bin.fromObject(req.body);
        const index = await binRepo.add(bin);
        res.status(Codes.Success.OK).json({success: true, data: {id: index}});
    } catch (err) {
        console.error(err);
        res.status(Codes.ClientError.BAD_REQUEST).json({success: false, message: err.message});
    }
};

/**
 * 
 * @param {Express.Request} req 
 * @param {import('express').Response} res 
 */
module.exports.getBin = async (req, res) => {
    const binRepo = await BinRepository.load();
    const {binId} = req.params;
    try {
        let id = Number(binId);
        const bin = await binRepo.getById(id);
        res.status(Codes.Success.OK).json({success: true, data: bin});
    } catch (err) {
        console.error(err);
        res.status(Codes.ClientError.NOT_FOUND).json({success: false, message: err.message});
    }
};

/**
 * 
 * @param {Express.Request} req 
 * @param {import('express').Response} res 
 */
module.exports.editBin = async (req, res) => {
    const binRepo = await BinRepository.load();
    const {binId} = req.params;
    try {
        const requestBody = req.body;
        console.log({requestBody});
        const index = await binRepo.update(Number(binId), requestBody);
        await binRepo.save();
        res.status(Codes.Success.OK).json({success: true, data: {id: index}});
    } catch (err) {
        console.error('Error with edit bin: ' + err);
        res.status(Codes.ClientError.BAD_REQUEST).json({success: false, message: err.message});
    }
};

/**
 * 
 * @param {import('express').Response} res 
 * @param {import('express').Request} req
 */
module.exports.deleteBin = async (req, res) => {
    const binRepo = await BinRepository.load();
    const {binId} = req.params;
    try {
        //const body = req.body;
        const didSucceed = await binRepo.delete(Number(binId));
        await binRepo.save();
        let message = didSucceed ? `Bin ${binId} deleted` : `Bin ${binId} not deleted`;
        res.status(Codes.Success.OK).json({success: didSucceed, message: message});
    } catch (err) {
        console.error('Error with edit bin: ' + err);
        res.status(Codes.ClientError.BAD_REQUEST).json({success: false, message: err.message});
    }
};


