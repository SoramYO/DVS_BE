//--Create table tblResult extend all from tblRequest and have id: int requestId: int price: float companyName: nvarchar dateValued: date
class tblResult extends tblRequest {
    constructor(id, requestId, price, companyName, dateValued, note, createdDate, updatedDate, diamondId, userId, processId) {
        super(id, note, createdDate, updatedDate, diamondId, userId, processId);
        this.requestId = requestId;
        this.price = price;
        this.companyName = companyName;
        this.dateValued = dateValued;
    }
}