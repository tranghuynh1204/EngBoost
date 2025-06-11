"use client";
import { Upload, Inbox, List, BarChartBig } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { cn } from "@/lib/utils";

// Menu items.
const items = [
  {
    title: "Inbox",
    url: "inbox",
    icon: Inbox,
  },
  {
    title: "Exam", // Mục mới cho việc upload bài thi
    url: "exams",
    icon: Upload,
  },
  {
    title: "List Exams", // Mục mới cho việc upload bài thi
    url: "list-exams",
    icon: List,
  },
];

export function AppSidebar() {
  const pathName = usePathname();
  return (
    <Sidebar className="bg-slate-50 border-r border-slate-500 shadow-md w-64 min-h-screen p-3">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground uppercase text-xs font-semibold mb-4">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton
                      asChild
                      isActive={pathName === "/admin"}
                      className={cn(
                        "flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium transition",
                        "hover:bg-accent hover:text-accent-foreground",
                        pathName === "/admin" &&
                          "bg-primary text-primary-foreground"
                      )}
                    >
                      <a href="/admin" className="flex items-center space-x-2">
                        <BarChartBig className="w-5 h-5" />
                        <span>Home</span>
                      </a>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent
                    className="text-white bg-zinc-800"
                    side="bottom"
                  >
                    Home
                  </TooltipContent>
                </Tooltip>
              </SidebarMenuItem>

              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        asChild
                        isActive={pathName === `/admin/${item.url}`}
                        className={cn(
                          "flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium transition",
                          "hover:bg-accent hover:text-accent-foreground",
                          pathName === `/admin/${item.url}` &&
                            "bg-primary text-primary-foreground"
                        )}
                      >
                        <a
                          href={`/admin/${item.url}`}
                          className="flex items-center space-x-2"
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent
                      className="text-white bg-zinc-800"
                      side="bottom"
                    >
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
