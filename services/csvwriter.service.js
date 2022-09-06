const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;

const writeCSV = (rsvps) => {
  const csvStringifier = createCsvStringifier({
    header: [
      {id: 'name', title: 'NAME'},
      {id: 'alternateNames', title: 'PARTY'},
      {id: 'totalCount', title: 'TOTAL COUNT'},
      {id: 'rsvpCount', title: 'RSVP COUNT'},
      {id: 'rsvp', title: 'RSVP'},
      {id: 'dietary', title: 'DIETARY'}
    ]
  });

  const data = csvStringifier.stringifyRecords(rsvps.map((rsvp) => {
    let rsvpStr = "";
    for (const [key, value] of Object.entries(rsvp.rsvp)) {
      rsvpStr+=key + ": " + value + "\n";
    }
    
    rsvp.rsvp = rsvpStr;

    let dietaryStr = "";
    for (const [key, value] of Object.entries(rsvp.dietary)) {
      dietaryStr+=key + ": " + value + "\n";
    }

    rsvp.dietary = dietaryStr;

    return {...rsvp};
  }));

  console.log('...Done');

  if (!data) {
    throw new Error("Failure to create data from rsvps - empty data");
  }
  return data;
};

module.exports = {
  writeCSV
}