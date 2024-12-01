import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Message } from "@/types";
import { MessageItem } from "./message-item";
interface ChatContentProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;
}
export const ChatContent = ({ socket }: ChatContentProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const chatContainerRef = useRef<HTMLDivElement | null>(null); // Tham chiếu đến container
  const hasJoined = useRef(false);
  // Hàm cuộn xuống cuối
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    if (socket) {
      const userId = localStorage.getItem("userId") || "";
      if (!hasJoined.current) {
        socket.emit("join_chat", userId);
        hasJoined.current = true;
      }
      socket.on("new_message", (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, ...newMessage]);
      });
      return () => {
        socket.off("new_message");
      };
    }
  }, [socket]);

  return (
    <div
      className="flex-1 overflow-y-auto h-full bg-[#F8F9FA] p-4 space-y-3 rounded-lg shadow-inner"
      ref={chatContainerRef}
    >
      {messages.map((message, index) => (
        <MessageItem
          key={index}
          timestamp={message.timestamp}
          content={message.content}
          isAdmin={message.isAdmin}
        />
      ))}
    </div>
  );
};
