"use client";

import { FaSearch, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { Bar, BarChart, XAxis, Legend, CartesianGrid } from "recharts";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  followersCount: {
    label: "Followers",
    color: "hsl(var(--chart-1))",
  },
  viewsCount: {
    label: "Views",
    color: "hsl(var(--chart-2))",
  },
  totalLikes: {
    label: "Likes",
    color: "hsl(var(--chart-3))",
  },
  totalComments: {
    label: "Comments",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function ChartComponent() {
  const [originalData, setOriginalData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [activeTab, setActiveTab] = useState("followersCount");

  useEffect(() => {
    fetch("https://mediasocial-backend.yapzanan.workers.dev/statistics")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched Data:", data); // Debugging line
        const transformedData = data.data.map((channel) => ({
          name: channel.channelName,
          followersCount: channel.followersCount / 1000, // Normalize to millions
          viewsCount: channel.viewsCount / 1000, // Normalize to millions
          totalLikes: channel.totalLikes / 1000, // Normalize to millions
          totalComments: channel.totalComments / 1000, // Normalize to millions
        }));
        setOriginalData(transformedData);
        sortData(transformedData, activeTab);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    sortData(originalData, activeTab);
  }, [activeTab]);

  const sortData = (data, tab) => {
    const sortedData = [...data].sort((a, b) => b[tab] - a[tab]);
    const top5Data = sortedData.slice(0, 5);
    setChartData(top5Data);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Channel Statistics</CardTitle>
      </CardHeader>
      <CardContent className="">
        <div className="flex space-x-4 mb-4">
          {Object.keys(chartConfig).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 rounded-md ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {chartConfig[tab].label}
            </button>
          ))}
        </div>
        <div className="items-center flex justify-center">
          <ChartContainer config={chartConfig} className="w-3/4">
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barCategoryGap="10%"
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                aria-label="Name Axis"
              />
              <Legend formatter={(value) => `${value} (in thousand)`} />
              <Bar
                dataKey={activeTab}
                fill={chartConfig[activeTab].color}
                name={chartConfig[activeTab].label}
                radius={[8, 8, 8, 8]}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => `${value}`}
                    formatter={(value) => `${value.toFixed(2)}K`} // Display values in millions
                  />
                }
                cursor={false}
                defaultIndex={1}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
