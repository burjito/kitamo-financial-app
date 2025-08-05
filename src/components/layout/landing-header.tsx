import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

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


export default function LandingHeader() {
  return (
    <header className="absolute top-0 z-50 w-full">
      <div className="container flex h-20 items-center text-white">
        <Link href="/" className="flex items-center gap-3">
          <Logo />
          <span className="text-2xl font-bold tracking-tight">
            KitaMo
          </span>
        </Link>
        <div className="ml-auto flex items-center space-x-4">
           <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                <Link href="#features" className="hover:text-secondary transition-colors">Features</Link>
                <Link href="/contact" className="hover:text-secondary transition-colors">Contact</Link>
           </nav>
            <Button asChild variant="secondary" className="hidden md:inline-flex">
                <Link href="/login">Get Started</Link>
            </Button>
        </div>
      </div>
    </header>
  );
}
