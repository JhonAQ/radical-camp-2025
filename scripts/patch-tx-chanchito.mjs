
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

async function safeUpdate(label, fn) {
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
  console.log('📦 Actualizando colección transactions...');

  // Update permissions
  try {
    await databases.updateCollection(DB_ID, 'transactions', 'Transactions', [
      Permission.read(Role.users()),
      Permission.create(Role.users()), // Allow users to create their own deposits
      Permission.update(Role.team('admin')),
      Permission.delete(Role.team('admin')),
    ]);
    console.log('✅ Permisos actualizados');
  } catch(e) {
    console.error('Error updating permissions', e.message);
  }

  await new Promise(r => setTimeout(r, 1000));
  await safeUpdate('Attr: tx.status', () => databases.createStringAttribute(DB_ID, 'transactions', 'status', 20, false, 'approved'));
  
  await new Promise(r => setTimeout(r, 1000));
  await safeUpdate('Attr: tx.txCode', () => databases.createStringAttribute(DB_ID, 'transactions', 'txCode', 20, false, ''));
  
  await new Promise(r => setTimeout(r, 1000));
  await safeUpdate('Attr: tx.userName', () => databases.createStringAttribute(DB_ID, 'transactions', 'userName', 128, false, 'Usuario'));

  console.log('✅ Finalizado');
}
main();

