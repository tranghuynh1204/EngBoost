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
import { Badge } from "./ui/badge";
import { TbLogout, TbUserCheck, TbUserScan } from "react-icons/tb";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  roles: string[]; // e.g., ["user", "moderator"]
}
interface UserBadgeProps {
  label: string;
  variant: "default" | "destructive" | "outline" | "secondary";
  className: string;
}
const Header = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const isLogin = useSelector((state: RootState) => state.data.isLogin);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  // Helper: returns the badge label and variant based on user's roles.
  const getUserBadgeProps = (): {
    label: string;
    variant: "rose" | "amber" | "sky";
  } | null => {
    if (!user || !user.roles || user.roles.length === 0) return null;
    if (user.roles.includes("admin")) {
      return { label: "Admin", variant: "rose" };
    }
    if (user.roles.includes("moderator")) {
      return { label: "Moderator", variant: "amber" };
    }
    // Fallback role: active user
    return { label: "Active Member", variant: "sky" };
  };

  const userBadgeProps = getUserBadgeProps();

  // Fetch user profile from API
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setUser(response.data);
      } catch (error: any) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const checkLoginStatus = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refresh_token: refreshToken }
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

  // Check login status and handle scroll events.
  useEffect(() => {
    checkLoginStatus();
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dispatch]);

  const logout = () => {
    router.push("/");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("userId");
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
              <div className="flex items-center space-x-2">
                {userBadgeProps && (
                  <Badge variant={userBadgeProps.variant}>
                    {userBadgeProps.label}
                  </Badge>
                )}
                <Avatar>
                  <AvatarImage src={"https://github.com/shadcn.png"} />
                  <AvatarFallback>
                    {user?.name?.charAt(0).toUpperCase() || "CN"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-50 rounded-md shadow-lg p-2">
              {user && user.roles.includes("admin") && (
                <>
                  <DropdownMenuItem
                    onClick={() => router.push("/admin")}
                    className="flex items-center gap-2 rounded-md hover:bg-slate-100 transition-colors"
                  >
                    <TbUserCheck className="w-4 h-4 text-zinc-500" />
                    <span> Admin Dashboard </span>
                  </DropdownMenuItem>
                  <div className="border-b border-slate-400 my-2" />
                </>
              )}
              <DropdownMenuItem
                onClick={() => router.push("/profile")}
                className="flex items-center gap-2 rounded-md hover:bg-slate-100 transition-colors"
              >
                <TbUserScan className="w-4 h-4 text-zinc-500" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={logout}
                className="flex items-center gap-2 rounded-md hover:bg-slate-100 transition-colors"
              >
                <TbLogout className="w-4 h-4 text-zinc-500" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Header;
