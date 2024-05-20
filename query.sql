create database DiamondValuation;
--Create Role table have id : int + name : nvarchar + description : nvarchar

CREATE TABLE tblRole (
    id INT PRIMARY KEY,
    name NVARCHAR(20),
    description NVARCHAR(255)
);

--Create table tblProcess have id: int processStatus: nvarchar actor: nvarchar
CREATE TABLE tblProcess (
    id INT IDENTITY(1,1)PRIMARY KEY ,
    processStatus NVARCHAR(20) NOT NULL,
    actor NVARCHAR(50) NOT NULL
);

--Create table User have id : int + email: varchar UNIQUE + password : nvarchar  + fullName : nvarchar + phone : int +address : nvarchar + roleId : int + status: bit
CREATE TABLE tblUser (
    id INT PRIMARY KEY IDENTITY(1,1),
    email VARCHAR(50) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    fullName NVARCHAR(50) NOT NULL,
    phone INT,
    address NVARCHAR(255),
    roleId INT,
    status BIT,
    FOREIGN KEY (roleId) REFERENCES tblRole(id)
);

--Create table tblDiamond + id: int + proportions: nvarchar + diamondOrigin: nvarchar + caratWeight: float + measurements: nvarchar + polish: nvarchar + fluorescence: nvarchar + color: int + cut: int + shapeId: int + clarity: nvarchar + symmetry: nvarchar
CREATE TABLE tblDiamond (
    id INT PRIMARY KEY IDENTITY(1,1),
    proportions NVARCHAR(255) ,
    diamondOrigin NVARCHAR(255),
    caratWeight FLOAT ,
    measurements NVARCHAR(255) ,
    polish NVARCHAR(255) ,
    fluorescence NVARCHAR(255) ,
    color NVARCHAR(255) ,
    cut NVARCHAR(255),
    shape NVARCHAR(255) ,
    clarity NVARCHAR(255),
    symmetry NVARCHAR(255)
);


--Create table tblRequest have + id: int + note: nvarchar + createdDate: date + updatedDate: date + diamondId: int + userId: int + processId: int
CREATE TABLE tblRequest (
    id INT PRIMARY KEY IDENTITY(1,1),
    note NVARCHAR(255),
    createdDate DATE,
    updatedDate DATE,
    diamondId INT,
    userId INT,
    processId INT,
    FOREIGN KEY (diamondId) REFERENCES tblDiamond(id),
    FOREIGN KEY (userId) REFERENCES tblUser(id),
    FOREIGN KEY (processId) REFERENCES tblProcess(id)
);

--Create table tblResult extend from tblRequest and have id: int requestId: int price: float companyName: nvarchar dateValued: date
CREATE TABLE tblResult (
    id INT PRIMARY KEY IDENTITY(1,1),
    requestId INT,
    price FLOAT,
    companyName NVARCHAR(50),
    dateValued DATE,
    FOREIGN KEY (requestId) REFERENCES tblRequest(id)
);

--Import data to Role table
INSERT INTO tblRole (id, name, description) VALUES (1, 'Admin', 'Admin role');
INSERT INTO tblRole (id, name, description) VALUES (2, 'Customer', 'Customer role');
INSERT INTO tblRole (id, name, description) VALUES (3, 'Staff', 'Staff role');
INSERT INTO tblRole (id, name, description) VALUES (4, 'Valuation', 'Valuation staff role');
--Import data to User table
INSERT INTO tblUser (email, password, fullName, phone, address, roleId, status) VALUES ('example@gmail.com', '123456', 'Example', 123456789, 'Example address', 1, 1);
INSERT INTO tblUser (email, password, fullName, phone, address, roleId, status) VALUES ('example1@gmail.com', '123456', 'Example1', 123456789, 'Example address', 2, 1);

