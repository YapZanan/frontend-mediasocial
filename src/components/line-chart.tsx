"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

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

// Updated data for TikTok, YouTube, and Instagram views
const chartData = [
  { month: "January", tiktok: 186000, youtube: 80000, instagram: 120000 },
  { month: "February", tiktok: 305000, youtube: 200000, instagram: 150000 },
  { month: "March", tiktok: 237000, youtube: 120000, instagram: 180000 },
  { month: "April", tiktok: 73000, youtube: 190000, instagram: 90000 },
  { month: "May", tiktok: 209000, youtube: 130000, instagram: 110000 },
  { month: "June", tiktok: 214000, youtube: 140000, instagram: 130000 },
];

// Updated chart configuration for TikTok, YouTube, and Instagram
const chartConfig = {
  tiktok: {
    label: "TikTok",
    color: "hsl(var(--chart-1))",
  },
  youtube: {
    label: "YouTube",
    color: "hsl(var(--chart-2))",
  },
  instagram: {
    label: "Instagram",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function LineComponent() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Line Chart - Social Media Views</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="tiktok"
              type="monotone"
              stroke="var(--color-tiktok)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="youtube"
              type="monotone"
              stroke="var(--color-youtube)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="instagram"
              type="monotone"
              stroke="var(--color-instagram)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total views for TikTok, YouTube, and Instagram over the
              last 6 months
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
