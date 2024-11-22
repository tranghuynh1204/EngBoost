// components/Header.tsx

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import useAppSelector from "@/hooks/useAppSelector";
import useAppDispatch from "@/hooks/useAppDispatch";
import { setLogout } from "@/lib/store/auth-slice";

const Header: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const currentTab = tab || "toeic";
  const dispatch = useAppDispatch();

  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true); // Indicate that hydration has completed
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
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-bold">
          TOEIC Online
        </Link>
      </div>

      {/* Tabs */}
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <TabsList className="flex space-x-4">
          <TabsTrigger value="toeic">TOEIC Exams</TabsTrigger>
          <TabsTrigger value="ielts">IELTS Exams</TabsTrigger>
        </TabsList>
      </Tabs>

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
