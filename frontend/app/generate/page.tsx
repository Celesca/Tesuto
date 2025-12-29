"use client";

import { AuthProvider, useAuth } from "../context/AuthContext";
import { Navbar } from "../components/Navigation";
import { HomeworkGenerator } from "../components/HomeworkGenerator";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function GenerateContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <HomeworkGenerator />
    </>
  );
}

export default function GeneratePage() {
  return (
    <AuthProvider>
      <GenerateContent />
    </AuthProvider>
  );
}
