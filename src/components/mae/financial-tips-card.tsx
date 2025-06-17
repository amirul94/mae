"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb, Zap } from 'lucide-react'; // Zap for AI aspect
import { Skeleton } from '@/components/ui/skeleton';

interface FinancialTipsCardProps {
  tip: string | null;
  isLoading: boolean;
}

const FinancialTipsCard: React.FC<FinancialTipsCardProps> = ({ tip, isLoading }) => {
  return (
    <Card className="mx-4 mb-4 shadow-lg rounded-xl bg-gradient-to-br from-primary to-blue-700 text-primary-foreground dark:from-primary dark:to-blue-800">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          <Zap className="h-6 w-6 text-accent" />
          <CardTitle className="font-headline text-lg">AI Financial Tip</CardTitle>
        </div>
        <CardDescription className="font-body text-primary-foreground/80">Personalized advice to help you save smart.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-primary-foreground/20" />
            <Skeleton className="h-4 w-3/4 bg-primary-foreground/20" />
          </div>
        ) : tip ? (
          <p className="font-body text-sm leading-relaxed">{tip}</p>
        ) : (
          <p className="font-body text-sm">No financial tips available at the moment.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialTipsCard;
