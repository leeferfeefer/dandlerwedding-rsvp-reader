const express = require('express');
const router = express.Router();
const { run } = require("../reader");

router.get('/sendemail', async function(req, res) {
  try {

    
    await run();

    res.status(200).end();
  } catch (error) {
    console.log("UNKNOWN ERROR: ", JSON.stringify(error));
    res.status(500);
    res.end();
  }
});

module.exports = router;