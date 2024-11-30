import React, { useEffect, useState } from "react";
import { ChatInput } from "./chat-input";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { ChatContent } from "./chat-content";

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleChat = () => setIsOpen(!isOpen);
  const [socket, setSocket] =
    useState<Socket<DefaultEventsMap, DefaultEventsMap>>();
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    // Lấy userId từ localStorage
    const storedUserId = localStorage.getItem("userId") ?? "";
    setUserId(storedUserId);

    // Kết nối đến Socket.io
    const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
      transports: ["websocket"],
    });
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);
  if (userId)
    return (
      <div>
        <div className="fixed bottom-5 right-5 z-50">
          <button
            onClick={toggleChat}
            className="bg-blue-500 text-white w-14 h-14 rounded-full shadow-lg hover:bg-blue-600 transition duration-200 flex items-center justify-center text-xl"
          >
            💬
          </button>
        </div>

        {isOpen && (
          <div className="fixed bottom-20 right-5 w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col">
            {/* Header */}
            <div className="bg-blue-500 text-white font-bold py-2 px-4 flex justify-between items-center">
              <span>Chat</span>
              <button
                onClick={toggleChat}
                className="text-white text-lg hover:text-gray-200"
              >
                ✖
              </button>
            </div>

            <ChatContent socket={socket} />
            <ChatInput socket={socket} isAdmin={false} userId={userId} />
          </div>
        )}
      </div>
    );
};
