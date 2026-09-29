// Horizontal bar chart component displaying average dwell time per page using Recharts

"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PageDwell } from "@/types";
import { formatSeconds } from "@/lib/utils";

interface DwellTimeChartProps {
  data: PageDwell[];
}

export default function DwellTimeChart({ data }: DwellTimeChartProps) {
  return (
    <div className="w-full h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E8E1D6" horizontal={false} />
          <XAxis
            type="number"
            stroke="#7A7A72"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: "#E8E1D6" }}
            tickFormatter={(val) => `${val}s`}
          />
          <YAxis
            dataKey="page"
            type="category"
            stroke="#2B2B2B"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={75}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FAF7F2",
              borderColor: "#E8E1D6",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value) => [
              formatSeconds(Number(value) || 0),
              "Avg. Dwell Time",
            ]}
          />
          <Bar
            dataKey="avgSeconds"
            fill="#D98B5F"
            radius={[0, 6, 6, 0]}
            maxBarSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
