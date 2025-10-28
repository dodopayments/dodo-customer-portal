"use client";

import React from "react";
import { Separator } from "./ui/separator";

const PageHeader = ({ children }: { children: React.ReactNode }) => {
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
