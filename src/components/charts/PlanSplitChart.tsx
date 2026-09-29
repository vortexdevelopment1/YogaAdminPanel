// Donut chart component visualizing revenue split by subscription plan (30-Day vs 7-Day)

"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatRupees } from "@/lib/utils";

interface PlanSplitData {
  plan: string;
  revenue: number;
  count: number;
}

interface PlanSplitChartProps {
  data: PlanSplitData[];
}

const PLAN_COLORS = ["#6B8F71", "#D98B5F"];

export default function PlanSplitChart({ data }: PlanSplitChartProps) {
  return (
    <div className="w-full h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="revenue"
            nameKey="plan"
            cx="50%"
            cy="45%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
          >
            {data.map((_, index) => (
              <Cell
                key={`plan-cell-${index}`}
                fill={PLAN_COLORS[index % PLAN_COLORS.length]}
                stroke="#FAF7F2"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#FAF7F2",
              borderColor: "#E8E1D6",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value, name, item) => [
              `${formatRupees(Number(value) || 0)} (${item.payload.count} paid)`,
              `${name} Plan`,
            ]}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            wrapperStyle={{
              paddingTop: "8px",
              fontSize: "12px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
