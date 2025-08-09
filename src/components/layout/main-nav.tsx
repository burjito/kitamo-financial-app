"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const navItems = [
  { href: "/home", label: "Home" },
  { href: "/kita-bot", label: "AI Bot" },
  { href: "/what-if-simulator", label: "Simulator" },
  { href: "/goal-tracker", label: "Goals" },
];


export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname();

  return (
    <nav
      className={cn("hidden md:flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
        {navItems.map((item) => (
            <Link
                key={item.href}
                href={item.href}
                className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname.startsWith(item.href) ? "text-primary" : "text-muted-foreground"
                )}
            >
                {item.label}
            </Link>
        ))}
    </nav>
  )
}
