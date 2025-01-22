"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaSearch, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { MdPersonOutline } from "react-icons/md";
import { GoDownload, GoPlus } from "react-icons/go";
import { DatePickerWithRange } from "@/components/date-range-picker";
import { ModeToggle } from "@/components/mode-toggle";
import { ChartComponent } from "@/components/chart-component";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LineComponent } from "@/components/line-chart";

export default function Home() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [youtubeChannelCount, setYoutubeChannelCount] = useState(0);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"comments" | "likes">("comments");

  // Fetch YouTube channel count
  useEffect(() => {
    fetch("https://mediasocial-backend.yapzanan.workers.dev/channels")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Count the number of channels
        setYoutubeChannelCount(data.data.length);
      })
      .catch((error) => {
        console.error("Error fetching YouTube channels:", error);
      });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const endpoint =
        activeTab === "comments"
          ? "https://mediasocial-backend.yapzanan.workers.dev/videos/top-comments"
          : "https://mediasocial-backend.yapzanan.workers.dev/videos/top-likes";

      const res = await fetch(endpoint);
      const data = await res.json();
      setVideos(data.data);
      setLoading(false);
    };

    fetchData();
  }, [activeTab]);

  if (loading) {
    return (
      <div className="col-span-5 row-span-6 col-start-7 row-start-4 h-full bg-purple-500 text-white rounded-3xl shadow-lg flex items-center justify-center p-6">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-screen pb-4 gap-4 bg-background">
      {/* Header */}
      <header className="w-full flex justify-between items-center py-4 px-8 sticky top-0 rounded-xl bg-background/90 backdrop-blur-sm z-10 border-b">
        <div className="flex items-center w-full max-w-xl border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow">
          <FaSearch className="text-gray-400 ml-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-full py-2 px-4 focus:outline-none bg-transparent rounded-full placeholder:text-gray-400"
          />
        </div>
        {/* Action Buttons */}
        <div className="flex space-x-4 items-center">
          <IconButton
            icon={<GoPlus />}
            label="Add Item 1"
            onClick={() => router.push("/getData")}
          />
          <IconButton icon={<GoDownload />} label="Add Item 2" />
          <IconButton icon={<MdPersonOutline />} label="Add Item 3" />
          <ModeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="p-4 w-full h-max">
        <div className="grid grid-cols-11 grid-rows-12 gap-4 min-h-screen">
          {/* Item 1 */}
          <div className="col-span-11 row-span-2 h-full rounded-lg bg-background shadow-lg flex items-center justify-between p-8">
            <div className="flex flex-col h-full justify-center">
              <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
              <h2 className="text-2xl font-extralight text-muted-foreground">
                New Report Employees
              </h2>
            </div>

            <div className="flex flex-col items-center gap-4">
              <DatePickerWithRange />
              <div className="flex gap-4">
                <SocialMediaCard
                  bgColor="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-400 hover:via-pink-400 hover:to-orange-400"
                  Icon={FaInstagram}
                  count={150}
                  onClick={() => console.log("Instagram clicked")}
                />

                <SocialMediaCard
                  bgColor="bg-red-600 hover:bg-red-500"
                  Icon={FaYoutube}
                  count={youtubeChannelCount}
                  onClick={() => router.push("/youtube")}
                />
                <SocialMediaCard
                  bgColor="bg-black hover:bg-gray-800"
                  Icon={FaTiktok}
                  count={150}
                  onClick={() => console.log("TikTok clicked")}
                />
              </div>
            </div>
          </div>

          {/* Item 2 */}
          <div className="col-span-8 row-start-3 h-full rounded-3xl shadow-lg bg-background flex items-center justify-start p-4">
            <ScrollArea className="w-full h-full overflow-x-auto gap-4 rounded-xl">
              <div className="flex gap-4">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="w-max h-full bg-secondary rounded-xl flex flex-row items-center px-4 gap-4 p-2 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <p className="text-muted-foreground">
                      User has uploaded a new post
                    </p>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          {/* Item 3 */}
          <div className="col-span-3 row-span-5 col-start-1 row-start-4 h-full bg-green-500 text-white rounded-3xl shadow-lg flex items-center justify-center">
            <div className="p-6 rounded-lg shadow-lg bg-gray-100 w-full h-full">
              <div className="flex justify-between items-center mb-6">
                <div className="text-gray-800 text-xl font-semibold">
                  Filters
                </div>
                <button className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 15.414V19a1 1 0 01-.293.707l-3 3A1 1 0 019 22h-.586a1 1 0 01-.707-.293l-3-3A1 1 0 015 19v-3.586L3.293 6.707A1 1 0 013 6V4z"
                    />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                {/* Instagram Filter */}
                <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <FaInstagram className="text-pink-600 w-6 h-6" />
                    <span className="text-gray-800 font-medium">Instagram</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:bg-blue-600 transition-colors">
                      <div className="after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    </div>
                  </label>
                </div>

                {/* TikTok Filter */}
                <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <FaTiktok className="text-black w-6 h-6" />
                    <span className="text-gray-800 font-medium">TikTok</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:bg-blue-600 transition-colors">
                      <div className="after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    </div>
                  </label>
                </div>

                {/* YouTube Filter */}
                <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <FaYoutube className="text-red-600 w-6 h-6" />
                    <span className="text-gray-800 font-medium">YouTube</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:bg-blue-600 transition-colors">
                      <div className="after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Item 4 */}
          <div className="col-span-5 row-span-6 col-start-7 row-start-4 h-full text-white rounded-3xl shadow-2xl flex flex-col items-center p-8 bg-gradient-to-br from-slate-800 to-slate-900">
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveTab("comments")}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === "comments"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                Top Commented Videos
              </button>
              <button
                onClick={() => setActiveTab("likes")}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === "likes"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                Top Liked Videos
              </button>
            </div>
            <h2 className="text-3xl font-bold mb-6 text-primary">
              {activeTab === "comments"
                ? "Top Commented Videos"
                : "Top Liked Videos"}
            </h2>
            <ul className="w-full space-y-4">
              {videos.map((video) => (
                <li key={video.videoId}>
                  <Link
                    href={`https://www.youtube.com/watch?v=${video.videoId}`}
                    passHref
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="block p-6 bg-slate-700 hover:bg-slate-600 rounded-xl transition-all duration-300 cursor-pointer transform hover:scale-105 shadow-md">
                      <h3 className="text-xl font-semibold mb-2">
                        {video.title}
                      </h3>
                      <p className="text-sm text-slate-300 mb-1">
                        {video.channelName}
                      </p>
                      <p className="text-sm text-slate-400">
                        {activeTab === "comments"
                          ? `${video.comments} comments`
                          : `${video.likes} likes`}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Item 5 */}
          <div className="col-span-6 row-span-4 col-start-1 row-start-9 h-full rounded-3xl shadow-lg flex items-center justify-center bg-background">
            <ChartComponent />
          </div>

          {/* Item 6 */}
          <div className="col-span-5 row-span-3 col-start-7 row-start-10 h-full text-white rounded-3xl shadow-lg flex items-center justify">
            <LineComponent />
          </div>

          {/* Item 7 */}
          <div className="col-span-3 row-span-5 col-start-4 row-start-4 h-full bg-background text-white rounded-3xl shadow-lg flex items-center justify-center p-6">
            {/* <h2 className="text-2xl font-bold">Item 7</h2> */}
          </div>

          {/* Item 8 */}
          <div className="col-span-2 col-start-10 row-start-3 h-full bg-orange-500 text-white rounded-3xl shadow-lg flex items-center justify-center">
            <Button
              className="text-2xl font-bold h-full w-full bg-accent-foreground rounded-3xl"
              onClick={() => router.push("/youtube")}
            >
              Buka Timeline
            </Button>
          </div>
        </div>
      </div>
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

interface SocialMediaCardProps {
  bgColor: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  count: number;
  onClick: () => void;
}

const SocialMediaCard: React.FC<SocialMediaCardProps> = ({
  bgColor,
  Icon,
  count,
  onClick,
}) => (
  <button
    className={cn(
      "rounded-2xl shadow-lg w-32 h-20 flex flex-row items-center p-4 hover:shadow-xl transition-shadow justify-center gap-4",
      bgColor
    )}
    onClick={onClick}
  >
    <Icon className="w-8 h-8 text-white" />
    <h1 className="text-2xl font-bold text-white">{count}</h1>
  </button>
);
