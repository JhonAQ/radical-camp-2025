import { Client, Account, Databases } from "appwrite";

const client = new Client()
    .setEndpoint("https://nyc.cloud.appwrite.io/v1")
    .setProject("69d8b2ac002de5834ff7");

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases };
