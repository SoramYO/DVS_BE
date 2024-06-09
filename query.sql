CREATE TABLE Role(
	id int identity(1,1),
	name nvarchar(255) NOT NULL,
	PRIMARY KEY(id)
)

CREATE TABLE Account(
	id int identity(1,1),
	username nvarchar(255) NOT NULL,
	password nvarchar(255) NOT NULL,
	firstName nvarchar(255) NOT NULL,
	lastName nvarchar(255) NOT NULL,
	email nvarchar(255),
	phone nvarchar(255),
	createdAt datetime,
	status int
	PRIMARY KEY(id)
)

CREATE TABLE Diamond(
	id int identity(1,1),
	proportions nvarchar(255),
	diamondOrigin nvarchar(255),
	caratWeight float,
	measurements nvarchar(255),
	polish nvarchar(255),
	flourescence nvarchar(255),
	color nvarchar(255),
	cut nvarchar(255),
	clarity nvarchar(255),
	symmetry nvarchar(255),
	shape nvarchar(255),
	PRIMARY KEY(id)
)

CREATE TABLE Process(
	id int identity(1,1),
	processStatus nvarchar(255),
	actor nvarchar(255)
	PRIMARY KEY(id)
)
CREATE TABLE Service(
	id int identity(1,1),
    price int NOT NULL ,
	serviceName nvarchar(255) NOT NULL,
	PRIMARY KEY(id)
)
CREATE TABLE Request(
	id int identity(1,1),
	requestImage nvarchar(MAX),
	note nvarchar(255),
	createdDate datetime,
	updatedDate datetime,
	PRIMARY KEY(id)
)


CREATE TABLE PasswordResetTokens (
    id INT IDENTITY(1,1) PRIMARY KEY,
    userId INT FOREIGN KEY REFERENCES Account(id),
    token NVARCHAR(255) NOT NULL,
    expiryDate DATETIME NOT NULL
);

CREATE TABLE Result(
	id int identity(1,1),
	price float,
	companyName nvarchar(255),
	dateValued datetime,
	PRIMARY KEY(id)
)

ALTER TABLE Account
ADD roleId int foreign key references Role(id)

ALTER TABLE Request
ADD userId int foreign key references Account(id),
	processId int foreign key references Process(id),
	diamondId int foreign key references Diamond(id)

