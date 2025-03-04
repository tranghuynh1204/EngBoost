"use client";

import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  XAxis,
  Area,
  AreaChart,
  Tooltip,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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
import { TbPresentationAnalytics } from "react-icons/tb";
import axios from "axios";

const formSchema = z.object({
  days: z.string(),
});

interface SectionData {
  date: string;
  precision: number;
}

interface Sections {
  [key: string]: {
    examsCount: number;
    precision: { correct: number; questionCount: number };
    data: SectionData[];
  };
}

interface ExamResult {
  examsCount: number;
  sections: Sections;
  duration: number;
}

type ResultType = {
  [key: string]: ExamResult;
};

const Statisticspage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<ResultType>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      days: "7",
    },
  });
  const fixedOrder = ["toeic", "ielts", "part 1"];
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    fetchData(Number(data.days));
  };

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
      console.log(response.data);
    } catch (error) {
      console.error(error);
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

  // For each exam type (e.g., ielts, toeic, part 1), we want to merge the Listening and Reading data
  // into one chart. We'll assume that if both sections exist, they share the same dates.
  const mergeSectionData = (sections: Sections) => {
    const listeningData = sections["Listening"]?.data || [];
    const readingData = sections["Reading"]?.data || [];
    // Create an array of data points. We'll merge by index for simplicity.
    const dataPoints = listeningData.map((d, i) => ({
      date: d.date,
      Listening: d.precision,
      Reading: readingData[i] ? readingData[i].precision : 0,
    }));
    return dataPoints;
  };
  const renderCustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex justify-center gap-4 text-xs text-black mt-2">
        {payload?.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></span>
            <span>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };
  // Custom Area Chart component to display Listening & Reading data together
  const AreaChartComponent = ({ sections }: { sections: Sections }) => {
    const chartData = mergeSectionData(sections);
    return (
      <ChartContainer
        config={{ user: { label: "Precision", color: "#1F2937" } }}
        className="aspect-video h-[300px] w-full"
      >
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid
            stroke="#d1fae5"
            vertical={false}
            strokeDasharray="3 3"
          />

          {/* XAxis with axis line and tick line removed, 
            and tickMargin adjusted so the date is "on top" */}
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tickFormatter={(date) =>
              new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }
            style={{ fill: "#1F2937", fontSize: "12px" }}
          />

          {/* Tooltip with no vertical cursor line */}
          <Tooltip
            cursor={false}
            contentStyle={{ border: "1px solid #D1D5DB", borderRadius: "8px" }}
          />

          <Legend content={renderCustomLegend} />

          <Area
            type="monotone"
            dataKey="Listening"
            stackId="1"
            stroke="#4ade80"
            fill="#4ade80"
            fillOpacity={0.4}
          />
          <Area
            type="monotone"
            dataKey="Reading"
            stackId="1"
            stroke="#047857"
            fill="#047857"
            fillOpacity={0.4}
          />
        </AreaChart>
      </ChartContainer>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-500 p-6 w-[1000px]">
      {/* Heading & Description */}
      <div className="mt-5 mb-4">
        <h2 className="text-xl font-bold mb-1 text-gray-800">
          <button className="text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg mr-3">
            <TbPresentationAnalytics size={20} />
          </button>
          Statistics
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-8">
          View comprehensive statistics on your exam performance over different
          timeframes.
        </p>
      </div>

      {/* Filter Form */}

      {/* Statistics Tabs */}
      <Tabs defaultValue={Object.keys(result)[0]}>
        <div className="flex justify-between mb-6">
          <TabsList className="flex space-x-3 border bg-emerald-50 border-slate-400 rounded-lg overflow-x-auto">
            {Object.keys(result)
              .sort(
                (a, b) =>
                  fixedOrder.indexOf(a.toLowerCase()) -
                  fixedOrder.indexOf(b.toLowerCase())
              )
              .map((key) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="flex items-center space-x-2 py-1 px-3 text-sm uppercase font-medium text-muted-foreground  hover:text-black focus:outline-none rounded-lg transition-all data-[state=active]:bg-white data-[state=active]:text-black "
                >
                  {key}
                </TabsTrigger>
              ))}
          </TabsList>
          <div className="flex justify-end w-[500px]">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col sm:flex-row items-center gap-4"
              >
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
                          <SelectTrigger className="w-40 text-[#212529] text-sm border border-sky-100">
                            <SelectValue placeholder="Select Timeframe" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white text-[#212529] ">
                          <SelectItem className="text-sm" value="7">
                            Week
                          </SelectItem>
                          <SelectItem className="text-sm" value="30">
                            Month
                          </SelectItem>
                          <SelectItem className="text-sm" value="365">
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
        </div>

        {Object.entries(result)
          .sort(
            ([keyA], [keyB]) =>
              fixedOrder.indexOf(keyA.toLowerCase()) -
              fixedOrder.indexOf(keyB.toLowerCase())
          )
          .map(([key, value]) => (
            <TabsContent key={key} value={key}>
              <div className="p-6 shadow-lg rounded-lg">
                <div className="flex justify-between  gap-4">
                  <div className="text-base font-semibold text-gray-800">
                    Total exam:{" "}
                    <span className="text-gray-600">{value.examsCount}</span>
                  </div>
                  <div className="text-base font-semibold text-gray-800">
                    Duration:{" "}
                    <span className="text-gray-600">
                      {formatTime(value.duration)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-4 mt-4">
                  {Object.entries(value.sections).map(
                    ([sectionKey, sectionData]) => {
                      const { correct, questionCount } = sectionData.precision;
                      // Calculate the percentage precision (if questionCount > 0)
                      const percentage =
                        questionCount > 0
                          ? ((correct / questionCount) * 100).toFixed(2)
                          : "0.00";
                      return (
                        <div
                          key={sectionKey}
                          className="text-xs font-medium text-zinc-500"
                        >
                          {sectionKey}: {percentage}%
                        </div>
                      );
                    }
                  )}
                </div>
                {/* Combined Area Chart for Listening & Reading */}
                <div className="mt-6">
                  <AreaChartComponent sections={value.sections} />
                </div>
              </div>
            </TabsContent>
          ))}
      </Tabs>
    </div>
  );
};

export default Statisticspage;
