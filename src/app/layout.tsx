import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import ServiceWorkerRegistration from '@/components/service-worker-registration';

export const metadata: Metadata = {
  title: 'MAE Financial App',
  description: 'Your Mobile Finance Assistant',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#1E3A8A', // Deep Blue, matching primary color
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <Script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js" strategy="beforeInteractive" />
        <Script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js" strategy="beforeInteractive" />
        <Script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js" strategy="lazyOnload" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
