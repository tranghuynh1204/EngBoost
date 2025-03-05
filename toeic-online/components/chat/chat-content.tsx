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
  const [loadMore, setLoadMore] = useState(false);
  const noMore = useRef(false);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop } = chatContainerRef.current;

      if (scrollTop === 0 && !loadMore && !noMore.current) {
        if (socket) {
          setLoadMore(true);
          const userId = localStorage.getItem("userId") || "";
          socket.emit("load_old", { userId, skip: messages.length });
        }
        setLoadMore(false);
      }
    }
  };
  useEffect(() => {
    if (chatContainerRef.current) {
      const { scrollTop } = chatContainerRef.current;
      if (scrollTop !== 0) {
        scrollToBottom();
      }
    }
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
      socket.on("old_message", (oldMessage) => {
        if (oldMessage.length === 0) {
          noMore.current = true;
        }
        setMessages((prevMessages) => [...oldMessage, ...prevMessages]);
      });
      return () => {
        socket.off("new_message");
        socket.off("old_message");
      };
    }
  }, [socket]);

  return (
    <div
      className="flex-1 overflow-y-auto h-full bg-white p-4 space-y-3 rounded-lg shadow-inner"
      ref={chatContainerRef}
      onScroll={handleScroll}
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
