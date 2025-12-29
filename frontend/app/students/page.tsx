"use client";

import { AuthProvider, useAuth } from "../context/AuthContext";
import { Navbar } from "../components/Navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const mockStudents = [
  {
    id: 1,
    name: "Alex Thompson",
    email: "alex.t@school.edu",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    grade: "10th Grade",
    assignmentsCompleted: 18,
    totalAssignments: 20,
    avgScore: 87,
    lastActive: "2 hours ago",
    status: "active",
  },
  {
    id: 2,
    name: "Emily Chen",
    email: "emily.c@school.edu",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    grade: "10th Grade",
    assignmentsCompleted: 20,
    totalAssignments: 20,
    avgScore: 95,
    lastActive: "1 hour ago",
    status: "active",
  },
  {
    id: 3,
    name: "Marcus Johnson",
    email: "marcus.j@school.edu",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    grade: "11th Grade",
    assignmentsCompleted: 15,
    totalAssignments: 18,
    avgScore: 78,
    lastActive: "3 hours ago",
    status: "active",
  },
  {
    id: 4,
    name: "Sofia Rodriguez",
    email: "sofia.r@school.edu",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia",
    grade: "10th Grade",
    assignmentsCompleted: 19,
    totalAssignments: 20,
    avgScore: 92,
    lastActive: "5 hours ago",
    status: "active",
  },
  {
    id: 5,
    name: "James Wilson",
    email: "james.w@school.edu",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    grade: "11th Grade",
    assignmentsCompleted: 12,
    totalAssignments: 18,
    avgScore: 72,
    lastActive: "1 day ago",
    status: "inactive",
  },
  {
    id: 6,
    name: "Olivia Brown",
    email: "olivia.b@school.edu",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
    grade: "9th Grade",
    assignmentsCompleted: 14,
    totalAssignments: 15,
    avgScore: 88,
    lastActive: "30 minutes ago",
    status: "active",
  },
];

function StudentsContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<typeof mockStudents[0] | null>(null);

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

  const filteredStudents = mockStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Students</h1>
              <p className="text-muted mt-2">
                Manage your students and track their progress
              </p>
            </div>
            <Button>+ Add Student</Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card padding="md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl">
                  👥
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{mockStudents.length}</p>
                  <p className="text-sm text-muted">Total Students</p>
                </div>
              </div>
            </Card>
            <Card padding="md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-2xl">
                  ✅
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {mockStudents.filter((s) => s.status === "active").length}
                  </p>
                  <p className="text-sm text-muted">Active This Week</p>
                </div>
              </div>
            </Card>
            <Card padding="md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-2xl">
                  📊
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {Math.round(mockStudents.reduce((acc, s) => acc + s.avgScore, 0) / mockStudents.length)}%
                  </p>
                  <p className="text-sm text-muted">Average Score</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Search */}
          <div className="mb-6">
            <Input
              placeholder="Search students by name, email, or grade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          {/* Students Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((student) => (
              <Card
                key={student.id}
                variant="elevated"
                className="cursor-pointer hover:scale-[1.02] transition-transform"
                onClick={() => setSelectedStudent(student)}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-14 h-14 rounded-full bg-secondary"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground truncate">
                        {student.name}
                      </h3>
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          student.status === "active" ? "bg-green-500" : "bg-muted"
                        }`}
                      />
                    </div>
                    <p className="text-sm text-muted truncate">{student.email}</p>
                    <p className="text-xs text-muted mt-1">{student.grade}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted">Progress</span>
                    <span className="font-medium text-foreground">
                      {student.assignmentsCompleted}/{student.totalAssignments}
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{
                        width: `${(student.assignmentsCompleted / student.totalAssignments) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-3">
                    <div>
                      <p className="text-xs text-muted">Avg Score</p>
                      <p className={`font-semibold ${getScoreColor(student.avgScore)}`}>
                        {student.avgScore}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted">Last Active</p>
                      <p className="text-sm text-foreground">{student.lastActive}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <Card padding="lg">
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔍</span>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No students found
                </h3>
                <p className="text-muted">
                  Try adjusting your search query
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedStudent(null)}
        >
          <Card
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                <img
                  src={selectedStudent.avatar}
                  alt={selectedStudent.name}
                  className="w-16 h-16 rounded-full bg-secondary"
                />
                <div>
                  <CardTitle>{selectedStudent.name}</CardTitle>
                  <CardDescription>{selectedStudent.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-secondary">
                  <p className="text-sm text-muted">Grade</p>
                  <p className="font-semibold text-foreground">{selectedStudent.grade}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary">
                  <p className="text-sm text-muted">Average Score</p>
                  <p className={`font-semibold ${getScoreColor(selectedStudent.avgScore)}`}>
                    {selectedStudent.avgScore}%
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-secondary">
                  <p className="text-sm text-muted">Completed</p>
                  <p className="font-semibold text-foreground">
                    {selectedStudent.assignmentsCompleted}/{selectedStudent.totalAssignments}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-secondary">
                  <p className="text-sm text-muted">Last Active</p>
                  <p className="font-semibold text-foreground">{selectedStudent.lastActive}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1">View Progress</Button>
                <Button variant="secondary" className="flex-1">Send Message</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

export default function StudentsPage() {
  return (
    <AuthProvider>
      <StudentsContent />
    </AuthProvider>
  );
}
