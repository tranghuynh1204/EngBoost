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
  const [data, setData] = useState<any[]>([]);

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
        fill:
          (chartConfig as Record<string, { label: string; color?: string }>)[
            item.key
          ]?.color || "#000",
      }));
      setTotal(response.data.total);
      setData(updatedData);
    } catch {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  const legendItems = (
    Object.keys(chartConfig) as Array<keyof typeof chartConfig>
  )
    .filter((key) => key !== "value")
    .map((key) => {
      // Cast to the type that definitely includes color
      const configEntry = chartConfig[key] as { label: string; color: string };
      // Find matching data item (if available)
      const item = data?.find((d) => d.key === key);
      return {
        key,
        label: configEntry.label,
        color: configEntry.color,
        value: item ? item.value : 0,
      };
    });

  return (
    <Card className="bg-white border border-slate-500 shadow-slate-500 text-[#212529]">
      {/* Card Header: matching the style of the user chart */}
      <CardHeader className="p-4">
        <CardTitle className="flex items-center text-lg font-extrabold mb-2">
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
              tickFormatter={(value) => {
                const item = data.find((d) => d.key === value);
                return item ? item.value : "";
              }}
              style={{ fill: "#343A40" }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent className="bg-white border border-slate-400 text-black p-2 rounded-lg" />
              }
            />
            <Bar
              dataKey="value"
              strokeWidth={2}
              radius={8}
              fillOpacity={0.8}
              fill="#0ea5e9" // fallback accent color; individual bars could also use <Cell> if needed
            />
          </BarChart>
        </ChartContainer>
      </CardContent>

      {/* Card Footer: Custom Legend */}
      <CardFooter className="flex flex-wrap justify-center gap-4 text-xs text-[#495057]">
        {legendItems.map((legend) => (
          <div key={legend.key} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: legend.color }}
            ></span>
            <span>
              {legend.label}
            </span>
          </div>
        ))}
      </CardFooter>
    </Card>
  );
};
