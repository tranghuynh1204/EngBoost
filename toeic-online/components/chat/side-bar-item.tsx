"use client";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate } from "@/types";
import { Badge } from "../ui/badge";

interface SideBarItemProps {
  _id: string;
  name: string;
  content: string;
  timestamp: string;
  unreadCount: number;
  onClick: () => void;
  isActive: boolean;
}

export const SideBarItem = ({
  _id,
  name,
  content,
  timestamp,
  unreadCount,
  onClick,
  isActive,
}: SideBarItemProps) => {
  console.log(timestamp);
  return (
    <div
      className={`flex items-center px-4 py-3 my-1 mt-2 cursor-pointer hover:bg-[#E9ECEF] transition duration-200 rounded-md ${
        isActive
          ? "bg-sky-100 text-zinc-700 font-semibold"
          : unreadCount > 0
          ? "font-semibold "
          : "text-zinc-700"
      }`}
      onClick={onClick}
    >
      {/* Avatar */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-12 min-h-[3rem] bg-[#343A40] rounded-full flex justify-center items-center text-white text-xl font-bold mr-4">
              {name.charAt(0).toUpperCase()}
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Text Content */}
      <div className="flex flex-col w-full">
        {/* Top row: Name and Timestamp */}
        <div className="flex justify-between items-center">
          <div className="truncate  font-semibold text-[#212529]">
            {name}
          </div>
          <Badge variant="sky" className="whitespace-nowrap">
            {formatDate(timestamp)}
          </Badge>
        </div>
        {/* Bottom row: Content and Unread badge */}
        <div className="flex justify-between items-center mt-1">
          <div className="truncate text-xs text-[#495057]">{content}</div>
          {unreadCount > 0 && (
            <Badge variant="sky" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};