--Import some data to tblDiamond
INSERT INTO tblDiamond (proportions, diamondOrigin, caratWeight, measurements, polish, fluorescence, color, cut, shape, clarity, symmetry) VALUES ('Ideal', 'Russia', 1.5, '6.5x6.5x4.5', 'Excellent', 'None', 'D', 'Excellent', 'Round', 'VVS1', 'Excellent');
INSERT INTO tblDiamond (proportions, diamondOrigin, caratWeight, measurements, polish, fluorescence, color, cut, shape, clarity, symmetry) VALUES ('Ideal', 'Russia', 1.5, '6.5x6.5x4.5', 'Excellent', 'None', 'E', 'Excellent', 'Princess', 'VVS1', 'Excellent');
INSERT INTO tblDiamond (proportions, diamondOrigin, caratWeight, measurements, polish, fluorescence, color, cut, shape, clarity, symmetry) VALUES ('Ideal', 'Russia', 1.5, '6.5x6.5x4.5', 'Excellent', 'None', 'F', 'Excellent', 'Radiant', 'VVS1', 'Excellent');
INSERT INTO tblDiamond (proportions, diamondOrigin, caratWeight, measurements, polish, fluorescence, color, cut, shape, clarity, symmetry) VALUES ('Ideal', 'Russia', 1.5, '6.5x6.5x4.5', 'Excellent', 'None', 'G', 'Excellent', 'Cushion', 'VVS1', 'Excellent');
INSERT INTO tblDiamond (proportions, diamondOrigin, caratWeight, measurements, polish, fluorescence, color, cut, shape, clarity, symmetry) VALUES ('Ideal', 'Russia', 1.5, '6.5x6.5x4.5', 'Excellent', 'None', 'H', 'Excellent', 'Emerald', 'VVS1', 'Excellent');
INSERT INTO tblDiamond (proportions, diamondOrigin, caratWeight, measurements, polish, fluorescence, color, cut, shape, clarity, symmetry) VALUES ('Ideal', 'Russia', 1.5, '6.5x6.5x4.5', 'Excellent', 'None', 'I', 'Excellent', 'Oval', 'VVS1', 'Excellent');
INSERT INTO tblDiamond (proportions, diamondOrigin, caratWeight, measurements, polish, fluorescence, color, cut, shape, clarity, symmetry) VALUES ('Ideal', 'Russia', 1.5, '6.5x6.5x4.5', 'Excellent', 'None', 'K', 'Excellent', 'Asscher', 'VVS1', 'Excellent');
INSERT INTO tblDiamond (proportions, diamondOrigin, caratWeight, measurements, polish, fluorescence, color, cut, shape, clarity, symmetry) VALUES ('Ideal', 'Russia', 1.5, '6.5x6.5x4.5', 'Excellent', 'None', 'L', 'Excellent', 'Pear', 'VVS1', 'Excellent');
INSERT INTO tblDiamond (proportions, diamondOrigin, caratWeight, measurements, polish, fluorescence, color, cut, shape, clarity, symmetry) VALUES ('Ideal', 'Russia', 1.5, '6.5x6.5x4.5', 'Excellent', 'None', 'M', 'Excellent', 'Heart', 'VVS1', 'Excellent');
INSERT INTO tblDiamond (proportions, diamondOrigin, caratWeight, measurements, polish, fluorescence, color, cut, shape, clarity, symmetry) VALUES ('Ideal', 'Russia', 1.5, '6.5x6.5x4.5', 'Excellent', 'None', 'N', 'Excellent', 'Marquise', 'VVS1', 'Excellent');


--Import some data to tblRequest
INSERT INTO tblRequest (note, createdDate, updatedDate, diamondId, userId, processId) VALUES ('Good', '2021-01-01', '2021-01-01', 1, 1, 1);
INSERT INTO tblRequest (note, createdDate, updatedDate, diamondId, userId, processId) VALUES ('Good', '2021-01-01', '2021-01-01', 2, 1, 1);
INSERT INTO tblRequest (note, createdDate, updatedDate, diamondId, userId, processId) VALUES ('Good', '2021-01-01', '2021-01-01', 3, 1, 1);
INSERT INTO tblRequest (note, createdDate, updatedDate, diamondId, userId, processId) VALUES ('Good', '2021-01-01', '2021-01-01', 4, 1, 1);
INSERT INTO tblRequest (note, createdDate, updatedDate, diamondId, userId, processId) VALUES ('Good', '2021-01-01', '2021-01-01', 5, 1, 1);
INSERT INTO tblRequest (note, createdDate, updatedDate, diamondId, userId, processId) VALUES ('Good', '2021-01-01', '2021-01-01', 6, 1, 1);
INSERT INTO tblRequest (note, createdDate, updatedDate, diamondId, userId, processId) VALUES ('Good', '2021-01-01', '2021-01-01', 7, 1, 1);
INSERT INTO tblRequest (note, createdDate, updatedDate, diamondId, userId, processId) VALUES ('Good', '2021-01-01', '2021-01-01', 8, 1, 1);
INSERT INTO tblRequest (note, createdDate, updatedDate, diamondId, userId, processId) VALUES ('Good', '2021-01-01', '2021-01-01', 9, 1, 1);
INSERT INTO tblRequest (note, createdDate, updatedDate, diamondId, userId, processId) VALUES ('Good', '2021-01-01', '2021-01-01', 10, 1, 1);
--Import some data to tblResult
INSERT INTO tblResult (requestId, price, companyName, dateValued) VALUES (1, 1000, 'Company 1', '2021-01-01');
INSERT INTO tblResult (requestId, price, companyName, dateValued) VALUES (2, 1000, 'Company 1', '2021-01-01');
INSERT INTO tblResult (requestId, price, companyName, dateValued) VALUES (3, 1000, 'Company 1', '2021-01-01');
INSERT INTO tblResult (requestId, price, companyName, dateValued) VALUES (4, 1000, 'Company 1', '2021-01-01');
INSERT INTO tblResult (requestId, price, companyName, dateValued) VALUES (5, 1000, 'Company 1', '2021-01-01');
INSERT INTO tblResult (requestId, price, companyName, dateValued) VALUES (6, 1000, 'Company 1', '2021-01-01');
INSERT INTO tblResult (requestId, price, companyName, dateValued) VALUES (7, 1000, 'Company 1', '2021-01-01');
INSERT INTO tblResult (requestId, price, companyName, dateValued) VALUES (8, 1000, 'Company 1', '2021-01-01');
INSERT INTO tblResult (requestId, price, companyName, dateValued) VALUES (9, 1000, 'Company 1', '2021-01-01');
INSERT INTO tblResult (requestId, price, companyName, dateValued) VALUES (10, 1000, 'Company 1', '2021-01-01');
