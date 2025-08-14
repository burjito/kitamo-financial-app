import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export default function LandingHeader() {
  return (
    <header className="absolute top-0 z-50 w-full">
      <div className="container max-w-7xl mx-auto flex h-20 items-center">
        <Link href="/" className="flex items-center gap-3">
          <Image 
            src="/logo.png" 
            alt="KitaMo Logo" 
            width={32} 
            height={32} 
            className="w-8 h-8"
          />
          <span className="text-2xl font-bold tracking-tight text-primary">
            KitaMo
          </span>
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <Button asChild size="sm" className="bg-gradient-to-r from-primary to-yellow-400 text-primary-foreground shadow-lg transition-transform hover:scale-105">
            <Link href="/login">
              Sign In
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
