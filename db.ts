import { MongoClient, Db, Collection } from "mongodb";

const MONGO_URI = process.env.MONGO_URI!;
const DB_NAME = "mp-5";
export const URLS_COLLECTION = "url-collection";

if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
}

// Global type declaration to avoid multiple clients in dev
declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// ✅ Use global caching for hot reload stability (Next.js friendly)
if (!global._mongoClientPromise) {
    client = new MongoClient(MONGO_URI);
    global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function getCollection(name: string): Promise<Collection> {
    const client = await clientPromise;
    const db: Db = client.db(DB_NAME);
    return db.collection(name);
}
