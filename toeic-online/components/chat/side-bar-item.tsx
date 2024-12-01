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
      className="flex px-2 cursor-pointer hover:bg-[#E9ECEF] transition duration-200 rounded-md"
      onClick={() => router.replace(`/admin/inbox/${_id}`)}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-10 h-10 mr-2 bg-[#343A40] rounded-full flex justify-center items-center text-white text-xl font-bold">
              {name.charAt(0).toUpperCase()}
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="space-y-1">
        <div className="truncate font-semibold text-[#212529]">{name}</div>
        <div className="truncate text-sm text-[#495057]">{content}</div>
      </div>
    </div>
  );
};
