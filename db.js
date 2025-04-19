const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectId;


let database;

async function getDatabase() {
  const client = await MongoClient.connect("mongodb://127.0.0.1:27017");
  database = client.db("Library");

  if (!database) {
    console.log("Database Not Connected..!");
  }
  return database;
}

module.exports = { getDatabase, ObjectID };
