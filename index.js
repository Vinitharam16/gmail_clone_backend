const express = require('express');

const { connectToDatabase }= require('./database/dbconfig');

const CORS = require('cors');

const HTTP_SERVER = express();


HTTP_SERVER.use(express.urlencoded({ extended: true }));
HTTP_SERVER.use(express.json({ extended: true }))



//enabling cors
HTTP_SERVER.use(CORS());

//configuring dotenv package
require("dotenv").config();

//connecting with mongodb database
connectToDatabase();


// Defining A Port and listening to port with express server
const PORT = process.env.DEV_SERVER_PORT;
HTTP_SERVER.listen(PORT, process.env.NODE_HOSTNAME, () => {
    console.log(`Server started successfully ${PORT}`);
});

//enabling routes
HTTP_SERVER.use("/", require('./routes/route'));
HTTP_SERVER.use('/auth', require('./routes/Authrouter'));


