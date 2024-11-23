// components/Header.tsx

"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "./ui/button";
import { RootState } from "@/lib/store/store";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { setIsLogin } from "@/lib/store/data-slice";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const isLogin = useSelector((state: RootState) => state.data.isLogin);
  const dispatch = useDispatch();
  const checkLoginStatus = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        // Gửi yêu cầu đến backend để refresh access token
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {
            refresh_token: refreshToken,
          }
        );
        const { access_token, refresh_token } = response.data;
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        dispatch(setIsLogin(true));
      } else {
        dispatch(setIsLogin(false));
      }
    } catch {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      dispatch(setIsLogin(false));
    }
  };

  // Kiểm tra trạng thái đăng nhập khi component được render
  useEffect(() => {
    checkLoginStatus(); // Kiểm tra và refresh token khi trang được tải
  }, []);
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    dispatch(setIsLogin(false));
  };
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-bold">
          TOEIC Online
        </Link>
      </div>

      {/* Authentication */}
      <div className="flex items-center space-x-4">
        {!isLogin ? (
          <Button
            variant="ghost"
            onClick={() => {
              redirect("/login");
            }}
          >
            Login
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Trang cá nhân</DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>Đăng xuất</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Header;
