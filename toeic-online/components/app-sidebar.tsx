"use client";
import { Calendar, Upload, Home, Inbox, Search, Settings } from "lucide-react";

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
];

export function AppSidebar() {
  const pathName = usePathname();
  return (
    <Sidebar className="bg-[#F8F9FA] text-[#212529] border-r border-[#E9ECEF] shadow-md">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#495057] uppercase text-sm font-semibold mb-2">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {/* Home Menu Item */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathName === "/admin"}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md transition duration-200 data-[active=true]:bg-[#343A40] data-[active=true]:text-white hover:bg-[#E9ECEF]"
                >
                  <a href="/admin" className="flex items-center space-x-2">
                    <Home />
                    <span>Home</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Dynamic Menu Items */}
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathName.includes(item.url)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md transition duration-200 data-[active=true]:bg-[#343A40] data-[active=true]:text-white hover:bg-[#E9ECEF]"
                  >
                    <a
                      href={`/admin/${item.url}`}
                      className="flex items-center space-x-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
