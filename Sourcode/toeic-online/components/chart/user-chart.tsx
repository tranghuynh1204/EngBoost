/* eslint-disable @typescript-eslint/no-explicit-any */
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

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

const chartConfig = {
  user: {
    label: "user",
    color: "red",
  },
} satisfies ChartConfig;

import React, { useEffect, useState } from "react";
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

export const UserChart = () => {
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
        `${process.env.NEXT_PUBLIC_API_URL}/users/statistics`,
        {
          params: { days },
        }
      );
      setTotal(response.data.total);
      setData(response.data.data);
    } catch {}
  };
  useEffect(() => {
    fetchData(7);
  }, []);
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
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
                    <SelectTrigger className="bg-[#DEE2E6] text-[#212529] border border-[#ADB5BD]">
                      <SelectValue placeholder="Select Timeframe" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white text-[#212529]">
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
      <Card className="bg-[#F8F9FA] text-[#212529] border border-[#ADB5BD]">
        <CardHeader className="border-b p-4">
          <CardTitle className="text-lg font-semibold">
            Total New Users: {total}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              user: {
                label: "User",
                color: "#343A40",
              },
            }}
            className="aspect-auto h-[250px] w-full"
          >
            <LineChart
              accessibilityLayer
              data={data}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid
                stroke="#DEE2E6"
                vertical={false}
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="key"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
                style={{ fill: "#343A40" }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="bg-gray-400 text-black p-2 rounded-lg"
                    nameKey="views"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                  />
                }
              />
              <Line
                dataKey="value"
                type="monotone"
                stroke="#ADB5BD"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="text-sm">User Growth Over Time</CardFooter>
      </Card>
    </div>
  );
};
