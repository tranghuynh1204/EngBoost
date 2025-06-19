"use client";
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
            className="text-slate-700 hover:bg-slate-300 px-3 py-1 rounded-md transition-colors text-sm"
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
            className="text-slate-700 hover:bg-slate-300 px-3 py-1 rounded-md transition-colors text-sm"
          >
            {Number(currentPage - 2)}
          </PaginationLink>
        </PaginationItem>
      )}
      {currentPage > 1 && (
        <PaginationItem>
          <PaginationLink
            href={`?page=${Number(currentPage - 1)}`}
            className="text-slate-700 hover:bg-slate-300 px-3 py-1 rounded-md transition-colors text-sm"
          >
            {Number(currentPage - 1)}
          </PaginationLink>
        </PaginationItem>
      )}

      {/* Current Page */}
      <PaginationItem>
        <PaginationLink
          isActive
          className="bg-slate-700 text-white px-4 py-1 rounded-md text-sm"
        >
          {currentPage}
        </PaginationLink>
      </PaginationItem>

      {/* Next Buttons */}
      {currentPage < totalPages && (
        <PaginationItem>
          <PaginationLink
            href={`?page=${Number(currentPage) + 1}`}
            className="text-slate-700 hover:bg-slate-300 px-3 py-1 rounded-md transition-colors text-sm"
          >
            {Number(currentPage) + 1}
          </PaginationLink>
        </PaginationItem>
      )}
      {Number(currentPage) + 1 < totalPages && (
        <PaginationItem>
          <PaginationLink
            href={`?page=${Number(currentPage) + 2}`}
            className="text-slate-700 hover:bg-slate-300 px-3 py-1 rounded-md transition-colors text-sm"
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
                <Button className="bg-slate-500 text-white hover:bg-slate-700 px-3 py-1 rounded-md text-sm">
                  Go
                </Button>
              </PopoverTrigger>
            </HoverCardTrigger>
            <HoverCardContent className="text-sm text-slate-600">
              Enter a page number
            </HoverCardContent>
          </HoverCard>

          <PopoverContent className="w-80 bg-slate-200 p-4 rounded-md shadow-md">
            <Label htmlFor="page" className="block text-slate-700 mb-2 text-sm">
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
              className="w-full h-8 mb-4 border rounded-md px-2 text-sm"
            />
            {page > 0 && page <= totalPages && (
              <PaginationLink
                href={`?page=${page}`}
                className="bg-slate-700 text-white hover:bg-slate-800 px-3 py-1 rounded-md text-sm"
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
            className="text-slate-700 hover:bg-slate-300 px-3 py-1 rounded-md transition-colors text-sm"
          >
            <LuChevronLast />
          </PaginationLink>
        </PaginationItem>
      )}
    </PaginationContent>
  </Pagination>
  );
};
