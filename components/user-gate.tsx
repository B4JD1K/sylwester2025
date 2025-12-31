"use client";

import {useEffect, useState} from "react";
import {useUser} from "@/lib/user-context";

export function UserGate({children}: { children: React.ReactNode }) {
  const {name, setName} = useUser();
  const [inputName, setInputName] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch

  if (name) {
    return <>{children}</>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputName.trim().length > 0) {
      setName(inputName.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-card text-card-foreground rounded-xl border shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-2 text-center text-primary">Hej! Kto tam?</h2>
        <p className="text-muted-foreground text-center mb-6">
          Zanim wejdziesz, podaj swoje imię, żebyśmy wiedzieli kto co przynosi!
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            autoFocus
            type="text"
            placeholder="Twoje imię (np. Adam)"
            className="flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-1 text-lg shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
          />
          <button
            type="submit"
            disabled={!inputName.trim()}
            className="inline-flex h-12 w-full items-center justify-center whitespace-nowrap rounded-md bg-primary text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-lg font-medium"
          >
            Wchodzę!
          </button>
        </form>
      </div>
    </div>
  );
}
