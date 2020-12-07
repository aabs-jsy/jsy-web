 const utf8 = require('utf8');
// const encoding = require('encoding')

// let str = "શ્રી ઔદિચ્ય​ આચાર્ય બ્રહ્મ સમાજ ";
// //console.log(str)
// //console.log(utf8.encode(str))
// //console.log(utf8.decode(utf8.encode(str)))

// let stringToBeEscaped= `   `
// +`તરફથી રૂપીઆ 100,  `
// +`ના મૃત્યુ પેટે સ્વીકારવામા આવલે છે`;// રસીદ નંબર - 2525252`;
// var qs = require('querystring');
// let ee= utf8.encode(stringToBeEscaped);//qs.escape(stringToBeEscaped);

// console.log(utf8.decode(ee));

// console.log("http://msg.pwasms.com/app/smsapi/index.php?key=45F3B943047D61&campaign=0&routeid=9&type=unicode&contacts=9033574544&senderid=PWASMS&msg="+ee)//utf8.encode(stringToBeEscaped))


var urlencode = require('urlencode');
 
console.log(encodeURI(utf8.encode('શ્રી ઔદિચ્ય​ આચાર્ય બ્રહ્મ સમાજ ધ્વારા સંચાલીત શ્રી જીવન સહાય યોજના ધ્વારા શ્રી  તરફથી રૂપીઆ 100,  ના મૃત્યુ પેટે સ્વીકારવામા આવલે છે'))); // default is utf8
//console.log(urlencode('કારવામા આવલે છે', 'utf-8')); // '%CB%D5%C7%A7'
 