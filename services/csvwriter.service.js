const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;

const writeCSV = (rsvps) => {
  const csvStringifier = createCsvStringifier({
    header: [
      {id: 'name', title: 'NAME'},
      {id: 'alternateNames', title: 'PARTY'},
      {id: 'totalCount', title: 'TOTAL PARTY COUNT'},
      {id: 'rsvpCount', title: 'RSVP COUNT'},
      {id: 'rsvp', title: 'RSVP'},
      {id: 'dietary', title: 'DIETARY'},
      {id: 'invitedCount', title: 'TOTAL INVITED COUNT'},
      {id: 'yesCount', title: 'YES'},
      {id: 'noCount', title: 'NO'},
      {id: 'unconfirmedCount', title: "UNCONFIRMED COUNT"}
    ]
  });

  let invitedCount = 0;
  let yesCount = 0;
  let noCount = 0;

  const data = csvStringifier.stringifyRecords(rsvps.map((rsvp) => {

    let rsvpStr = "";
    for (const [key, value] of Object.entries(rsvp.rsvp)) {
      rsvpStr+=key + ": " + value + "\n";
      if (value) {
        yesCount++;
      } else {
        noCount++;
      }
    }

    invitedCount += rsvp.totalCount;
    
    rsvp.rsvp = rsvpStr;

    let dietaryStr = "";
    for (const [key, value] of Object.entries(rsvp.dietary)) {
      dietaryStr+=key + ": " + value + "\n";
    }

    rsvp.dietary = dietaryStr;

    return {...rsvp};
  }).concat({invitedCount, yesCount, noCount, unconfirmedCount: invitedCount - (yesCount + noCount)}));

  console.log('...Done');

  if (!data) {
    throw new Error("Failure to create data from rsvps - empty data");
  }
  return csvStringifier.getHeaderString() + data;
};

module.exports = {
  writeCSV
}