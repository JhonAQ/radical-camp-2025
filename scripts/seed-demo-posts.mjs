/**
 * Script para crear posts de demostración en la base de datos.
 * Crea posts de texto (que no necesitan subir archivos al storage).
 *
 * Uso: node scripts/seed-demo-posts.mjs YOUR_API_KEY
 */

import { Client, Databases, ID, Permission, Role } from "node-appwrite";

const ENDPOINT = "https://nyc.cloud.appwrite.io/v1";
const PROJECT_ID = "69d8b2ac002de5834ff7";
const API_KEY = process.argv[2] || process.env.APPWRITE_API_KEY;

if (!API_KEY) {
  console.error("❌ Necesitas pasar tu Appwrite API Key:");
  console.error("   node scripts/seed-demo-posts.mjs YOUR_API_KEY");
  process.exit(1);
}

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);

const DB_ID = "social-db";
const POSTS_COL = "posts";

const demoPosts = [
  {
    title: "¡Bienvenidos al Muro Radical! 🔥",
    content: "Este es el espacio oficial de la comunidad Radical Camp. Aquí encontrarás las últimas novedades, promos exclusivas y contenido detrás de cámaras. ¡Conecta, comparte y sé parte de algo radical!",
    mediaType: "text",
    mediaFileIds: [],
    category: "info",
    featured: true,
    pinned: true,
    isStory: false,
    storyExpiresAt: "",
    likesCount: 12,
    commentsCount: 3,
    authorName: "Radical Camp",
    authorAvatar: "",
    status: "published",
    publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
  },
  {
    title: "Confirmado: Speaker invitado especial 🎤",
    content: "Estamos emocionados de anunciar a nuestro speaker principal para Radical Camp 2025-2026. ¡Prepárate para una experiencia que transformará tu vida! Más detalles próximamente...",
    mediaType: "text",
    mediaFileIds: [],
    category: "speaker",
    featured: false,
    pinned: false,
    isStory: false,
    storyExpiresAt: "",
    likesCount: 24,
    commentsCount: 7,
    authorName: "Equipo Radical",
    authorAvatar: "",
    status: "published",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    title: "🎫 Promo Early Bird: ¡Últimos cupos!",
    content: "¡Aprovecha la promo de inscripción anticipada! Solo quedan pocas plazas con el precio especial. No te quedes fuera del evento más radical del año. Inscríbete ahora en la sección de registro.",
    mediaType: "text",
    mediaFileIds: [],
    category: "promo",
    featured: true,
    pinned: false,
    isStory: false,
    storyExpiresAt: "",
    likesCount: 45,
    commentsCount: 15,
    authorName: "Radical Camp",
    authorAvatar: "",
    status: "published",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
  {
    title: "Preparando todo para una experiencia inolvidable",
    content: "El equipo de logística ya está trabajando en cada detalle. Desde las actividades hasta las dinámicas nocturnas, cada momento está diseñado para impactar tu vida. ¡Campel Arequipa nos espera! 🏕️⛰️",
    mediaType: "text",
    mediaFileIds: [],
    category: "behind-scenes",
    featured: false,
    pinned: false,
    isStory: false,
    storyExpiresAt: "",
    likesCount: 18,
    commentsCount: 4,
    authorName: "Equipo Logística",
    authorAvatar: "",
    status: "published",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
  },
  {
    title: "📋 Info importante: Qué llevar al camp",
    content: "Lista de elementos esenciales: Ropa abrigada, sleeping bag, artículos de higiene personal, Biblia, cuaderno y lapicero, ropa para actividades al aire libre, protector solar y repelente. ¡No olvides tu actitud radical! 💪",
    mediaType: "text",
    mediaFileIds: [],
    category: "info",
    featured: false,
    pinned: false,
    isStory: false,
    storyExpiresAt: "",
    likesCount: 32,
    commentsCount: 8,
    authorName: "Radical Camp",
    authorAvatar: "",
    status: "published",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    title: "Throwback: Radical Camp 2024 🔙",
    content: "¿Recuerdas esos momentos increíbles del año pasado? Las fogatas, las dinámicas, los devocionales al amanecer... Este año será aún mejor. ¡La cuenta regresiva ya comenzó!",
    mediaType: "text",
    mediaFileIds: [],
    category: "archive",
    featured: false,
    pinned: false,
    isStory: false,
    storyExpiresAt: "",
    likesCount: 56,
    commentsCount: 12,
    authorName: "Radical Camp",
    authorAvatar: "",
    status: "published",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
];

async function main() {
  console.log("🌱 Creando posts de demostración...\n");

  for (const post of demoPosts) {
    try {
      const result = await databases.createDocument(
        DB_ID,
        POSTS_COL,
        ID.unique(),
        post,
        [
          Permission.read(Role.any()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ]
      );
      console.log(`  ✅ "${post.title.slice(0, 40)}..." -> ${result.$id}`);
    } catch (err) {
      console.error(`  ❌ "${post.title.slice(0, 40)}..." -> ${err.message}`);
    }
  }

  // Create a couple of stories
  console.log("\n📸 Creando stories de demostración...\n");

  const stories = [
    {
      title: "Nuevo 🔥",
      content: "¡Este año Radical Camp viene con todo! Prepárate para la mejor experiencia de tu vida.",
      mediaType: "text",
      mediaFileIds: [],
      category: "promo",
      featured: true,
      pinned: true,
      isStory: true,
      storyExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      likesCount: 5,
      commentsCount: 0,
      authorName: "Radical Camp",
      authorAvatar: "",
      status: "published",
      publishedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
    {
      title: "BTS ✨",
      content: "!El equipo preparando todo para que vivas algo único este verano!",
      mediaType: "text",
      mediaFileIds: [],
      category: "behind-scenes",
      featured: false,
      pinned: true,
      isStory: true,
      storyExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      likesCount: 3,
      commentsCount: 0,
      authorName: "Equipo",
      authorAvatar: "",
      status: "published",
      publishedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      title: "Cupos 🎫",
      content: "¡Quedan pocos cupos para el camp! Asegura tu lugar ahora.",
      mediaType: "text",
      mediaFileIds: [],
      category: "promo",
      featured: false,
      pinned: false,
      isStory: true,
      storyExpiresAt: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
      likesCount: 8,
      commentsCount: 0,
      authorName: "Radical Camp",
      authorAvatar: "",
      status: "published",
      publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
  ];

  for (const story of stories) {
    try {
      const result = await databases.createDocument(
        DB_ID,
        POSTS_COL,
        ID.unique(),
        story,
        [
          Permission.read(Role.any()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ]
      );
      console.log(`  ✅ Story: "${story.title}" -> ${result.$id}`);
    } catch (err) {
      console.error(`  ❌ Story: "${story.title}" -> ${err.message}`);
    }
  }

  console.log("\n🎉 ¡Seed completado!");
}

main();
