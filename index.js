const express = require('express')
var moment = require('moment')
const fs = require('fs')
const app = express()
const port = process.env.PORT || 3000

// set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  res.send("Hii!!!");
});

app.get('/receipt', async (req, res) => {
    var payerMemberId = req.query.payerMemberId;
    var payeeMemberId =  req.query.payeeMemberId;
    var amount =  req.query.amount;

    let receiptNumber = nanosecond();
    let pdfFileName = receiptNumber+'.pdf';

    const puppeteer = require('puppeteer');

    let googleReceiptCallBackUrl = `https://script.google.com/macros/s/AKfycbxGcWSuzok59PPmQ9k4jeZLIY9wUtBSvkZQ0vYKoa1eilxyMMk/exec`
    +`?payerMemberId=${payerMemberId}&payeeMemberId=${payeeMemberId}&amount=${amount}&receiptNumber=${pdfFileName}`
    let response =  await getRequest(googleReceiptCallBackUrl,'{}')
    console.log(response);
    // send message
    Sendsms('9033574544',response.payerMember.MemberName,response.payeeMemeber.MemberName,amount,receiptNumber);

    const browser =  await puppeteer.launch({headless: true});//===await puppeteer.launch();
    const page = await browser.newPage();
    let host = req.protocol + "://" + req.get('host') ;//+( port == 80 || port == 443 ? '' : ':'+port );
    console.log(host);
    // todo: correction spelling payeeMemeber
    await page.goto( host+'/receiptPdf?receiptNumber='+ receiptNumber +'&payerMemberId=' + payerMemberId+'&payeeMemberId=' + payeeMemberId+"&paymentAmount="+amount+"&payerName="+response.payerMember.MemberName+"&payeeName="+response.payeeMemeber.MemberName, {waitUntil: 'networkidle2'});
    await page.pdf({path: pdfFileName, format: 'A4'});

    await browser.close();

    res.download(pdfFileName, pdfFileName, function(err) {
        if (err) {
        console.log(err); // Check error if you want
        }
        fs.unlink(pdfFileName, function(){
            console.log("File was deleted") // Callback
    });

  });
})


app.get('/receiptPdf', (req, res) => {
    // res.send('<h1 style="color:green;">Hello World Pdf!</h1>' + req.query.payerMemberId)
// https://script.google.com/macros/s/AKfycbxGcWSuzok59PPmQ9k4jeZLIY9wUtBSvkZQ0vYKoa1eilxyMMk/exec
    const template =
    {
        payerMemberId : req.query.payerMemberId,
        payeeMemberId : req.query.payeeMemberId,
        amount : req.query.paymentAmount,
        payerMemberName : req.query.payerName,
        payeeMemberName : req.query.payeeName,
        paidOn : moment().format('DD/MM/YYYY hh:mm:ss'),
        receiptNumber :  req.query.receiptNumber,
    }

    res.render('receipt',{template:template});
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

function getRequest(url,bodyInString) {
    return new Promise(function(resolve, reject) {
        let fetch = require('node-fetch');

        fetch(url, {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
        //  body: bodyInString
        }).then(response => {
            resolve(response.json());
        }).catch(err => {console.log(err);});
    });
  }

  function getRequestNonJson(url,bodyInString) {
    return new Promise(function(resolve, reject) {
        let fetch = require('node-fetch');

        fetch(url, {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
        //  body: bodyInString
        }).then(response => {
            resolve(response);
        }).catch(err => {console.log(err);});
    });
  }


  const nanosecond = () => Number(Date.now() + String(process.hrtime()[1]).slice(3))
  

  async function Sendsms(messageTo,payerName,payeeName,amount,receiptnumber)
  {
    let sender = "PWASMS";
    let message= `શ્રી ઔદિચ્ય​ આચાર્ય બ્રહ્મ સમાજ ધ્વારા સંચાલીત શ્રી જીવન સહાય યોજના ધ્વારા શ્રી ${payerName} `
    +`તરફથી રૂપીઆ ${amount}, ${payeeName} `
    +`ના મૃત્યુ પેટે સ્વીકારવામા આવલે છે. રસીદ નંબર - ${receiptnumber}`;

    let api_url = "http://msg.pwasms.com/app/smsapi/index.php?key=45F3B943047D61"
    +"&campaign=0&routeid=9&type=unicode&contacts=9033574544&senderid="+sender
    +"&msg="+utf8.encode(message);
    
    
   // await getRequestNonJson(api_url);

   console.log(api_url)
console.log(utf8.encode(api_url))
console.log(utf8.decode(utf8.encode(api_url)))
    /*
    
    http://msg.pwasms.com/app/smsapi/index.php?key=45F3B943047D61&campaign=0&routeid=31type=text&contacts=9033574544&%20senderid=AABSWT&msg=Hello+People%2C+have+a+great+day
    */
  }
