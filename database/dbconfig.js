const mongoose = require('mongoose');

function connectToDatabase(){
    const dbUrl = "mongodb://localhost:27017";
    mongoose.connect(dbUrl)
    .then((response) => console.log("Database connected successfully"))
        .catch((err) => console.log(err));
}
module.exports = {
    connectToDatabase
}