// components/filters/DateFilter.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface DateFilterProps {
  onSelect: (startDate: string, endDate: string) => void;
  startDate?: string;
  endDate?: string;
}

export const DateFilter: React.FC<DateFilterProps> = ({
  onSelect,
  startDate: initialStartDate = "",
  endDate: initialEndDate = "",
}) => {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  useEffect(() => {
    setStartDate(initialStartDate);
  }, [initialStartDate]);

  useEffect(() => {
    setEndDate(initialEndDate);
  }, [initialEndDate]);

  const handleFilter = () => {
    onSelect(startDate, endDate);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Filter by Creation Date
      </label>
      <div className="flex space-x-2">
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mt-1 block w-1/2 p-2 border border-gray-300 rounded-md"
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="mt-1 block w-1/2 p-2 border border-gray-300 rounded-md"
        />
      </div>
      <Button
        onClick={handleFilter}
        className="mt-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-900"
      >
        Apply
      </Button>
    </div>
  );
};
