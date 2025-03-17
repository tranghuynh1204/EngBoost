"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { formatTime } from "@/types";

interface CounterProps {
  onSubmit: () => void;
  counter: number;
  isSubmit: boolean;
}

// Changed from named export to default export
export default function Counter({ onSubmit, counter, isSubmit }: CounterProps) {
  const [count, setCount] = useState(counter);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 mt-2 text-center text-cyan-700">
        <span className="font-bold">{formatTime(count)}</span>
      </h2>
      <div className="mb-6">
        <Button
          onClick={onSubmit}
          disabled={isSubmit}
          className="w-full flex items-center justify-center bg-cyan-700 text-sm text-white px-4 py-2 rounded-lg hover:bg-cyan-800"
        >
          Submit
        </Button>
      </div>
    </div>
  );
}