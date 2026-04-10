import { Client, Account, Databases, Storage, Teams } from "appwrite";

const client = new Client()
    .setEndpoint("https://nyc.cloud.appwrite.io/v1")
    .setProject("69d8b2ac002de5834ff7");

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);
const teams = new Teams(client);

/* ── Appwrite Resource IDs ─────────────────────────────────── */
export const APPWRITE = {
  endpoint: "https://nyc.cloud.appwrite.io/v1",
  projectId: "69d8b2ac002de5834ff7",
  databaseId: "social-db",
  collections: {
    posts: "posts",
    comments: "comments",
    likes: "likes",
    notifications: "notifications",
    wallets: "wallets",
    transactions: "transactions",
  },
  buckets: {
    socialMedia: "social-media",
  },
  teams: {
    admin: "admin",
  },
} as const;

export { client, account, databases, storage, teams };
