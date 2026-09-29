// Bar chart component visualizing slot occupancy comparison using Recharts

"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Slot } from "@/types";

interface OccupancyChartProps {
  slots: Slot[];
}

export default function OccupancyChart({ slots }: OccupancyChartProps) {
  const chartData = slots.map((slot) => ({
    name: slot.time,
    filled: slot.filled,
    capacity: slot.capacity,
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E8E1D6" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#7A7A72"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: "#E8E1D6" }}
          />
          <YAxis
            stroke="#7A7A72"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[0, 20]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FAF7F2",
              borderColor: "#E8E1D6",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value) => [`${value} booked`, "Occupancy"]}
          />
          <Bar
            dataKey="filled"
            fill="#6B8F71"
            radius={[6, 6, 0, 0]}
            maxBarSize={48}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
