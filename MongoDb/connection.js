const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017/zadatak1";

const database = "vjezba1";

let connection = null;
async function createConnection() {
  if (connection == null) {
    connection = new MongoClient(url);
    await connection.connect();
    console.log("Connected.");
  }
  return connection;
}

let cachedDb;
async function connectDb() {
  const client = await createConnection();
  if (!cachedDb) {
    cachedDb = client.db(database);
    console.log("Connected to " + database + " database.\n");
  }
  return cachedDb;
}

async function closeConnection() {
  if (connection) {
    await connection.close();
    console.log("\nConnection closed!");
    connection = null;
  } else {
    console.log("\nNo connection to close");
  }
}

module.exports = { createConnection, closeConnection, connectDb };
