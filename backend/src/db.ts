import { MongoClient } from "mongodb";
import { env } from "./env.js";

export const mongoClient = new MongoClient(env.MONGODB_URI);
export const database = mongoClient.db(env.MONGODB_DATABASE);

export async function connectDatabase(): Promise<void> {
  await mongoClient.connect();
  await database.collection("books").createIndex({ title: 1 });
}
