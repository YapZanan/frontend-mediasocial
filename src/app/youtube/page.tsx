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
import { Loader2 } from "lucide-react";

interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  url: string;
  uploadedAt: string;
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

const AddVideoCard = ({ onClose, onAdd }) => {
  const [url, setUrl] = useState("");

  const handleAdd = async () => {
    try {
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

      onClose();
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

const BatchImportCard = ({ onClose, onBatchImport }) => {
  const [urls, setUrls] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const extractUsername = (url) => {
    const match = url.match(/youtube\.com\/@([^/?]+)/);
    if (match && match[1]) {
      return `@${match[1]}`;
    }
    return null;
  };

  const handleBatchImport = async () => {
    const urlList = urls
      .split("\n")
      .map((url) => url.trim())
      .map((url) => extractUsername(url))
      .filter((username) => username !== null);

    if (urlList.length === 0) {
      alert("No valid YouTube channel usernames found.");
      return;
    }

    setIsLoading(true);

    try {
      for (const username of urlList) {
        try {
          const apiUrl = `https://mediasocial-backend.yapzanan.workers.dev/?url=${username}`;
          const response = await fetch(apiUrl);

          if (!response.ok) {
            throw new Error(`Failed to fetch data for ${username}`);
          }

          const result = await response.json();
          console.log("API Response for", username, ":", result);
        } catch (error) {
          console.error("Error processing", username, ":", error);
        }
      }
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error during batch import:", error);
      alert("Failed to batch import. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">
          Batch Import YouTube Channels
        </h2>
        <textarea
          placeholder="Enter YouTube channel URLs (one per line)..."
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4 h-32"
          disabled={isLoading}
        />
        <div className="flex justify-end space-x-2">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleBatchImport} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Importing...
              </>
            ) : (
              "Import"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

const fetchUserTimezone = async () => {
  try {
    const response = await fetch("https://ipapi.co/timezone/");
    if (!response.ok) {
      throw new Error("Failed to fetch timezone");
    }
    const timezone = await response.text();
    return timezone;
  } catch (error) {
    console.error("Error fetching timezone:", error);
    return "UTC"; // Fallback to UTC if the request fails
  }
};

const formatDateToLocal = (dateString, timezone) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    timeZone: timezone,
    hour12: false, // Use 24-hour format
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
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
  const [isBatchImportVisible, setIsBatchImportVisible] = useState(false);
  const [userTimezone, setUserTimezone] = useState("UTC");
  const limit = 20;

  useEffect(() => {
    // Fetch the user's timezone when the component mounts
    fetchUserTimezone().then(setUserTimezone);
  }, []);

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

  const videosToDisplay = searchQuery ? filteredData : data;

  return (
    <div className="p-4">
      <div className="flex flex-row justify-between px-8">
        <h1 className="text-2xl font-bold mb-4">YouTube Videos</h1>

        <div className="flex space-x-4 items-center">
          <IconButton
            icon={<GoPlus />}
            label="Add Item"
            onClick={() => setIsCardVisible(true)}
          />
          <Button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => setIsBatchImportVisible(true)}
          >
            Batch Import
          </Button>
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
                <div>{formatDateToLocal(video.uploadedAt, userTimezone)}</div>
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
            console.log("Added URL:", url);
          }}
          onClose={() => setIsCardVisible(false)}
        />
      )}

      {/* Batch Import Card */}
      {isBatchImportVisible && (
        <BatchImportCard
          onBatchImport={handleBatchImport}
          onClose={() => setIsBatchImportVisible(false)}
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
