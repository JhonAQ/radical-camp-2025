import { databases, storage, APPWRITE } from "./appwrite";
import { Query, ID, type Models } from "appwrite";

const { databaseId, collections, buckets } = APPWRITE;

/* ── Types ─────────────────────────────────────────────────── */
export interface Post extends Models.Document {
  title: string;
  content: string;
  mediaType: "image" | "video" | "gallery" | "text";
  mediaFileIds: string[];
  category: string;
  featured: boolean;
  pinned: boolean;
  likesCount: number;
  commentsCount: number;
  authorName: string;
  authorAvatar: string;
  status: "draft" | "published" | "archived";
  publishedAt: string;
  isStory: boolean;
  storyExpiresAt: string;
}

export interface Comment extends Models.Document {
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
}

export interface Like extends Models.Document {
  postId: string;
  userId: string;
}

/* ── Media URLs ────────────────────────────────────────────── */
export function getMediaUrl(fileId: string): string {
  return `${APPWRITE.endpoint}/storage/buckets/${buckets.socialMedia}/files/${fileId}/view?project=${APPWRITE.projectId}`;
}

export function getMediaPreview(
  fileId: string,
  width = 800,
  height?: number
): string {
  let url = `${APPWRITE.endpoint}/storage/buckets/${buckets.socialMedia}/files/${fileId}/preview?project=${APPWRITE.projectId}&width=${width}`;
  if (height) url += `&height=${height}`;
  url += "&gravity=center&quality=80";
  return url;
}

/* ── Posts ──────────────────────────────────────────────────── */
export async function getPosts(
  category?: string,
  cursor?: string,
  limit = 10
): Promise<{ posts: Post[]; hasMore: boolean; lastId?: string }> {
  const queries: string[] = [
    Query.equal("status", "published"),
    Query.equal("isStory", false),
    Query.orderDesc("pinned"),
    Query.orderDesc("publishedAt"),
    Query.limit(limit + 1),
  ];

  if (category && category !== "Todos") {
    queries.push(Query.equal("category", category));
  }

  if (cursor) {
    queries.push(Query.cursorAfter(cursor));
  }

  const res = await databases.listDocuments(
    databaseId,
    collections.posts,
    queries
  );

  const posts = res.documents as Post[];
  const hasMore = posts.length > limit;
  if (hasMore) posts.pop();

  return {
    posts,
    hasMore,
    lastId: posts[posts.length - 1]?.$id,
  };
}

export async function getPost(postId: string): Promise<Post> {
  return (await databases.getDocument(
    databaseId,
    collections.posts,
    postId
  )) as Post;
}

/* ── Stories ────────────────────────────────────────────────── */
export async function getStories(): Promise<Post[]> {
  const now = new Date().toISOString();

  // Get pinned stories (permanent) + non-expired stories
  const res = await databases.listDocuments(databaseId, collections.posts, [
    Query.equal("status", "published"),
    Query.equal("isStory", true),
    Query.orderDesc("pinned"),
    Query.orderDesc("publishedAt"),
    Query.limit(20),
  ]);

  const stories = res.documents as Post[];

  // Filter: keep pinned ones always, non-pinned only if not expired
  return stories.filter(
    (s) => s.pinned || !s.storyExpiresAt || s.storyExpiresAt > now
  );
}

/* ── Likes ─────────────────────────────────────────────────── */
export async function hasUserLiked(
  postId: string,
  userId: string
): Promise<boolean> {
  try {
    const res = await databases.listDocuments(
      databaseId,
      collections.likes,
      [
        Query.equal("postId", postId),
        Query.equal("userId", userId),
        Query.limit(1),
      ]
    );
    return res.total > 0;
  } catch {
    return false;
  }
}

export async function getUserLikedPostIds(
  userId: string,
  postIds: string[]
): Promise<Set<string>> {
  if (!userId || postIds.length === 0) return new Set();
  try {
    const res = await databases.listDocuments(
      databaseId,
      collections.likes,
      [
        Query.equal("userId", userId),
        Query.equal("postId", postIds),
        Query.limit(100),
      ]
    );
    return new Set((res.documents as Like[]).map((d) => d.postId));
  } catch {
    return new Set();
  }
}

export async function toggleLike(
  postId: string,
  userId: string
): Promise<{ liked: boolean; newCount: number }> {
  // Check if already liked
  const res = await databases.listDocuments(databaseId, collections.likes, [
    Query.equal("postId", postId),
    Query.equal("userId", userId),
    Query.limit(1),
  ]);

  const post = await getPost(postId);
  let newCount = post.likesCount;

  if (res.total > 0) {
    // Unlike
    await databases.deleteDocument(
      databaseId,
      collections.likes,
      res.documents[0].$id
    );
    newCount = Math.max(0, newCount - 1);
    await databases.updateDocument(databaseId, collections.posts, postId, {
      likesCount: newCount,
    });
    return { liked: false, newCount };
  } else {
    // Like
    await databases.createDocument(databaseId, collections.likes, ID.unique(), {
      postId,
      userId,
    });
    newCount += 1;
    await databases.updateDocument(databaseId, collections.posts, postId, {
      likesCount: newCount,
    });
    return { liked: true, newCount };
  }
}

