import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type Item = {
    value: string;
    label: string;
    link: string;
}
export function SessionTabs({ className, items }: { className?: string, items: Item[] }) {
    return (
        <Tabs defaultValue={items[0].value} className={cn("w-[400px]", className)}>
            <TabsList>
                {items.map((item) => (
                    <TabsTrigger key={item.value} value={item.value}>{item.label}</TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    )
}