import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

interface SideBarItemProps {
  _id: string;
  name: string;
  content: string;
}
export const SideBarItem = ({ _id, name, content }: SideBarItemProps) => {
  const router = useRouter();
  return (
    <div
      className="flex px-2"
      onClick={() => router.replace(`/admin/inbox/${_id}`)}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-10 h-10 mr-2 bg-blue-500 rounded-full flex justify-center items-center text-white text-xl font-bold">
              {name.charAt(0).toUpperCase()}
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="space-x-4">
        <div className="truncate">{name}</div>
        <div className="truncate">{content}</div>
      </div>
    </div>
  );
};
