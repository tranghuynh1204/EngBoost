import { formatDate } from "@/types";
import React, { memo, useState } from "react";

interface MessageItemProps {
  timestamp: string;
  content: string;
  isAdmin: boolean;
}

export const MessageItem = memo(
  ({ content, isAdmin, timestamp }: MessageItemProps) => {
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
      setIsClicked(!isClicked); // Toggle trạng thái
    };

    return (
      <div
        className={`flex flex-col ${
          isAdmin ? "items-start" : "items-end"
        } transition-all duration-300`}
        onClick={handleClick}
      >
        {/* Message Bubble */}
        {/* Message Bubble */}
        <div
          className={`relative max-w-[70%] p-3 rounded-lg shadow-md transition-transform duration-200 ${
            isAdmin
              ? "bg-[#E9ECEF] text-[#212529]" // Other users' messages
              : "bg-[#343A40] text-white" // My messages
          } ${
            isClicked ? "translate-y-[-5px]" : "translate-y-0"
          } hover:shadow-lg`}
        >
          <p className="text-sm break-words">{content}</p>
        </div>

        {/* Timestamp (Visible on click) */}
        {isClicked && (
          <div className="text-xs text-gray-500 mt-2 break-words">
            {formatDate(timestamp)}
          </div>
        )}
      </div>
    );
  }
);

MessageItem.displayName = "MessageItem";
