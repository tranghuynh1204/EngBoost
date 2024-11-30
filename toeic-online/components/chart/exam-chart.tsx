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
    color: "red",
  },
  ielts: {
    label: "Ielts",
    color: "blue",
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
    <Card>
      <CardHeader>
        <CardTitle>Tổng số bài thi là {total}</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="key"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="value"
              strokeWidth={2}
              radius={8}
              activeIndex={2}
              activeBar={({ ...props }) => {
                return (
                  <Rectangle
                    {...props}
                    fillOpacity={0.8}
                    strokeDasharray={4}
                    strokeDashoffset={4}
                  />
                );
              }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>Đếm bài thi theo phân loại</CardFooter>
    </Card>
  );
};
