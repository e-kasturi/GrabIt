
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI as string;
console.log(uri);

export const client = new MongoClient(uri)

export const database = client.db("grabit")