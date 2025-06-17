"use client";

import React, { useState, useRef } from 'react';
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Camera, Download, Share2, Upload, X } from 'lucide-react';
import QrCodeDisplay from './qr-code-display'; // Assuming you have this component

interface QrPayModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  userId?: string | null; // Optional: pass current user ID for "My QR"
  onScanComplete: (data: string) => void; // Callback when QR is "scanned" (simulated)
}

const QrPayModal: React.FC<QrPayModalProps> = ({ isOpen, onOpenChange, userId, onScanComplete }) => {
  const [activeTab, setActiveTab] = useState<"my-qr" | "scan-qr">("my-qr");
  const qrData = userId ? `https://mae.example.com/pay?user=${userId}` : 'https://mae.example.com/pay?user=demo';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      // Simulate processing and then show scan result
      // For a real app, you'd use a QR scanner library here
      setTimeout(() => {
        onScanComplete("Simulated QR Data: merchant@example.com, amount:12.50, ref:INV-2023-456");
        onOpenChange(false); // Close this modal
      }, 1000);
    }
  };

  const handleShareQr = () => {
    if (navigator.share) {
      navigator.share({
        title: 'MAE Payment QR Code',
        text: 'Scan this QR code to pay me.',
        url: qrData, // Or a link to a page displaying the QR
      }).catch(error => console.log('Error sharing:', error));
    } else {
      alert('Web Share API not supported. QR Data: ' + qrData);
    }
  };

  const handleDownloadQr = () => {
    const canvas = document.querySelector('#myQrSection canvas') as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'mae_payment_qr.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } else {
      alert('Could not find QR code to download.');
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="font-headline text-2xl text-primary">QR Payment</DialogTitle>
          <DialogDescription className="font-body">
            {activeTab === "my-qr" ? "Share your QR code to receive payments." : "Scan a QR code to make a payment."}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "my-qr" | "scan-qr")} className="w-full px-6 pt-2">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="my-qr" className="font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">My QR</TabsTrigger>
            <TabsTrigger value="scan-qr" className="font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Scan QR</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-qr" id="myQrSection">
            <div className="flex flex-col items-center py-4">
              <div className="p-2 border-2 border-primary rounded-lg shadow-md bg-white mb-4">
                <QrCodeDisplay data={qrData} size={200} />
              </div>
              <p className="text-sm text-muted-foreground mb-1 font-body">Scan to pay me instantly</p>
              <p className="text-xs text-muted-foreground/70 mb-4 font-body">QR code is dynamic and secure</p>
              <div className="flex space-x-3 w-full">
                <Button onClick={handleShareQr} variant="outline" className="flex-1 font-body">
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
                <Button onClick={handleDownloadQr} className="flex-1 font-body bg-primary hover:bg-primary/90">
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="scan-qr" id="scanQrSection">
            <div className="flex flex-col items-center py-4">
              <div className="relative w-full aspect-square bg-muted/50 rounded-lg mb-4 overflow-hidden border border-dashed border-primary/50 flex items-center justify-center">
                <Camera className="h-16 w-16 text-muted-foreground/50" />
                <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="w-full h-full border-2 border-primary rounded-lg opacity-50"></div>
                </div>
                <div className="absolute left-[10%] right-[10%] h-0.5 bg-accent animate-scan" style={{ animationDuration: '3s' }}></div>
                <p className="absolute bottom-4 text-xs text-muted-foreground font-body">Camera access needed or upload image</p>
              </div>
              <p className="text-sm text-muted-foreground mb-4 font-body">Position QR code within the frame or upload an image.</p>
              <Button onClick={() => fileInputRef.current?.click()} className="w-full font-body bg-primary hover:bg-primary/90">
                <Upload className="mr-2 h-4 w-4" /> Upload QR Image
              </Button>
              <input
                type="file"
                id="qrFileInput"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="p-6 pt-2">
          <DialogClose asChild>
            <Button type="button" variant="ghost" className="w-full font-body">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QrPayModal;
