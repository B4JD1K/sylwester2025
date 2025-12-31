"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {cn} from "@/lib/utils";
import {useUser} from "@/lib/user-context";
import {LogOut, Menu, X} from "lucide-react";
import {useEffect, useState} from "react";

import {ModeToggle} from "@/components/mode-toggle";

export function MainNav() {
  const pathname = usePathname();
  const {name, setName} = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const links = [
    {href: "/", label: "Lista"},
    {href: "/summary", label: "Podsumowanie"},
    {href: "/gallery", label: "Galeria"},
  ];

  return (
    <header className="sticky mx-auto top-4 z-40 w-4/5 flex justify-center pointer-events-none px-2">
      {/* Main Nav */}
      <div className="pointer-events-auto flex h-14 items-center px-4 md:px-6 rounded-full border bg-background/80 backdrop-blur-md shadow-md mx-auto w-full max-w-3xl overflow-hidden justify-between">
        <div className="flex gap-4 md:gap-8 items-center min-w-0 flex-1">

          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <span className="inline-block font-bold text-lg md:text-xl bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 bg-clip-text text-transparent drop-shadow-sm">
              Sylwester 2025
            </span>
          </Link>
          {isMobile ? (
            <div className="ml-auto">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 text-foreground/80 hover:text-foreground hover:bg-muted rounded-full transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={20}/> : <Menu size={20}/>}
              </button>

              {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border bg-card/95 backdrop-blur-md shadow-lg p-3 animate-in fade-in slide-in-from-top-2 z-50 mx-20">
                  <nav className="flex flex-col gap-1">
                    {links.map((item) => (
                      <Link key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "flex items-center justify-center text-sm font-medium px-4 py-3 rounded-xl transition-all duration-200",
                              pathname === item.href
                                ? "bg-primary/5 text-primary font-semibold"
                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              )}
            </div>
          ) : (
            links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                //  className={cn(
                //    "flex items-center justify-center text-sm font-medium px-4 py-3 rounded-lg transition-colors border",
                //    pathname === item.href 
                //      ? "bg-primary/10 text-primary border-primary/20" 
                //      : "text-muted-foreground hover:bg-muted hover:text-foreground border-transparent"
                //  )}
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-foreground/80 whitespace-nowrap px-3 py-1.5 rounded-full hover:bg-muted",
                  pathname === item.href ? "bg-muted text-foreground font-semibold" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))
          )}


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
                <LogOut size={16}/>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mode Toggle - Far Right Outside Pill */}
      <div className="absolute pointer-events-auto left-99/100 translate-y-1/2 md:right-8 w-12 h-12">
        <ModeToggle className="bg-background/80 backdrop-blur-md shadow-sm border"/>
      </div>

    </header>
  );
}