"use client";

import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

const Header = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const currentTab = tab || "toeic";

  const handleTabChange = (selectedTab: string) => {
    // Update the URL with the selected tab without reloading the page
    router.push(`/?tab=${selectedTab}`);
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
      <div>
        {/* Replace with actual authentication logic */}
        <Button variant="ghost">Login</Button>
        {/* Once logged in, display Avatar */}
        {/* <Avatar src="/path-to-avatar.jpg" /> */}
      </div>
    </header>
  );
};

export default Header;
