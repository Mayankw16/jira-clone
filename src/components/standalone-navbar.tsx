"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { UserButton } from "@/features/auth/components/user-button";
import { cn } from "@/lib/utils";

export const StandaloneNavbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 inset-x-0 z-50 bg-white",
        scrolled && "shadow-[0_4px_6px_-2px_rgba(0,0,0,0.08)]",
      )}
    >
      <div className="mx-auto max-w-7xl flex justify-between items-center h-18 px-8">
        <Link href="/">
          <Image src="/logo.svg" alt="Logo" width={80} height={31} />
        </Link>
        <UserButton />
      </div>
    </nav>
  );
};
