"use client";

import React, { useState } from "react";

// Sample data (replace with your dynamic data source)
const sampleConversations = [
  {
    id: "1",
    user: { _id: "1", name: "Alice" },
    content: "Hey, I need help with my account!",
    timestamp: "2025-03-04T20:00:00Z",
  },
  {
    id: "2",
    user: { _id: "2", name: "Bob" },
    content: "New message regarding the recent update.",
    timestamp: "2025-03-04T18:30:00Z",
  },
  {
    id: "3",
    user: { _id: "3", name: "Charlie" },
    content: "Quick question about pricing.",
    timestamp: "2025-03-04T17:15:00Z",
  },
];
const InboxPage = () => {
  const [sortOrder, setSortOrder] = useState<"newest" | "random">("newest");

  // Copy the data to avoid mutating the original array
  const conversations = [...sampleConversations].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    // Random order: simple shuffle
    return Math.random() - 0.5;
  });

  return (
    <div suppressHydrationWarning={true} className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Inbox Card at the top */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {/* Header */}
          <header className="mb-8 text-center">
            <h1 className="text-xl font-bold text-gray-800 mb-2">Inbox</h1>
            <p className="text-gray-500 text-xs">
              View and manage your latest messages efficiently.
            </p>
          </header>

          {/* Sort Toggle */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setSortOrder("newest")}
              className={`px-4 py-1 text-xs border rounded-l-full focus:outline-none transition ${
                sortOrder === "newest"
                  ? "bg-blue-100 text-sky-600 border-sky-300"
                  : "bg-white text-gray-600 border-gray-300"
              }`}
            >
              Newest
            </button>
            <button
              onClick={() => setSortOrder("random")}
              className={`px-4 py-1 text-xs border rounded-r-full focus:outline-none transition ${
                sortOrder === "random"
                  ? "bg-blue-100 text-sky-600 border-sky-300"
                  : "bg-white text-gray-600 border-gray-300"
              }`}
            >
              Random
            </button>
          </div>

          {/* Conversation Cards */}
          <div className="space-y-6">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className="bg-white text-sm border border-gray-200 rounded-lg p-5 hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer"
                onClick={() => alert(`Open conversation with ${conv.user.name}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {/* User Avatar */}
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {conv.user.name.charAt(0).toUpperCase()}
                    </div>
                    {/* Name and Message Preview */}
                    <div className="ml-4">
                      <h3 className=" font-medium text-gray-800 truncate">
                        {conv.user.name}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {conv.content}
                      </p>
                    </div>
                  </div>
                  {/* Timestamp */}
                  <div className="text-xs text-gray-400">
                    {new Date(conv.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional page content can go here */}
      </div>
    </div>
  );
};

export default InboxPage;