// Analytics page displaying traffic sources, daily visitors trend, dwell times, and user conversion funnels

import { Users, Globe, Timer, TrendingUp, ArrowRight, Route } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import TrafficPieChart from "@/components/charts/TrafficPieChart";
import VisitorsLineChart from "@/components/charts/VisitorsLineChart";
import DwellTimeChart from "@/components/charts/DwellTimeChart";
import JourneyFunnel from "@/components/ui/JourneyFunnel";
import {
  trafficSources,
  dailyVisitors,
  pageDwell,
  journeySteps,
  topJourneys,
} from "@/lib/mockData";
import {
  getTotalVisitors,
  getTopSource,
  getAvgDwellSeconds,
  formatSeconds,
  getConversionRate,
} from "@/lib/utils";

export default function AnalyticsPage() {
  const totalVisitors = getTotalVisitors(trafficSources);
  const topSource = getTopSource(trafficSources);
  const avgDwell = formatSeconds(getAvgDwellSeconds(pageDwell));
  const conversionRate = getConversionRate(journeySteps);

  return (
    <div className="space-y-8">
      {/* Header & Subtitle */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-forest font-serif">
          Analytics
        </h1>
        <p className="text-sm text-warmgray mt-1">
          Understand how visitors use your website
        </p>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Visitors"
          value={totalVisitors.toLocaleString()}
          icon={Users}
          hint="Across all marketing channels"
        />
        <StatCard
          title="Top Source"
          value={topSource}
          icon={Globe}
          hint="Highest converting channel"
        />
        <StatCard
          title="Avg. Time on Page"
          value={avgDwell}
          icon={Timer}
          hint="Average session engagement"
        />
        <StatCard
          title="Booking Conversion"
          value={conversionRate}
          icon={TrendingUp}
          hint="From landing to completed"
        />
      </div>

      {/* Row 1: Traffic Sources & 14-Day Visitors Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources Pie Chart */}
        <div className="bg-white rounded-xl border border-sand p-5 md:p-6 shadow-sm">
          <h2 className="text-lg font-bold text-forest font-serif mb-1">
            Traffic Sources
          </h2>
          <p className="text-xs text-warmgray mb-4">
            Distribution of visitors by acquisition channel
          </p>
          <TrafficPieChart data={trafficSources} />
        </div>

        {/* Daily Visitors Line Chart */}
        <div className="bg-white rounded-xl border border-sand p-5 md:p-6 shadow-sm">
          <h2 className="text-lg font-bold text-forest font-serif mb-1">
            Visitors (Last 14 Days)
          </h2>
          <p className="text-xs text-warmgray mb-4">
            Daily web traffic trends from Sep 16 to Sep 29
          </p>
          <VisitorsLineChart data={dailyVisitors} />
        </div>
      </div>

      {/* Row 2: Average Time per Page & Visitor Journey Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Dwell Time Bar Chart */}
        <div className="bg-white rounded-xl border border-sand p-5 md:p-6 shadow-sm">
          <h2 className="text-lg font-bold text-forest font-serif mb-1">
            Avg. Time per Page
          </h2>
          <p className="text-xs text-warmgray mb-4">
            Average time spent per session across core sections
          </p>
          <DwellTimeChart data={pageDwell} />
        </div>

        {/* Visitor Journey & Drop-offs Funnel */}
        <div className="bg-white rounded-xl border border-sand p-5 md:p-6 shadow-sm">
          <h2 className="text-lg font-bold text-forest font-serif mb-1">
            Visitor Journey & Drop-offs
          </h2>
          <p className="text-xs text-warmgray mb-4">
            Conversion funnel from landing to booking completion
          </p>
          <JourneyFunnel steps={journeySteps} />
        </div>
      </div>

      {/* Row 3: Top Visitor Paths */}
      <div className="bg-white rounded-xl border border-sand p-5 md:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Route className="w-5 h-5 text-sage" />
          <h2 className="text-lg font-bold text-forest font-serif">
            Top Visitor Paths
          </h2>
        </div>
        <p className="text-xs text-warmgray mb-4">
          Most frequent user navigation journeys through the website
        </p>

        <div className="space-y-3">
          {topJourneys.map((path, index) => {
            const steps = path.split(" > ");
            return (
              <div
                key={index}
                className="flex flex-wrap items-center gap-2 p-3 bg-cream/60 rounded-xl border border-sand/60 text-xs md:text-sm"
              >
                <span className="w-6 h-6 rounded-full bg-sage/20 text-forest font-bold text-xs flex items-center justify-center shrink-0">
                  {index + 1}
                </span>

                <div className="flex flex-wrap items-center gap-1.5 font-medium">
                  {steps.map((step, sIdx) => (
                    <span key={sIdx} className="flex items-center gap-1.5">
                      <span
                        className={`px-2.5 py-1 rounded-lg ${
                          step === "Booking"
                            ? "bg-sage text-white font-semibold"
                            : step === "Exit"
                            ? "bg-[#F8E1DE] text-[#A3382B]"
                            : "bg-white border border-sand text-charcoal"
                        }`}
                      >
                        {step}
                      </span>
                      {sIdx < steps.length - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 text-warmgray/70 shrink-0" />
                      )}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
