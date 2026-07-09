import React from "react";
import QRCode from "react-qr-code";
import { useCard } from "../context/CardContext";
import { generateVCard } from "../utils/generateVCard";
import { FaQrcode, FaInfoCircle } from "react-icons/fa";

export const QRCodeSection = () => {
  const { cardData, accentColor } = useCard();
  
  // Create vCard payload
  const vCardData = generateVCard(cardData);

  return (
    <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/60 transition-colors flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4 self-start">
        <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
          <FaQrcode className="text-sm" />
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
            Contact QR Share
          </h3>
          <p className="text-[9px] text-slate-400 dark:text-slate-500">Scan to import directly to mobile contacts</p>
        </div>
      </div>

      {/* QR Code Container */}
      <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 dark:border-slate-800/50">
        <QRCode
          value={vCardData || "No Data"}
          size={140}
          fgColor="#0f172a"
          bgColor="#ffffff"
          level="M"
        />
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-[10px] text-slate-405 dark:text-slate-500 text-center max-w-xs leading-normal">
        <FaInfoCircle className="shrink-0 text-emerald-500" />
        <span>Instantly updates as you write in the form.</span>
      </div>
    </div>
  );
};
