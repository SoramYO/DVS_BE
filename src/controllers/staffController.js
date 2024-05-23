var staffService = require('../services/staffService');


let handleConfirmRequest = async (req, res) => {
    let data = req.body;
    let message = await staffService.confirmRequest(data);
    return res.status(200).json(message)
}


module.exports = {
    handleConfirmRequest: handleConfirmRequest
}