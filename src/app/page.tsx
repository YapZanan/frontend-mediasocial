"use client";

import { useState } from "react";
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

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="w-full flex flex-col min-h-screen pb-4 gap-4">
      {/* Header */}
      <header className="w-full flex justify-between items-center py-4 px-8 sticky top-0 rounded-xl bg-background z-10">
        <div className="flex items-center w-full max-w-xl border border-gray-300 rounded-full shadow-sm">
          <FaSearch className="text-gray-400 ml-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-full py-2 px-4 focus:outline-none bg-transparent rounded-full"
          />
        </div>
        {/* Action Buttons */}
        <div className="flex space-x-4 items-center">
          <IconButton icon={<GoPlus />} label="Add Item 1" />
          <IconButton icon={<GoDownload />} label="Add Item 2" />
          <IconButton icon={<MdPersonOutline />} label="Add Item 3" />
          <ModeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="p-4 w-full h-max">
        <div className="grid grid-cols-11 grid-rows-12 gap-2 min-h-screen">
          {/* Item 1 */}
          <div className="col-span-11 row-span-2 h-full rounded-lg items-center justify-center grid grid-cols-5 grid-rows-3 p-4">
            <div className="col-span-2 row-span-3 flex flex-col h-full items-left justify-center pl-8">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <h2 className="text-2xl font-extralight">New Report Employess</h2>
            </div>

            <div className="col-span-3 col-start-3 rounded-2xl flex items-center h-full justify-end px-4 py-2 gap-2">
              <DatePickerWithRange />
            </div>
            <div className="col-span-3 row-span-2 col-start-3 row-start-2 flex flex-row h-full gap-4 px-8">
              <SocialMediaCard
                bgColor="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-400 hover:via-pink-400 hover:to-orange-400"
                Icon={FaInstagram}
                count={150}
                onClick={() => console.log("Instagram clicked")}
              />

              <SocialMediaCard
                bgColor="bg-red-600"
                Icon={FaYoutube}
                count={150}
                onClick={() => console.log("YouTube clicked")}
              />
              <SocialMediaCard
                bgColor="bg-black"
                Icon={FaTiktok}
                count={150}
                onClick={() => console.log("TikTok clicked")}
              />
            </div>
          </div>

          {/* Item 2 */}
          <div className="col-span-8 row-start-3 h-full rounded-3xl shadow-xl flex items-center justify-start p-2 gap-2 bg-secondary">
            <ScrollArea className="w-full h-full overflow-x-auto gap-4 p-2 rounded-xl">
              <div className="flex gap-4">
                <div className="w-max h-full bg-background rounded-xl flex flex-row items-center px-4 gap-4 p-2 shadow-xl">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <p>User has uploaded a new post</p>
                </div>
                <div className="w-max h-full bg-background rounded-xl flex flex-row items-center px-4 gap-4 p-2 shadow-xl">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <p>User has uploaded a new post</p>
                </div>
                <div className="w-max h-full bg-background rounded-xl flex flex-row items-center px-4 gap-4 p-2 shadow-xl">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <p>User has uploaded a new post</p>
                </div>
                <div className="w-max h-full bg-background rounded-xl flex flex-row items-center px-4 gap-4 p-2 shadow-xl">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <p>User has uploaded a new post</p>
                </div>
                <div className="w-max h-full bg-background rounded-xl flex flex-row items-center px-4 gap-4 p-2 shadow-xl">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <p>User has uploaded a new post</p>
                </div>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          {/* Item 3 */}
          <div className="col-span-3 row-span-5 col-start-1 row-start-4 h-full bg-green-500 text-white border-2 border-green-400 rounded-3xl shadow-lg flex items-center justify-center">
            3
          </div>

          {/* Item 4 */}
          <div className="col-span-5 row-span-6 col-start-7 row-start-4 h-full bg-purple-500 text-white border-2 border-purple-400 rounded-3xl shadow-lg flex items-center justify-center">
            4
          </div>

          {/* Item 5 */}
          <div className="col-span-6 row-span-4 col-start-1 row-start-9 h-full text-white border-2 rounded-3xl shadow-lg flex p-4 items-center justify-center bg-background">
            <ChartComponent />
          </div>

          {/* Item 6 */}
          <div className="col-span-5 row-span-3 col-start-7 row-start-10 h-full bg-red-500 text-white border-2 border-red-400 rounded-3xl shadow-lg flex items-center justify-center">
            6
          </div>

          {/* Item 7 */}
          <div className="col-span-3 row-span-5 col-start-4 row-start-4 h-full bg-teal-500 text-white border-2 border-teal-400 rounded-3xl shadow-lg flex items-center justify-center">
            7
          </div>

          {/* Item 8 */}
          <div className="col-span-2 col-start-10 row-start-3 h-full bg-orange-500 text-white border-2 border-orange-400 rounded-3xl shadow-lg flex items-center justify-center">
            8
          </div>
        </div>
      </div>
    </div>
  );
}

interface IconButtonProps {
  icon: React.ReactNode;
  label: string;
}
const IconButton: React.FC<IconButtonProps> = ({ icon, label }) => {
  return (
    <Button
      aria-label={label}
      className="rounded-full w-14 h-14 flex items-center justify-center shadow-md hover:bg-gray-200 transition ease-in-out duration-200 bg-primary-foreground click"
    >
      <span className="text-3xl text-primary-foreground">{icon}</span>
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
      "rounded-2xl shadow-2xl w-1/3 flex flex-row items-center p-4 hover:bg-muted-foreground transform active:scale-95 transition-transform border-2 justify-center gap-6",
      bgColor
    )}
    onClick={onClick}
  >
    <Icon className="col-span-2 w-max h-full p-2 text-white" />
    <h1 className="col-span-3 text-3xl w-max font-bold text-white">{count}</h1>
  </button>
);
