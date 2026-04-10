import { ID, Query, Models } from "appwrite";
import { databases, APPWRITE } from "./appwrite";

const DB_ID = APPWRITE.databaseId;
const WALLETS_COL = APPWRITE.collections.wallets;
const TX_COL = APPWRITE.collections.transactions;

export interface Wallet extends Models.Document {
  userId: string;
  userName: string;
  balance: number;
}

export interface Transaction extends Models.Document {
  userId: string;
  amount: number;
  note: string;
  status: 'pending' | 'approved' | 'rejected';
  txCode: string;
  userName: string;
}

export async function getUserWallet(userId: string, userName: string): Promise<Wallet> {
  try {
    const list = await databases.listDocuments<Wallet>(DB_ID, WALLETS_COL, [
      Query.equal("userId", userId)
    ]);
    if (list.documents.length > 0) {
      return list.documents[0];
    }
    const newWallet = await databases.createDocument<Wallet>(
      DB_ID,
      WALLETS_COL,
      ID.unique(),
      { userId, userName, balance: 0 }
    );
    return newWallet;
  } catch (error) {
    console.error("Error fetching wallet:", error);
    throw error;
  }
}

export async function getTransactions(userId: string): Promise<Transaction[]> {
  try {
    const list = await databases.listDocuments<Transaction>(DB_ID, TX_COL, [
      Query.equal("userId", userId),
      Query.notEqual("status", "rejected"),
      Query.orderDesc("$createdAt"),
      Query.limit(50)
    ]);
    return list.documents;
  } catch (error) {
    console.error("Error fetching tx:", error);
    return [];
  }
}

export async function addTransaction(userId: string, amount: number, note: string): Promise<void> {
  try {
    // Admin directly deposits (we set as approved)
    await databases.createDocument(DB_ID, TX_COL, ID.unique(), {
      userId,
      amount,
      note,
      status: "approved",
      txCode: "",
      userName: "Administrador"
    });

    // Update wallet balance immediately
    const list = await databases.listDocuments<Wallet>(DB_ID, WALLETS_COL, [
        Query.equal("userId", userId)
    ]);
    if (list.documents.length > 0) {
      const wallet = list.documents[0];
      await databases.updateDocument(DB_ID, WALLETS_COL, wallet.$id, {
        balance: wallet.balance + amount
      });
    }
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw error;
  }
}

export async function submitUserDeposit(userId: string, userName: string, amount: number, txCode: string): Promise<void> {
  try {
    await databases.createDocument(DB_ID, TX_COL, ID.unique(), {
      userId,
      amount,
      note: `Depósito Yape: ${txCode}`,
      status: "pending",
      txCode,
      userName
    });
  } catch (error) {
    console.error("Error submitting user deposit:", error);
    throw error;
  }
}

export async function getPendingDeposits(): Promise<Transaction[]> {
  try {
    const list = await databases.listDocuments<Transaction>(DB_ID, TX_COL, [
      Query.equal("status", "pending"),
      Query.orderAsc("$createdAt"),
      Query.limit(100)
    ]);
    return list.documents;
  } catch (error) {
    console.error("Error getting pending deposits:", error);
    return [];
  }
}

export async function approveDeposit(txId: string, userId: string, amount: number): Promise<void> {
  try {
    // Mark as approved
    await databases.updateDocument(DB_ID, TX_COL, txId, {
      status: "approved"
    });

    // Update user wallet
    const list = await databases.listDocuments<Wallet>(DB_ID, WALLETS_COL, [
        Query.equal("userId", userId)
    ]);
    if (list.documents.length > 0) {
      const wallet = list.documents[0];
      await databases.updateDocument(DB_ID, WALLETS_COL, wallet.$id, {
        balance: wallet.balance + amount
      });
    }
  } catch (error) {
    console.error("Error approving deposit:", error);
    throw error;
  }
}

export async function rejectDeposit(txId: string): Promise<void> {
  try {
    // Mark as rejected
    await databases.updateDocument(DB_ID, TX_COL, txId, {
      status: "rejected"
    });
  } catch (error) {
    console.error("Error rejecting deposit:", error);
    throw error;
  }
}

export async function getAllWallets(): Promise<Wallet[]> {
  try {
    const list = await databases.listDocuments<Wallet>(DB_ID, WALLETS_COL, [
      Query.orderDesc("balance"),
      Query.limit(100)
    ]);
    return list.documents;
  } catch (error) {
    console.error("Error getting all wallets:", error);
    return [];
  }
}
