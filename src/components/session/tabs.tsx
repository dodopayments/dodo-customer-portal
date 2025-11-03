"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type Item = {
  value: string;
  label: string;
  link: string;
};
export function SessionTabs({
  className,
  items,
  currentTab,
}: {
  className?: string;
  items: Item[];
  currentTab: string;
}) {
  const router = useRouter();
  return (
    <Tabs defaultValue={currentTab} className={cn("w-[400px]", className)}>
      <TabsList>
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            onClick={() => router.push(item.link)}
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
