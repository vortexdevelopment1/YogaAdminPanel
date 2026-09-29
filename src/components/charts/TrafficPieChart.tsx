// Donut chart component visualizing traffic breakdown by source using Recharts

"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrafficSource } from "@/types";

interface TrafficPieChartProps {
  data: TrafficSource[];
}

const COLORS = ["#6B8F71", "#D98B5F", "#C9B79C", "#2F4A3A", "#8FB3A0"];

export default function TrafficPieChart({ data }: TrafficPieChartProps) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="visitors"
            nameKey="source"
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={3}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
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
            formatter={(value) => [`${value} visitors`, "Visitors"]}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            wrapperStyle={{
              paddingTop: "12px",
              fontSize: "12px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
