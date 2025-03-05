"use client";
import { ChatInput } from "@/components/chat/chat-input";
import { MessageItem } from "@/components/chat/message-item";
import { Message } from "@/types";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

const InboxIdPage = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const chatContainerRef = useRef<HTMLDivElement | null>(null); // Tham chiếu đến container
  const [socket, setSocket] =
    useState<Socket<DefaultEventsMap, DefaultEventsMap>>();
  const [loadMore, setLoadMore] = useState(false);
  const noMore = useRef(false);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop } = chatContainerRef.current;

      if (scrollTop === 0 && !loadMore && !noMore.current) {
        if (socket) {
          setLoadMore(true);
          socket.emit("load_old", { userId: id, skip: messages.length });
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
    const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
      transports: ["websocket"],
    });
    setSocket(socket);

    socket.emit("join_chat", id);
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
      socket.disconnect();
    };
  }, [id]);
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  return (
    <div>
      <div
        className="flex-1 overflow-y-auto h-[510px] bg-white p-4 space-y-3 rounded-t-lg "
        ref={chatContainerRef}
        onScroll={handleScroll}
      >
        {messages.map((message, index) => (
          <MessageItem
            key={index}
            timestamp={message.timestamp}
            content={message.content}
            isAdmin={!message.isAdmin}
          />
        ))}
      </div>
      <ChatInput socket={socket} isAdmin={true} userId={id as string} />
    </div>
  );
};

export default InboxIdPage;