/* ── Comments ──────────────────────────────────────────────── */
export async function getComments(
  postId: string,
  cursor?: string,
  limit = 20
): Promise<{ comments: Comment[]; hasMore: boolean }> {
  const queries: string[] = [
    Query.equal("postId", postId),
    Query.orderDesc("$createdAt"),
    Query.limit(limit + 1),
  ];

  if (cursor) queries.push(Query.cursorAfter(cursor));

  const res = await databases.listDocuments(
    databaseId,
    collections.comments,
    queries
  );

  const comments = res.documents as Comment[];
  const hasMore = comments.length > limit;
  if (hasMore) comments.pop();

  return { comments, hasMore };
}

export async function addComment(
  postId: string,
  userId: string,
  userName: string,
  userAvatar: string,
  content: string
): Promise<Comment> {
  const comment = (await databases.createDocument(
    databaseId,
    collections.comments,
    ID.unique(),
    { postId, userId, userName, userAvatar, content }
  )) as Comment;

  // Increment comment count on post
  const post = await getPost(postId);
  await databases.updateDocument(databaseId, collections.posts, postId, {
    commentsCount: post.commentsCount + 1,
  });

  return comment;
}

export async function deleteComment(
  commentId: string,
  postId: string
): Promise<void> {
  await databases.deleteDocument(databaseId, collections.comments, commentId);

  const post = await getPost(postId);
  await databases.updateDocument(databaseId, collections.posts, postId, {
    commentsCount: Math.max(0, post.commentsCount - 1),
  });
}

/* ── Admin: Create/Update/Delete Posts ─────────────────────── */
export async function createPost(data: {
  title: string;
  content: string;
  mediaType: string;
  mediaFileIds: string[];
  category: string;
  featured?: boolean;
  pinned?: boolean;
  isStory?: boolean;
  authorName: string;
  authorAvatar: string;
}): Promise<Post> {
  const now = new Date();
  const storyExpiry = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  return (await databases.createDocument(
    databaseId,
    collections.posts,
    ID.unique(),
    {
      ...data,
      featured: data.featured ?? false,
      pinned: data.pinned ?? false,
      isStory: data.isStory ?? false,
      storyExpiresAt: data.isStory ? storyExpiry.toISOString() : "",
      likesCount: 0,
      commentsCount: 0,
      status: "published",
      publishedAt: now.toISOString(),
    }
  )) as Post;
}

export async function updatePost(
  postId: string,
  data: Partial<Post>
): Promise<Post> {
  return (await databases.updateDocument(
    databaseId,
    collections.posts,
    postId,
    data
  )) as Post;
}

export async function deletePost(postId: string): Promise<void> {
  // Delete associated likes and comments
  try {
    const likes = await databases.listDocuments(
      databaseId,
      collections.likes,
      [Query.equal("postId", postId), Query.limit(100)]
    );
    await Promise.all(
      likes.documents.map((d) =>
        databases.deleteDocument(databaseId, collections.likes, d.$id)
      )
    );
  } catch {}

  try {
    const comments = await databases.listDocuments(
      databaseId,
      collections.comments,
      [Query.equal("postId", postId), Query.limit(100)]
    );
    await Promise.all(
      comments.documents.map((d) =>
        databases.deleteDocument(databaseId, collections.comments, d.$id)
      )
    );
  } catch {}

  await databases.deleteDocument(databaseId, collections.posts, postId);
}

export async function uploadMedia(file: File): Promise<string> {
  const result = await storage.createFile(
    buckets.socialMedia,
    ID.unique(),
    file
  );
  return result.$id;
}

export async function deleteMedia(fileId: string): Promise<void> {
  await storage.deleteFile(buckets.socialMedia, fileId);
}

/* ── Admin: Get all posts (including drafts) ───────────────── */
export async function getAdminPosts(
  cursor?: string,
  limit = 25
): Promise<{ posts: Post[]; total: number; hasMore: boolean }> {
  const queries: string[] = [
    Query.orderDesc("$createdAt"),
    Query.limit(limit + 1),
  ];
  if (cursor) queries.push(Query.cursorAfter(cursor));

  const res = await databases.listDocuments(
    databaseId,
    collections.posts,
    queries
  );

  const posts = res.documents as Post[];
  const hasMore = posts.length > limit;
  if (hasMore) posts.pop();

  return { posts, total: res.total, hasMore };
}
