// Component rendering slot-wise revenue distribution with custom CSS progress bars

import { formatRupees } from "@/lib/utils";

interface SlotRevenueItem {
  slot: string;
  revenue: number;
}

interface SlotRevenueListProps {
  data: SlotRevenueItem[];
}

export default function SlotRevenueList({ data }: SlotRevenueListProps) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className="space-y-4">
      {data.map((item) => {
        const percentage = Math.round((item.revenue / maxRevenue) * 100);

        return (
          <div key={item.slot} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-charcoal">{item.slot}</span>
              <span className="font-bold text-forest">
                {formatRupees(item.revenue)}
              </span>
            </div>
            <div className="w-full bg-sand/50 h-3 rounded-full overflow-hidden">
              <div
                className="bg-sage h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${item.revenue > 0 ? Math.max(percentage, 3) : 0}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
