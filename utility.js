module.exports = class Utility {
  
  static nanosecond = () => Number(Date.now() + String(process.hrtime()[1]).slice(3))

  static now = (unit) => {

    const hrTime = process.hrtime();

    switch (unit) {

      case 'milli':
        return hrTime[0] * 1000 + hrTime[1] / 1000000;

      case 'micro':
        return hrTime[0] * 1000000 + hrTime[1] / 1000;

      case 'nano':
        return hrTime[0] * 1000000000 + hrTime[1];

      default:
        return now('nano');
    }

  };

  static currentDatetimeWithFormat = () =>
  {
    return moment().format('DD/MM/YYYY hh:mm:ss');
    //return new Date()
    //.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
   //.format("%d-%m-%Y %H:%M:%S");
  }
}
