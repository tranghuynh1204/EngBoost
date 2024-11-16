"use client";

import React from "react";
import { CommentContainer } from "@/components/comment/comment-container"; // Adjust the path as needed

export default function CommentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  examId: string; // Ensure this prop is defined in the parent or router
}>) {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <main className="flex flex-col">
        {children}
        {/* Add the CommentContainer */}
        <CommentContainer />
      </main>
    </div>
  );
}
