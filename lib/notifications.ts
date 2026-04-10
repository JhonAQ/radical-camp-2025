import { databases, APPWRITE } from "./appwrite";
import { Query, ID, type Models } from "appwrite";

const { databaseId, collections } = APPWRITE;

/* ── Types ─────────────────────────────────────────────────── */
export interface Notification extends Models.Document {
  userId: string;
  type: "like" | "comment" | "new_post";
  fromUserName: string;
  fromUserAvatar: string;
  postId: string;
  postTitle: string;
  message: string;
  read: boolean;
}

/* ── Get Notifications for a User ──────────────────────────── */
export async function getNotifications(
  userId: string,
  cursor?: string,
  limit = 20
): Promise<{ notifications: Notification[]; hasMore: boolean }> {
  const queries: string[] = [
    Query.equal("userId", userId),
    Query.orderDesc("$createdAt"),
    Query.limit(limit + 1),
  ];
  if (cursor) queries.push(Query.cursorAfter(cursor));

  const res = await databases.listDocuments(
    databaseId,
    collections.notifications,
    queries
  );

  const notifications = res.documents as unknown as Notification[];
  const hasMore = notifications.length > limit;
  if (hasMore) notifications.pop();

  return { notifications, hasMore };
}

/* ── Unread Count ──────────────────────────────────────────── */
export async function getUnreadCount(userId: string): Promise<number> {
  try {
    const res = await databases.listDocuments(
      databaseId,
      collections.notifications,
      [
        Query.equal("userId", userId),
        Query.equal("read", false),
        Query.limit(1),
      ]
    );
    return res.total;
  } catch {
    return 0;
  }
}

/* ── Mark as Read ──────────────────────────────────────────── */
export async function markAsRead(notificationId: string): Promise<void> {
  await databases.updateDocument(
    databaseId,
    collections.notifications,
    notificationId,
    { read: true }
  );
}

export async function markAllAsRead(userId: string): Promise<void> {
  try {
    const res = await databases.listDocuments(
      databaseId,
      collections.notifications,
      [
        Query.equal("userId", userId),
        Query.equal("read", false),
        Query.limit(100),
      ]
    );
    await Promise.all(
      res.documents.map((d) =>
        databases.updateDocument(
          databaseId,
          collections.notifications,
          d.$id,
          { read: true }
        )
      )
    );
  } catch {}
}

/* ── Create Notification ───────────────────────────────────── */
export async function createNotification(data: {
  userId: string;
  type: "like" | "comment" | "new_post";
  fromUserName: string;
  fromUserAvatar: string;
  postId: string;
  postTitle: string;
  message: string;
}): Promise<void> {
  // Don't notify yourself
  if (!data.userId) return;

  try {
    await databases.createDocument(
      databaseId,
      collections.notifications,
      ID.unique(),
      { ...data, read: false }
    );
  } catch (e) {
    console.error("Failed to create notification:", e);
  }
}
