import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { formatTime } from "@/types";
interface CounterProps {
  onSubmit: () => void;
  counter: number;
  isSubmit: boolean;
}
export const Counter = ({ onSubmit, counter, isSubmit }: CounterProps) => {
  const [count, setCount] = useState(counter);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        <span>
          <span className="font-bold">{formatTime(count)}</span>
        </span>
      </h2>
      <div className="mb-6">
        <Button
          onClick={onSubmit}
          disabled={isSubmit}
          className="w-full flex items-center justify-center px-4 py-2 border border-white bg-black text-white rounded-lg shadow hover:bg-gray-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Nộp bài
        </Button>
      </div>
    </div>
  );
};
