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
      if (Array.isArray(newMessage)) {
        const enrichedMessages = newMessage.map((msg) => ({
          ...msg,
          user: msg.user || { _id: "default", name: "Unknown" },
          timestamp: msg.timestamp || new Date().toISOString(),
        }));
        const updatedCounts = { ...unreadCounts };
        enrichedMessages.forEach((msg) => {
          // Now msg.user is always defined.
          updatedCounts[msg.user._id] = (updatedCounts[msg.user._id] || 0) + 1;
        });
        setUserInboxs((prevMessages) => [...prevMessages, ...enrichedMessages]);
        setUnreadCounts(updatedCounts);
      } else {
        const enrichedMessage = {
          ...newMessage,
          user: newMessage.user || { _id: "default", name: "Unknown" },
          timestamp: newMessage.timestamp || new Date().toISOString(),
        };
        setUserInboxs((prevMessages) => [
          enrichedMessage,
          ...prevMessages.filter(
            (item) => item.user._id !== enrichedMessage.user._id
          ),
        ]);
        setUnreadCounts((prevCounts) => ({
          ...prevCounts,
          [enrichedMessage.user._id]:
            (prevCounts[enrichedMessage.user._id] || 0) + 1,
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
    <ScrollArea className="flex flex-col  min-w-[200px] max-h-[600px] rounded-md bg-slate-50 border border-slate-300 ">
      {userInboxs.map((item) => (
        <SideBarItem
          key={item.user._id}
          _id={item.user._id}
          name={item.user.name}
          content={item.content}
          timestamp={item.timestamp}
          unreadCount={unreadCounts[item.user._id] || 0}
          onClick={() => handleUserClick(item.user._id)}
          isActive={activeUserId === item.user._id}
        />
      ))}
    </ScrollArea>
  );
};
