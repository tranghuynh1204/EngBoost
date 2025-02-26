"use client";

import React, { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { SideBarItem } from "./side-bar-item";
import { Message } from "@/types";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";

export const SideBarChat = () => {
  const [userInboxs, setUserInboxs] = useState<Message[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const router = useRouter();
  const [activeUserId, setActiveUserId] = useState<string | null>(null); // Track active user

  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
      transports: ["websocket"],
    });

    socket.emit("admin");

    socket.on("new_message", (newMessage) => {
      if (newMessage.length || newMessage.length === 0) {
        setUserInboxs((prevMessages) => [...prevMessages, ...newMessage]);
      } else {
        setUserInboxs((prevMessages) => [
          newMessage,
          ...prevMessages.filter(
            (item) => item.user._id !== newMessage.user._id
          ),
        ]);

        // Cập nhật số lượng tin nhắn chưa đọc
        setUnreadCounts((prevCounts) => ({
          ...prevCounts,
          [newMessage.user._id]: (prevCounts[newMessage.user._id] || 0) + 1,
        }));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleUserClick = (userId: string) => {
    setActiveUserId(userId);
    router.replace(`/admin/inbox/${userId}`);
    setUnreadCounts((prevCounts) => ({
      ...prevCounts,
      [userId]: 0, // Đặt số tin nhắn chưa đọc về 0 khi người dùng nhấp vào
    }));
  };

  return (
    <ScrollArea className="flex flex-col space-y-4 min-w-[300px] w-full bg-white border-r border-gray-300 p-4">
      {userInboxs.map((item) => (
        <SideBarItem
          key={item.user._id}
          _id={item.user._id}
          name={item.user.name}
          content={item.content}
          unreadCount={unreadCounts[item.user._id] || 0}
          onClick={() => handleUserClick(item.user._id)}
          isActive={activeUserId === item.user._id}
        />
      ))}
    </ScrollArea>
  );
};
