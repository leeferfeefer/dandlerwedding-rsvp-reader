require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.CLUSTER_NAME}/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
  try {
    const database = client.db(`${process.env.DB_NAME}`);
    const rsvps = await database.collection(`${process.env.DB_COLLECTION}`).find().toArray();
    const csvWriter = createCsvWriter({
      path: './rsvps.csv',
      header: [
        {id: 'name', title: 'NAME'},
        {id: 'alternateNames', title: 'PARTY'},
        {id: 'totalCount', title: 'TOTAL COUNT'},
        {id: 'rsvpCount', title: 'RSVP COUNT'},
        {id: 'rsvp', title: 'RSVP'},
        {id: 'dietary', title: 'DIETARY'}
      ]
    });

    csvWriter.writeRecords(rsvps.map((rsvp) => {
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
    })).then(() => {
        console.log('...Done');
    });
  
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch("ERROR! ", console.dir);