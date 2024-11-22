// app/login/page.tsx

"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // Adjust the path based on your setup
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast"; // Import your custom useToast hook
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";
import { ToastAction } from "@/components/ui/toast";
import useAppDispatch from "@/hooks/useAppDispatch";
import { setLogin } from "@/lib/store/auth-slice";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast(); // Destructure toast from useToast
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { email, password }
      );
      console.log("Full response data:", response.data);
      const { access_token } = response.data;
      console.log("Received accessToken:", access_token); // Debugging

      if (rememberMe) {
        localStorage.setItem("accessToken", access_token);
      } else {
        sessionStorage.setItem("accessToken", access_token);
      }

      // Dispatch login action
      dispatch(setLogin(access_token));
      console.log("Dispatched setLogin with token"); // Debugging

      toast({
        title: "Đăng nhập thành công!",
        description: "Bạn đã đăng nhập thành công.",
      });

      // Redirect to home or desired page
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error: any) {
      // Existing error handling
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* The Toaster is already included in RootLayout */}
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Nhập email của bạn"
              className="mt-1 block w-full"
            />
          </div>
          <div className="relative">
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mật khẩu
            </Label>
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Nhập mật khẩu của bạn"
              className="mt-1 block w-full pr-10" // Pr-10 để dành chỗ cho icon
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 px-3 mt-5 flex items-center text-gray-500 focus:outline-none"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
            >
              {showPassword ? (
                <RiEyeLine className="h-5 w-5" />
              ) : (
                <RiEyeCloseLine className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="flex items-center">
            <Checkbox
              id="rememberMe"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <Label
              htmlFor="rememberMe"
              className="ml-2 block text-sm text-gray-900"
            >
              Nhớ mật khẩu
            </Label>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
