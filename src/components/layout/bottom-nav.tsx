
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FlaskConical,
  Milestone,
  Target,
  BrainCircuit,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  isCenter?: boolean;
}

const navItems: NavItem[] = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/what-if-simulator", label: "Simulator", icon: FlaskConical },
  { href: "/kitamo-bot", label: "AI Bot", icon: BrainCircuit, isCenter: true },
  { href: "/lifepath-navigator", label: "LifePath", icon: Milestone },
  { href: "/goal-tracker", label: "Goals", icon: Target },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <TooltipProvider>
        <div className="grid h-full grid-cols-5 items-center">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);

            if (item.isCenter) {
              return (
                <div key={item.href} className="flex justify-center -mt-6">
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex h-14 w-14 items-center justify-center rounded-full transition-all",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "bg-background border-4 border-primary text-primary hover:bg-primary/10 shadow-md"
                        )}
                      >
                        <item.icon className="h-6 w-6" />
                      </Link>
                    </TooltipTrigger>
                     <TooltipContent>
                        <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              );
            }

            return (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary/80"
                    )}
                  >
                    <item.icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                    <span
                      className={cn(
                        "text-[10px] font-medium",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>
    </nav>
  );
}