ALTER TABLE Result
ADD requestId int foreign key references Request(id)
INSERT INTO Diamond (proportions, diamondOrigin, caratWeight, measurements, polish, flourescence, color, cut, shape, clarity, symmetry) VALUES ('Ideal', 'Russia', 1.5, '6.5x6.5x4.5', 'Excellent', 'None', 'D', 'Excellent', 'Round', 'VVS1', 'Excellent');
INSERT INTO Diamond (proportions, diamondOrigin, caratWeight, measurements, polish, flourescence, color, cut, shape, clarity, symmetry) VALUES ('Ideal', 'Russia', 1.5, '6.5x6.5x4.5', 'Excellent', 'None', 'E', 'Excellent', 'Princess', 'VVS1', 'Excellent');
INSERT INTO Diamond (proportions, diamondOrigin, caratWeight, measurements, polish, flourescence, color, cut, shape, clarity, symmetry) VALUES ('Ideal', 'Russia', 1.5, '6.5x6.5x4.5', 'Excellent', 'None', 'F', 'Excellent', 'Radiant', 'VVS1', 'Excellent');
INSERT INTO Diamond (proportions, diamondOrigin, caratWeight, measurements, polish, flourescence, color, cut, shape, clarity, symmetry) VALUES ('Ideal', 'Russia', 1.5, '6.5x6.5x4.5', 'Excellent', 'None', 'G', 'Excellent', 'Cushion', 'VVS1', 'Excellent');
INSERT INTO Diamond (proportions, diamondOrigin, caratWeight, measurements, polish, flourescence, color, cut, shape, clarity, symmetry) VALUES ('Ideal', 'Russia', 1.5, '6.5x6.5x4.5', 'Excellent', 'None', 'H', 'Excellent', 'Emerald', 'VVS1', 'Excellent');
INSERT INTO Diamond (proportions, diamondOrigin, caratWeight, measurements, polish, flourescence, color, cut, shape, clarity, symmetry) VALUES ('Ideal', 'Russia', 1.5, '6.5x6.5x4.5', 'Excellent', 'None', 'I', 'Excellent', 'Oval', 'VVS1', 'Excellent');
INSERT INTO Diamond (proportions, diamondOrigin, caratWeight, measurements, polish, flourescence, color, cut, shape, clarity, symmetry) VALUES ('Ideal', 'Russia', 1.5, '6.5x6.5x4.5', 'Excellent', 'None', 'K', 'Excellent', 'Asscher', 'VVS1', 'Excellent');
INSERT INTO Diamond (proportions, diamondOrigin, caratWeight, measurements, polish, flourescence, color, cut, shape, clarity, symmetry) VALUES ('Ideal', 'Russia', 1.5, '6.5x6.5x4.5', 'Excellent', 'None', 'L', 'Excellent', 'Pear', 'VVS1', 'Excellent');
INSERT INTO Diamond (proportions, diamondOrigin, caratWeight, measurements, polish, flourescence, color, cut, shape, clarity, symmetry) VALUES ('Ideal', 'Russia', 1.5, '6.5x6.5x4.5', 'Excellent', 'None', 'M', 'Excellent', 'Heart', 'VVS1', 'Excellent');
INSERT INTO Diamond (proportions, diamondOrigin, caratWeight, measurements, polish, flourescence, color, cut, shape, clarity, symmetry) VALUES ('Ideal', 'Russia', 1.5, '6.5x6.5x4.5', 'Excellent', 'None', 'N', 'Excellent', 'Marquise', 'VVS1', 'Excellent');


