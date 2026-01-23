"use client";

import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";

export default function WasilaQRCode({ url, name }: { url: string, name?: string }) {
  return (
    <div className="flex flex-col items-start gap-2">
      <div className="p-4 bg-white rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 mt-2">
        <div className="relative w-[150px] h-[150px] mx-auto">
          {/* QR Code */}
          <QRCodeSVG
            value={url}
            size={150}
            level="H"
            bgColor="#ffffff"
            fgColor="#000000"
          />

          {/* Center Logo + Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center bg-white px-2 py-1 rounded">
              <Image src="/logo.svg" alt="qrLogo" width={28} height={28} />
              <span className="text-[10px] font-semibold text-gray-800 mt-0.5">
                Wasila
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-center text-gray-500 mt-2">
          Scan to visit {name || ""} profile
        </p>
      </div>
    </div>
  );
}
