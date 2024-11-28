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
        } transition-all`}
        onClick={handleClick}
        style={{
          marginBottom: isClicked ? "10px" : "5px", // Nhích nhẹ lên khi click
        }}
      >
        {/* Tin nhắn */}
        <div
          className={`relative max-w-[70%] p-3 rounded-lg shadow-md block ${
            isAdmin ? "bg-blue-100" : "bg-green-100"
          }`}
        >
          <p className="text-sm text-gray-800 break-words">{content}</p>
        </div>

        {/* Thời gian, sẽ xuất hiện dưới tin nhắn khi click */}
        {isClicked && (
          <div className="text-xs text-gray-500 mt-2 ml-2 break-words">
            {formatDate(timestamp)}
          </div>
        )}
      </div>
    );
  }
);

MessageItem.displayName = "MessageItem";
