
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@uploadthing/react/styles.css";
import { UserProvider } from "@/lib/user-context";
import { UserGate } from "@/components/user-gate";
import { MainNav } from "@/components/main-nav";
import { Toaster } from "sonner";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sylwester 2025",
  description: "Lista zakupów i wspomnień na Sylwestra 2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body 
        className={`${inter.className} min-h-screen bg-background text-foreground antialiased relative`}
        suppressHydrationWarning
      >
        <div className="fixed inset-0 z-[-1] opacity-20 dark:opacity-40 pointer-events-none bg-[url('/sparkles1.png')] bg-cover bg-center bg-no-repeat bg-fixed mix-blend-screen" />
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <UserProvider>
            <UserGate>
              <div className="relative flex min-h-screen flex-col">
                <MainNav />
                <main className="flex-1 container mx-auto p-4 md:p-8">
                  {children}
                </main>
              </div>
              <Toaster richColors position="bottom-right" />
            </UserGate>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
