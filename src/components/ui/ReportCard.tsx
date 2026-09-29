// Client component rendering individual CSV report cards with download actions and temporary confirmation state

"use client";

import { useState } from "react";
import { LucideIcon, Download, Check } from "lucide-react";

interface ReportCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  recordCount: number;
  onDownload: () => void;
}

export default function ReportCard({
  title,
  description,
  icon: Icon,
  recordCount,
  onDownload,
}: ReportCardProps) {
  const [downloaded, setDownloaded] = useState(false);

  const handleClick = () => {
    onDownload();
    setDownloaded(true);
    setTimeout(() => {
      setDownloaded(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-sand p-5 md:p-6 shadow-sm flex flex-col justify-between space-y-5">
      {/* Top Title & Icon */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-sage/15 text-sage flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-forest font-serif">
            {title}
          </h3>
        </div>

        {/* Description & Record Count */}
        <p className="text-xs md:text-sm text-warmgray mb-3 leading-relaxed">
          {description}
        </p>

        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sand/60 text-charcoal">
          {recordCount} records included
        </span>
      </div>

      {/* Download Action Button */}
      <button
        onClick={handleClick}
        className={`w-full py-2.5 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs ${
          downloaded
            ? "bg-[#2F6B3D] text-white"
            : "bg-sage hover:bg-forest text-white"
        }`}
      >
        {downloaded ? (
          <>
            <Check className="w-4 h-4" />
            <span>Downloaded!</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span>Download CSV</span>
          </>
        )}
      </button>
    </div>
  );
}
