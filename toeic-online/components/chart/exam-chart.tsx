"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import axios from "axios";
import { TbChartBar } from "react-icons/tb";

const chartConfig = {
  value: {
    label: "Value",
  },
  toeic: {
    label: "Toeic",
    color: "#0284c7",
  },
  ielts: {
    label: "Ielts",
    color: "#38bdf8",
  },
  "part 1": {
    label: "Section",
    color: "#06b6d4",
  },
} satisfies ChartConfig;

export const ExamChart = () => {
  const [total, setTotal] = useState<number | undefined>();
  const [data, setData] = useState<any[] | undefined>([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/exams/statistics`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      const updatedData = response.data.data.map((item: { key: string }) => ({
        ...item,
        fill: (chartConfig as Record<string, { label: string; color?: string }>)[item.key]?.color || "#000",
      }));
      setTotal(response.data.total);
      setData(updatedData);
    } catch {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card className="bg-white border border-slate-500 shadow-slate-500 text-[#212529]">
      {/* Card Header: matching the style of the user chart */}
      <CardHeader className="p-4">
      <CardTitle className="flex items-center text-lg font-extrabold">
        <TbChartBar className="mr-2" />
          Exams: {total}
        </CardTitle>
      </CardHeader>

      {/* Card Content: chart area */}
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[200px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid
              stroke="#bae6fd"
              vertical={false}
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="key"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
              style={{ fill: "#343A40" }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="bg-white border border-slate-400 text-black p-2 rounded-lg"
                />
              }
            />
            {/* Updated bar style to match the accent color from the user chart */}
            <Bar
              dataKey="value"
              strokeWidth={2}
              radius={8}
              fillOpacity={0.8}
              fill="#0ea5e9" // Same accent color as the UserChart line
            />
          </BarChart>
        </ChartContainer>
      </CardContent>

      {/* Card Footer */}
      <CardFooter className="flex-col gap-2 text-xs text-[#495057]">
        Exams by Category
      </CardFooter>
    </Card>
  );
};
