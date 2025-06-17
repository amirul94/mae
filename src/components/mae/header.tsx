"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { UserCircle } from 'lucide-react';

interface HeaderProps {
  onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onProfileClick }) => {
  return (
    <header className="bg-primary text-primary-foreground px-4 py-3 sm:px-6 sm:py-4 flex justify-between items-center shadow-md">
      <h1 className="font-headline text-xl sm:text-2xl font-bold">MAE</h1>
      <Button variant="ghost" size="icon" onClick={onProfileClick} className="text-primary-foreground hover:bg-primary/80 rounded-full">
        <UserCircle className="h-6 w-6 sm:h-7 sm:w-7" />
        <span className="sr-only">User Profile</span>
      </Button>
    </header>
  );
};

export default Header;
