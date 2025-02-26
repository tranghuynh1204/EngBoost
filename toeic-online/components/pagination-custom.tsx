import React, { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";
import { LuChevronFirst, LuChevronLast } from "react-icons/lu";
interface PaginationCustomProps {
  currentPage: number;
  totalPages: number;
}

export const PaginationCustom = ({
  currentPage,
  totalPages,
}: PaginationCustomProps) => {
  const [page, setPage] = useState<number>(
    Number(useSearchParams().get("page"))
  );
  return (
    <Pagination>
      <PaginationContent className="flex items-center justify-center space-x-2 p-4">
        {/* First Button */}
        {Number(currentPage) !== 1 && (
          <PaginationItem>
            <PaginationLink
              href={"?page=1"}
              className="text-[rgb(53,47,68)] hover:bg-[rgb(185,180,199)] px-3 py-1 rounded-md transition-colors"
            >
              <LuChevronFirst />
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Previous Buttons */}
        {currentPage > 2 && (
          <PaginationItem>
            <PaginationLink
              href={`?page=${Number(currentPage - 2)}`}
              className="text-[rgb(92,84,112)] hover:bg-[rgb(185,180,199)] px-3 py-1 rounded-md transition-colors"
            >
              {Number(currentPage - 2)}
            </PaginationLink>
          </PaginationItem>
        )}
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationLink
              href={`?page=${Number(currentPage - 1)}`}
              className="text-[rgb(92,84,112)] hover:bg-[rgb(185,180,199)] px-3 py-1 rounded-md transition-colors"
            >
              {Number(currentPage - 1)}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Current Page */}
        <PaginationItem>
          <PaginationLink
            isActive
            className="bg-[rgb(53,47,68)] text-white px-4 py-1 rounded-md"
          >
            {currentPage}
          </PaginationLink>
        </PaginationItem>

        {/* Next Buttons */}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationLink
              href={`?page=${Number(currentPage) + 1}`}
              className="text-[rgb(92,84,112)] hover:bg-[rgb(185,180,199)] px-3 py-1 rounded-md transition-colors"
            >
              {Number(currentPage) + 1}
            </PaginationLink>
          </PaginationItem>
        )}
        {Number(currentPage) + 1 < totalPages && (
          <PaginationItem>
            <PaginationLink
              href={`?page=${Number(currentPage) + 2}`}
              className="text-[rgb(92,84,112)] hover:bg-[rgb(185,180,199)] px-3 py-1 rounded-md transition-colors"
            >
              {Number(currentPage) + 2}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Go to Page */}
        <PaginationItem>
          <Popover>
            <HoverCard>
              <HoverCardTrigger asChild>
                <PopoverTrigger asChild>
                  <Button className="bg-[rgb(92,84,112)] text-white hover:bg-[rgb(53,47,68)] px-3 py-1 rounded-md">
                    Go
                  </Button>
                </PopoverTrigger>
              </HoverCardTrigger>
              <HoverCardContent className="text-sm text-gray-600">
                Enter a page number
              </HoverCardContent>
            </HoverCard>

            <PopoverContent className="w-80 bg-[rgb(250,240,230)] p-4 rounded-md shadow-md">
              <Label htmlFor="page" className="block text-[rgb(53,47,68)] mb-2">
                Enter the page you want to go to
              </Label>
              <Input
                id="page"
                type="number"
                min={1}
                max={totalPages}
                defaultValue={currentPage}
                onChange={(e) => {
                  setPage(Number(e.target.value));
                }}
                className="w-full h-8 mb-4 border rounded-md px-2"
              />
              {page > 0 && page <= totalPages && (
                <PaginationLink
                  href={`?page=${page}`}
                  className="bg-[rgb(92,84,112)] text-white hover:bg-[rgb(53,47,68)] px-3 py-1 rounded-md"
                >
                  GO
                </PaginationLink>
              )}
            </PopoverContent>
          </Popover>
        </PaginationItem>

        {/* Last Button */}
        {Number(currentPage) !== totalPages && (
          <PaginationItem>
            <PaginationLink
              href={`?page=${totalPages}`}
              className="text-[rgb(53,47,68)] hover:bg-[rgb(185,180,199)] px-3 py-1 rounded-md transition-colors"
            >
              <LuChevronLast />
            </PaginationLink>
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};
