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
    </>
  );
}

export default PageHeader;
