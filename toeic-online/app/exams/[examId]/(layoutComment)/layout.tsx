"use client";

import React from "react";
import { CommentContainer } from "@/components/comment/comment-container"; // Adjust the path as needed

export default function CommentLayout({
  children,
  examId, // Pass examId as a prop to this layout
}: Readonly<{
  children: React.ReactNode;
  examId: string; // Ensure this prop is defined in the parent or router
}>) {
  return (
    <div className="layout-container">
      <main className="content">
        {children}
        {/* Add the CommentContainer */}
        <CommentContainer />
      </main>
    </div>
  );
}
