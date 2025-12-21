"use client";

import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import { ContributionBoard } from "@/components/contribution-board";
import { getContributions } from "@/app/actions";
import { contributions } from "@/lib/schema";
import { useUser } from "@/lib/user-context";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { addContribution } from "@/app/actions";

// We fetch data in a client component wrapper or server component?
// Best to fetch in server component and pass to client.
// But for "live" feel and Masonry which assumes client-side often, let's keep it simple.
// Wait, masonry is layout only.
// Let's make page.tsx a server component, fetch data, grouping, and pass to a Client List.

export default function HomeClient({ 
    initialData 
}: { 
    initialData: (typeof contributions.$inferSelect)[] 
}) {
    // Grouping logic
    const { name: currentUserName } = useUser();
    
    // We want to group by case-insensitive name, but preserve the display name of the first entry found or capitalized?
    // Let's normalize keys to lowercase.
    const grouped: Record<string, typeof items> = {};
    const items = initialData;

    items.forEach(item => {
        const key = item.userName.toLowerCase();
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(item);
    });

    // We also want to ensure the current user has a board even if empty
    if (currentUserName && !grouped[currentUserName.toLowerCase()]) {
        // We will render an empty board for current user by handling it in the display list
        // Or just inject it into grouped
        // But we don't know the proper casing display name yet, so use currentUserName as display
    }

    const uniqueKeys = Object.keys(grouped);
    if (currentUserName && !uniqueKeys.includes(currentUserName.toLowerCase())) {
        uniqueKeys.unshift(currentUserName.toLowerCase());
        grouped[currentUserName.toLowerCase()] = [];
    }
    
    // Sort keys: Current user first, then alphabetical?
    uniqueKeys.sort((a, b) => {
        if (currentUserName && a === currentUserName.toLowerCase()) return -1;
        if (currentUserName && b === currentUserName.toLowerCase()) return 1;
        return a.localeCompare(b);
    });

    const breakpointColumnsObj = {
      default: 4,
      1100: 3,
      700: 2,
      500: 1
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">

                    <div className="mx-auto p-4 md:p-8 shadow-sm">
                <h1 className="text-3xl font-bold tracking-tight">Kto co przynosi?</h1>
                <p className="text-muted-foreground text-lg">
                    Zadeklaruj co bierzesz, żebyśmy nie mieli 50 butelek Coli i 0 chipsów!
                </p>
            </div>
            </div>
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="flex -ml-6 w-auto"
                columnClassName="pl-6 bg-clip-padding"
            >
                {uniqueKeys.map(key => {
                    // Find display name from first item or use key if empty (and match with current user)
                    const items = grouped[key] || [];
                    let displayName = items[0]?.userName;
                    if (!displayName) {
                        // If it's the empty board for current user
                        if (currentUserName && key === currentUserName.toLowerCase()) {
                            displayName = currentUserName;
                        } else {
                            displayName = key; // Fallback
                        }
                    }
                    
                    return (
                        <ContributionBoard 
                            key={key} 
                            userName={displayName} 
                            items={items} 
                        />
                    );
                })}
            </Masonry>
        </div>
    );
}
