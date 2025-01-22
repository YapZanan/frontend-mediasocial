"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { fetchVideos } from "@/utils/fetchVideos";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { GoPlus } from "react-icons/go";
import { Button } from "@/components/ui/button";

interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  url: string;
}

interface VideoStatistics {
  id: string;
  videoId: string;
  statistics: {
    likeCount: string;
    viewCount: string;
    commentCount: string;
    favoriteCount: string;
  };
  recordedAt: string;
}

const AddVideoCard = ({ onClose }) => {
  const [url, setUrl] = useState("");

  const handleAdd = async () => {
    try {
      // Call the API with the provided URL
      const response = await fetch(
        `https://mediasocial-backend.yapzanan.workers.dev/?url=${encodeURIComponent(
          url
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data from the API");
      }

      const result = await response.json();
      console.log("API Response:", result);

      // Close the card
      onClose();

      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error("Error calling the API:", error);
      alert("Failed to add the URL. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Add Video URL</h2>
        <input
          type="text"
          placeholder="Enter video URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <div className="flex justify-end space-x-2">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleAdd}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Youtube() {
  const [data, setData] = useState<Video[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedVideoStats, setSelectedVideoStats] = useState<
    VideoStatistics[]
  >([]);
  const [activeTab, setActiveTab] = useState<
    "likes" | "views" | "comments" | "favorites"
  >("likes");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<Video[]>([]);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const limit = 20;

  const loadMoreData = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const result = await fetchVideos(page, limit);
      setData((prevData) => [...prevData, ...result.videos]);
      setPage((prevPage) => prevPage + 1);

      if (result.videos.length < limit) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  useInfiniteScroll(loadMoreData);

  const handleCardClick = async (videoId: string) => {
    try {
      const response = await fetch(
        `https://mediasocial-backend.yapzanan.workers.dev/videos/statistics?videoIds=${videoId}`
      );
      const result = await response.json();
      if (result.data && result.data.length > 0) {
        setSelectedVideoStats(result.data);
      } else {
        setSelectedVideoStats([]);
      }
    } catch (error) {
      console.error("Error fetching video statistics:", error);
      setSelectedVideoStats([]);
    }
  };

  const formatChartData = (stats: VideoStatistics[]) => {
    if (!stats || !Array.isArray(stats)) return [];
    return stats.map((stat) => ({
      recordedAt: new Date(stat.recordedAt).toLocaleDateString(),
      likeCount: parseInt(stat.statistics.likeCount),
      viewCount: parseInt(stat.statistics.viewCount),
      commentCount: parseInt(stat.statistics.commentCount),
      favoriteCount: parseInt(stat.statistics.favoriteCount),
    }));
  };

  const getActiveDataKey = () => {
    switch (activeTab) {
      case "likes":
        return "likeCount";
      case "views":
        return "viewCount";
      case "comments":
        return "commentCount";
      case "favorites":
        return "favoriteCount";
      default:
        return "likeCount";
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = data.filter((video) =>
      video.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleOpenPopup = (videoId: string) => {
    handleCardClick(videoId);
  };

  const videosToDisplay = searchQuery ? filteredData : data;

  return (
    <div className="p-4">
      <div className="flex flex-row justify-between px-8">
        <h1 className="text-2xl font-bold mb-4">YouTube Videos</h1>

        <div className="flex space-x-4 items-center">
          <IconButton
            icon={<GoPlus />}
            label="Add Item 1"
            onClick={() => setIsCardVisible(true)}
          />
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search videos..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videosToDisplay.map((video) => (
          <Card
            key={video.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCardClick(video.id)}
          >
            <CardContent className="p-0">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <CardHeader className="p-4">
                <CardTitle className="text-lg">{video.title}</CardTitle>
              </CardHeader>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Display Video Statistics with Chart */}
      {selectedVideoStats.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full">
            <h2 className="text-xl font-bold mb-4">
              Video Statistics Over Time
            </h2>

            {/* Tabbed Pane */}
            <div className="flex space-x-4 mb-4">
              <button
                className={`px-4 py-2 rounded ${
                  activeTab === "likes"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setActiveTab("likes")}
              >
                Likes
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  activeTab === "views"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setActiveTab("views")}
              >
                Views
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  activeTab === "comments"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setActiveTab("comments")}
              >
                Comments
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  activeTab === "favorites"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setActiveTab("favorites")}
              >
                Favorites
              </button>
            </div>

            {/* Chart */}
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formatChartData(selectedVideoStats)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="recordedAt" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey={getActiveDataKey()}
                    stroke={
                      activeTab === "likes"
                        ? "#8884d8"
                        : activeTab === "views"
                        ? "#82ca9d"
                        : activeTab === "comments"
                        ? "#ffc658"
                        : "#ff7300"
                    }
                    name={
                      activeTab === "likes"
                        ? "Likes"
                        : activeTab === "views"
                        ? "Views"
                        : activeTab === "comments"
                        ? "Comments"
                        : "Favorites"
                    }
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Close Button */}
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setSelectedVideoStats([])}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {Array.from({ length: limit }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-0">
                <Skeleton className="w-full h-48 rounded-t-lg" />
                <CardHeader className="p-4">
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No More Data */}
      {!hasMore && (
        <div className="text-center mt-4 text-gray-500">
          No more videos to load.
        </div>
      )}

      {/* Add Video Card */}
      {isCardVisible && (
        <AddVideoCard
          onAdd={(url) => {
            // Handle the URL addition logic here
            console.log("Added URL:", url);
          }}
          onClose={() => setIsCardVisible(false)}
        />
      )}
    </div>
  );
}

interface IconButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}
const IconButton: React.FC<IconButtonProps> = ({ icon, label, onClick }) => {
  return (
    <Button
      aria-label={label}
      className="rounded-full w-14 h-14 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow bg-primary-foreground hover:bg-primary-foreground/90"
      onClick={onClick}
    >
      <span className="text-3xl text-primary">{icon}</span>
    </Button>
  );
};
