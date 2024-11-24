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
      <PaginationContent>
        {Number(currentPage) !== 1 && (
          <PaginationItem>
            <PaginationLink href={"?page=1"}>Frist</PaginationLink>
          </PaginationItem>
        )}
        {currentPage > 2 && (
          <PaginationItem>
            <PaginationLink href={`?page=${Number(currentPage - 2)}`}>
              {Number(currentPage - 2)}
            </PaginationLink>
          </PaginationItem>
        )}
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationLink href={`?page=${Number(currentPage - 1)}`}>
              {Number(currentPage - 1)}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink isActive>{currentPage}</PaginationLink>
        </PaginationItem>
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationLink href={`?page=${Number(currentPage) + 1}`}>
              {Number(currentPage) + 1}
            </PaginationLink>
          </PaginationItem>
        )}
        {Number(currentPage) + 1 < totalPages && (
          <PaginationItem>
            <PaginationLink href={`?page=${Number(currentPage) + 2}`}>
              {Number(currentPage) + 2}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <Popover>
            <HoverCard>
              <HoverCardTrigger asChild>
                <PopoverTrigger asChild>
                  <Button>Go</Button>
                </PopoverTrigger>
              </HoverCardTrigger>
              <HoverCardContent>Nhấn để nhập trang muốn đến</HoverCardContent>
            </HoverCard>

            <PopoverContent className="w-80">
              <Label htmlFor="page">Nhập trang bạn muốn đến</Label>
              <Input
                id="page"
                type="number"
                min={0}
                defaultValue={page}
                onChange={(e) => {
                  setPage(Number(e.target.value));
                }}
                max={totalPages}
                className="col-span-2 h-8"
              />

              {page > 0 && page <= totalPages && (
                <PaginationLink href={`?page=${page}`}>GO</PaginationLink>
              )}
            </PopoverContent>
          </Popover>
        </PaginationItem>

        {Number(currentPage) !== totalPages && (
          <PaginationItem>
            <PaginationLink href={`?page=${totalPages}`}>Last</PaginationLink>
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};
