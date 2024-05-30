var staffService = require('../services/staffService');


let handleChangeProcess = async (req, res) => {
    let message = await staffService.changeProcess(req.body, req.params);
    return res.status(200).json(message)
}
let handleValuation = async (req, res) => {
    let message = await staffService.valuation(req.body, req.params);
    return res.status(200).json(message)
}


module.exports = {
    handleChangeProcess: handleChangeProcess,
    handleValuation: handleValuation,
}