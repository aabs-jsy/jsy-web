const Utility = require("../Library/Utility");

module.exports = class Receipt{
    constructor(receiptNumber, payerMemberId, payeeMemberId, amount, paymentMethod, payerMemberName, payeeMemberName, phone, email, payeeMemeberCity)
    {
        this.receiptNumber = receiptNumber;
        this.payerMemberId = payerMemberId;
        this.payeeMemberId = payeeMemberId;
        this.amount = amount;
        this.payerMemberName = payerMemberName;
        this.payeeMemberName = payeeMemberName;
        this.generatedOn = Utility.currentDatetimeWithFormat(),
        this.paymentMethod = paymentMethod,
        this.payerMemeberPhone = phone,
        this.payerMemeberEmail = email,
        this.payeeMemeberCity = payeeMemeberCity
    }
}