// UserContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getCookie } from "~/cookie";
import type { User } from "./owntypes";

interface UserContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    hasPermission: (name: string) => boolean;
    hasPermissions: (...names: string[]) => boolean;
}
const UserContext = createContext<UserContextType>({ user: null, login: (userData) => { }, logout: () => { }, hasPermission: (name: string) => false, hasPermissions: (...names: string[]) => false });

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };


    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    const hasPermission = (name: string): boolean => {
        return !!user?.permissions?.[name];
    };

    const hasPermissions = (...names: string[]): boolean => {
        return names.every(hasPermission);
    };

    return <UserContext.Provider value={{ user, login, logout, hasPermission, hasPermissions }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
