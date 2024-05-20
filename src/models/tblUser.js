//--Create table User have id : int + email: varchar UNIQUE + password : nvarchar  + fullName : nvarchar + phone : int +address : nvarchar + roleId : int + status: bit
class tblUser {
    constructor(id, email, password, fullName, phone, address, roleId, status) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.phone = phone;
        this.address = address;
        this.roleId = roleId;
        this.status = status;
    }
}