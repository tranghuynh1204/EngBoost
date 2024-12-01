"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { SideBarItem } from "./side-bar-item";
import { Message } from "@/types";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";

export const SideBarChat = () => {
  const [userInboxs, setUserInboxs] = useState<Message[]>([]);
  const router = useRouter();
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
      }
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <ScrollArea className="flex flex-col space-y-4 min-w-[300px] w-full bg-white border-r border-gray-300 p-4">
      {userInboxs.map((item) => (
        <SideBarItem
          key={item.user._id}
          _id={item.user._id}
          name={item.user.name}
          content={item.content}
        />
      ))}
    </ScrollArea>
  );
};
