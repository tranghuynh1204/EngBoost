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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";



import React, { useEffect, useState } from "react";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { TbUsersPlus } from "react-icons/tb";
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
  const fetchData = async (days: number) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/statistics`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
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
    <div className=" ">
      <Card className="bg-white border border-slate-500 shadow-slate-500 text-[#212529] ">
        <CardHeader className="p-4">
          <div className="flex w-full items-center justify-between">
            <CardTitle className="flex items-center text-lg font-extrabold">
              <TbUsersPlus className="mr-2" />
              New Users: {total}
            </CardTitle>
            <Form {...form}>
              <form className="w-1/3">
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
        <CardContent>
          <ChartContainer
            config={{
              user: {
                label: "User",
                color: "#343A40",
              },
            }}
            className="aspect-auto h-[200px] w-full"
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
                stroke="#bae6fd"
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
                    className="bg-white border border-slate-400 text-black p-2 rounded-lg"
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
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-xs text-[#495057]">
          User Growth Over Time
        </CardFooter>
      </Card>
    </div>
  );
};
