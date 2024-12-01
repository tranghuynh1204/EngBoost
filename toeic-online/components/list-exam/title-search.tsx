// components/filters/TitleSearch.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface TitleSearchProps {
  onSearch: (title: string) => void;
  initialValue?: string;
}

export const TitleSearch: React.FC<TitleSearchProps> = ({
  onSearch,
  initialValue = "",
}) => {
  const [title, setTitle] = useState(initialValue);

  useEffect(() => {
    setTitle(initialValue);
  }, [initialValue]);

  const handleSearch = () => {
    onSearch(title);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Search by Title
      </label>
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyPress={handleKeyPress}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        placeholder="Enter exam title..."
      />
      <Button
        onClick={handleSearch}
        className="mt-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-900"
      >
        Search
      </Button>
    </div>
  );
};
