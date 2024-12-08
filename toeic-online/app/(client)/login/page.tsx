"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // Adjust the path based on your setup

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
import { Input } from "@/components/ui/input";
import { LuLogIn } from "react-icons/lu";

const formSchema = z.object({
  email: z
    .string()
    .min(2, {
      message: "Invalid email format",
    })
    .email(),
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
      const { access_token, refresh_token, userId } = response.data;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("userId", userId);

      dispatch(setIsLogin(true));
      const next = window.location.href.split("next=")[1] || "/";

      router.push(next);

      toast({
        title: "Đăng nhập thành công!",
        description: "Bạn đã đăng nhập thành công.",
      });
    } catch (error: any) {
      if (error.response.status === 404) {
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
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{
        backgroundImage: "url('/assets/124947253_p0.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10 bg-gradient-to-b from-[#142846] to-[#4A6DA5] p-8 rounded-lg shadow-lg w-full max-w-md mx-4">
        <h2 className="text-3xl font-semibold mb-6 text-center text-white">
          Đăng nhập
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập email của bạn"
                      type="email"
                      {...field}
                      className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                    />
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
                  <FormLabel className="text-white">Mật khẩu</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="******"
                      type="password"
                      {...field}
                      className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={loading}
                className="w-12 h-12 border border-blue-300 bg-white text-blue-600 p-0 rounded-xl shadow hover:bg-blue-50 transition-colors disabled:border-blue-200 disabled:text-blue-200 flex items-center justify-center"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-6 w-6 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                ) : (
                  <LuLogIn size={24} />
                )}
              </Button>
            </div>
          </form>
        </Form>
        <p className="mt-4 text-center text-white">
          Bạn chưa có tài khoản?{" "}
          <a href="/register" className="text-white hover:underline">
            Đăng ký ngay
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
