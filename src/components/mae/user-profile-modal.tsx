"use client";

import React from 'react';
import type { User } from 'firebase/auth';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, HelpCircle, LogOut, UserCircle } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface UserProfileModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  user: User | null;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onOpenChange, user }) => {
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      onOpenChange(false); // Close modal
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      // Auth state change in parent will handle redirect
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({ variant: "destructive", title: "Logout Failed", description: error.message });
    }
  };
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-primary">My Account</DialogTitle>
          <DialogDescription className="font-body">Manage your profile and settings.</DialogDescription>
        </DialogHeader>
        
        {user && (
          <div className="py-4 space-y-6">
            <div className="flex flex-col items-center space-y-2">
              <Avatar className="h-20 w-20 border-2 border-primary">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-headline">
                  {getInitials(user.displayName)}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-headline text-xl font-semibold text-foreground">{user.displayName || "MAE User"}</h3>
              <p className="text-sm text-muted-foreground font-body">{user.email}</p>
            </div>

            <div className="space-y-2 font-body">
              <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-accent/10 py-3 px-3">
                <Settings className="mr-3 h-5 w-5" /> Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-accent/10 py-3 px-3">
                <HelpCircle className="mr-3 h-5 w-5" /> Help & Support
              </Button>
            </div>
          </div>
        )}
        
        <DialogFooter className="flex-col space-y-2 sm:flex-col sm:space-y-2">
           <Button onClick={handleLogout} variant="destructive" className="w-full font-body">
            <LogOut className="mr-2 h-5 w-5" /> Log Out
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="outline" className="w-full font-body">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
