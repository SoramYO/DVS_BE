--Create Role table have id : int + name : nvarchar + description : nvarchar

CREATE TABLE tblRole (
    id INT PRIMARY KEY,
    name NVARCHAR(20),
    description NVARCHAR(255)
);
--Import data to Role table
INSERT INTO tblRole (id, name, description) VALUES (1, 'Admin', 'Admin role');
INSERT INTO tblRole (id, name, description) VALUES (2, 'User', 'User role');
INSERT INTO tblRole (id, name, description) VALUES (3, 'Staff', 'Staff role');
INSERT INTO tblRole (id, name, description) VALUES (4, 'Valuation', 'Valuation staff role');

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
--Import data to User table
INSERT INTO tblUser (email, password, fullName, phone, address, roleId, status) VALUES ('example@gmail.com', '123456', 'Example', 123456789, 'Example address', 1, 1);
INSERT INTO tblUser (email, password, fullName, phone, address, roleId, status) VALUES ('example1@gmail.com', '123456', 'Example1', 123456789, 'Example address', 2, 1);

--Create table tblShape have id: int + name: nvarchar + image: nvarchar
CREATE TABLE tblShape (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(20) NOT NULL,
    image NVARCHAR(255)
);
--Create table tblDiamond + id: int + proportions: nvarchar + diamondOrigin: nvarchar + caratWeight: float + measurements: nvarchar + polish: nvarchar + flourescence: nvarchar + color: int + cut: int + shapeId: int + clarity: nvarchar + symmetry: nvarchar
CREATE TABLE tblDiamond (
    id INT PRIMARY KEY IDENTITY(1,1),
    proportions NVARCHAR(255) NOT NULL,
    diamondOrigin NVARCHAR(255) NOT NULL,
    caratWeight FLOAT NOT NULL,
    measurements NVARCHAR(255) NOT NULL,
    polish NVARCHAR(255) NOT NULL,
    flourescence NVARCHAR(255) NOT NULL,
    color INT NOT NULL,
    cut INT NOT NULL,
    shapeId INT NOT NULL,
    clarity NVARCHAR(255) NOT NULL,
    symmetry NVARCHAR(255) NOT NULL,
    FOREIGN KEY (shapeId) REFERENCES tblShape(id)
);
--Import all shape of diamond data to tblShape
INSERT INTO tblShape (name, image) VALUES ('Round', 'https://www.bluenile.com/diamonds/images/diamond-shapes/round.svg');
INSERT INTO tblShape (name, image) VALUES ('Princess', 'https://www.bluenile.com/diamonds/images/diamond-shapes/princess.svg');
INSERT INTO tblShape (name, image) VALUES ('Emerald', 'https://www.bluenile.com/diamonds/images/diamond-shapes/emerald.svg');
INSERT INTO tblShape (name, image) VALUES ('Asscher', 'https://www.bluenile.com/diamonds/images/diamond-shapes/asscher.svg');
INSERT INTO tblShape (name, image) VALUES ('Marquise', 'https://www.bluenile.com/diamonds/images/diamond-shapes/marquise.svg');
INSERT INTO tblShape (name, image) VALUES ('Oval', 'https://www.bluenile.com/diamonds/images/diamond-shapes/oval.svg');
INSERT INTO tblShape (name, image) VALUES ('Radiant', 'https://www.bluenile.com/diamonds/images/diamond-shapes/radiant.svg');
INSERT INTO tblShape (name, image) VALUES ('Pear', 'https://www.bluenile.com/diamonds/images/diamond-shapes/pear.svg');
INSERT INTO tblShape (name, image) VALUES ('Heart', 'https://www.bluenile.com/diamonds/images/diamond-shapes/heart.svg');
INSERT INTO tblShape (name, image) VALUES ('Cushion', 'https://www.bluenile.com/diamonds/images/diamond-shapes/cushion.svg');


--Import some data to tblDiamond 
INSERT INTO tblDiamond (proportions, diamondOrigin, caratWeight, measurements, polish, flourescence, color, cut, shapeId, clarity, symmetry) VALUES ('Ideal', 'Russia', 1.5, '6.5x6.5x4.5', 'Excellent', 'None', 1, 1, 1, 'VVS1', 'Excellent');
INSERT INTO tblDiamond (proportions, diamondOrigin, caratWeight, measurements, polish, flourescence, color, cut, shapeId, clarity, symmetry) VALUES ('Ideal', 'Russia', 1.5, '6.5x6.5x4.5', 'Excellent', 'None', 1, 1, 2, 'VVS1', 'Excellent');
INSERT INTO tblDiamond (proportions, diamondOrigin, caratWeight, measurements, polish, flourescence, color, cut, shapeId, clarity, symmetry) VALUES ('Ideal', 'Russia', 1.5, '6.5x6.5x4.5', 'Excellent', 'None', 1, 1, 3, 'VVS1', 'Excellent');
INSERT INTO tblDiamond (proportions, diamondOrigin, caratWeight, measurements, polish, flourescence, color, cut, shapeId, clarity, symmetry) VALUES ('Ideal', 'Russia', 1.5, '6.5x6.5x4.5', 'Excellent', 'None', 1, 1, 4, 'VVS1', 'Excellent');
INSERT INTO tblDiamond (proportions, diamondOrigin, caratWeight, measurements, polish, flourescence, color, cut, shapeId, clarity, symmetry) VALUES ('Ideal', 'Russia', 1.5, '6.5x6.5x4.5', 'Excellent', 'None', 1, 1, 5, 'VVS1', 'Excellent');
INSERT INTO tblDiamond (proportions, diamondOrigin, caratWeight, measurements, polish, flourescence, color, cut, shapeId, clarity, symmetry) VALUES ('Ideal', 'Russia', 1.5, '6.5x6.5x4.5', 'Excellent', 'None', 1, 1, 6, 'VVS1', 'Excellent');
INSERT INTO tblDiamond (proportions, diamondOrigin, caratWeight, measurements, polish, flourescence, color, cut, shapeId, clarity, symmetry) VALUES ('Ideal', 'Russia', 1.5, '6.5x6.5x4.5', 'Excellent', 'None', 1, 1, 7, 'VVS1', 'Excellent');


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
