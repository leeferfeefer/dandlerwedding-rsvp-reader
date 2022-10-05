const express = require('express');
const router = express.Router();
require('dotenv').config()
const AxiosService = require("../services/axios.service");
const { writeCSV } = require("../services/csvwriter.service");
const { sendEmail } = require("../services/emailer.service");

router.get('/sendemail', async function(req, res) {
  try {
    const response = await AxiosService.mongoInstance.get("/endpoint/getRSVPs");
    console.log("response: ", response.data);
    const rsvps = response.data;
    const csvData = writeCSV(rsvps);
    sendEmail(csvData);
    res.status(200).end();
  } catch (error) {
    console.log("UNKNOWN ERROR: ", JSON.stringify(error));
    res.status(500);
    res.end();
  }
});

module.exports = router;