const express = require('express')
var moment = require('moment')
const fs = require('fs')
const { trace } = require('console')
const utility = require('./Library/Utility')
const Helper = require('./Library/Helper')
const { response } = require('express')
const Receipt = require('./Models/Receipt')

const app = express()
const port = process.env.PORT || 3000

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static('public'))

app.get('/', async (req, res) => {
  res.send("Welcome!");
});

app.get('/receipt', async (req, res) => {

  try {
    // create receipt object
    let receipt = new Receipt(
      utility.nanosecond(),
      req.query.payerMemberId,
      req.query.payeeMemberId,
      req.query.amount,
      req.query.Method
    );

    // validate receipt 
    Helper.ValidateReceiptModel(receipt);

    // get data from google sheet
    const googleSheetData = await Helper.GetSheetData(receipt);

    receipt.payerMemberName = googleSheetData.payerMember.MemberName;
    receipt.payeeMemberName = googleSheetData.payeeMember.MemberName;
    receipt.payerMemeberPhone = googleSheetData.payeeMember.Phone;
    receipt.payerMemeberEmail = googleSheetData.payeeMember.Email;
    
    // define pdf file name
    let pdfFileName = receipt.payerMemberName.substring(0, 8) + '_'
      + receipt.payeeMemberName.substring(0, 8) + '_'
      + receipt.receiptNumber
      + '.pdf';

    // generate pdf file
    await Helper.generateReceiptPdf(req, receipt, pdfFileName);
    console.log('pdf downloaded')
    // download pdf file
    res.setHeader('Content-type', 'aplication/pdf');
    res.download(pdfFileName, pdfFileName, function (err) {

      if (err) {
        console.log(err); // Check error if you want
      }

      fs.unlink(pdfFileName, function () {
        console.log("File was deleted") // Callback
      });

    /* Helper.Sendsms(receipt.payerMemeberPhone,
        receipt.payerMemberName,
        receipt.payeeMemberName,
        receipt.amount,
        receipt.receiptNumber
      )*/

    });

  } catch (error) {
    console.log(error.message)
    res.status(400).send(error.message)
  }
})


app.get('/receiptPdf', (req, res) => {

   const template = req.query;
  // {
  //   payerMemberId: req.query.payerMemberId,
  //   payeeMemberId: req.query.payeeMemberId,
  //   amount: req.query.paymentAmount,
  //   payerMemberName: req.query.payerName,
  //   payeeMemberName: req.query.payeeName,
  //   generatedOn: req.query.generatedOn,
  //   receiptNumber: req.query.receiptNumber,
  //   PaymentMethod = req.query.PaymentMethod
  // }

  res.render('receipt', { template: template });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})



