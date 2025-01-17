"use client";

import { Bar, BarChart, XAxis, YAxis, Legend, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Get today's date
const today = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const chartData = [
  { name: "Alice", views: 2500, likes: 150, comments: 50 },
  { name: "Bob", views: 3800, likes: 200, comments: 80 },
  { name: "Charlie", views: 5200, likes: 300, comments: 120 },
  { name: "Dave", views: 1400, likes: 90, comments: 30 },
  { name: "Eve", views: 6000, likes: 400, comments: 150 },
  { name: "Frank", views: 4800, likes: 250, comments: 100 },
];

const chartConfig = {
  views: {
    label: "Views",
    color: "hsl(var(--chart-1))",
  },
  likes: {
    label: "Likes",
    color: "hsl(var(--chart-2))",
  },
  comments: {
    label: "Comments",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function ChartComponent() {
  return (
    <ChartContainer config={chartConfig} className="h-full text-white">
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        barCategoryGap="10%"
      >
        <CartesianGrid vertical={false} />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />

        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
          aria-label="Name Axis"
        />
        {/* <YAxis aria-label="Value Axis" /> */}
        <Legend />
        <Bar
          dataKey="views"
          fill="var(--color-views)"
          name="Views"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="likes"
          fill="var(--color-likes)"
          name="Likes"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="comments"
          fill="var(--color-comments)"
          name="Comments"
          radius={[4, 4, 0, 0]}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent labelFormatter={(value) => `Name: ${value}`} />
            // <ChartTooltipContent hideLabel />
          }
          cursor={false}
          defaultIndex={1}
        />
      </BarChart>
    </ChartContainer>
  );
}
