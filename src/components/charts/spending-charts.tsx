"use client";

import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CategoryBreakdown, MonthlySpending } from "@/types";

const tooltipStyle = {
  backgroundColor: "rgba(17, 24, 39, 0.95)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  color: "#f9fafb",
};

export function SpendingAreaChart({ data }: { data: MonthlySpending[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Monthly Spending Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => formatCurrency(Number(value))}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#6366f1"
                fillOpacity={1}
                fill="url(#colorTotal)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="subscriptions"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorSubs)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function CategoryPieChart({ data }: { data: CategoryBreakdown[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="amount"
                nameKey="category"
              >
                {data.map((entry) => (
                  <Cell key={entry.category} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => formatCurrency(Number(value))}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {data.map((item) => (
              <div key={item.category} className="flex items-center gap-2 text-xs">
                <div
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-muted-foreground truncate">{item.category}</span>
                <span className="ml-auto font-medium">{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function SavingsBarChart({
  data,
}: {
  data: { name: string; current: number; optimized: number }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Current vs Optimized Spending</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `$${v}`} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value) => formatCurrency(Number(value))}
            />
            <Bar dataKey="current" fill="#ef4444" radius={[4, 4, 0, 0]} name="Current" />
            <Bar dataKey="optimized" fill="#10b981" radius={[4, 4, 0, 0]} name="Optimized" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function PriceHistoryChart({
  data,
}: {
  data: { date: string; amount: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="date" stroke="#6b7280" fontSize={11} />
        <YAxis stroke="#6b7280" fontSize={11} tickFormatter={(v) => `$${v}`} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value) => formatCurrency(Number(value))}
        />
        <Area
          type="stepAfter"
          dataKey="amount"
          stroke="#ef4444"
          fill="url(#priceGradient)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
