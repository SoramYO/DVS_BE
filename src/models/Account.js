// id int identity(1,1),
// 	username nvarchar(255) NOT NULL,
// 	password nvarchar(255) NOT NULL,
// 	firstName nvarchar(255) NOT NULL,
// 	lastName nvarchar(255) NOT NULL,
// 	email nvarchar(255),
// 	phone nvarchar(255),
// 	createdAt datetime,
// 	status int
// 	PRIMARY KEY(id)

const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const AccountSchema = new Schema({
    username: { type: String },
    password: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    phone: { type: String },
    createdAt: { type: Date },
    status: { type: Number }
});
const Account = mongoose.model('Account', AccountSchema);
module.exports = Account;