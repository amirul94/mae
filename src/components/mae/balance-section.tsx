"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface BalanceSectionProps {
  balance: number;
  lastUpdatedTimestamp?: string | number | Date; 
}

const BalanceSection: React.FC<BalanceSectionProps> = ({ balance, lastUpdatedTimestamp }) => {
  const [formattedLastUpdated, setFormattedLastUpdated] = useState("Just now");

  useEffect(() => {
    if (lastUpdatedTimestamp) {
      const date = new Date(lastUpdatedTimestamp);
      // Format to a more friendly time string, e.g., "10:30 AM" or "Yesterday"
      // This is a simplified version. For more complex relative time, use a library like date-fns.
      const now = new Date();
      const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000);

      if (diffSeconds < 60) {
        setFormattedLastUpdated("Just now");
      } else if (diffSeconds < 3600) {
        setFormattedLastUpdated(`${Math.floor(diffSeconds / 60)} min ago`);
      } else {
         setFormattedLastUpdated(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } else {
       // Fallback if no timestamp is provided, though this should be rare.
       const now = new Date();
       setFormattedLastUpdated(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  }, [lastUpdatedTimestamp, balance]); // Re-run if balance changes, implying an update

  // Placeholder for balance change percentage
  const balanceChangePercentage = 0.0; 
  const isPositiveChange = balanceChangePercentage >= 0;

  return (
    <Card className="m-4 shadow-lg rounded-xl">
      <CardHeader>
        <CardDescription className="font-body text-muted-foreground">Available Balance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <h2 className="font-headline text-4xl font-bold text-primary">
            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          {/* <span className={`text-sm font-medium flex items-center ${isPositiveChange ? 'text-green-500' : 'text-red-500'}`}>
            {isPositiveChange ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            {isPositiveChange ? '+' : ''}{balanceChangePercentage.toFixed(1)}%
          </span> */}
        </div>
        <p className="text-xs text-muted-foreground mt-1 font-body">
          Last updated: {formattedLastUpdated}
        </p>
      </CardContent>
    </Card>
  );
};

export default BalanceSection;
