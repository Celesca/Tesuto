"use client";

import { AuthProvider, useAuth } from "../context/AuthContext";
import { Navbar } from "../components/Navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const mockAssignments = [
  {
    id: 1,
    title: "Quadratic Equations Practice",
    subject: "Mathematics",
    topic: "Algebra",
    problems: 10,
    students: 12,
    dueDate: "Jan 5, 2026",
    createdAt: "Dec 28, 2025",
    status: "active",
    completionRate: 45,
  },
  {
    id: 2,
    title: "Newton's Laws of Motion",
    subject: "Physics",
    topic: "Mechanics",
    problems: 8,
    students: 8,
    dueDate: "Jan 3, 2026",
    createdAt: "Dec 27, 2025",
    status: "active",
    completionRate: 62,
  },
  {
    id: 3,
    title: "Trigonometry Basics",
    subject: "Mathematics",
    topic: "Trigonometry",
    problems: 15,
    students: 15,
    dueDate: "Dec 28, 2025",
    createdAt: "Dec 20, 2025",
    status: "completed",
    completionRate: 100,
  },
  {
    id: 4,
    title: "Electric Circuits",
    subject: "Physics",
    topic: "Electromagnetism",
    problems: 12,
    students: 10,
    dueDate: "Dec 25, 2025",
    createdAt: "Dec 18, 2025",
    status: "completed",
    completionRate: 95,
  },
  {
    id: 5,
    title: "Calculus Integration",
    subject: "Mathematics",
    topic: "Calculus",
    problems: 8,
    students: 6,
    dueDate: "Dec 22, 2025",
    createdAt: "Dec 15, 2025",
    status: "completed",
    completionRate: 88,
  },
];

function AssignmentsContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

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

  const filteredAssignments = mockAssignments.filter((assignment) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "all" || assignment.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Assignments</h1>
              <p className="text-muted mt-2">
                Manage and track all your homework assignments
              </p>
            </div>
            <Button onClick={() => router.push("/generate")}>
              + Create Assignment
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search assignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {(["all", "active", "completed"] as const).map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Assignments List */}
          <div className="space-y-4">
            {filteredAssignments.map((assignment) => (
              <Card key={assignment.id} variant="elevated" padding="none">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Icon */}
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                        assignment.subject === "Mathematics"
                          ? "bg-blue-500/10 text-blue-600"
                          : "bg-purple-500/10 text-purple-600"
                      }`}
                    >
                      {assignment.subject === "Mathematics" ? "📐" : "⚛️"}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {assignment.title}
                          </h3>
                          <p className="text-sm text-muted mt-1">
                            {assignment.subject} • {assignment.topic} • {assignment.problems} problems
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                            assignment.status === "active"
                              ? "bg-green-500/10 text-green-600"
                              : "bg-muted/20 text-muted"
                          }`}
                        >
                          {assignment.status === "active" ? "Active" : "Completed"}
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="flex flex-wrap items-center gap-6 mt-4">
                        <div className="flex items-center gap-2 text-sm text-muted">
                          <span>👥</span>
                          <span>{assignment.students} students</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted">
                          <span>📅</span>
                          <span>Due {assignment.dueDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted">
                          <span>🕒</span>
                          <span>Created {assignment.createdAt}</span>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted">Completion Rate</span>
                          <span className="font-medium text-foreground">
                            {assignment.completionRate}%
                          </span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              assignment.completionRate === 100
                                ? "bg-green-500"
                                : "bg-primary"
                            }`}
                            style={{ width: `${assignment.completionRate}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2">
                      <Button variant="secondary" size="sm" className="flex-1">
                        View Details
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {filteredAssignments.length === 0 && (
              <Card padding="lg">
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📭</span>
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No assignments found
                  </h3>
                  <p className="text-muted mb-4">
                    {searchQuery
                      ? "Try adjusting your search query"
                      : "Create your first assignment to get started"}
                  </p>
                  <Button onClick={() => router.push("/generate")}>
                    Create Assignment
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function AssignmentsPage() {
  return (
    <AuthProvider>
      <AssignmentsContent />
    </AuthProvider>
  );
}
