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
    color: "red",
  },
  ielts: {
    label: "Ielts",
    color: "blue",
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
    <div>
      {" "}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
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
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn Khoảng thời gian" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="7">7 Ngày</SelectItem>
                    <SelectItem value="30">1 tháng</SelectItem>
                    <SelectItem value="365">1 năm</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Search</Button>
        </form>
      </Form>
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Thống kê số bài làm</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
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
                            className="fill-foreground text-3xl font-bold"
                          >
                            {total}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Bài làm
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
        <CardFooter className="flex-col gap-2 text-sm">
          Phân loại và đếm số bài làm
        </CardFooter>
      </Card>
    </div>
  );
};
