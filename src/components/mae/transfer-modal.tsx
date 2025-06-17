"use client";

import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

const transferSchema = z.object({
  recipient: z.string().min(1, { message: "Recipient is required." }).email({message: "Please enter a valid email for recipient."}),
  amount: z.preprocess(
    (val) => parseFloat(z.string().parse(val)),
    z.number().positive({ message: "Amount must be positive." })
  ),
  note: z.string().optional(),
});

type TransferFormInputs = z.infer<typeof transferSchema>;

interface TransferModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirmTransfer: (recipient: string, amount: number, note?: string) => Promise<boolean>;
  currentBalance: number;
}

const TransferModal: React.FC<TransferModalProps> = ({ isOpen, onOpenChange, onConfirmTransfer, currentBalance }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<TransferFormInputs>({
    resolver: zodResolver(transferSchema),
    defaultValues: { recipient: "", amount: 0, note: "" },
  });

  const onSubmit: SubmitHandler<TransferFormInputs> = async (data) => {
    if (data.amount > currentBalance) {
        form.setError("amount", { type: "manual", message: "Insufficient balance." });
        return;
    }
    setIsLoading(true);
    const success = await onConfirmTransfer(data.recipient, data.amount, data.note);
    setIsLoading(false);
    if (success) {
      form.reset();
      onOpenChange(false); // Parent will show success modal
    }
    // Error toast handled by onConfirmTransfer in parent
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) form.reset(); // Reset form on close
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-primary">Transfer Money</DialogTitle>
          <DialogDescription className="font-body">Send funds securely to another user.</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div>
            <Label htmlFor="recipient" className="font-body">Recipient Email</Label>
            <Input
              id="recipient"
              placeholder="user@example.com"
              {...form.register('recipient')}
              className="font-body mt-1"
              aria-invalid={form.formState.errors.recipient ? "true" : "false"}
            />
            {form.formState.errors.recipient && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.recipient.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="amount" className="font-body">Amount</Label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-muted-foreground sm:text-sm font-body">$</span>
              </div>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...form.register('amount')}
                className="font-body pl-7"
                aria-invalid={form.formState.errors.amount ? "true" : "false"}
              />
            </div>
             {form.formState.errors.amount && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.amount.message}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1 font-body">Available: ${currentBalance.toFixed(2)}</p>
          </div>

          <div>
            <Label htmlFor="note" className="font-body">Note (Optional)</Label>
            <Textarea
              id="note"
              placeholder="What's this for?"
              {...form.register('note')}
              className="font-body mt-1 min-h-[60px]"
            />
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="w-full sm:w-auto font-body" disabled={isLoading}>Cancel</Button>
            </DialogClose>
            <Button type="submit" className="w-full sm:w-auto font-body bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Money'} <Send className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransferModal;
