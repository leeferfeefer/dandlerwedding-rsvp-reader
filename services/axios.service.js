const axios = require("axios");
require('dotenv').config();


const mongoInstance = axios.create({
  baseURL: 'https://eastus2.azure.data.mongodb-api.com/app/dandlerwedding-tlicw',
  timeout: 10000,
  headers: {
    "api-key": `${ process.env.API_KEY }`,
    "Content-Type": "application/json",
    "Accept": "application/json",
  }
});

module.exports = {
  mongoInstance,
};