--Import some data to Request
INSERT INTO Request (requestImage, note, createdDate, updatedDate, diamondId, userId, processId) VALUES ('https://encrypted/tbn0.gstatic.com/images?q=tbn:ANd9GcSP3frOOEwI_TR/xpvcrdcI8qqTW9/rpGPBdvC9jlTd5A&s', 'Good', '2021/01/01', '2021/01/01', 1, 1, 1);
INSERT INTO Request (requestImage, note, createdDate, updatedDate, diamondId, userId, processId) VALUES ('https://encrypted/tbn0.gstatic.com/images?q=tbn:ANd9GcSP3frOOEwI_TR/xpvcrdcI8qqTW9/rpGPBdvC9jlTd5A&s', 'Good', '2021/01/01', '2021/01/01', 2, 1, 1);
INSERT INTO Request (requestImage, note, createdDate, updatedDate, diamondId, userId, processId) VALUES ('https://encrypted/tbn0.gstatic.com/images?q=tbn:ANd9GcSP3frOOEwI_TR/xpvcrdcI8qqTW9/rpGPBdvC9jlTd5A&s', 'Good', '2021/01/01', '2021/01/01', 3, 1, 1);
INSERT INTO Request (requestImage, note, createdDate, updatedDate, diamondId, userId, processId) VALUES ('https://encrypted/tbn0.gstatic.com/images?q=tbn:ANd9GcSP3frOOEwI_TR/xpvcrdcI8qqTW9/rpGPBdvC9jlTd5A&s', 'Good', '2021/01/01', '2021/01/01', 4, 1, 1);
INSERT INTO Request (requestImage, note, createdDate, updatedDate, diamondId, userId, processId) VALUES ('https://encrypted/tbn0.gstatic.com/images?q=tbn:ANd9GcSP3frOOEwI_TR/xpvcrdcI8qqTW9/rpGPBdvC9jlTd5A&s', 'Good', '2021/01/01', '2021/01/01', 5, 1, 1);
INSERT INTO Request (requestImage, note, createdDate, updatedDate, diamondId, userId, processId) VALUES ('https://encrypted/tbn0.gstatic.com/images?q=tbn:ANd9GcSP3frOOEwI_TR/xpvcrdcI8qqTW9/rpGPBdvC9jlTd5A&s', 'Good', '2021/01/01', '2021/01/01', 6, 1, 1);
INSERT INTO Request (requestImage, note, createdDate, updatedDate, diamondId, userId, processId) VALUES ('https://encrypted/tbn0.gstatic.com/images?q=tbn:ANd9GcSP3frOOEwI_TR/xpvcrdcI8qqTW9/rpGPBdvC9jlTd5A&s', 'Good', '2021/01/01', '2021/01/01', 7, 1, 1);
INSERT INTO Request (requestImage, note, createdDate, updatedDate, diamondId, userId, processId) VALUES ('https://encrypted/tbn0.gstatic.com/images?q=tbn:ANd9GcSP3frOOEwI_TR/xpvcrdcI8qqTW9/rpGPBdvC9jlTd5A&s', 'Good', '2021/01/01', '2021/01/01', 8, 1, 1);
INSERT INTO Request (requestImage, note, createdDate, updatedDate, diamondId, userId, processId) VALUES ('https://encrypted/tbn0.gstatic.com/images?q=tbn:ANd9GcSP3frOOEwI_TR/xpvcrdcI8qqTW9/rpGPBdvC9jlTd5A&s', 'Good', '2021/01/01', '2021/01/01', 9, 1, 1);
INSERT INTO Request (requestImage, note, createdDate, updatedDate, diamondId, userId, processId) VALUES ('https://encrypted/tbn0.gstatic.com/images?q=tbn:ANd9GcSP3frOOEwI_TR/xpvcrdcI8qqTW9/rpGPBdvC9jlTd5A&s', 'Good', '2021/01/01', '2021/01/01', 10, 1, 1);
--Import some data to Result
INSERT INTO Result (requestId, price, companyName, dateValued) VALUES (1, 1000, 'Company 1', '2021/01/01');
INSERT INTO Result (requestId, price, companyName, dateValued) VALUES (2, 1000, 'Company 1', '2021/01/01');
INSERT INTO Result (requestId, price, companyName, dateValued) VALUES (3, 1000, 'Company 1', '2021/01/01');
INSERT INTO Result (requestId, price, companyName, dateValued) VALUES (4, 1000, 'Company 1', '2021/01/01');
INSERT INTO Result (requestId, price, companyName, dateValued) VALUES (5, 1000, 'Company 1', '2021/01/01');
INSERT INTO Result (requestId, price, companyName, dateValued) VALUES (6, 1000, 'Company 1', '2021/01/01');
INSERT INTO Result (requestId, price, companyName, dateValued) VALUES (7, 1000, 'Company 1', '2021/01/01');
INSERT INTO Result (requestId, price, companyName, dateValued) VALUES (8, 1000, 'Company 1', '2021/01/01');
INSERT INTO Result (requestId, price, companyName, dateValued) VALUES (9, 1000, 'Company 1', '2021/01/01');
INSERT INTO Result (requestId, price, companyName, dateValued) VALUES (10, 1000, 'Company 1', '2021/01/01');

--Import some data to Role
INSERT INTO Role(name)
VALUES
	('Customer'),
	('Valuation Staff'),
	('Consulting Staff'),
	('Admin')

--Import some data to Account
INSERT INTO Account(username, password, firstName, lastName, email, phone, createdAt, roleId, status)
VALUES
	('customer1', '123456', 'John', 'Wick', 'customer1@gmail.com', '0123456789', '2024-05-20', 1, 1),
	('staff1', '123456', 'Murat', 'Bay', 'staff1@gmail.com', '0123456789', '2024-05-20', 2, 1),
	('staff2', '123456', 'Christiano', 'Ronaldo', 'staff2@gmail.com', '0123456789', '2024-05-20', 3, 1),
	('admin1', '123456', 'Lionel', 'Messi', 'admin1@gmail.com', '0123456789', '2024-05-20', 4, 1)