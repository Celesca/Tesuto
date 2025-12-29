"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { userAPI, User as APIUser } from "../lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "tutor" | "student";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  bypassLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("tesuto_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async () => {
    // Mock Google login - authenticate with backend
    try {
      const apiUser = await userAPI.auth({
        email: "sarah.johnson@tesuto.edu",
        name: "Sarah Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        role: "TUTOR",
      });
      
      const mockUser: User = {
        id: apiUser.id,
        name: apiUser.name,
        email: apiUser.email,
        avatar: apiUser.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        role: apiUser.role.toLowerCase() as "tutor" | "student",
      };
      setUser(mockUser);
      localStorage.setItem("tesuto_user", JSON.stringify(mockUser));
    } catch (error) {
      console.error("Login failed:", error);
      // Fallback to mock user if backend is not available
      const mockUser: User = {
        id: "tutor-001",
        name: "Sarah Johnson",
        email: "sarah.johnson@tesuto.edu",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        role: "tutor",
      };
      setUser(mockUser);
      localStorage.setItem("tesuto_user", JSON.stringify(mockUser));
    }
  };

  const bypassLogin = async () => {
    // Bypass login for development - auto-login as tutor
    setIsLoading(true);
    try {
      const apiUser = await userAPI.auth({
        email: "sarah.johnson@tesuto.edu",
        name: "Sarah Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        role: "TUTOR",
      });
      
      const mockUser: User = {
        id: apiUser.id,
        name: apiUser.name,
        email: apiUser.email,
        avatar: apiUser.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        role: apiUser.role.toLowerCase() as "tutor" | "student",
      };
      setUser(mockUser);
      localStorage.setItem("tesuto_user", JSON.stringify(mockUser));
    } catch (error) {
      console.error("Bypass login failed:", error);
      // Fallback to mock user
      const mockUser: User = {
        id: "tutor-001",
        name: "Sarah Johnson",
        email: "sarah.johnson@tesuto.edu",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        role: "tutor",
      };
      setUser(mockUser);
      localStorage.setItem("tesuto_user", JSON.stringify(mockUser));
    }
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("tesuto_user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, bypassLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
