"use client";

import React from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/Button";
import Link from "next/link";
import { usePathname } from "next/navigation";

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
  { label: "Subjects", href: "/subjects", icon: "📚" },
  { label: "Generate Homework", href: "/generate", icon: "📝" },
  { label: "Assignments", href: "/assignments", icon: "📋" },
  { label: "Students", href: "/students", icon: "👥" },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <span className="text-xl font-bold text-primary">Tesuto</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-primary text-white"
                    : "text-muted hover:text-foreground hover:bg-secondary"
                }`}
              >
                <span className="mr-1.5">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full bg-secondary"
              />
              <div className="text-sm">
                <p className="font-medium text-foreground">{user.name}</p>
                <p className="text-muted text-xs capitalize">{user.role}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-border">
        <div className="flex overflow-x-auto py-2 px-4 gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-primary text-white"
                  : "text-muted hover:text-foreground hover:bg-secondary"
              }`}
            >
              <span className="mr-1">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export function LoginForm() {
  const { login, bypassLogin } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isBypassing, setIsBypassing] = React.useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await login();
    setIsLoading(false);
  };

  const handleBypassLogin = async () => {
    setIsBypassing(true);
    await bypassLogin();
    setIsBypassing(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-4">
            <span className="text-4xl">🎓</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Tesuto</h1>
          <p className="text-muted mt-2">
            Smart Homework Generator for Tutors
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card rounded-2xl border border-border p-8 shadow-xl shadow-black/5">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-foreground">Welcome Back</h2>
            <p className="text-muted mt-2">
              Sign in to access your tutor dashboard
            </p>
          </div>

          <Button
            onClick={handleGoogleLogin}
            isLoading={isLoading}
            variant="outline"
            size="lg"
            className="w-full"
            leftIcon={!isLoading && <GoogleIcon />}
          >
            {isLoading ? "Signing in..." : "Continue with Google"}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-card px-2 text-muted">or</span>
            </div>
          </div>

          <Button
            onClick={handleBypassLogin}
            isLoading={isBypassing}
            variant="secondary"
            size="lg"
            className="w-full"
          >
            {isBypassing ? "Entering..." : "Quick Demo Access"}
          </Button>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted">
              By continuing, you agree to our{" "}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-xl bg-card/50 border border-border/50">
            <span className="text-2xl">📐</span>
            <p className="text-sm text-muted mt-2">Math Problems</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-card/50 border border-border/50">
            <span className="text-2xl">⚛️</span>
            <p className="text-sm text-muted mt-2">Physics</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-card/50 border border-border/50">
            <span className="text-2xl">🤖</span>
            <p className="text-sm text-muted mt-2">AI Powered</p>
          </div>
        </div>
      </div>
    </div>
  );
}
