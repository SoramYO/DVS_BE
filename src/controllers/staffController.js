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


        let isApproved = await staffService.takeRequest(req.user.id, requestId);

        if (isApproved) {
            return res.status(200).json({
                errCode: 0,
                message: 'Taken request successfully',
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

const handleValuation = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                errCode: 1,
                message: 'Invalid input parameters or Request ID or Valuation Result missing'
            });
        }


        let result = await staffService.valuation(req.body, req.params, req.user.id);

        if (result) {
            res.status(200).json({
                errCode: 0,
                message: 'Valuation submitted successfully'
            });
        } else {
            res.status(500).json({
                errCode: -1,
                message: 'Failed to submit valuation'
            });
        }
    } catch (error) {
        console.error('Error in managerController.handleValuation:', error);
        res.status(500).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
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
        const { requestId, requestType, description } = req.body;

        if (!requestId || !requestType) {
            return res.status(400).json({
                errCode: 1,
                message: 'Invalid input parameters or Request ID or Request Type missing'
            });
        }

        let result = await staffService.requestApproval(req.user.id, requestId, requestType, description);

        if (result.message === 'You have already sent the request') {
            return res.status(200).json({
                errCode: 0,
                message: result.message
            });
        }

        if (result.message === 'Approval request submitted successfully') {
            return res.status(200).json({
                errCode: 0,
                message: result.message
            });
        } else {
            res.status(500).json({
                errCode: -1,
                message: 'Failed to submit approval request'
            });
        }
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
        const { requestId, signatureUrl, signName } = req.body;

        if (!requestId) {
            return res.status(400).json({
                errCode: 1,
                message: 'Invalid input parameters or missing required fields'
            });
        }

        const result = await staffService.receiveDiamond(requestId, signatureUrl, signName, req.user.id);

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
        const { requestId } = req.body;


        if (!requestId) {
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

        const result = await staffService.sendDiamondToValuation(requestId, req.user.id);

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

const handleGetNewRequest = async (req, res) => {
    try {
        const requests = await staffService.getNewRequest();

        res.status(200).json({
            errCode: 0,
            message: 'Get new request successfully',
            data: requests
        });
    } catch (error) {
        console.error('Error in staffController.handleGetNewRequest:', error);
        res.status(500).json({
            errCode: 1,
            message: 'Error from server'
        });
    }
}

const handleBookingsAppoinment = async (req, res) => {
    try {
        const { id, appointmentDate } = req.body;
        if (!id || !appointmentDate) {
            return res.status(400).json({
                errCode: 1,
                message: 'Invalid input parameters or missing required fields'
            });
        }

        const result = await staffService.bookingsAppoinment(id, appointmentDate);

        if (result) {
            res.status(200).json({
                errCode: 0,
                message: 'Appointment booked successfully'
            });
        } else {
            res.status(404).json({
                errCode: 2,
                message: 'Request not found or invalid request ID'
            });
        }
    } catch (error) {
        console.error('Error in handleBookingsAppoinment controller:', error);
        res.status(500).json({
            errCode: 1,
            message: 'Server error'
        });
    }
}

const handleGetTakeRequest = async (req, res) => {
    try {
        const requests = await staffService.getTakenRequestByStaff(req.user.id);

        res.status(200).json({
            errCode: 0,
            message: 'Get new request successfully',
            data: requests
        });
    } catch (error) {
        console.error('Error in managerController.handleGetTakeRequest:', error);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
}

const handleGetRequestReadyForValuation = async (req, res) => {
    try {
        const requests = await staffService.getRequestReadyForValuation();

        res.status(200).json({
            errCode: 0,
            message: 'Get new request successfully',
            data: requests
        });
    } catch (error) {
        console.error('Error in managerController.handleGetRequestReadyForValuation:', error);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
}

const handleTakeRequestForValuation = async (req, res) => {
    try {
        const { requestId } = req.body;

        let isApproved = await staffService.takeRequestForValuation(req.user.id, requestId);

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
        console.error('Error in managerController.handleTakeRequestForValuation:', error);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
}

const handleGetRequestTakenByValuation = async (req, res) => {
    try {
        const requests = await staffService.getRequestTakenByValuation(req.user.id);

        res.status(200).json({
            errCode: 0,
            message: 'Get new request successfully',
            data: requests
        });
    } catch (error) {
        console.error('Error in managerController.handleGetRequestTakenByValuation:', error);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
}

const handleGetFinishedRequest = async (req, res) => {
    try {
        const requests = await staffService.getFinishedRequest(req.user.id);

        res.status(200).json({
            errCode: 0,
            message: 'Get new request successfully',
            data: requests
        });
    } catch (error) {
        console.error('Error in managerController.handleGetFinishedRequest:', error);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
}

const handleCustomerTookSample = async (req, res) => {
    try {
        const { requestId } = req.body;

        if (!requestId) {
            return res.status(400).json({
                errCode: 1,
                message: 'Invalid input parameters or missing required fields'
            });
        }

        const result = await staffService.customerTookSample(requestId, req.user.id);

        if (result) {
            res.status(200).json({
                errCode: 0,
                message: 'Customer took sample successfully'
            });
        } else {
            res.status(404).json({
                errCode: 2,
                message: 'Request not found or invalid request ID'
            });
        }
    } catch (error) {
        console.error('Error in handleCustomerTookSample controller:', error);
        res.status(500).json({
            errCode: 1,
            message: 'Server error'
        });
    }
}
const handleGetStaffApproval = async (req, res) => {
    try {
        const requests = await staffService.getStaffApproval(req.user.id);


        res.status(200).json({
            errCode: 0,
            message: 'Get new request successfully',
            data: requests
        });
    } catch (error) {
        console.error('Error in managerController.handleGetStaffApproval:', error);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
}


module.exports = {
    handleApproveValuationRequest: handleApproveValuationRequest,
    handleChangeProcess: handleChangeProcess,
    handleValuation: handleValuation,
    handlePrintValuationReport: handlePrintValuationReport,
    handleRequestApproval: handleRequestApproval,
    handleReceiveDiamond: handleReceiveDiamond,
    handleSendValuationResult: handleSendValuationResult,
    handleSendValuationResultToCustomer: handleSendValuationResultToCustomer,
    handleSendDiamondToValuation: handleSendDiamondToValuation,
    handleApproveCommitment: handleApproveCommitment,
    handleGetNewRequest: handleGetNewRequest,
    handleBookingsAppoinment: handleBookingsAppoinment,
    handleGetTakeRequest: handleGetTakeRequest,
    handleGetRequestReadyForValuation: handleGetRequestReadyForValuation,
    handleTakeRequestForValuation: handleTakeRequestForValuation,
    handleGetRequestTakenByValuation: handleGetRequestTakenByValuation,
    handleGetFinishedRequest: handleGetFinishedRequest,
    handleCustomerTookSample: handleCustomerTookSample,
    handleGetStaffApproval: handleGetStaffApproval,

}