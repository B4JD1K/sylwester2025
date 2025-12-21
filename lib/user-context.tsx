"use client";

import { createContext, useContext, useEffect, useState } from "react";

type UserContextType = {
  name: string | null;
  setName: (name: string) => void;
};

const UserContext = createContext<UserContextType>({
  name: null,
  setName: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [name, setNameState] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("sylwester_user");
    if (stored) setNameState(stored);
  }, []);

  const setName = (newName: string) => {
    localStorage.setItem("sylwester_user", newName);
    setNameState(newName);
  };

  return (
    <UserContext.Provider value={{ name, setName }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
