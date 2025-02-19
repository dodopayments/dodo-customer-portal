/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import ThemeSwitch from "./ui/dodo/ThemeSwitch";
import { useParams, usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";

const BusinessName = ({ image, name }: { image: string; name: string }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Image
        src={image}
        className="rounded-full object-cover object-center"
        alt="logo"
        width={32}
        height={32}
      />
      <span className="text-text-primary font-display text-xl font-semibold">
        {name}
      </span>
    </div>
  );
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="sticky top-0 z-50 bg-bg-primary border-b border-border-secondary">
      <div className="relative flex items-center gap-6 justify-between py-4 pb-3 md:px-12 px-4">
        <div className="flex items-center gap-6">
          <BusinessName image="/images/business.svg" name="Turbo repo" />
          <div className="hidden lg:block">
            <Pills />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeSwitch />
          <div className="lg:block hidden">
            <Button variant="secondary">Logout</Button>
          </div>
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="secondary" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] px-2 sm:w-[400px]">
                <div className="flex flex-col h-full">
                  <div className="px-4 py-6 w-full flex justify-start">
                    <BusinessName image="/images/business.svg" name="Turbo repo" />
                  </div>
                  <MobilePills closeSheet={() => setIsOpen(false)} />
                  <div className="mt-auto p-4">
                    <Button variant="secondary" className="w-full">
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

const Pills = () => {
  type Props = {
    id: number;
    tile: string;
    href: string;
  };

  const ITEMS: Props[] = [
    {
      id: 1,
      tile: "Billing history",
      href: "/billing-history",
    },
    {
      id: 2,
      tile: "Subscriptions",
      href: "/subscriptions",
    },
    {
      id: 3,
      tile: "License Keys",
      href: "/license-keys",
    },
    {
      id: 4,
      tile: "Profile",
      href: "/profile",
    },
  ];

  const [active, setActive] = useState<Props>(ITEMS[0]);
  const params = useParams();
  const token = params.token;
  const pathname = usePathname();

  useEffect(() => {
    const isActive = (item: Props) => {
      return pathname.includes(item.href);
    };
    setActive(ITEMS.find((item) => isActive(item)) || ITEMS[0]);
  }, [pathname]);

  const [isHover, setIsHover] = useState<Props | null>(null);

  return (
    <ul className="md:flex hidden items-center justify-center">
      {ITEMS.map((item) => (
        <Link
          key={item.id}
          href={token ? `/session/${token}${item.href}` : item.href}
          className={cn(
            "py-2 relative duration-300 font-display text-sm font-normal tracking-wide transition-colors",
            active.id === item.id
              ? "text-button-secondary-text"
              : "text-text-tertiary hover:text-button-secondary-text"
          )}
          onClick={() => setActive(item)}
          onMouseEnter={() => setIsHover(item)}
          onMouseLeave={() => setIsHover(null)}
        >
          <div className="px-5 py-2 relative z-10">
            {item.tile}
            {(isHover?.id === item.id || active.id === item.id) && (
              <motion.div
                layoutId="hover-bg"
                className="absolute bottom-0 left-0 right-0 w-full h-full bg-button-secondary-bg z-[-1]"
                style={{
                  borderRadius: 6,
                }}
                initial={false}
                transition={{ duration: 0.3 }}
              />
            )}
          </div>
        </Link>
      ))}
    </ul>
  );
};

const MobilePills = ({ closeSheet }: { closeSheet: () => void }) => {
  type Props = {
    id: number;
    tile: string;
    href: string;
  };

  const ITEMS: Props[] = [
    {
      id: 1,
      tile: "Billing history",
      href: "/billing-history",
    },
    {
      id: 2,
      tile: "Subscriptions",
      href: "/subscriptions",
    },
    {
      id: 3,
      tile: "License Keys",
      href: "/license-keys",
    },
    {
      id: 4,
      tile: "Profile",
      href: "/profile",
    },
  ];

  const [active, setActive] = useState<Props>(ITEMS[0]);
  const params = useParams();
  const token = params.token;
  const pathname = usePathname();

  useEffect(() => {
    const isActive = (item: Props) => {
      return pathname.includes(item.href);
    };
    setActive(ITEMS.find((item) => isActive(item)) || ITEMS[0]);
  }, [pathname]);

  return (
    <div className="flex flex-col gap-2 px-4">
      {ITEMS.map((item) => (
        <Link
          key={item.id}
          href={token ? `/session/${token}${item.href}` : item.href}
          className={cn(
            "p-2 relative duration-300 font-display text-sm font-normal tracking-wide transition-colors rounded-md",
            active.id === item.id
              ? "bg-button-secondary-bg text-button-secondary-text"
              : "text-text-tertiary hover:text-button-secondary-text hover:bg-button-secondary-bg/50"
          )}
          onClick={() => {
            setActive(item);
            closeSheet();
          }}
        >
          {item.tile}
        </Link>
      ))}
    </div>
  );
};
