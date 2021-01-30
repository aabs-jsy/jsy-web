const utf8 = require('utf8');
const Enums = require("./Enums");
const Utility = require("./Utility"); 

module.exports = class Helper {

  static ValidateReceiptModel = (receiptModel) => {

    // todo: create validations
    // throw new Error(Enums.ErrorCode.ErrorCode1001.message); 
  }

  static GetSheetData = (receipt) => {
    let googleSheetUrl = process.env.googleSheetUrl || 'https://script.google.com/macros/s/AKfycbxof3T4314iKGDaJQwTUQZUh2E64r3QZR2hB8MHEArqvD1qDLTNYsWh/exec';

    let googleReceiptCallBackUrl = googleSheetUrl + '?' + Utility.objectToGetRequestParameters(receipt)
      // + `?payerMemberId=${receiptRequest.payerMemberId}`
      // + `&payeeMemberId=${receiptRequest.payeeMemberId}`
      // + `&amount=${receiptRequest.amount}`
      // + `&receiptNumber=${receiptRequest.receiptNumber}`

      console.log(googleReceiptCallBackUrl)

    return Utility.getJsonRequest(googleReceiptCallBackUrl, '{}')
  }

  static generateReceiptPdf = async (req, receipt, pdfFileName) => {
    const puppeteer = require('puppeteer');

    const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });//===await puppeteer.launch();
    const page = await browser.newPage();
    let host = req.protocol + "://" + req.get('host');//+( port == 80 || port == 443 ? '' : ':'+port );

    /*
    let pdfReceiptUrl = host + '/receiptPdf?receiptNumber=' + receipt.receiptNumber
        + '&payerMemberId=' + receipt.payerMemberId
        + '&payeeMemberId=' + receipt.payeeMemberId
        + "&paymentAmount=" + receipt.amount
        + "&payerName=" + receipt.payerMemberName
        + "&payeeName=" + receipt.payeeMemberName
        + "&paidOn=" + receipt.generatedOn
    */

    let pdfReceiptUrl = host + '/receiptPdf?' + Utility.objectToGetRequestParameters(receipt)

    // todo: correction spelling payeeMemeber
    await page.goto(pdfReceiptUrl, { waitUntil: 'networkidle2' });
    
    await page.pdf({ path: pdfFileName, format: 'A4' });

    await page.screenshot({ path: './public/'+receipt.receiptNumber+".png", format: 'A4' });

    await browser.close();

  }

  static Sendsms = async (messageTo, payerName, payeeName, amount, receiptnumber) => {
    try{
    let sender = "PWASMS";
    let message = `શ્રી ઔદિચ્ય​ આચાર્ય બ્રહ્મ સમાજ ધ્વારા સંચાલીત શ્રી જીવન સહાય યોજના ધ્વારા શ્રી ${payerName} `
      + `તરફથી રૂપીઆ ${amount}, ${payeeName} `
      + `ના મૃત્યુ પેટે સ્વીકારવામા આવેલ છે. રસીદ નંબર - ${receiptnumber}`;

    let api_url = "http://msg.pwasms.com/app/smsapi/index.php"
      + "?key=45F3B943047D61"
      + "&campaign=0"
      + "&routeid=9"
      + "&type=unicode" 
      + "&contacts=" + messageTo
      + "&senderid=" + sender
      + "&msg=" + encodeURI(utf8.encode(message));
      console.log(api_url);

      await Utility.getRequest(api_url);
    }
    catch(err)
    {
      console.log(err)
    }

  } 
  
  static SendWhatsApp = async (messageTo, payerName, payeeName, amount, receiptnumber, req, snapshotName) => {
    try{
    let sender = "PWASMS";
    let message = `શ્રી ઔદિચ્ય​ આચાર્ય બ્રહ્મ સમાજ ધ્વારા સંચાલીત શ્રી જીવન સહાય યોજના ધ્વારા શ્રી ${payerName} `
      + `તરફથી રૂપીઆ ${amount}, ${payeeName} `
      + `ના મૃત્યુ પેટે સ્વીકારવામા આવેલ છે. રસીદ નંબર - ${receiptnumber}`;

    // let api_url = 'http://bulkwhatsapp.live/whatsapp/api/send';

    // let messageObject = {
    //   'apikey':'a30383ad223440f193cce6f00826ee5b',
    //   'mobile':messageTo,
    //   'msg':message
    // }
    //   console.log(api_url);

    //   console.log( await Utility.postRequest(api_url, messageObject));
    
    let snapShotUrl = req.protocol + "://" + req.get('host')+'/'+snapshotName;

    console.log(snapShotUrl);
      var request = require('request');
      var options = {
        'method': 'POST',
        'url': 'http://bulkwhatsapp.live/whatsapp/api/send',
        'headers': {
        },
        formData: {
          'apikey': 'a30383ad223440f193cce6f00826ee5b',
          'mobile': messageTo,
          'msg': message,
          'img1': snapShotUrl
        }
      };
      request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
        const fs = require('fs')
        if(fs.existsSync('./public/'+snapshotName))
        {
        fs.unlink('./public/'+snapshotName, function () {
          console.log("Snapshot was deleted") // Callback
        });
      }
      });

    }
    catch(err)
    {
      console.log(err)
    }

  }

}