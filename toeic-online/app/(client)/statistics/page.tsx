"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
import Loading from "@/components/loading";
import NotFound from "@/components/not-found";
import { formatTime } from "@/types";
const formSchema = z.object({
  days: z.string(),
});

const Statisticspage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<{
    [key: string]: {
      examsCount: number;
      sections: {
        [key: string]: {
          examsCount: number;
          precision: {
            correct: number;
            questionCount: number;
          };
          data: {
            date: string;
            precision: number;
          }[];
        };
      };
      duration: number;
    };
  }>();
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
        `${process.env.NEXT_PUBLIC_API_URL}/user-exams/analytics`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          params: { days },
        }
      );
      setResult(response.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData(7);
  }, []);
  if (loading) {
    return <Loading />;
  }
  if (!result) {
    return <NotFound />;
  }
  return (
    <div className="bg-gray-50 p-8 rounded-xl shadow-lg space-y-8 max-w-7xl mx-auto">
      {/* Filter Form */}
      <Card className="p-6 bg-gray-800">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <FormField
              control={form.control}
              name="days"
              render={({ field }) => (
                <FormItem className="w-full sm:w-1/3">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      {/* SelectTrigger with white background and black text */}
                      <SelectTrigger className="w-full bg-white text-black border border-gray-500 shadow-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Select Timeframe" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white text-black">
                      <SelectItem value="7">7 Days</SelectItem>
                      <SelectItem value="30">1 Month</SelectItem>
                      <SelectItem value="365">1 Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Search Button with white background and black text */}
            <Button
              type="submit"
              className="w-full sm:w-auto bg-white text-black px-6 py-2 rounded-md shadow hover:bg-gray-300 transition-colors duration-200 border border-gray-500"
            >
              Search
            </Button>
          </form>
        </Form>
      </Card>

      {/* Statistics Tabs */}
      <Tabs defaultValue={Object.keys(result)[0]} className="space-y-6">
        <TabsList className="flex space-x-3 overflow-x-auto">
          {Object.keys(result).map((key) => (
            <TabsTrigger
              key={key}
              value={key}
              className="flex-1 min-w-max px-4 py-2 bg-gray-700 text-gray-300 rounded-md shadow-sm hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
            >
              {key}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(result).map(([key, value]) => (
          <TabsContent key={key} value={key}>
            <Card className="p-6 bg-gray-600 shadow-md rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-lg font-semibold text-gray-100">
                  Số đề đã làm:{" "}
                  <span className="text-gray-300">{value.examsCount}</span>
                </div>
                <div className="text-lg font-semibold text-gray-100">
                  Thời gian luyện thi:{" "}
                  <span className="text-gray-300">
                    {formatTime(value.duration)}
                  </span>
                </div>
              </div>

              {/* Nested Sections Tabs */}
              <Tabs
                defaultValue={Object.keys(value.sections)[0]}
                className="mt-6"
              >
                <TabsList className="flex space-x-2 overflow-x-auto">
                  {Object.keys(value.sections).map((sectionKey) => (
                    <TabsTrigger
                      key={sectionKey}
                      value={sectionKey}
                      className="px-3 py-1.5 bg-gray-500 text-gray-700 rounded-md shadow-sm hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
                    >
                      {sectionKey}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Object.entries(value.sections).map(
                  ([sectionKey, sectionValue]) => (
                    <TabsContent key={sectionKey} value={sectionKey}>
                      <Card className="p-4 bg-gray-300 rounded-md shadow-inner mt-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                          <div className="text-md font-medium text-gray-700">
                            Số đề đã làm:{" "}
                            <span className="text-gray-500">
                              {sectionValue.examsCount}
                            </span>
                          </div>
                          <div className="text-md font-medium text-gray-700 mt-2 sm:mt-0">
                            Độ chính xác:{" "}
                            <span className="text-gray-500">
                              {sectionValue.precision.correct}/
                              {sectionValue.precision.questionCount}
                            </span>
                          </div>
                        </div>

                        {/* Chart */}
                        <Card className="mt-4 bg-gray-500 text-gray-800 border border-gray-600">
                          <CardContent>
                            <ChartContainer
                              config={{
                                user: {
                                  label: "Precision",
                                  color: "#1F2937", // Tailwind's gray-800
                                },
                              }}
                              className="aspect-video h-[300px] w-full"
                            >
                              <LineChart
                                data={sectionValue.data}
                                margin={{
                                  top: 20,
                                  right: 30,
                                  left: 0,
                                  bottom: 5,
                                }}
                              >
                                <CartesianGrid
                                  stroke="#D1D5DB" // Tailwind's gray-300
                                  vertical={false}
                                  strokeDasharray="3 3"
                                />
                                <XAxis
                                  dataKey="date"
                                  tickLine={false}
                                  axisLine={false}
                                  tickMargin={10}
                                  minTickGap={40}
                                  tickFormatter={(value) => {
                                    const date = new Date(value);
                                    return date.toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                    });
                                  }}
                                  style={{ fill: "#1F2937", fontSize: "12px" }} // Tailwind's gray-800
                                />
                                <ChartTooltip
                                  content={
                                    <ChartTooltipContent
                                      className="bg-gray-800 text-gray-300 p-3 rounded-lg"
                                      nameKey="precision"
                                      labelFormatter={(value) => {
                                        return new Date(
                                          value
                                        ).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                        });
                                      }}
                                    />
                                  }
                                />
                                <Line
                                  type="monotone"
                                  dataKey="precision"
                                  stroke="#1F2937" // Tailwind's gray-800
                                  strokeWidth={3}
                                  dot={{
                                    r: 4,
                                    stroke: "#1F2937",
                                    strokeWidth: 2,
                                    fill: "#D1D5DB", // Tailwind's gray-300
                                  }}
                                  activeDot={{ r: 6 }}
                                />
                              </LineChart>
                            </ChartContainer>
                          </CardContent>
                          <CardFooter className="text-sm text-gray-300">
                            Độ chính xác qua các ngày
                          </CardFooter>
                        </Card>
                      </Card>
                    </TabsContent>
                  )
                )}
              </Tabs>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Statisticspage;
