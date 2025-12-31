"use client";

import {type contributions} from "@/lib/schema";

export default function SummaryClient({data}: { data: typeof contributions.$inferSelect[] }) {
  // Group by user
  const grouped: Record<string, typeof data> = {};
  data.forEach(item => {
    const key = item.userName; // Keep original case for grouping unless we want to normalize?
    // Let's normalize for safer grouping
    const normKey = key.toLowerCase();
    if (!grouped[normKey]) grouped[normKey] = [];
    grouped[normKey].push(item);
  });

  const sortedKeys = Object.keys(grouped).sort();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="mx-auto p-4 md:p-8 shadow-sm">
        <h1 className="text-3xl font-bold mb-2">Podsumowanie</h1>
        <p className="text-muted-foreground">Wszystko w jednym miejscu.</p>
      </div>

      <div className="border rounded-lg overflow-hidden overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground font-medium uppercase text-xs">
          <tr>
            <th className="p-3 whitespace-nowrap">Kto</th>
            <th className="p-3 w-full">Co przynosi</th>
            <th className="p-3 text-right whitespace-wrap min-w-[80px] max-w-[120px]">Ile</th>
          </tr>
          </thead>
          <tbody className="divide-y">
          {sortedKeys.map(key => {
            const userItems = grouped[key];
            const displayName = userItems[0].userName; // Use first item's capitalization

            return userItems.map((item, index) => (
              <tr key={item.id} className="bg-card hover:bg-muted/50 transition-colors">
                <td className="p-3 font-medium align-top whitespace-nowrap">
                  {index === 0 && (
                    <span className="text-primary">{displayName}</span>
                  )}
                </td>
                <td className="p-3 break-words">
                  <div>
                    {item.itemName}
                    {item.note && (
                      <span className="block text-xs text-muted-foreground/80 italic">
                                📝 {item.note}
                            </span>
                    )}
                  </div>
                </td>
                <td className="p-3 text-right font-mono text-xs whitespace-wrap">{item.quantity}</td>
              </tr>
            ));
          })}
          {data.length === 0 && (
            <tr>
              <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                Pusto tu...
              </td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
