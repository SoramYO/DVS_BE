var staffService = require('../services/staffService');


let handleConfirmRequest = async (req, res) => {
    let message = await staffService.changeProcess(req.body);
    return res.status(200).json(message)
}


module.exports = {
    handleConfirmRequest: handleConfirmRequest
}