// app/login/page.tsx

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // Adjust the path based on your setup
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setIsLogin } from "@/lib/store/data-slice";

const formSchema = z.object({
  email: z.string().min(2, {
    message: "Invalid email format",
  }),
  password: z.string(),
});

const LoginPage = () => {
  // const searchParams = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  // const next = searchParams.get("next");
  const router = useRouter();
  const dispatch = useDispatch();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        values
      );
      const { access_token, refresh_token } = response.data;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      dispatch(setIsLogin(true));
      const next = window.location.href.split("next=")[1] || "exams";
      router.push(next);

      toast({
        title: "Đăng nhập thành công!",
        description: "Bạn đã đăng nhập thành công.",
      });
    } catch (error: any) {
      if (error.response.status == 404) {
        form.setError("email", {
          type: "manual",
          message: "User not found",
        });
        form.setFocus("email");
      } else {
        form.setError("password", {
          type: "manual",
          message: "Wrong password",
        });
        form.setFocus("password");
      }
      // Existing error handling
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* The Toaster is already included in RootLayout */}
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
