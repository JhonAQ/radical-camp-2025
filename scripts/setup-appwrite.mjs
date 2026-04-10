/**
 * Script de configuración de Appwrite para Muro Radical
 * Crea la base de datos, colecciones, atributos, índices y bucket de storage.
 *
 * Uso: node scripts/setup-appwrite.mjs
 *
 * Requiere: APPWRITE_API_KEY en variable de entorno o pásala como argumento
 *   node scripts/setup-appwrite.mjs YOUR_API_KEY_HERE
 */

import { Client, Databases, Storage, ID, Permission, Role } from "node-appwrite";

const ENDPOINT = "https://nyc.cloud.appwrite.io/v1";
const PROJECT_ID = "69d8b2ac002de5834ff7";
const API_KEY = process.argv[2] || process.env.APPWRITE_API_KEY;

if (!API_KEY) {
  console.error("❌ Necesitas pasar tu Appwrite API Key:");
  console.error("   node scripts/setup-appwrite.mjs YOUR_API_KEY");
  process.exit(1);
}

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

const DB_ID = "social-db";

/* ─── Helpers ──────────────────────────────────────────────── */
async function safeCreate(label, fn) {
  try {
    const result = await fn();
    console.log(`  ✅ ${label} -> creado (${result?.$id || "ok"})`);
    return result;
  } catch (err) {
    if (err.code === 409) {
      console.log(`  ⏭️  ${label} -> ya existe, saltando`);
      return null;
    }
    console.error(`  ❌ ${label} -> error:`, err.message);
    throw err;
  }
}

// Wait a bit between attribute creations to avoid rate limits
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/* ─── 1. Database ──────────────────────────────────────────── */
async function createDatabase() {
  console.log("\n📦 Creando base de datos...");
  await safeCreate("Database: social-db", () =>
    databases.create(DB_ID, "Social DB")
  );
}

/* ─── 2. Collection: posts ─────────────────────────────────── */
async function createPostsCollection() {
  console.log("\n📄 Creando collection: posts...");
  const COL = "posts";

  await safeCreate("Collection: posts", () =>
    databases.createCollection(DB_ID, COL, "Posts", [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ])
  );

  const attrs = [
    () => databases.createStringAttribute(DB_ID, COL, "title", 256, false, ""),
    () => databases.createStringAttribute(DB_ID, COL, "content", 2000, false, ""),
    () => databases.createEnumAttribute(DB_ID, COL, "mediaType", ["image", "video", "gallery", "text"], false, "image"),
    () => databases.createStringAttribute(DB_ID, COL, "mediaFileIds", 512, false, undefined, true),
    () => databases.createEnumAttribute(DB_ID, COL, "category", ["promo", "speaker", "info", "archive", "behind-scenes"], false, "promo"),
    () => databases.createBooleanAttribute(DB_ID, COL, "featured", false, false),
    () => databases.createBooleanAttribute(DB_ID, COL, "pinned", false, false),
    () => databases.createIntegerAttribute(DB_ID, COL, "likesCount", false, 0, 0, 1000000),
    () => databases.createIntegerAttribute(DB_ID, COL, "commentsCount", false, 0, 0, 1000000),
    () => databases.createStringAttribute(DB_ID, COL, "authorName", 128, false, "Radical Camp"),
    () => databases.createStringAttribute(DB_ID, COL, "authorAvatar", 512, false, ""),
    () => databases.createEnumAttribute(DB_ID, COL, "status", ["draft", "published", "archived"], false, "published"),
    () => databases.createDatetimeAttribute(DB_ID, COL, "publishedAt", false),
    () => databases.createBooleanAttribute(DB_ID, COL, "isStory", false, false),
    () => databases.createStringAttribute(DB_ID, COL, "storyExpiresAt", 64, false, ""),
  ];

  for (const attr of attrs) {
    await safeCreate(`Attr: posts.${attr.toString().match(/COL, "(\w+)"/)?.[1] || "?"}`, attr);
    await delay(1500);
  }

  // Indexes
  console.log("  📊 Creando índices para posts...");
  await delay(5000); // Wait for attributes to be ready
  
  await safeCreate("Index: posts.status_published", () =>
    databases.createIndex(DB_ID, COL, "idx_status_published", "key", ["status", "publishedAt"], ["ASC", "DESC"])
  );
  await delay(2000);
  
  await safeCreate("Index: posts.pinned", () =>
    databases.createIndex(DB_ID, COL, "idx_pinned", "key", ["pinned"], ["DESC"])
  );
  await delay(2000);
  
  await safeCreate("Index: posts.isStory", () =>
    databases.createIndex(DB_ID, COL, "idx_isStory", "key", ["isStory", "status"], ["ASC", "ASC"])
  );
  await delay(2000);
  
  await safeCreate("Index: posts.category", () =>
    databases.createIndex(DB_ID, COL, "idx_category", "key", ["category"], ["ASC"])
  );
}

