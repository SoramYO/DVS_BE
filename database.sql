CREATE TABLE Role (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL
);

CREATE TABLE Account (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(255) NOT NULL,
    password NVARCHAR(255) NOT NULL,
    firstName NVARCHAR(255) NOT NULL,
    lastName NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    phone NVARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    status INT NOT NULL,
    roleId INT,
    FOREIGN KEY (roleId) REFERENCES Role(id)
);

CREATE TABLE Diamonds (
    id INT IDENTITY(1,1) PRIMARY KEY,
    certificateId NVARCHAR(255),
    proportions NVARCHAR(255),
    diamondOrigin NVARCHAR(255),
    caratWeight FLOAT NOT NULL,
    measurements NVARCHAR(255),
    polish NVARCHAR(255),
    fluorescence NVARCHAR(255),
    color NVARCHAR(255),
    cut NVARCHAR(255),
    clarity NVARCHAR(255),
    symmetry NVARCHAR(255),
    shape NVARCHAR(255)
);

CREATE TABLE Processes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    processStatus NVARCHAR(255) NOT NULL,
    actor NVARCHAR(255) NOT NULL
);

CREATE TABLE Services (
    id INT IDENTITY(1,1) PRIMARY KEY,
    price NVARCHAR(255) NOT NULL,
    serviceName NVARCHAR(255) NOT NULL
);

CREATE TABLE Requests (
    id INT IDENTITY(1,1) PRIMARY KEY,
    requestImage NVARCHAR(255) NOT NULL,
    note NVARCHAR(255) NOT NULL,
    createdDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    appointmentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    paymentStatus NVARCHAR(255) NOT NULL,
    userId INT,
    diamondId INT,
    serviceId INT,
    FOREIGN KEY (userId) REFERENCES Account(id),
    FOREIGN KEY (diamondId) REFERENCES Diamonds(id),
    FOREIGN KEY (serviceId) REFERENCES Services(id)
);

CREATE TABLE Results (
    id INT IDENTITY(1,1) PRIMARY KEY,
    price FLOAT NOT NULL,
    companyName NVARCHAR(255) NOT NULL,
    requestId INT,
    dateValued DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (requestId) REFERENCES Requests(id)
);

CREATE TABLE Payments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    paymentAmount FLOAT NOT NULL,
    paymentDate DATETIME NOT NULL,
    requestId INT,
    FOREIGN KEY (requestId) REFERENCES Requests(id)
);

CREATE TABLE PasswordResetTokens (
    id INT IDENTITY(1,1) PRIMARY KEY,
    userId INT,
    token NVARCHAR(255) NOT NULL,
    expiryDate DATETIME NOT NULL,
    FOREIGN KEY (userId) REFERENCES Account(id)
);

CREATE TABLE Feedback (
    id INT IDENTITY(1,1) PRIMARY KEY,
    userId INT,
    requestId INT,
    customerName NVARCHAR(255),
    email NVARCHAR(255),
    feedbackText NVARCHAR(1000),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Account(id),
    FOREIGN KEY (requestId) REFERENCES Requests(id)
);

CREATE TABLE RequestProcesses (
    id INT IDENTITY(1,1) PRIMARY KEY,
    requestType NVARCHAR(255) NOT NULL,
    createdDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    finishDate DATETIME,
    description NVARCHAR(1000),
    status NVARCHAR(50),
    requestId INT NOT NULL,
    staffId INT NOT NULL,
    receiver INT,
    processId INT,
    FOREIGN KEY (staffId) REFERENCES Account(id),
    FOREIGN KEY (processId) REFERENCES Processes(id),
    FOREIGN KEY (receiver) REFERENCES Account(id),
    FOREIGN KEY (requestId) REFERENCES Requests(id)
);



-- Initial data insertion for Role, Account, Diamonds, Processes, Services, Requests, Results, Payments, PasswordResetTokens, Feedback
INSERT INTO Role (name) VALUES
('Admin'), ('Manager'), ('Consulting Staff'), ('Valuation Staff'), ('Customer'), ('Guest');

