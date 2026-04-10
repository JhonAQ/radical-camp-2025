// ============================================================
// Appwrite Backend Setup Script for Radical Camp Social Feed
// 
// Run: npx tsx scripts/setup-appwrite.mjs
// 
// Required: Set APPWRITE_API_KEY environment variable first:
//   $env:APPWRITE_API_KEY = "your-api-key-here"
//   npx tsx scripts/setup-appwrite.mjs
// ============================================================

import { Client, Databases, Storage, Teams } from "node-appwrite";

const ENDPOINT = "https://nyc.cloud.appwrite.io/v1";
const PROJECT_ID = "69d8b2ac002de5834ff7";
const API_KEY = process.env.APPWRITE_API_KEY;

if (!API_KEY) {
  console.error("❌ Set APPWRITE_API_KEY environment variable first!");
  console.error('   $env:APPWRITE_API_KEY = "your-key"');
  process.exit(1);
}

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);
const teams = new Teams(client);

const DB_ID = "social-db";

async function main() {
  console.log("🚀 Setting up Appwrite backend for Radical Camp Social...\n");

  // ── 1. Create Database ──────────────────────────────────
  try {
    await databases.create(DB_ID, "Radical Social");
    console.log("✅ Database 'social-db' created");
  } catch (e) {
    if (e.code === 409) console.log("⏭️  Database 'social-db' already exists");
    else throw e;
  }

  // ── 2. Create Posts Collection ──────────────────────────
  try {
    await databases.createCollection(DB_ID, "posts", "Posts", [
      'read("any")',
      'create("team:admin")',
      'update("team:admin")',
      'delete("team:admin")',
    ]);
    console.log("✅ Collection 'posts' created");
  } catch (e) {
    if (e.code === 409) console.log("⏭️  Collection 'posts' already exists");
    else throw e;
  }

  // Posts attributes
  const postsAttrs = [
    () => databases.createStringAttribute(DB_ID, "posts", "title", 256, false, ""),
    () => databases.createStringAttribute(DB_ID, "posts", "content", 2000, false, ""),
    () => databases.createEnumAttribute(DB_ID, "posts", "mediaType", ["image", "video", "gallery", "text"], false, "image"),
    () => databases.createStringAttribute(DB_ID, "posts", "mediaFileIds", 256, false, undefined, true),
    () => databases.createEnumAttribute(DB_ID, "posts", "category", ["promo", "speaker", "info", "archive", "behind-scenes"], false, "info"),
    () => databases.createBooleanAttribute(DB_ID, "posts", "featured", false, false),
    () => databases.createBooleanAttribute(DB_ID, "posts", "pinned", false, false),
    () => databases.createIntegerAttribute(DB_ID, "posts", "likesCount", false, 0, 0, 999999),
    () => databases.createIntegerAttribute(DB_ID, "posts", "commentsCount", false, 0, 0, 999999),
    () => databases.createStringAttribute(DB_ID, "posts", "authorName", 128, false, "Radical Camp"),
    () => databases.createStringAttribute(DB_ID, "posts", "authorAvatar", 512, false, ""),
    () => databases.createEnumAttribute(DB_ID, "posts", "status", ["draft", "published", "archived"], false, "published"),
    () => databases.createDatetimeAttribute(DB_ID, "posts", "publishedAt", false),
    () => databases.createBooleanAttribute(DB_ID, "posts", "isStory", false, false),
    () => databases.createStringAttribute(DB_ID, "posts", "storyExpiresAt", 64, false, ""),
  ];

  for (const createAttr of postsAttrs) {
    try {
      await createAttr();
    } catch (e) {
      if (e.code !== 409) console.warn("  ⚠️ Attr error:", e.message);
    }
  }
  console.log("  📝 Posts attributes configured");

  // Posts indexes
  try {
    await databases.createIndex(DB_ID, "posts", "idx_status_published", "key", ["status", "publishedAt"], ["asc", "desc"]);
  } catch (e) { if (e.code !== 409) console.warn("  ⚠️ Index error:", e.message); }
  try {
    await databases.createIndex(DB_ID, "posts", "idx_story", "key", ["isStory", "pinned", "publishedAt"], ["asc", "desc", "desc"]);
  } catch (e) { if (e.code !== 409) console.warn("  ⚠️ Index error:", e.message); }
  try {
    await databases.createIndex(DB_ID, "posts", "idx_category", "key", ["category", "status"], ["asc", "asc"]);
  } catch (e) { if (e.code !== 409) console.warn("  ⚠️ Index error:", e.message); }
  console.log("  📊 Posts indexes configured");

  // ── 3. Create Likes Collection ─────────────────────────
  try {
    await databases.createCollection(DB_ID, "likes", "Likes", [
      'read("any")',
      'create("users")',
      'delete("users")',
    ]);
    console.log("✅ Collection 'likes' created");
  } catch (e) {
    if (e.code === 409) console.log("⏭️  Collection 'likes' already exists");
    else throw e;
  }

  try {
    await databases.createStringAttribute(DB_ID, "likes", "postId", 36, true);
    await databases.createStringAttribute(DB_ID, "likes", "userId", 36, true);
  } catch (e) {
    if (e.code !== 409) console.warn("  ⚠️ Attr error:", e.message);
  }

  try {
    await databases.createIndex(DB_ID, "likes", "idx_post_user", "unique", ["postId", "userId"], ["asc", "asc"]);
  } catch (e) { if (e.code !== 409) console.warn("  ⚠️ Index error:", e.message); }
  try {
    await databases.createIndex(DB_ID, "likes", "idx_user", "key", ["userId"], ["asc"]);
  } catch (e) { if (e.code !== 409) console.warn("  ⚠️ Index error:", e.message); }
  console.log("  📊 Likes indexes configured");

  // ── 4. Create Comments Collection ──────────────────────
  try {
    await databases.createCollection(DB_ID, "comments", "Comments", [
      'read("any")',
      'create("users")',
      'update("users")',
      'delete("users")',
    ]);
    console.log("✅ Collection 'comments' created");
  } catch (e) {
    if (e.code === 409) console.log("⏭️  Collection 'comments' already exists");
    else throw e;
  }

  const commentsAttrs = [
    () => databases.createStringAttribute(DB_ID, "comments", "postId", 36, true),
    () => databases.createStringAttribute(DB_ID, "comments", "userId", 36, true),
    () => databases.createStringAttribute(DB_ID, "comments", "userName", 128, true),
    () => databases.createStringAttribute(DB_ID, "comments", "userAvatar", 512, false, ""),
    () => databases.createStringAttribute(DB_ID, "comments", "content", 1000, true),
  ];

  for (const createAttr of commentsAttrs) {
    try {
      await createAttr();
    } catch (e) {
      if (e.code !== 409) console.warn("  ⚠️ Attr error:", e.message);
    }
  }

  try {
    await databases.createIndex(DB_ID, "comments", "idx_post", "key", ["postId"], ["asc"]);
  } catch (e) { if (e.code !== 409) console.warn("  ⚠️ Index error:", e.message); }
  console.log("  📊 Comments indexes configured");

  // ── 5. Create Notifications Collection ─────────────────
  try {
    await databases.createCollection(DB_ID, "notifications", "Notifications", [
      'read("users")',
      'create("users")',
      'update("users")',
      'delete("users")',
    ]);
    console.log("✅ Collection 'notifications' created");
  } catch (e) {
    if (e.code === 409) console.log("⏭️  Collection 'notifications' already exists");
    else throw e;
  }

  const notifAttrs = [
    () => databases.createStringAttribute(DB_ID, "notifications", "userId", 36, true),
    () => databases.createEnumAttribute(DB_ID, "notifications", "type", ["like", "comment", "new_post"], true),
    () => databases.createStringAttribute(DB_ID, "notifications", "fromUserName", 128, true),
    () => databases.createStringAttribute(DB_ID, "notifications", "fromUserAvatar", 512, false, ""),
    () => databases.createStringAttribute(DB_ID, "notifications", "postId", 36, false, ""),
    () => databases.createStringAttribute(DB_ID, "notifications", "postTitle", 256, false, ""),
    () => databases.createStringAttribute(DB_ID, "notifications", "message", 512, true),
    () => databases.createBooleanAttribute(DB_ID, "notifications", "read", false, false),
  ];

  for (const createAttr of notifAttrs) {
    try {
      await createAttr();
    } catch (e) {
      if (e.code !== 409) console.warn("  ⚠️ Attr error:", e.message);
    }
  }

  try {
    await databases.createIndex(DB_ID, "notifications", "idx_user_read", "key", ["userId", "read"], ["asc", "asc"]);
  } catch (e) { if (e.code !== 409) console.warn("  ⚠️ Index error:", e.message); }
  try {
    await databases.createIndex(DB_ID, "notifications", "idx_user_created", "key", ["userId", "$createdAt"], ["asc", "desc"]);
  } catch (e) { if (e.code !== 409) console.warn("  ⚠️ Index error:", e.message); }
  console.log("  📊 Notifications indexes configured");

  // ── 6. Create Storage Bucket ───────────────────────────
  try {
    await storage.createBucket(
      "social-media",
      "Social Media",
      [
        'read("any")',
        'create("team:admin")',
        'update("team:admin")',
        'delete("team:admin")',
      ],
      false, // fileSecurity
      true,  // enabled
      104857600, // 100MB max
      ["jpg", "jpeg", "png", "webp", "gif", "mp4", "mov", "webm"],
      "gzip",
      false, // encryption
      false  // antivirus
    );
    console.log("✅ Storage bucket 'social-media' created");
  } catch (e) {
    if (e.code === 409) console.log("⏭️  Bucket 'social-media' already exists");
    else throw e;
  }

  // ── 7. Create Admin Team ───────────────────────────────
  try {
    await teams.create("admin", "Admin");
    console.log("✅ Team 'admin' created");
  } catch (e) {
    if (e.code === 409) console.log("⏭️  Team 'admin' already exists");
    else throw e;
  }

  console.log("\n🎉 Setup complete! Now add yourself to the 'admin' team via Appwrite console.");
  console.log("   Go to: https://cloud.appwrite.io > Your Project > Auth > Teams > admin > Add Member");
}

main().catch((err) => {
  console.error("\n❌ Setup failed:", err);
  process.exit(1);
});
