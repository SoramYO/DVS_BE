const managerService = require('../services/managerService');

const handleGetStaff = async (req, res) => {
    try {
        let response = await managerService.getStaff();
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in managerController.handleGetStaff:', error);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
};

const handleApproveRequest = async (req, res) => {
    try {
        const { approvalId, status } = req.body;

        if (!approvalId || !status) {
            return res.status(400).json({
                errCode: 1,
                message: 'Invalid input parameters or Approval ID or Status missing'
            });
        }

        let result = await managerService.approveRequest(req.user.id, approvalId, status);

        if (result) {
            res.status(200).json({
                errCode: 0,
                message: 'Approval status updated successfully'
            });
        } else {
            res.status(500).json({
                errCode: -1,
                message: 'Failed to update approval status'
            });
        }
    } catch (error) {
        console.error('Error in managerController.handleApproveRequest:', error);
        res.status(500).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
};

const handleGetRequestApproved = async (req, res) => {
    try {
        let response = await managerService.getRequestApproved();
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in managerController.handleGetRequestApproved:', error);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const handleGetBill = async (req, res) => {
    try {

        let response = await managerService.getBill();
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in managerController.handleGetBill:', error);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}




module.exports = {
    handleGetStaff: handleGetStaff,
    handleApproveRequest: handleApproveRequest,
    handleGetRequestApproved: handleGetRequestApproved,
    handleGetBill: handleGetBill,
};
