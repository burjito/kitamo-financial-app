import Link from "next/link";
import { User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/layout/main-nav";
import { cn } from "@/lib/utils";

const Logo = () => (
    <svg viewBox="0 0 64 64" fill="none" className="w-8 h-8">
      <defs>
        <linearGradient id="eyeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--secondary))" />
        </linearGradient>
      </defs>
      <path d="M2 32 C2 32 10 12 32 12 C54 12 62 32 62 32 C62 32 54 52 32 52 C10 52 2 32 2 32 Z" stroke="url(#eyeGradient)" strokeWidth="4" fill="none"/>
      <circle cx="32" cy="32" r="8" stroke="url(#eyeGradient)" strokeWidth="2" fill="url(#eyeGradient)"/>
    </svg>
);

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/home" className="flex items-center gap-3">
          <Logo />
          <span className="text-2xl font-bold text-primary tracking-tight">
            KitaMo
          </span>
        </Link>
        <div className="ml-auto flex items-center space-x-2">
          <MainNav />
          <Button asChild variant="ghost" size="icon" className="hidden md:inline-flex">
            <Link href="/profile">
                <User className="h-6 w-6 text-primary/80" />
                <span className="sr-only">Profile</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
