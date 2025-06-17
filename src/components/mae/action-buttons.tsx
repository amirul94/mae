"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRightLeft, QrCode, History, FileText } from 'lucide-react';

interface ActionButtonsProps {
  onTransferClick: () => void;
  onQrPayClick: () => void;
  onHistoryClick: () => void;
  onFinancialTipsClick: () => void;
}

const ActionButton: React.FC<{
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  className?: string;
}> = ({ icon: Icon, label, onClick, className }) => (
  <Button
    variant="outline"
    className={`flex flex-col items-center justify-center h-auto py-3 sm:py-4 px-2 text-center shadow-sm hover:bg-accent/10 transition-all duration-200 ease-in-out transform hover:scale-105 rounded-lg border-primary/20 ${className}`}
    onClick={onClick}
  >
    <div className="bg-accent/20 text-primary p-3 rounded-full mb-2">
      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
    </div>
    <span className="text-xs sm:text-sm font-medium text-primary font-body">{label}</span>
  </Button>
);


const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onTransferClick, 
  onQrPayClick, 
  onHistoryClick,
  onFinancialTipsClick
}) => {
  return (
    <Card className="mx-4 mb-4 shadow-lg rounded-xl">
      <CardContent className="p-3 sm:p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <ActionButton icon={ArrowRightLeft} label="Transfer" onClick={onTransferClick} />
          <ActionButton icon={QrCode} label="QR Pay" onClick={onQrPayClick} />
          <ActionButton icon={History} label="History" onClick={onHistoryClick} />
          <ActionButton icon={FileText} label="AI Tips" onClick={onFinancialTipsClick} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionButtons;
