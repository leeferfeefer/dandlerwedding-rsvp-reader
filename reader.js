require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: `${process.env.EMAIL_HOST}`,
  port: 465,
  auth: {
    user: `${process.env.EMAIL_USER}`,
    pass: `${process.env.EMAIL_PASS}`,
  },
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.CLUSTER_NAME}/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const run = async () => {
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

        let data;
        try {
          data = fs.readFileSync('./rsvps.csv', 'utf8');          
        } catch (error) {
          console.log("Could not read data bitch");
        }

        if (!data) {
          return;
        }


        transporter.sendMail(
          {
            from: `${process.env.EMAIL_USER}`,
            to: `${process.env.EMAIL_TO}`,
            subject: "RSVP BITCH",
            text: "😊",
            attachments: [
              {
                filename: "rsvps.csv",
                content: data,
              },
            ],
          },
          (err, info) => {
            if (err) {
              console.log("Error occurred. " + err.message);
              return process.exit(1);
            }
            console.log("Message sent: %s", info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
          }
        );
    });



  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

module.exports = {
  run
};