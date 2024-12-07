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
      <Tabs defaultValue={Object.keys(result)[0]} className="w-[400px]">
        <TabsList>
          {Object.entries(result).map(([key]) => (
            <TabsTrigger key={key} value={key}>
              {key}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(result).map(([key, value]) => (
          <TabsContent key={key} value={key}>
            <div>Số đề đã làm{value.examsCount}</div>
            <div>Thời gian luyện thi {formatTime(value.duration)}</div>
            <Tabs
              defaultValue={Object.keys(value.sections)[0]}
              className="w-[400px]"
            >
              <TabsList>
                {Object.entries(value.sections).map(([key]) => (
                  <TabsTrigger key={key} value={key}>
                    {key}
                  </TabsTrigger>
                ))}
              </TabsList>
              {Object.entries(value.sections).map(([key, value]) => (
                <TabsContent key={key} value={key}>
                  <div>Số đề đã làm{value.examsCount}</div>
                  <div>
                    Độ chính xác {value.precision.correct}/
                    {value.precision.questionCount}
                  </div>
                  <Card className="bg-[#F8F9FA] text-[#212529] border border-[#ADB5BD]">
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
                          data={value.data}
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
                            dataKey="date"
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
                                className="bg-[#343A40] text-white p-2 rounded-lg"
                                nameKey="views"
                                labelFormatter={(value) => {
                                  return new Date(value).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  );
                                }}
                              />
                            }
                          />
                          <Line
                            dataKey="precision"
                            type="monotone"
                            stroke="#ADB5BD"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ChartContainer>
                    </CardContent>
                    <CardFooter className="text-sm">
                      Độ chính xác qua các ngày
                    </CardFooter>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Statisticspage;
