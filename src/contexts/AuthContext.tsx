"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface User {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    role: "USER" | "ADMIN";
    image: string | null;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (data: { email?: string; phone?: string; password: string; rememberMe?: boolean }) => Promise<void>;
    register: (data: {
        name: string;
        email?: string;
        phone?: string;
        password: string;
    }) => Promise<void>;
    logout: () => void;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Load user from storage on mount
    useEffect(() => {
        // Check localStorage first (for Remember Me)
        let storedToken = localStorage.getItem("token");
        let storedUser = localStorage.getItem("user");

        // If not in localStorage, check sessionStorage
        if (!storedToken) {
            storedToken = sessionStorage.getItem("token");
            storedUser = sessionStorage.getItem("user");
        }

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }

        setIsLoading(false);
    }, []);

    const login = async (data: { email?: string; phone?: string; password: string; rememberMe?: boolean }) => {
        try {
            setIsLoading(true);

            const response = await api.auth.login(data);

            const { token: newToken, user: newUser, refreshToken } = response.data.data;

            // Choose storage based on rememberMe flag
            const storage = data.rememberMe ? localStorage : sessionStorage;

            // Store tokens and user
            storage.setItem("token", newToken);
            storage.setItem("user", JSON.stringify(newUser));

            if (refreshToken) {
                storage.setItem("refreshToken", refreshToken);
            }

            // Update state
            setToken(newToken);
            setUser(newUser);

            toast.success("Login successful!");

            // Redirect based on role
            if (newUser.role === "ADMIN") {
                router.push("/admin");
            } else {
                router.push("/");
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Invalid Credentials!";
            toast.error(errorMessage);
            // Don't throw error - just show toast and stay on page
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: {
        name: string;
        email?: string;
        phone?: string;
        password: string;
    }) => {
        try {
            setIsLoading(true);

            const response = await api.auth.register(data);

            const { token: newToken, user: newUser } = response.data.data;

            // Store in localStorage
            localStorage.setItem("token", newToken);
            localStorage.setItem("user", JSON.stringify(newUser));

            // Update state
            setToken(newToken);
            setUser(newUser);

            toast.success("Registration successful!");

            router.push("/");
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Registration failed";
            toast.error(errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        // Clear both localStorage and sessionStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("refreshToken");

        // Clear state
        setToken(null);
        setUser(null);

        toast.success("Logged out successfully");

        router.push("/login");
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    const value: AuthContextType = {
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}
