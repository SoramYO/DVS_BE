var adminService = require('../services/adminService')

let handleGetUserById = async (req, res) => {
    let id = req.params.id;
    if (!id) {
        return res.status(400).json({
            errCode: 1,
            message: 'Missing required parameter!',
            user: {}
        })
    }
    let user = await adminService.getUserById(id);
    return res.status(200).json({
        errCode: 0,
        message: 'OK',
        user
    })
}

let handleGetAllUsers = async (req, res) => {
    let users = await adminService.getAllUsers();
    return res.status(200).json({
        errCode: 0,
        message: 'OK',
        users
    })
}

let handleCreateNewUser = async (req, res) => {
    let message = await adminService.createNewUser(req.body);
    if (message.errCode !== 0) {
        return res.status(400).json(message)
    } else {
        return res.status(201).json(message)
    }

}

let handleUpdateUser = async (req, res) => {
    let message = await adminService.updateUser(req.body);
    return res.status(200).json(message)
}

let handleDeleteUser = async (req, res) => {
    let message = await adminService.deleteUser(req.body, req.query);
    return res.status(200).json(message)
}

let handleGetDiamonds = async (req, res) => {
    let diamonds = await adminService.getDiamonds();
    return res.status(200).json({
        errCode: 0,
        message: 'OK',
        diamonds
    })
}

let handleGetRequests = async (req, res) => {
    let requests = await adminService.getRequests();
    return res.status(200).json({
        errCode: 0,
        message: 'OK',
        requests
    })
}

let handleGetResults = async (req, res) => {
    let results = await adminService.getResults();
    return res.status(200).json({
        errCode: 0,
        message: 'OK',
        results
    })
}

let handleCountUser = async (req, res) => {
    let count = await adminService.countUser();
    return res.status(200).json({
        errCode: 0,
        message: 'OK',
        count
    })
}
let handleCountDiamond = async (req, res) => {
    let count = await adminService.countDiamond();
    return res.status(200).json({
        errCode: 0,
        message: 'OK',
        count
    })
}

let handleGetRequestById = async (req, res) => {
    let id = req.params.id;
    if (!id) {
        return res.status(400).json({
            errCode: 1,
            message: 'Missing required parameter!',
            request: {}
        })
    }
    let request = await adminService.getRequestById(id);
    return res.status(200).json({
        errCode: 0,
        message: 'OK',
        request
    })
}

let handleCountRequest = async (req, res) => {
    let count = await adminService.countRequest();
    return res.status(200).json({
        errCode: 0,
        message: 'OK',
        count
    })
}

let handleGetProfit = async (req, res) => {
    let profit = await adminService.getProfit();
    return res.status(200).json({
        errCode: 0,
        message: 'OK',
        profit
    })
}
const handleViewServices = async (req, res) => {
    try {
        const services = await adminService.getAllServices();

        return res.status(200).json({
            errCode: 0,
            message: 'Services retrieved successfully',
            services
        });
    } catch (error) {
        console.error('Error in viewServices controller:', error);
        return res.status(500).json({ errCode: 1, message: 'Server error', error: error.message });
    }
};

const handleCreateNewService = async (req, res) => {
    try {
        const { serviceName, price } = req.body;
        if (!serviceName || !price) {
            return res.status(400).json({ errCode: 1, message: 'Invalid input parameters' });
        }

        let message = await adminService.createNewService(req.body);

        return res.status(200).json(message);

    } catch (error) {
        console.error('Error in handleCreateNewService controller:', error);
        return res.status(500).json({ errCode: 1, message: 'Server error', error: error.message });
    }
};

const handleUpdateService = async (req, res) => {
    try {
        const { serviceId, serviceName } = req.body;
        if (!serviceId || !serviceName) {
            return res.status(400).json({ errCode: 1, message: 'Invalid input parameters or Service ID missing' });
        }

        let message = await adminService.updateService(req.body);
        return res.status(200).json(message);
    } catch (error) {
        console.error('Error in handleUpdateService controller:', error);
        return res.status(500).json({ errCode: 1, message: 'Server error', error: error.message });
    }
};

const handleDeleteService = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const { status } = req.body;
        if (!serviceId) {
            return res.status(400).json({ errCode: 1, message: 'Invalid input parameters or Service ID missing' });
        }

        const message = await adminService.deleteService(serviceId, status);

        return res.status(200).json(message);

    } catch (error) {
        console.error('Error in handleDeleteService controller:', error);
        return res.status(500).json({ errCode: 1, message: 'Server error', error: error.message });
    }
};

module.exports = {
    handleGetAllUsers: handleGetAllUsers,
    handleGetUserById: handleGetUserById,
    handleCreateNewUser: handleCreateNewUser,
    handleUpdateUser: handleUpdateUser,
    handleDeleteUser: handleDeleteUser,
    handleGetDiamonds: handleGetDiamonds,
    handleGetRequests: handleGetRequests,
    handleGetResults: handleGetResults,
    handleCountUser: handleCountUser,
    handleCountDiamond: handleCountDiamond,
    handleGetRequestById: handleGetRequestById,
    handleCountRequest: handleCountRequest,
    handleGetProfit: handleGetProfit,
    handleViewServices: handleViewServices,
    handleCreateNewService: handleCreateNewService,
    handleUpdateService: handleUpdateService,
    handleDeleteService: handleDeleteService,
}