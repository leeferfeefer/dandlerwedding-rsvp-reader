const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const api = require('./routes/api.js');

const app = express();

// dev = :method :url :status :response-time ms - :res[content-length]

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());
app.use(cors());
app.use('/api', api);


// built-in error handling
// NOTE: must be the last piece of middleware in stack
//https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Introduction
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.set("port", process.env.PORT || 3001);
app.set("host", process.env.HOST || "localhost");

app.listen(app.get("port"), function() {
  console.log(
   "%s db reader listening at http://%s:%s",
    process.env.NODE_ENV,
   app.get("host"),
   app.get("port")
  );
});