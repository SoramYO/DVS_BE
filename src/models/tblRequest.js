//Create table tblRequest have + id: int + note: nvarchar + createdDate: date + updatedDate: date + diamondId: int + userId: int + processId: int
class tblRequest {
    constructor(id, note, createdDate, updatedDate, diamondId, userId, processId) {
        this.id = id;
        this.note = note;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.diamondId = diamondId;
        this.userId = userId;
        this.processId = processId;
    }
}