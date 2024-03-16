const express = require('express');

const { connectToDatabase }= require('./database/dbconfig');

const CORS = require('cors');

const HTTP_SERVER = express();


HTTP_SERVER.use(express.urlencoded({ extended: true }));
HTTP_SERVER.use(express.json({ extended: true }))


var whitelist = [
  "http://127.0.0.1:5500",
  undefined,
  "https://gmail-clone-backend-o2y5.onrender.com/",

];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

//enabling cors
HTTP_SERVER.use(CORS(corsOptions));

//configuring dotenv package
require("dotenv").config();

//connecting with mongodb database
connectToDatabase();


// Defining A Port and listening to port with express server
const PORT = process.env.DEV_SERVER_PORT;
HTTP_SERVER.listen(PORT, process.env.NODE_HOSTNAME, () => {
    console.log("Server started successfully" + PORT);
});

//enabling routes
HTTP_SERVER.use("/", require('./routes/route'));


