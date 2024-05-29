var staffService = require('../services/staffService');


let handleChangeProcess = async (req, res) => {
    let message = await staffService.changeProcess(req.body, req.query);
    return res.status(200).json(message)
}


module.exports = {
    handleChangeProcess: handleChangeProcess
}