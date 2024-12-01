"use client";

import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
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

const chartConfig = {
  value: {
    label: "Value",
  },
  toeic: {
    label: "Toeic",
    color: "#495057", // Darker shade for distinction
  },
  ielts: {
    label: "Ielts",
    color: "#6C757D", // Muted dark gray for contrast
  },
} satisfies ChartConfig;
export const ExamChart = () => {
  const [total, setTotal] = useState();
  const [data, setData] = useState();
  const fetchData = async () => {
    try {
      // Gọi API với số ngày là 7 (7 ngày gần nhất)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/exams/statistics`
      );
      const updatedData = response.data.data.map((item: { key: string }) => ({
        ...item,
        fill: `var(--color-${item.key})`,
      }));
      setTotal(response.data.total);
      setData(updatedData); // Lưu kết quả vào state
    } catch {}
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card className="bg-[#F8F9FA] text-[#212529] rounded-lg shadow-lg p-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Tổng số bài thi: {total}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data} className="mx-auto">
            <CartesianGrid
              stroke="#E9ECEF"
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
              style={{ fill: "#495057" }} // Dark gray for X-axis labels
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent className="bg-[#ADB5BD] text-[#212529] p-2 rounded-lg" />
              }
            />
            <Bar
              dataKey="value"
              strokeWidth={2}
              radius={8}
              fillOpacity={0.8}
              fill="#6C757D" // Consistent muted color for bars
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-[#495057]">
        Đếm bài thi theo phân loại
      </CardFooter>
    </Card>
  );
};
