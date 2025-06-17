"use client";

import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    QRCode: any;
  }
}

interface QrCodeDisplayProps {
  data: string;
  size?: number;
  className?: string;
}

const QrCodeDisplay: React.FC<QrCodeDisplayProps> = ({ data, size = 160, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && data && typeof window.QRCode !== 'undefined') {
      window.QRCode.toCanvas(canvasRef.current, data, {
        width: size,
        margin: 1,
        color: {
          dark: '#000000', // Primary color or black
          light: '#FFFFFF', // Background color or white
        },
      }, (error: any) => {
        if (error) console.error("QR Code generation error:", error);
      });
    } else if (typeof window.QRCode === 'undefined') {
        // console.warn("QRCode library not loaded yet. QR code will not be rendered.");
        // Retry after a short delay if QRCode is not available
        const timeoutId = setTimeout(() => {
            if (canvasRef.current && data && typeof window.QRCode !== 'undefined') {
                 window.QRCode.toCanvas(canvasRef.current, data, {
                    width: size,
                    margin: 1,
                    color: { dark: '#000000', light: '#FFFFFF' },
                }, (error: any) => {
                    if (error) console.error("QR Code generation error (retry):", error);
                });
            } else if(typeof window.QRCode === 'undefined') {
                console.error("QRCode library still not loaded after retry.");
            }
        }, 500); // Retry after 500ms
        return () => clearTimeout(timeoutId);
    }
  }, [data, size]);

  return <canvas ref={canvasRef} className={className} aria-label="QR Code"></canvas>;
};

export default QrCodeDisplay;
