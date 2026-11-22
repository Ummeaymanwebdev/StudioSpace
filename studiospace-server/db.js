
import { MongoClient } from "mongodb";

let client;
let db;
let connectionPromise;

export async function getDb() {
  if (db) return db;

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }

  if (!connectionPromise) {
    client = new MongoClient(process.env.MONGODB_URI);

    connectionPromise = client
      .connect()
      .then(() => {
        db = client.db("studiospace");
        return db;
      })
      .catch(async (error) => {
        await client.close().catch(() => {});
        client = undefined;
        connectionPromise = undefined;
        throw error;
      });
  }

  return connectionPromise;
}
