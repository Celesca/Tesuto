"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

const statsData = [
  {
    title: "Total Assignments",
    value: "24",
    change: "+3 this week",
    icon: "📝",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    title: "Active Students",
    value: "48",
    change: "+5 this month",
    icon: "👥",
    color: "bg-green-500/10 text-green-600",
  },
  {
    title: "Problems Created",
    value: "312",
    change: "+42 this week",
    icon: "📊",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    title: "Avg. Completion",
    value: "87%",
    change: "+2% vs last month",
    icon: "✅",
    color: "bg-orange-500/10 text-orange-600",
  },
];

const recentAssignments = [
  {
    id: 1,
    title: "Quadratic Equations Practice",
    subject: "Mathematics",
    students: 12,
    dueDate: "Jan 5, 2026",
    status: "active",
  },
  {
    id: 2,
    title: "Newton's Laws of Motion",
    subject: "Physics",
    students: 8,
    dueDate: "Jan 3, 2026",
    status: "active",
  },
  {
    id: 3,
    title: "Trigonometry Basics",
    subject: "Mathematics",
    students: 15,
    dueDate: "Dec 28, 2025",
    status: "completed",
  },
  {
    id: 4,
    title: "Electric Circuits",
    subject: "Physics",
    students: 10,
    dueDate: "Dec 25, 2025",
    status: "completed",
  },
];

const quickActions = [
  {
    title: "Generate Math Homework",
    description: "Create algebra, geometry, or calculus problems",
    icon: "📐",
    href: "/generate?subject=math",
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "Generate Physics Homework",
    description: "Create mechanics, thermodynamics, or optics problems",
    icon: "⚛️",
    href: "/generate?subject=physics",
    color: "from-purple-500 to-pink-600",
  },
  {
    title: "Add New Student",
    description: "Invite students to your class",
    icon: "➕",
    href: "/students/add",
    color: "from-green-500 to-teal-600",
  },
  {
    title: "View Analytics",
    description: "Check student performance reports",
    icon: "📈",
    href: "/analytics",
    color: "from-orange-500 to-red-600",
  },
];

export function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-muted mt-2">
            Here&apos;s what&apos;s happening with your classes today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsData.map((stat) => (
            <Card key={stat.title} variant="elevated" padding="md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className="text-xs text-accent mt-1">{stat.change}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center text-xl`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <Card
                  padding="md"
                  className="h-full cursor-pointer hover:scale-[1.02] transition-transform group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-2xl text-white mb-4`}>
                    {action.icon}
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-muted mt-1">{action.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Assignments */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card padding="none">
              <CardHeader className="p-6 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Assignments</CardTitle>
                    <CardDescription>Your latest homework assignments</CardDescription>
                  </div>
                  <Link href="/assignments">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="space-y-3">
                  {recentAssignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                          assignment.subject === "Mathematics" 
                            ? "bg-blue-500/10 text-blue-600" 
                            : "bg-purple-500/10 text-purple-600"
                        }`}>
                          {assignment.subject === "Mathematics" ? "📐" : "⚛️"}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{assignment.title}</p>
                          <p className="text-sm text-muted">
                            {assignment.students} students • Due {assignment.dueDate}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        assignment.status === "active"
                          ? "bg-green-500/10 text-green-600"
                          : "bg-muted/20 text-muted"
                      }`}>
                        {assignment.status === "active" ? "Active" : "Completed"}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subject Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Subject Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted">Mathematics</span>
                      <span className="font-medium text-foreground">58%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "58%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted">Physics</span>
                      <span className="font-medium text-foreground">42%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: "42%" }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardContent>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <h4 className="font-semibold text-foreground">Pro Tip</h4>
                    <p className="text-sm text-muted mt-1">
                      Use adaptive difficulty to automatically adjust problem complexity based on student performance.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
