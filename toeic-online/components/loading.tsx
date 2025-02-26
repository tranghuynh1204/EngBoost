import { CircleStackIcon } from "@heroicons/react/24/solid";
import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center">
        <CircleStackIcon className="h-10 w-10 text-blue-500 animate-spin" />
        <p className="text-gray-500 text-lg mt-2">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
