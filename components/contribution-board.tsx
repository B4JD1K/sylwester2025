"use client";

import { useState } from "react";
import { type contributions } from "@/lib/schema";
import { useUser } from "@/lib/user-context";
import { addContribution, deleteContribution } from "@/app/actions";
import { toast } from "sonner";
import { Trash2, Plus, Edit2, NotebookPen, StickyNote } from "lucide-react";
import { cn } from "@/lib/utils";

type Contribution = typeof contributions.$inferSelect;

export function ContributionBoard({ 
  userName, 
  items 
}: { 
  userName: string; 
  items: Contribution[] 
}) {
  const { name: currentUserName } = useUser();
  const isCurrentUser = currentUserName?.toLowerCase() === userName.toLowerCase();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newNote, setNewNote] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem || !newQuantity) return;
    
    const res = await addContribution(userName, newItem, newQuantity, newNote);
    
    if (res.success) {
      toast.success("Dodano!");
      setNewItem("");
      setNewQuantity("");
      setNewNote("");
      setIsAdding(false);
    } else {
      toast.error("Błąd!");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Na pewno usunąć?")) return;
    await deleteContribution(id);
    toast.success("Usunięto");
  };

  return (
    <div className={cn(
      "break-inside-avoid rounded-xl border bg-card text-card-foreground shadow-sm mb-6 overflow-hidden transition-all hover:shadow-md",
      isCurrentUser ? "ring-2 ring-primary border-primary" : ""
    )}>
      <div className="p-4 border-b bg-muted/30 flex justify-between items-center">
        <h3 className="font-semibold text-lg capitalize">{userName}</h3>
        {isCurrentUser && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">To Ty</span>
        )}
      </div>
      <div className="p-4 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">Jeszcze nic nie przynosi...</p>
        ) : (
          <ul className="space-y-2">
            {items.map(item => (
              <li key={item.id} className="group relative flex items-start justify-between text-sm gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                 <div className="flex-1 space-y-0.5">
                    <span className="font-medium text-foreground block">{item.itemName}</span>
                    <span className="text-muted-foreground text-xs block">{item.quantity}</span>
                    {item.note && (
                        <div className="flex items-center gap-1.5 text-xs text-amber-600/90 dark:text-amber-400 mt-1">
                            <StickyNote size={12} className="shrink-0" />
                            <span className="italic">{item.note}</span>
                        </div>
                    )}
                 </div>
                 {isCurrentUser && (
                   <button 
                     onClick={() => handleDelete(item.id)}
                     className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 p-1"
                     title="Usuń"
                   >
                     <Trash2 size={16} />
                   </button>
                 )}
              </li>
            ))}
          </ul>
        )}

        {isCurrentUser && (
            <div className="pt-2 border-t mt-2">
                {isAdding ? (
                    <form onSubmit={handleAdd} className="space-y-2 animate-in fade-in slide-in-from-top-2">
                        <input 
                            autoFocus
                            placeholder="Co przynosisz?" 
                            className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                            value={newItem}
                            onChange={e => setNewItem(e.target.value)}
                        />
                        <div className="flex gap-2">
                            <input 
                                placeholder="Ile? (np. 2l)" 
                                className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                value={newQuantity}
                                onChange={e => setNewQuantity(e.target.value)}
                            />
                        </div>
                        <input 
                            placeholder="Notatka (opcjonalna)..." 
                            className="w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring text-muted-foreground"
                            value={newNote}
                            onChange={e => setNewNote(e.target.value)}
                        />
                        <div className="flex justify-end pt-1">
                            <button type="submit" className="bg-primary text-primary-foreground rounded-md px-3 py-1 text-xs font-medium hover:bg-primary/90 w-full sm:w-auto">
                              Dodaj
                            </button>
                        </div>
                        <button 
                            type="button" 
                            onClick={() => setIsAdding(false)}
                            className="text-xs text-muted-foreground hover:underline w-full text-center"
                        >
                            Anuluj
                        </button>
                    </form>
                ) : (
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="w-full flex items-center justify-center gap-1 rounded-md border border-dashed border-muted-foreground/30 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                    >
                        <Plus size={16} /> Dodaj coś
                    </button>
                )}
            </div>
        )}
      </div>
    </div>
  );
}
