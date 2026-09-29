// StatCard component for displaying key dashboard metrics with icons and hints

import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
}

export default function StatCard({ title, value, icon: Icon, hint }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-sand p-5 md:p-6 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-warmgray mb-1">{title}</p>
        <h3 className="text-2xl md:text-3xl font-bold text-forest font-serif">{value}</h3>
        {hint && <p className="text-xs text-warmgray/80 mt-1.5">{hint}</p>}
      </div>
      <div className="w-12 h-12 rounded-xl bg-sage/15 text-sage flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}
