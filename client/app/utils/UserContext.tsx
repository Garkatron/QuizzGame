// UserContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getCookie } from "~/cookie";

interface UserContextType {
    username: string | null;
}
const UserContext = createContext<UserContextType>({ username: null });

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        setUsername(getCookie("username"));

    }, []);

    return <UserContext.Provider value={{ username }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
