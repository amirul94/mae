"use client";

import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import type { User } from 'firebase/auth';
import SplashScreen from '@/components/mae/splash-screen';
import AuthForm from '@/components/mae/auth-form';
import MainAppShell from '@/components/mae/main-app-shell';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 1500); // Show splash for 1.5 seconds

    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setIsLoading(false);
      if (!showSplash) { // if splash screen is already hidden, no need to hide again
         clearTimeout(splashTimer); // clear timer if auth resolves before splash timeout
      }
    });

    return () => {
      clearTimeout(splashTimer);
      unsubscribe();
    };
  }, [showSplash]);

  if (showSplash || (isLoading && !currentUser)) { // Keep showing splash if auth is still loading and splash is meant to be visible
    return <SplashScreen />;
  }

  if (!currentUser) {
    return <AuthForm />;
  }

  return <MainAppShell user={currentUser} />;
}
