import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-primary flex flex-col items-center justify-center z-[9999]">
      <h1 className="text-5xl font-headline font-bold text-primary-foreground mb-6">MAE</h1>
      <div className="w-10 h-10 border-4 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
      <p className="text-primary-foreground mt-4 font-body">Mobile Finance Assistant</p>
    </div>
  );
};

export default SplashScreen;
