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
const formSchema = z.object({
  days: z.string(),
});
const chartConfig = {
  value: {
    label: "Value",
  },
  toeic: {
    label: "Toeic",
    color: "#495057", // Darker gray for contrast
  },
  ielts: {
    label: "Ielts",
    color: "#6C757D", // Muted dark gray for differentiation
  },
} satisfies ChartConfig;

export const UserExamChart = () => {
  const [total, setTotal] = useState();
  const [data, setData] = useState();
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
        fill: `var(--color-${item.key})`,
      }));
      setTotal(response.data.total);
      setData(updatedData); // Lưu kết quả vào state
    } catch {}
  };
  useEffect(() => {
    fetchData(7);
  }, []);
  return (
    <div className="bg-[#F8F9FA] p-4 rounded-lg shadow-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="days"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-[#E9ECEF] text-[#212529] border border-[#ADB5BD]">
                      <SelectValue placeholder="Select Timeframe" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-[#F8F9FA] text-[#495057]">
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="30">1 Month</SelectItem>
                    <SelectItem value="365">1 Year</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="bg-[#343A40] text-white hover:bg-[#212529]">
            Search
          </Button>
        </form>
      </Form>
      <Card className="flex flex-col text-[#212529] bg-white rounded-lg mt-6">
        <CardHeader className="items-center pb-0">
          <CardTitle className="text-lg font-semibold">
            Exam Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent className="bg-[#ADB5BD] text-[#212529] p-2 rounded-lg" />
                }
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="key"
                innerRadius={60}
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
        <CardFooter className="flex-col gap-2 text-sm text-[#495057]">
          Exam breakdown by category
        </CardFooter>
      </Card>
    </div>
  );
};
