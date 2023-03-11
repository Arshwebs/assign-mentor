const mongodb = require("mongodb");
const dbName = "assign-mentor";
const dbUrl = `mongodb+srv://arsh:welcome123@cluster0.ye06dga.mongodb.net/${dbName}`;
const MongoClient = mongodb.MongoClient;
module.exports = {mongodb, dbName, dbUrl, MongoClient};
