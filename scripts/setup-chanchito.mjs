import { Client, Databases, Permission, Role } from 'node-appwrite';

const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '69d8b2ac002de5834ff7';
const API_KEY = process.argv[2];
const DB_ID = 'social-db';

if (!API_KEY) {
  console.error('API KEY NO PROPORCIONADA');
  process.exit(1);
}

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const databases = new Databases(client);

async function safeCreate(label, fn) {
  try {
    const result = await fn();
    console.log('✅ ' + label + ' -> ok');
    return result;
  } catch (err) {
    if (err.code === 409) {
      console.log('⏭️ ' + label + ' -> ya existe');
      return null;
    }
    console.error('❌ ' + label + ' -> error: ' + err.message);
    throw err;
  }
}

async function main() {
  console.log('📦 Configurando colecciones de Chanchito...');

  // 1. Wallets
  await safeCreate('Collection: wallets', () =>
    databases.createCollection(DB_ID, 'wallets', 'Wallets', [
      Permission.read(Role.users()),
      Permission.create(Role.users()),
      Permission.update(Role.team('admin')),
      Permission.delete(Role.team('admin')),
    ])
  );
  await new Promise(r => setTimeout(r, 1000));
  await safeCreate('Attr: wallets.userId', () => databases.createStringAttribute(DB_ID, 'wallets', 'userId', 64, true));
  await new Promise(r => setTimeout(r, 1000));
  await safeCreate('Attr: wallets.userName', () => databases.createStringAttribute(DB_ID, 'wallets', 'userName', 128, false, 'Usuario'));
  await new Promise(r => setTimeout(r, 1000));
  await safeCreate('Attr: wallets.balance', () => databases.createIntegerAttribute(DB_ID, 'wallets', 'balance', false, 0));
  await new Promise(r => setTimeout(r, 1000));
  await safeCreate('Idx: wallets.userId_idx', () => databases.createIndex(DB_ID, 'wallets', 'userId_idx', 'unique', ['userId']));

  // 2. Transactions
  await safeCreate('Collection: transactions', () =>
    databases.createCollection(DB_ID, 'transactions', 'Transactions', [
      Permission.read(Role.users()),
      Permission.create(Role.team('admin')),
      Permission.update(Role.team('admin')),
      Permission.delete(Role.team('admin')),
    ])
  );
  await new Promise(r => setTimeout(r, 1000));
  await safeCreate('Attr: tx.userId', () => databases.createStringAttribute(DB_ID, 'transactions', 'userId', 64, true));
  await new Promise(r => setTimeout(r, 1000));
  await safeCreate('Attr: tx.amount', () => databases.createIntegerAttribute(DB_ID, 'transactions', 'amount', true));
  await new Promise(r => setTimeout(r, 1000));
  await safeCreate('Attr: tx.note', () => databases.createStringAttribute(DB_ID, 'transactions', 'note', 256, false, ''));
  await new Promise(r => setTimeout(r, 1000));
  await safeCreate('Idx: tx.userId_idx', () => databases.createIndex(DB_ID, 'transactions', 'userId_idx', 'key', ['userId']));

  console.log('✅ Finalizado');
}
main();
