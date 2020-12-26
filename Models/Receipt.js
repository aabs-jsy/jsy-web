module.exports = class Receipt{
    constructor(receiptNumber, payerMemberId, payeeMemberId, amount, payerMemberName, payeeMemberName)
    {
        this.receiptNumber = receiptNumber;
        this.payerMemberId = payerMemberId;
        this.payeeMemberId = payeeMemberId;
        this.amount = amount;
        this.payerMemberName = payerMemberName;
        this.payerMemberName = payerMemberName;
        this.generatedon = Utility.currentDatetimeWithFormat()
    }
}