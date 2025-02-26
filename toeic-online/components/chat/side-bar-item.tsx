"use client";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

interface SideBarItemProps {
  _id: string;
  name: string;
  content: string;
  unreadCount: number;
  onClick: () => void;
  isActive: boolean;
}

export const SideBarItem = ({
  _id,
  name,
  content,
  unreadCount,
  onClick,
  isActive,
}: SideBarItemProps) => {
  const router = useRouter();
  return (
    <div
      className={`flex px-2 cursor-pointer hover:bg-[#E9ECEF] transition duration-200 rounded-md ${
        isActive
          ? "bg-gray-100 text-blue-900 font-semibold" // Active chat styles
          : unreadCount > 0
          ? "font-semibold bg-[#F8F9FA]"
          : "text-gray-700"
      }`}
      onClick={onClick}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-10 h-10 mr-2 bg-[#343A40] rounded-full flex justify-center items-center text-white text-xl font-bold">
              {name.charAt(0).toUpperCase()}
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="space-y-1 w-full">
        <div className="flex justify-between items-center">
          <div
            className={`truncate ${
              unreadCount > 0
                ? "font-semibold text-[#212529]"
                : "text-[#495057]"
            }`}
          >
            {name}
          </div>
          {unreadCount > 0 && (
            <span className="bg-[#E03131] text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="truncate text-sm text-[#495057]">{content}</div>
      </div>
    </div>
  );
};
