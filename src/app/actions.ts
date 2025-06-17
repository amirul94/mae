"use server";

import { db, FieldValue } from '@/lib/firebase';
import { getFinancialTips as getFinancialTipsFromAI } from '@/ai/flows/financial-tips';
import type { User } from 'firebase/auth';

export interface Transaction {
  id: string;
  type: 'incoming' | 'outgoing';
  amount: number;
  description: string;
  timestamp: any; // Firebase Timestamp or Date
  recipient?: string | null;
}

export interface UserData {
  name: string;
  email: string | null;
  balance: number;
  transactions: Transaction[];
}

export async function fetchUserDataAction(userId: string): Promise<UserData | null> {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return null;
    }
    const userData = userDoc.data() as Omit<UserData, 'transactions'>;

    const transactionsSnapshot = await db.collection('users').doc(userId)
      .collection('transactions')
      .orderBy('timestamp', 'desc')
      .limit(5)
      .get();
    
    const transactions = transactionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate ? doc.data().timestamp.toDate().toISOString() : new Date().toISOString(), // Convert to ISO string for serialization
    })) as Transaction[];

    return { ...userData, transactions };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error("Failed to fetch user data.");
  }
}

export async function addTransactionAction(
  userId: string,
  type: 'incoming' | 'outgoing',
  amount: number,
  description: string,
  recipient: string | null = null
): Promise<{ success: boolean; newBalance?: number; error?: string }> {
  if (!userId) return { success: false, error: "User not authenticated." };

  const amountNum = Number(amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    return { success: false, error: "Invalid amount." };
  }

  try {
    const userRef = db.collection('users').doc(userId);
    
    // Use a transaction to ensure atomicity
    return db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        throw new Error("User document does not exist.");
      }
      
      let currentBalance = userDoc.data()?.balance || 0;
      const balanceChange = type === 'incoming' ? amountNum : -amountNum;
      const newBalance = currentBalance + balanceChange;

      if (type === 'outgoing' && newBalance < 0) {
        throw new Error("Insufficient funds.");
      }

      transaction.update(userRef, { balance: newBalance });

      const newTransactionRef = userRef.collection('transactions').doc();
      transaction.set(newTransactionRef, {
        type,
        amount: amountNum,
        description,
        recipient,
        timestamp: FieldValue.serverTimestamp(),
      });
      
      return { success: true, newBalance };
    });

  } catch (error: any) {
    console.error("Error adding transaction:", error);
    return { success: false, error: error.message || "Failed to add transaction." };
  }
}


export async function getFinancialTipAction(transactions: Transaction[]): Promise<string | null> {
  if (!transactions || transactions.length === 0) {
    return "Start making some transactions to receive personalized financial tips!";
  }

  const transactionHistorySummary = transactions
    .slice(0, 10) // Use recent transactions for the summary
    .map(t => `${t.type === 'outgoing' ? 'Spent' : 'Received'} $${t.amount.toFixed(2)} for ${t.description} on ${new Date(t.timestamp).toLocaleDateString()}`)
    .join('\n');

  try {
    const result = await getFinancialTipsFromAI({ transactionHistory: transactionHistorySummary });
    return result.financialTip;
  } catch (error) {
    console.error("Error getting financial tip:", error);
    return "Could not fetch financial tip at this time. Please try again later.";
  }
}

export async function updateFirebaseUserProfile(userId: string, displayName: string): Promise<{success: boolean; error?: string}> {
   if (!userId) return { success: false, error: "User not authenticated." };
   try {
    // Note: This updates Firebase Auth profile, not Firestore directly.
    // For Firestore, you'd update the user document separately if needed.
    // The auth object is not directly available in server actions.
    // This action might be better performed client-side after auth.currentUser.updateProfile
    // or by using Firebase Admin SDK if running in a trusted server environment (not a simple server action).
    // For this context, we'll assume this would be part of a larger backend process or client-side call.
    // This is a placeholder for a more complex operation.
    await db.collection('users').doc(userId).update({ name: displayName });
    return { success: true };
   } catch (error: any) {
     console.error("Error updating user profile:", error);
     return { success: false, error: error.message || "Failed to update profile." };
   }
}
