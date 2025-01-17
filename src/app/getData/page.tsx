/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, ThumbsUp, MessageCircle, Clock, Video } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

export default function Home() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://backend-youtube.yapzanan.workers.dev/?url=${encodeURIComponent(
          url
        )}`
      );
      const text = await response.text();
      try {
        const result = JSON.parse(text);
        setData(result);
      } catch (jsonError) {}
    } catch (error) {}
    setLoading(false);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "short",
    }).format(num);
  };

  const getChartData = (dataKey, limit = 5) => {
    if (!data) return [];
    return data.videos
      .sort((a, b) => parseInt(b[dataKey]) - parseInt(a[dataKey])) // Keep sorting for charts
      .slice(0, limit)
      .map((video) => ({
        title:
          video.title.length > 15
            ? video.title.slice(0, 15) + "..."
            : video.title,
        fullTitle: video.title, // for tooltip
        [dataKey]: parseInt(video[dataKey]) || 0,
      }));
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>YouTube Channel Statistics</CardTitle>
          <CardDescription>
            Enter a YouTube channel URL to fetch statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter YouTube channel URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button onClick={fetchData} disabled={loading}>
              {loading ? "Fetching..." : "Fetch Data"}
            </Button>
          </div>
        </CardContent>
        {error && (
          <CardFooter>
            <p className="text-red-500">{error}</p>
          </CardFooter>
        )}
      </Card>

      {data && (
        <>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Channel Overview</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Video className="h-5 w-5 text-blue-500" />
                <span>Total Videos: {data.totalVideos}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-green-500" />
                <span>Elapsed Time: {data.elapsedTime}ms</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-purple-500" />
                <span>
                  Total Views:{" "}
                  {formatNumber(
                    data.videos.reduce(
                      (sum, video) => sum + parseInt(video.viewCount),
                      0
                    )
                  )}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <ThumbsUp className="h-5 w-5 text-yellow-500" />
                <span>
                  Total Likes:{" "}
                  {formatNumber(
                    data.videos.reduce(
                      (sum, video) => sum + parseInt(video.likeCount),
                      0
                    )
                  )}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-pink-500" />
                <span>
                  Total Comments:{" "}
                  {formatNumber(
                    data.videos.reduce(
                      (sum, video) => sum + (parseInt(video.commentCount) || 0),
                      0
                    )
                  )}
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Top 5 Videos by Views</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    viewCount: {
                      label: "Views",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getChartData("viewCount")}
                      margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
                    >
                      <XAxis
                        dataKey="title"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        interval={0}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis tickFormatter={formatNumber} width={60} />
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background p-2 rounded-lg border shadow-sm">
                                <p className="font-medium">
                                  {payload[0].payload.fullTitle}
                                </p>
                                <p>{formatNumber(payload[0].value)} views</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="viewCount" fill="var(--color-viewCount)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Top 5 Videos by Likes</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    likeCount: {
                      label: "Likes",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getChartData("likeCount")}
                      margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
                    >
                      <XAxis
                        dataKey="title"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        interval={0}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis tickFormatter={formatNumber} width={60} />
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background p-2 rounded-lg border shadow-sm">
                                <p className="font-medium">
                                  {payload[0].payload.fullTitle}
                                </p>
                                <p>{formatNumber(payload[0].value)} likes</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="likeCount" fill="var(--color-likeCount)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Top 5 Videos by Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    commentCount: {
                      label: "Comments",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[300px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getChartData("commentCount")}
                      margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
                    >
                      <XAxis
                        dataKey="title"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        interval={0}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis tickFormatter={formatNumber} width={60} />
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background p-2 rounded-lg border shadow-sm">
                                <p className="font-medium">
                                  {payload[0].payload.fullTitle}
                                </p>
                                <p>{formatNumber(payload[0].value)} comments</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        dataKey="commentCount"
                        fill="var(--color-commentCount)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>All Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Thumbnail</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Likes</TableHead>
                    <TableHead>Comments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* No sorting here, just map through the videos as they are */}
                  {data.videos.map((video) => (
                    <TableRow key={video.videoID}>
                      <TableCell>
                        <Image
                          src={video.thumbnailUrl || "/placeholder.svg"}
                          alt={`Thumbnail for ${video.title}`}
                          width={120}
                          height={90}
                          className="rounded-md"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {video.title}
                        </a>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Eye className="h-4 w-4" />
                          <span>{formatNumber(video.viewCount)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{formatNumber(video.likeCount)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <MessageCircle className="h-4 w-4" />
                          <span>{formatNumber(video.commentCount)}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