/* ─── 3. Collection: likes ─────────────────────────────────── */
async function createLikesCollection() {
  console.log("\n❤️ Creando collection: likes...");
  const COL = "likes";

  await safeCreate("Collection: likes", () =>
    databases.createCollection(DB_ID, COL, "Likes", [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ])
  );

  await safeCreate("Attr: likes.postId", () =>
    databases.createStringAttribute(DB_ID, COL, "postId", 36, true)
  );
  await delay(1500);

  await safeCreate("Attr: likes.userId", () =>
    databases.createStringAttribute(DB_ID, COL, "userId", 36, true)
  );
  await delay(5000);

  // Unique index
  await safeCreate("Index: likes.unique_post_user", () =>
    databases.createIndex(DB_ID, COL, "idx_unique_like", "unique", ["postId", "userId"], ["ASC", "ASC"])
  );
  await delay(2000);

  await safeCreate("Index: likes.by_user", () =>
    databases.createIndex(DB_ID, COL, "idx_user_likes", "key", ["userId", "postId"], ["ASC", "ASC"])
  );
}

/* ─── 4. Collection: comments ──────────────────────────────── */
async function createCommentsCollection() {
  console.log("\n💬 Creando collection: comments...");
  const COL = "comments";

  await safeCreate("Collection: comments", () =>
    databases.createCollection(DB_ID, COL, "Comments", [
      Permission.read(Role.any()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ])
  );

  const attrs = [
    () => databases.createStringAttribute(DB_ID, COL, "postId", 36, true),
    () => databases.createStringAttribute(DB_ID, COL, "userId", 36, true),
    () => databases.createStringAttribute(DB_ID, COL, "userName", 128, false, ""),
    () => databases.createStringAttribute(DB_ID, COL, "userAvatar", 512, false, ""),
    () => databases.createStringAttribute(DB_ID, COL, "content", 1000, true),
  ];

  for (const attr of attrs) {
    await safeCreate(`Attr: comments.${attr.toString().match(/COL, "(\w+)"/)?.[1] || "?"}`, attr);
    await delay(1500);
  }

  await delay(5000);

  await safeCreate("Index: comments.by_post", () =>
    databases.createIndex(DB_ID, COL, "idx_by_post", "key", ["postId"], ["ASC"])
  );
}

/* ─── 5. Collection: notifications ────────────────────────── */
async function createNotificationsCollection() {
  console.log("\n🔔 Creando collection: notifications...");
  const COL = "notifications";

  await safeCreate("Collection: notifications", () =>
    databases.createCollection(DB_ID, COL, "Notifications", [
      Permission.read(Role.users()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ])
  );

  const attrs = [
    () => databases.createStringAttribute(DB_ID, COL, "userId", 36, true),
    () => databases.createEnumAttribute(DB_ID, COL, "type", ["like", "comment", "new_post"], true),
    () => databases.createStringAttribute(DB_ID, COL, "fromUserName", 128, false, ""),
    () => databases.createStringAttribute(DB_ID, COL, "fromUserAvatar", 512, false, ""),
    () => databases.createStringAttribute(DB_ID, COL, "postId", 36, false, ""),
    () => databases.createStringAttribute(DB_ID, COL, "postTitle", 256, false, ""),
    () => databases.createStringAttribute(DB_ID, COL, "message", 500, false, ""),
    () => databases.createBooleanAttribute(DB_ID, COL, "read", false, false),
  ];

  for (const attr of attrs) {
    await safeCreate(`Attr: notifications.${attr.toString().match(/COL, "(\w+)"/)?.[1] || "?"}`, attr);
    await delay(1500);
  }

  await delay(5000);

  await safeCreate("Index: notifications.by_user", () =>
    databases.createIndex(DB_ID, COL, "idx_by_user", "key", ["userId", "read"], ["ASC", "ASC"])
  );
}

/* ─── 6. Storage Bucket ────────────────────────────────────── */
async function createBucket() {
  console.log("\n📁 Creando bucket: social-media...");
  await safeCreate("Bucket: social-media", () =>
    storage.createBucket(
      "social-media",
      "Social Media",
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ],
      false,  // fileSecurity
      true,   // enabled
      104857600, // 100MB max file size
      ["jpg", "jpeg", "png", "webp", "gif", "mp4", "mov", "webm"],
      "none",  // compression
      false,   // encryption
      false    // antivirus
    )
  );
}

/* ─── Main ─────────────────────────────────────────────────── */
async function main() {
  console.log("🚀 Configuración de Appwrite para Muro Radical");
  console.log(`   Endpoint: ${ENDPOINT}`);
  console.log(`   Project:  ${PROJECT_ID}`);
  console.log(`   DB ID:    ${DB_ID}\n`);

  try {
    await createDatabase();
    await createPostsCollection();
    await createLikesCollection();
    await createCommentsCollection();
    await createNotificationsCollection();
    await createBucket();

    console.log("\n" + "=".repeat(50));
    console.log("🎉 ¡Setup completado con éxito!");
    console.log("=".repeat(50));
    console.log("\nRecursos creados:");
    console.log("  • Database: social-db");
    console.log("  • Collections: posts, likes, comments, notifications");
    console.log("  • Bucket: social-media");
    console.log("\nPuedes empezar a usar el Muro Radical. 🔥");
  } catch (err) {
    console.error("\n💥 Error fatal durante el setup:", err.message);
    process.exit(1);
  }
}

main();