INSERT INTO Account (username, password, firstName, lastName, email, phone, createdAt, status, roleId) VALUES
('admin', 'admin@123', 'Admin', 'User', 'admin@example.com', '123456789', GETDATE(), 1, 1),
('manager', 'manager@123', 'Manager', 'User', 'manager@example.com', '987654321', GETDATE(), 1, 2),
('consultant1', 'consultant1@123', 'Consultant', 'One', 'consultant1@example.com', '111222333', GETDATE(), 1, 3),
('consultant2', 'consultant2@123', 'Consultant', 'Two', 'consultant2@example.com', '444555666', GETDATE(), 1, 3),
('valuator1', 'valuator1@123', 'Valuator', 'One', 'valuator1@example.com', '777888999', GETDATE(), 1, 4),
('valuator2', 'valuator2@123', 'Valuator', 'Two', 'valuator2@example.com', '000111222', GETDATE(), 1, 4),
('customer1', 'customer1@123', 'Customer', 'One', 'customer1@example.com', '333444555', GETDATE(), 1, 5),
('customer2', 'customer2@123', 'Customer', 'Two', 'customer2@example.com', '666777888', GETDATE(), 1, 5),
('guest1', 'guest1@123', 'Guest', 'One', 'guest1@example.com', '999000111', GETDATE(), 1, 6),
('guest2', 'guest2@123', 'Guest', 'Two', 'guest2@example.com', '222333444', GETDATE(), 1, 6);

INSERT INTO Diamonds (certificateId, proportions, diamondOrigin, caratWeight, measurements, polish, fluorescence, color, cut, clarity, symmetry, shape) VALUES
('CER001', 'Ideal', 'Africa', 1.5, '6.5x6.5x4.2 mm', 'Excellent', 'None', 'D', 'Round', 'IF', 'Excellent', 'Round'),
('CER002', 'Good', 'South America', 2.1, '7.2x7.2x4.5 mm', 'Very Good', 'Faint', 'E', 'Princess', 'VVS1', 'Very Good', 'Princess'),
('CER003', 'Very Good', 'Australia', 1.8, '6.8x6.8x4.3 mm', 'Good', 'Medium', 'F', 'Emerald', 'VS2', 'Good', 'Emerald');

INSERT INTO Processes (processStatus, actor) VALUES
('Called', 'Consulting Staff'),
('Received', 'Consulting Staff'),
('Approved', 'Consulting Staff'),
('In Progress', 'Valuation Staff'),
('Sent to Valuation', 'Consulting Staff'),
('Completed', 'Manager'),
('Start Valuated', 'Valuation Staff'),
('Valuated', 'Valuation Staff'),
('Commitment', 'Consulting Staff'),
('Sealing', 'Consulting Staff'),
('Result Sent to Customer', 'Consulting Staff'),
('Received for Valuation', 'Valuation Staff'),
('Sent to Consulting', 'Valuation Staff');

INSERT INTO Services (price, serviceName) VALUES
('$100', 'Basic Valuation'),
('$200', 'Advanced Valuation'),
('$50', 'Diamond Inspection');

INSERT INTO Requests (requestImage, note, createdDate, appointmentDate, paymentStatus, userId, diamondId, serviceId) VALUES
('image1.jpg', 'Urgent request', GETDATE(), GETDATE(), 'Pending', 7, 1, 2),
('image2.jpg', 'Standard request', GETDATE(), GETDATE(), 'Paid', 8, 2, 3),
('image3.jpg', 'Regular request', GETDATE(), GETDATE(), 'Pending', 9, 3, 1);

INSERT INTO Results (price, companyName, requestId) VALUES
(150.0, 'Diamond Valuations Inc.', 1),
(220.0, 'Gem Experts Ltd.', 2),
(90.0, 'Certified Diamonds', 3);

INSERT INTO Payments (paymentAmount, paymentDate, requestId) VALUES
(100.0, GETDATE(), 1),
(200.0, GETDATE(), 2),
(50.0, GETDATE(), 3);
     INSERT INTO PasswordResetTokens (userId, token, expiryDate)
     VALUES
     (7, 'abc123xyz', DATEADD(DAY, 1, GETDATE())),
     (8, 'def456uvw', DATEADD(DAY, 1, GETDATE())),
     (9, 'ghi789rst', DATEADD(DAY, 1, GETDATE()));


     INSERT INTO Feedback (userId, requestId, customerName, email, feedbackText, createdAt)
     VALUES
     (1, 1, 'John Doe', 'john.doe@example.com', 'The diamond valuation service was excellent!', GETDATE()),
     (2, 2, 'Jane Smith', 'jane.smith@example.com', 'Very satisfied with the diamond cleaning service.', GETDATE()),
     (null , null, 'Son', 'ngoxuanson121@gmail.com',N'làm ăn tốt đấy',GETDATE())

        INSERT INTO RequestProcesses (requestType, createdDate, finishDate, description, status, requestId, staffId, receiver, processId) VALUES
        ('Valuation', GETDATE(), GETDATE(), 'Basic valuation service', 'Completed', 1, 5, 2, 6),
        ('Inspection', GETDATE(), GETDATE(), 'Diamond inspection service', 'Completed', 2, 6, 2, 6),
        ('Valuation', GETDATE(), GETDATE(), 'Advanced valuation service', 'Completed', 3, 5, 2, 6);