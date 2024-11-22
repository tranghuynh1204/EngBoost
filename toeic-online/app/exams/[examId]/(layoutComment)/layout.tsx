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
    <div className="">
      <main className="flex flex-col">
        {children}
        {/* Add the CommentContainer */}
        <CommentContainer />
      </main>
    </div>
  );
}
