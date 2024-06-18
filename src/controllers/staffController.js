var staffService = require('../services/staffService');

const handleApproveValuationRequest = async (req, res) => {
    try {
        const { requestId } = req.body;

        if (req.user.role !== 'Consulting Staff' && req.user.role !== 'Manager') {
            return res.status(403).json({
                errCode: 3,
                message: 'Access denied',
            });
        }

        if (!requestId) {
            return res.status(400).json({
                errCode: 1,
                message: 'Invalid input parameters or Request ID missing',
            });
        }


        let isApproved = await staffService.approveValuationRequest(req.user.id, requestId);

        if (isApproved) {
            return res.status(200).json({
                errCode: 0,
                message: 'Valuation request approved successfully',
            });
        } else {
            return res.status(404).json({
                errCode: 2,
                message: 'Valuation request not found',
            });
        }
    } catch (error) {
        console.error('Error in managerController.handleApproveValuationRequest:', error);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};


let handleChangeProcess = async (req, res) => {
    let message = await staffService.changeProcess(req.body, req.params);
    return res.status(200).json(message)
}
let handleValuation = async (req, res) => {
    let message = await staffService.valuation(req.body, req.params);
    return res.status(200).json(message)
}
const handlePrintValuationReport = async (req, res) => {
    try {
        const { requestId } = req.query;

        if (!requestId) {
            return res.status(400).json({
                errCode: 1,
                message: 'Invalid input parameters or Request ID missing'
            });
        }

        let valuationReport = await staffService.printValuationReport(requestId);

        if (!valuationReport) {
            return res.status(404).json({
                errCode: 2,
                message: 'Valuation report not found for the provided Request ID'
            });
        }

        return res.status(200).json(valuationReport);
    } catch (error) {
        console.error('Error in valuationController.handlePrintValuationReport:', error);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
};

const handleRequestApproval = async (req, res) => {
    try {
        const { requestId, requestType } = req.body;

        if (!requestId || !requestType) {
            return res.status(400).json({
                errCode: 1,
                message: 'Invalid input parameters or Request ID or Request Type missing'
            });
        }

        let result = await staffService.requestApproval(requestId, requestType);

        res.status(200).json({
            errCode: 0,
            message: 'Approval request submitted successfully'
        });
    } catch (error) {
        console.error('Error in managerController.handleRequestApproval:', error);
        res.status(500).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
};

const handleReceiveDiamond = async (req, res) => {
    try {
        const { requestId } = req.body;

        if (!requestId) {
            return res.status(400).json({
                errCode: 1,
                message: 'Invalid input parameters or missing required fields'
            });
        }

        const result = await staffService.receiveDiamond(requestId, req.user.id);

        if (result) {
            res.status(200).json({
                errCode: 0,
                message: 'Diamond received successfully'
            });
        } else {
            res.status(404).json({
                errCode: 2,
                message: 'Request not found or invalid request ID'
            });
        }
    } catch (error) {
        console.error('Error in receiveDiamond controller:', error);
        res.status(500).json({
            errCode: 1,
            message: 'Server error'
        });
    }
};
const handleSendValuationResult = async (req, res) => {
    try {
        const { requestId, valuationResultId } = req.body;

        if (!requestId || !valuationResultId) {
            return res.status(400).json({
                errCode: 1,
                message: 'Invalid input parameters or missing required fields'
            });
        }

        const result = await staffService.sendValuationResult(requestId, req.user.id);

        if (result) {
            res.status(200).json({
                errCode: 0,
                message: 'Valuation result sent successfully'
            });
        } else {
            res.status(404).json({
                errCode: 2,
                message: 'Request not found or invalid request ID'
            });
        }
    } catch (error) {
        console.error('Error in handleSendValuationResult controller:', error);
        res.status(500).json({
            errCode: 1,
            message: 'Server error'
        });
    }
};

const handleReceiveDiamondForValuation = async (req, res) => {
    try {
        const { requestId } = req.body;

        if (!requestId) {
            return res.status(400).json({
                errCode: 1,
                message: 'Invalid input parameters or missing required fields'
            });
        }

        const result = await staffService.receiveDiamondForValuation(requestId, req.user.id);

        if (result) {
            res.status(200).json({
                errCode: 0,
                message: 'Diamond received for valuation successfully'
            });
        } else {
            res.status(404).json({
                errCode: 2,
                message: 'Request not found or invalid request ID'
            });
        }
    } catch (error) {
        console.error('Error in handleReceiveDiamondForValuation controller:', error);
        res.status(500).json({
            errCode: 1,
            message: 'Server error'
        });
    }
};

const handleSendValuationResultToCustomer = async (req, res) => {
    try {
        const { requestId } = req.body;

        if (!requestId) {
            return res.status(400).json({
                errCode: 1,
                message: 'Invalid input parameters or missing required fields'
            });
        }

        const result = await staffService.sendValuationResultToCustomer(requestId, req.user.id);

        if (result) {
            res.status(200).json({
                errCode: 0,
                message: 'Valuation result sent to customer successfully'
            });
        } else {
            res.status(404).json({
                errCode: 2,
                message: 'Request not found or invalid request ID'
            });
        }
    } catch (error) {
        console.error('Error in handleSendValuationResultToCustomer controller:', error);
        res.status(500).json({
            errCode: 1,
            message: 'Server error'
        });
    }
};

const handleSendDiamondToValuation = async (req, res) => {
    try {
        const { requestId } = req.body;

        if (!requestId) {
            return res.status(400).json({
                errCode: 1,
                message: 'Invalid input parameters or missing required fields'
            });
        }

        const result = await consultingService.sendDiamondToValuation(requestId, req.user.id);

        if (result) {
            res.status(200).json({
                errCode: 0,
                message: 'Diamond sent to valuation staff successfully'
            });
        } else {
            res.status(404).json({
                errCode: 2,
                message: 'Request not found or invalid request ID'
            });
        }
    } catch (error) {
        console.error('Error in handleSendDiamondToValuation controller:', error);
        res.status(500).json({
            errCode: 1,
            message: 'Server error'
        });
    }
};

const handleApproveCommitment = async (req, res) => {
    try {
        const { commitmentId, status } = req.body;

        if (!commitmentId || !status) {
            return res.status(400).json({
                errCode: 1,
                message: 'Invalid input parameters or missing required fields'
            });
        }

        const result = await managerService.approveCommitment(req.user.id, commitmentId, status);

        if (result) {
            res.status(200).json({
                errCode: 0,
                message: 'Commitment approved successfully'
            });
        } else {
            res.status(404).json({
                errCode: 2,
                message: 'Commitment not found or invalid commitment ID'
            });
        }
    } catch (error) {
        console.error('Error in handleApproveCommitment controller:', error);
        res.status(500).json({
            errCode: 1,
            message: 'Server error'
        });
    }
};


module.exports = {
    handleApproveValuationRequest: handleApproveValuationRequest,
    handleChangeProcess: handleChangeProcess,
    handleValuation: handleValuation,
    handlePrintValuationReport: handlePrintValuationReport,
    handleRequestApproval: handleRequestApproval,
    handleReceiveDiamond: handleReceiveDiamond,
    handleSendValuationResult: handleSendValuationResult,
    handleReceiveDiamondForValuation: handleReceiveDiamondForValuation,
    handleSendValuationResultToCustomer: handleSendValuationResultToCustomer,
    handleSendDiamondToValuation: handleSendDiamondToValuation,
    handleApproveCommitment: handleApproveCommitment
}