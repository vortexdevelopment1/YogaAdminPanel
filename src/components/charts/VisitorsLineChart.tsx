// Line chart component displaying daily visitor trends over 14 days using Recharts

"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DailyVisitors } from "@/types";

interface VisitorsLineChartProps {
  data: DailyVisitors[];
}

export default function VisitorsLineChart({ data }: VisitorsLineChartProps) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E8E1D6" vertical={false} />
          <XAxis
            dataKey="date"
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
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FAF7F2",
              borderColor: "#E8E1D6",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value) => [`${value} visitors`, "Daily Count"]}
          />
          <Line
            type="monotone"
            dataKey="visitors"
            stroke="#6B8F71"
            strokeWidth={3}
            dot={{ r: 4, fill: "#6B8F71", strokeWidth: 2, stroke: "#FAF7F2" }}
            activeDot={{ r: 6, fill: "#2F4A3A" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
