// components/Header.tsx

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import useAppSelector from "@/hooks/useAppSelector";
import useAppDispatch from "@/hooks/useAppDispatch";
import { setLogout } from "@/lib/store/auth-slice";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuViewport,
} from "./ui/navigation-menu";
const Header: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const currentTab = tab || "toeic";
  const dispatch = useAppDispatch();

  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const [isHydrated, setIsHydrated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    setIsHydrated(true); // Indicate that hydration has completed
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
  if (!isHydrated) {
    // Render nothing or a loading skeleton until hydration is complete
    return null;
  }
  const handleTabChange = (selectedTab: string) => {
    router.push(`/?tab=${selectedTab}`);
  };

  const navigateToLogin = () => {
    router.push("/login");
  };

  const navigateToProfile = () => {
    router.push("/profile");
  };

  const handleLogout = () => {
    // Remove token from storage
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("accessToken");
    // Dispatch logout action
    dispatch(setLogout());
    router.push("/login");
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
            src="/assets/draft_logo.jpg" // Đường dẫn đến logo
            alt="Logo"
            width={40} // Chiều rộng logo
            height={40} // Chiều cao logo
            priority // Tải logo sớm hơn
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
        </NavigationMenuList>
        <NavigationMenuViewport />
      </NavigationMenu>

      {/* Authentication */}
      <div className="flex items-center space-x-4">
        {!isLoggedIn ? (
          <Button variant="ghost" onClick={navigateToLogin}>
            Login
          </Button>
        ) : (
          <>
            <Button variant="ghost" onClick={navigateToProfile}>
              Hello
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
