"use client";

import React from 'react';
import type { Transaction } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowDownCircle, ArrowUpCircle,Inbox } from 'lucide-react';

interface TransactionsListProps {
  transactions: Transaction[];
  onViewAllClick: () => void;
}

const TransactionsList: React.FC<TransactionsListProps> = ({ transactions, onViewAllClick }) => {
  return (
    <Card className="mx-4 mb-4 shadow-lg rounded-xl flex-1 flex flex-col min-h-[200px]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="font-headline text-lg text-primary">Recent Transactions</CardTitle>
          <CardDescription className="font-body">Your latest financial movements.</CardDescription>
        </div>
        <Button variant="link" onClick={onViewAllClick} className="font-body text-primary px-0">
          View All
        </Button>
      </CardHeader>
      <CardContent className="pt-0 overflow-y-auto flex-1">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-8">
            <Inbox className="h-12 w-12 mb-2" />
            <p className="font-body">No transactions yet.</p>
            <p className="text-xs font-body">Your transactions will appear here.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {transactions.map((transaction) => {
              const isOutgoing = transaction.type === 'outgoing';
              const date = new Date(transaction.timestamp);
              const formattedDate = `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
              return (
                <li key={transaction.id} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-3 ${isOutgoing ? 'bg-red-100 dark:bg-red-900' : 'bg-green-100 dark:bg-green-900'}`}>
                      {isOutgoing ? (
                        <ArrowUpCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                      ) : (
                        <ArrowDownCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground font-body">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground font-body">{formattedDate}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold font-mono ${isOutgoing ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    {isOutgoing ? '-' : '+'}${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionsList;
