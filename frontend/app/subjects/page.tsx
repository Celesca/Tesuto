"use client";

import { AuthProvider, useAuth } from "../context/AuthContext";
import { Navbar } from "../components/Navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input, Textarea } from "../components/ui/Input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { subjectAPI, Subject } from "../lib/api";

const subjectIcons = ["📐", "⚛️", "🧪", "🔬", "📊", "🌍", "💻", "📚"];
const subjectColors = [
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#6366F1", // Indigo
];

function SubjectsContent() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "📐",
    color: "#3B82F6",
    topics: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadSubjects();
    }
  }, [user]);

  const loadSubjects = async () => {
    try {
      setIsLoading(true);
      const data = await subjectAPI.getAll(user?.id);
      setSubjects(data);
    } catch (err) {
      console.error("Failed to load subjects:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!user || !formData.name.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const topics = formData.topics
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      await subjectAPI.create({
        name: formData.name,
        description: formData.description || undefined,
        icon: formData.icon,
        color: formData.color,
        tutorId: user.id,
        topics: topics.length > 0 ? topics : undefined,
      });

      setShowCreateModal(false);
      resetForm();
      loadSubjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create subject");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingSubject || !formData.name.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      await subjectAPI.update(editingSubject.id, {
        name: formData.name,
        description: formData.description || undefined,
        icon: formData.icon,
        color: formData.color,
      });

      setEditingSubject(null);
      resetForm();
      loadSubjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update subject");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subject? All associated assignments will also be deleted.")) {
      return;
    }

    try {
      await subjectAPI.delete(id);
      loadSubjects();
    } catch (err) {
      console.error("Failed to delete subject:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      icon: "📐",
      color: "#3B82F6",
      topics: "",
    });
    setError("");
  };

  const openEditModal = (subject: Subject) => {
    setFormData({
      name: subject.name,
      description: subject.description || "",
      icon: subject.icon || "📐",
      color: subject.color || "#3B82F6",
      topics: subject.topics.map((t) => t.name).join(", "),
    });
    setEditingSubject(subject);
  };

  if (authLoading) {
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
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Subjects</h1>
              <p className="text-muted mt-2">
                Manage your teaching subjects and topics
              </p>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              + Create Subject
            </Button>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : subjects.length === 0 ? (
            /* Empty State */
            <Card padding="lg">
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📚</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No Subjects Yet
                </h3>
                <p className="text-muted mb-6 max-w-md mx-auto">
                  Create your first subject to start organizing your homework assignments.
                  Subjects help you group related topics together.
                </p>
                <Button onClick={() => setShowCreateModal(true)}>
                  Create Your First Subject
                </Button>
              </div>
            </Card>
          ) : (
            /* Subjects Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => (
                <Card
                  key={subject.id}
                  variant="elevated"
                  className="hover:scale-[1.02] transition-transform"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: `${subject.color}20` }}
                    >
                      {subject.icon || "📚"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-foreground truncate">
                        {subject.name}
                      </h3>
                      {subject.description && (
                        <p className="text-sm text-muted line-clamp-2 mt-1">
                          {subject.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Topics */}
                  {subject.topics.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs text-muted mb-2">Topics:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {subject.topics.slice(0, 4).map((topic) => (
                          <span
                            key={topic.id}
                            className="px-2 py-0.5 text-xs rounded-full bg-secondary text-foreground"
                          >
                            {topic.name}
                          </span>
                        ))}
                        {subject.topics.length > 4 && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-secondary text-muted">
                            +{subject.topics.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Stats & Actions */}
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-sm text-muted">
                      {subject._count?.assignments || 0} assignments
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(subject)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(subject.id)}
                        className="text-error hover:text-error"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingSubject) && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowCreateModal(false);
            setEditingSubject(null);
            resetForm();
          }}
        >
          <Card
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <CardTitle>
                {editingSubject ? "Edit Subject" : "Create New Subject"}
              </CardTitle>
              <CardDescription>
                {editingSubject
                  ? "Update your subject details"
                  : "Add a new subject to organize your assignments"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-error/10 text-error text-sm">
                  {error}
                </div>
              )}

              <Input
                label="Subject Name"
                placeholder="e.g., Mathematics, Physics"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <Textarea
                label="Description (Optional)"
                placeholder="Brief description of what this subject covers..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={2}
              />

              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {subjectIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                        formData.icon === icon
                          ? "bg-primary/20 ring-2 ring-primary"
                          : "bg-secondary hover:bg-border"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {subjectColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-10 h-10 rounded-lg transition-all ${
                        formData.color === color
                          ? "ring-2 ring-offset-2 ring-foreground"
                          : ""
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {!editingSubject && (
                <Input
                  label="Topics (Optional)"
                  placeholder="Algebra, Geometry, Calculus (comma-separated)"
                  value={formData.topics}
                  onChange={(e) =>
                    setFormData({ ...formData, topics: e.target.value })
                  }
                  helperText="Add topics to organize problems within this subject"
                />
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingSubject(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={editingSubject ? handleUpdate : handleCreate}
                  isLoading={isSubmitting}
                  disabled={!formData.name.trim()}
                >
                  {editingSubject ? "Update Subject" : "Create Subject"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

export default function SubjectsPage() {
  return (
    <AuthProvider>
      <SubjectsContent />
    </AuthProvider>
  );
}
