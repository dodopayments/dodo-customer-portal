"use client";

import React from "react";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Search } from "lucide-react";

const PageHeader = ({ children, searchPlaceholder = "Search", searchValue, setSearchValue }: { children: React.ReactNode, searchPlaceholder?: string, searchValue?: string, setSearchValue?: (value: string) => void }) => {
  return (
    <>
      <section className="flex items-start md:items-center gap-4 md:flex-row flex-col  justify-between">
        {children}
      </section>
      <Separator className="mb-6" />
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary border-border-secondary" />
          <Input type="text" placeholder={searchPlaceholder} className="pl-10 border-border-secondary" value={searchValue} onChange={(e) => setSearchValue?.(e.target.value)} />
        </div>
      </div>
    </>
  );
}

export default PageHeader;
