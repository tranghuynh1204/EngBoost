"use client";

import { Label, Pie, PieChart } from "recharts";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TbChartBar, TbChartDonut } from "react-icons/tb";
const formSchema = z.object({
  days: z.string(),
});
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

export const UserExamChart = () => {
  const [total, setTotal] = useState();
  const [data, setData] = useState<any[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      days: "7",
    },
  });
  function onSubmit(data: z.infer<typeof formSchema>) {
    fetchData(Number(data.days));
  }
  const fetchData = async (days: number) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user-exams/statistics`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          params: { days },
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
      setData(updatedData); // Lưu kết quả vào state
    } catch {}
  };
  useEffect(() => {
    fetchData(7);
  }, []);
  const legendItems = (
    Object.keys(chartConfig) as Array<keyof typeof chartConfig>
  )
    .filter((key) => key !== "value")
    .map((key) => {
      // Find matching data item by key (API returns "part 1", etc.)
      const item = data?.find((d) => d.key === key);
      return {
        key,
        label: chartConfig[key].label,
        color: (chartConfig[key] as { label: string; color: string }).color,
        value: item ? item.value : 0,
      };
    });

  return (
    <div className="">
      <Card className=" text-[#212529] bg-white border border-slate-500 shadow-slate-500">
        <CardHeader className="p-4">
          <div className="flex w-full items-center justify-between">
            <CardTitle className="flex items-center text-lg font-extrabold">
              <TbChartDonut className="mr-2" />
              Exam Statistics
            </CardTitle>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/3">
                <FormField
                  control={form.control}
                  name="days"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          fetchData(Number(value));
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="text-[#212529] text-xs border border-slate-500">
                            <SelectValue placeholder="Select Timeframe" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white text-[#212529] text-xs">
                          <SelectItem className="text-xs" value="7">
                            Week
                          </SelectItem>
                          <SelectItem className="text-xs" value="30">
                            Month
                          </SelectItem>
                          <SelectItem className="text-xs" value="365">
                            Year
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </CardHeader>
        <CardContent className="">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[200px] w-full"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent className="bg-white border border-slate-400 text-[#212529] p-2 rounded-lg" />
                }
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="key"
                outerRadius="90%" // Increase outer radius to fill more space
                innerRadius={60} // Decrease inner radius to make the donut thicker
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-[#212529] text-3xl font-bold"
                          >
                            {total}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-[#ADB5BD]"
                          >
                            Exams
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex flex-wrap justify-center gap-4 text-xs text-[#495057]">
          {legendItems.map((legend) => (
            <div key={legend.key as string} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: legend.color }}
              ></span>
              <span>
                {legend.label}: {legend.value}
              </span>
            </div>
          ))}
        </CardFooter>
      </Card>
    </div>
  );
};
