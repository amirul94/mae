"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserCircle, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScanResultModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  qrData: string | null; // Example: "merchant@example.com, amount:12.50, ref:INV-2023-456"
  onConfirmPayment: (amount: number, description: string, recipient: string, note?: string) => Promise<boolean>;
}

interface ParsedQrData {
  recipientName: string;
  recipientEmail: string;
  amount: number;
  reference: string;
}

const ScanResultModal: React.FC<ScanResultModalProps> = ({ isOpen, onOpenChange, qrData, onConfirmPayment }) => {
  const [paymentNote, setPaymentNote] = useState("");
  const [parsedData, setParsedData] = useState<ParsedQrData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (qrData) {
      // Simple parsing, make this more robust for a real app
      try {
        const parts = qrData.split(',').map(part => part.trim());
        const recipientPart = parts.find(p => p.includes('@')) || "Unknown Merchant <unknown@example.com>";
        const [recipientName, recipientEmail] = recipientPart.split('<').map(s => s.replace('>', '').trim());

        const amountPart = parts.find(p => p.startsWith('amount:')) || "amount:0";
        const amount = parseFloat(amountPart.split(':')[1]);

        const refPart = parts.find(p => p.startsWith('ref:')) || "ref:N/A";
        const reference = refPart.split(':')[1];
        
        setParsedData({
          recipientName: recipientName || "Merchant",
          recipientEmail: recipientEmail || "merchant@example.com",
          amount: !isNaN(amount) ? amount : 0,
          reference: reference || "N/A",
        });
      } catch (e) {
        console.error("Error parsing QR data:", e);
        setParsedData({ recipientName: "Error", recipientEmail: "Invalid QR", amount: 0, reference: "Error" });
         toast({ variant: "destructive", title: "Invalid QR Code", description: "The scanned QR code is not valid."});
         onOpenChange(false); // Close modal if QR is invalid
      }
    }
  }, [qrData, isOpen, onOpenChange, toast]);

  const handlePayment = async () => {
    if (!parsedData || parsedData.amount <= 0) {
        toast({ variant: "destructive", title: "Payment Error", description: "Invalid payment amount."});
        return;
    }
    setIsLoading(true);
    const success = await onConfirmPayment(parsedData.amount, `Payment to ${parsedData.recipientName}`, parsedData.recipientEmail, paymentNote);
    setIsLoading(false);
    if (success) {
      onOpenChange(false); // Close this modal, parent will show success modal
    } else {
      // Error toast is handled by onConfirmPayment
    }
  };
  
  if (!parsedData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-primary">Payment Details</DialogTitle>
          <DialogDescription className="font-body">Confirm the details to complete your payment.</DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <div className="flex items-center">
            <div className="bg-muted p-3 rounded-full mr-4">
              <UserCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h4 className="font-headline text-lg font-semibold text-foreground">{parsedData.recipientName}</h4>
              <p className="text-sm text-muted-foreground font-body">{parsedData.recipientEmail}</p>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg space-y-2 font-body">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Amount:</span>
              <span className="text-sm font-semibold text-primary">
                ${parsedData.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Reference:</span>
              <span className="text-sm font-medium text-foreground">{parsedData.reference}</span>
            </div>
          </div>

          <div>
            <Label htmlFor="paymentNote" className="font-body mb-1 block">Note (Optional)</Label>
            <Input
              id="paymentNote"
              value={paymentNote}
              onChange={(e) => setPaymentNote(e.target.value)}
              placeholder="Add a payment note"
              className="font-body"
            />
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="w-full sm:w-auto font-body" disabled={isLoading}>Cancel</Button>
          </DialogClose>
          <Button 
            type="button" 
            onClick={handlePayment} 
            className="w-full sm:w-auto font-body bg-primary hover:bg-primary/90"
            disabled={isLoading || parsedData.amount <= 0}
          >
            {isLoading ? 'Processing...' : 
            `Pay $${parsedData.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScanResultModal;
