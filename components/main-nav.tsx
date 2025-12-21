"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/user-context";
import { LogOut } from "lucide-react";

export function MainNav() {
  const pathname = usePathname();
  const { name, setName } = useUser();

  const links = [
    { href: "/", label: "Lista" },
    { href: "/summary", label: "Podsumowanie" },
    { href: "/gallery", label: "Galeria" },
  ];

  return (
    <header className="sticky top-4 z-40 w-full flex justify-center pointer-events-none px-2">
      <div className="pointer-events-auto flex h-14 items-center px-4 md:px-6 rounded-full border bg-background/80 backdrop-blur-md shadow-md mx-auto w-full max-w-3xl overflow-hidden">
        <div className="flex gap-4 md:gap-8 mr-auto items-center min-w-0 flex-1">
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <span className="inline-block font-bold text-lg md:text-xl bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              Sylwester 2025
            </span>
          </Link>
              <nav className="flex gap-1 md:gap-4 items-center">
                {links.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center text-sm font-medium transition-colors hover:text-foreground/80 whitespace-nowrap px-3 py-1.5 rounded-full hover:bg-muted",
                      pathname === item.href ? "bg-muted text-foreground font-semibold" : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
          </div>
        <div className="flex items-center gap-2 pl-2 md:pl-4 border-l ml-2 md:ml-4 shrink-0">
            {name && (
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground hidden lg:inline">Jesteś jako:</span>
                    <span className="font-semibold text-primary truncate max-w-[80px] md:max-w-[120px]">{name}</span>
                    <button 
                        onClick={() => setName("")}
                        className="p-1.5 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                        title="Zmień imię"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            )}
        </div>
        </div>
    </header>
  );
}
