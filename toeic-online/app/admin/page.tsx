"use client";

import { CustomBarChart } from "@/components/chart/custom-barchart";
import CustomLineChart from "@/components/chart/custom-linechart";
import { Statistical } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
const AdminPage = () => {
  const [userStatistics, setUserStatistics] = useState<Statistical>();
  const [examStatistics, setExamStatistics] = useState<Statistical>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      days: "7",
    },
  });
  function onSubmit(data: z.infer<typeof formSchema>) {
    fetchUserStatistics(Number(data.days));
  }
  const fetchUserStatistics = async (days: number) => {
    console.log(days);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/statistics`,
        {
          params: { days },
        }
      );
      setUserStatistics(response.data); // Lưu kết quả vào state
    } catch {}
  };
  const fetchExamStatistics = async () => {
    try {
      // Gọi API với số ngày là 7 (7 ngày gần nhất)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/exams/statistics`
      );
      setExamStatistics(response.data); // Lưu kết quả vào state
    } catch {}
  };
  useEffect(() => {
    fetchExamStatistics();
    fetchUserStatistics(7);
  }, []);
  return (
    <div>
      {userStatistics && (
        <div>
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
                    <FormLabel>Email</FormLabel>
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
          <CustomLineChart
            name="user"
            chartData={userStatistics.data}
            title="Người dùng tăng trưởng"
            description="Người dùng tăng trường trong 7 ngày qua"
          />
        </div>
      )}
      {examStatistics && (
        <CustomBarChart
          chartData={examStatistics.data}
          title="Thống kê bài thi"
          description="Phân loại bài thi và đếm số lượng"
        />
      )}
    </div>
  );
};

export default AdminPage;
