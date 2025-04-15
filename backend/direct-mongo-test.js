// direct-mongo-test.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const mongoURI = process.env.MONGO_URI;

async function testDirectConnection() {
  const client = new MongoClient(mongoURI);
  
  try {
    await client.connect();
    console.log("Connected to MongoDB directly!");
    
    // List all collections
    const db = client.db(); // This gets the default database from your connection string
    const collections = await db.listCollections().toArray();
    console.log("\nCollections in database:");
    collections.forEach(coll => console.log(`- ${coll.name}`));
    
    // List indexes on each collection
    console.log("\nIndexes by collection:");
    for (const coll of collections) {
      const indexes = await db.collection(coll.name).indexes();
      console.log(`\n${coll.name} indexes:`);
      console.log(indexes);
    }
    
    // Count documents in each collection
    console.log("\nDocument counts:");
    for (const coll of collections) {
      const count = await db.collection(coll.name).countDocuments();
      console.log(`${coll.name}: ${count} documents`);
    }
    
  } catch (err) {
    console.error("Error testing MongoDB:", err);
  } finally {
    await client.close();
  }
}

testDirectConnection();