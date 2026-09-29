// Bar chart component visualizing 6-month revenue trend with current month highlighted in terracotta

"use client";

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { MonthlyRevenue } from "@/types";
import { formatRupees } from "@/lib/utils";

interface RevenueChartProps {
  data: MonthlyRevenue[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E8E1D6" vertical={false} />
          <XAxis
            dataKey="month"
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
            tickFormatter={(val: number) => `${Math.round(val / 1000)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FAF7F2",
              borderColor: "#E8E1D6",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value) => [formatRupees(Number(value) || 0), "Revenue"]}
          />
          <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={48}>
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === data.length - 1 ? "#D98B5F" : "#6B8F71"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
