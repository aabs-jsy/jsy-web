const Enums = require("./Enums");
module.exports = class Helper {

    static ValidateReceiptModel = (receiptModel) => {

        // todo: create validations
        // throw new Error(Enums.ErrorCode.ErrorCode1001.message); 
    }

    static GetSheetData = (receiptRequest) => {
        let googleSheetUrl = process.env.googleSheetUrl || 'https://script.google.com/macros/s/AKfycbxGcWSuzok59PPmQ9k4jeZLIY9wUtBSvkZQ0vYKoa1eilxyMMk/exec';

        let googleReceiptCallBackUrl = googleSheetUrl
            + `?payerMemberId=${receiptRequest.payerMemberId}`
            + `&payeeMemberId=${receiptRequest.payeeMemberId}`
            + `&amount=${receiptRequest.amount}`
            + `&receiptNumber=${receiptRequest.receiptNumber}`

        return this.getRequest(googleReceiptCallBackUrl, '{}')
    }

    static getRequest = (url, bodyInString) => {
        return new Promise(function (resolve, reject) {
            let fetch = require('node-fetch');

            fetch(url,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    //  body: bodyInString
                }).then(response => {
                    resolve(response.json());
                }).catch(err => { console.log(err); });
        });
    }

    static generateReceiptPdf = async (req, receipt, pdfFileName) => {
        const puppeteer = require('puppeteer');

        const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });//===await puppeteer.launch();
        const page = await browser.newPage();
        let host = req.protocol + "://" + req.get('host');//+( port == 80 || port == 443 ? '' : ':'+port );

        let pdfReceiptUrl = host + '/receiptPdf?receiptNumber=' + receipt.receiptNumber
            + '&payerMemberId=' + receipt.payerMemberId
            + '&payeeMemberId=' + receipt.payeeMemberId
            + "&paymentAmount=" + receipt.amount
            + "&payerName=" + receipt.payerMemberName
            + "&payeeName=" + receipt.payeeMemberName

        // todo: correction spelling payeeMemeber
        await page.goto(pdfReceiptUrl, { waitUntil: 'networkidle2' });
       
        await page.pdf({ path: pdfFileName, format: 'A4' });

        await browser.close();
    }


}