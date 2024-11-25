// components/Header.tsx

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, redirect } from "next/navigation";
import { Button } from "./ui/button";
import { RootState } from "@/lib/store/store";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { setIsLogin } from "@/lib/store/data-slice";
import axios from "axios";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuViewport,
} from "./ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
const Header = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
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
    checkLoginStatus(); // Indicate that hydration has completed
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const logout = () => {
    router.push("/exams");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    dispatch(setIsLogin(false));
  };

  return (
    <header
      className={`sticky top-0 z-50 flex items-center justify-between p-4 transition-colors duration-300 ${
        isScrolled ? "bg-white/5 backdrop-blur-md shadow-sm" : "bg-white"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center ml-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/draft_logo.jpg"
            alt="Logo"
            width={40}
            height={40}
          />
        </Link>
      </div>

      {/* Navigation Menu */}
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger
              onClick={() => router.push("/exams")}
              className="cursor-pointer font-semibold"
            >
              Exam
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="flex flex-col space-y-2 p-4 bg-white rounded-md shadow-lg">
                <li>
                  <NavigationMenuLink
                    asChild
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <Link href="/exams/toeic">TOEIC Exams</Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink
                    asChild
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <Link href="/exams/ielts">IELTS Exams</Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger
              onClick={() => router.push("/flashcards")}
              className="cursor-pointer font-semibold"
            >
              Flashcard
            </NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuViewport />
      </NavigationMenu>

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
              <DropdownMenuItem
                onClick={() => {
                  router.push("/profile");
                }}
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>Đăng xuất</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Header;
