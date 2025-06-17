"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { fetchUserDataAction, addTransactionAction, getFinancialTipAction, type Transaction, type UserData } from '@/app/actions';
import Header from './header';
import BalanceSection from './balance-section';
import ActionButtons from './action-buttons';
import TransactionsList from './transactions-list';
import FinancialTipsCard from './financial-tips-card';
import UserProfileModal from './user-profile-modal';
import TransferModal from './transfer-modal';
import QrPayModal from './qr-pay-modal';
import ScanResultModal from './scan-result-modal';
import SuccessModal from './success-modal';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface MainAppShellProps {
  user: FirebaseUser;
}

const MainAppShell: React.FC<MainAppShellProps> = ({ user }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isQrPayModalOpen, setIsQrPayModalOpen] = useState(false);
  const [isScanResultModalOpen, setIsScanResultModalOpen] = useState(false);
  const [scannedQrData, setScannedQrData] = useState<string | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successModalTitle, setSuccessModalTitle] = useState("");
  const [successModalMessage, setSuccessModalMessage] = useState("");
  const [financialTip, setFinancialTip] = useState<string | null>(null);
  const [isLoadingTip, setIsLoadingTip] = useState(true);

  const { toast } = useToast();

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchUserDataAction(user.uid);
      if (data) {
        setUserData(data);
        if (data.transactions.length > 0) {
            setIsLoadingTip(true);
            getFinancialTipAction(data.transactions)
                .then(setFinancialTip)
                .finally(() => setIsLoadingTip(false));
        } else {
            setFinancialTip("Start making transactions to get AI tips!");
            setIsLoadingTip(false);
        }
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not load your data." });
    } finally {
      setIsLoading(false);
    }
  }, [user.uid, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTransaction = async (
    type: 'incoming' | 'outgoing',
    amount: number,
    description: string,
    recipient?: string | null
  ): Promise<boolean> => {
    const result = await addTransactionAction(user.uid, type, amount, description, recipient);
    if (result.success && result.newBalance !== undefined) {
      setUserData(prev => prev ? { ...prev, balance: result.newBalance! } : null);
      loadData(); // Reload all data including transactions and then get new tip
      setSuccessModalTitle(type === 'outgoing' ? "Payment Successful" : "Transfer Received");
      setSuccessModalMessage(`Successfully ${type === 'outgoing' ? 'sent' : 'received'} $${amount.toFixed(2)} ${type === 'outgoing' && recipient ? 'to ' + recipient : ''}.`);
      setIsSuccessModalOpen(true);
      return true;
    } else {
      toast({ variant: "destructive", title: "Transaction Failed", description: result.error || "An unknown error occurred." });
      return false;
    }
  };
  
  const handleQrScanComplete = (data: string) => {
    setScannedQrData(data);
    setIsQrPayModalOpen(false); // Close QR Pay modal
    setIsScanResultModalOpen(true); // Open Scan Result modal
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header onProfileClick={() => {}} />
        <div className="p-4 space-y-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!userData) {
     return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
            <p className="font-body text-destructive">Could not load user data. Please try again.</p>
            <Button onClick={loadData} className="mt-4">Retry</Button>
        </div>
    );
  }


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header onProfileClick={() => setIsProfileModalOpen(true)} />
      <main className="flex-1 flex flex-col overflow-y-auto pb-4">
        <BalanceSection balance={userData.balance} lastUpdatedTimestamp={userData.transactions[0]?.timestamp}/>
        <ActionButtons
          onTransferClick={() => setIsTransferModalOpen(true)}
          onQrPayClick={() => setIsQrPayModalOpen(true)}
          onHistoryClick={() => alert("Full transaction history page not implemented.")}
          onFinancialTipsClick={() => { /* Could open a modal or scroll to tips */ alert(financialTip || "No tips yet."); }}
        />
        <FinancialTipsCard tip={financialTip} isLoading={isLoadingTip} />
        <TransactionsList
          transactions={userData.transactions}
          onViewAllClick={() => alert("Full transaction history page not implemented.")}
        />
      </main>

      <UserProfileModal isOpen={isProfileModalOpen} onOpenChange={setIsProfileModalOpen} user={user} />
      <TransferModal 
        isOpen={isTransferModalOpen} 
        onOpenChange={setIsTransferModalOpen}
        currentBalance={userData.balance}
        onConfirmTransfer={(recipient, amount, note) => 
            handleTransaction('outgoing', amount, note || `Transfer to ${recipient}`, recipient)
        }
      />
      <QrPayModal 
        isOpen={isQrPayModalOpen} 
        onOpenChange={setIsQrPayModalOpen} 
        userId={user.uid}
        onScanComplete={handleQrScanComplete}
      />
      <ScanResultModal
        isOpen={isScanResultModalOpen}
        onOpenChange={setIsScanResultModalOpen}
        qrData={scannedQrData}
        onConfirmPayment={(amount, description, recipient, note) =>
            handleTransaction('outgoing', amount, description, recipient)
        }
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
        title={successModalTitle}
        message={successModalMessage}
      />
    </div>
  );
};

export default MainAppShell;
