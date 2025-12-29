const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "TUTOR" | "STUDENT" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

export interface Topic {
  id: string;
  name: string;
  order: number;
  subjectId: string;
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  tutorId: string;
  topics: Topic[];
  _count?: {
    assignments: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Problem {
  id: string;
  question: string;
  answer?: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  order: number;
  topicId?: string;
  assignmentId?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: "DRAFT" | "ACTIVE" | "COMPLETED" | "ARCHIVED";
  tutorId: string;
  subjectId: string;
  subject?: Subject;
  problems: Problem[];
  _count?: {
    problems: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Generic fetch wrapper
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `API Error: ${response.status}`);
  }

  return response.json();
}

// User API
export const userAPI = {
  auth: (data: { email: string; name: string; avatar?: string; role?: string }) =>
    fetchAPI<User>("/users/auth", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getById: (id: string) => fetchAPI<User>(`/users/${id}`),

  getAll: () => fetchAPI<User[]>("/users"),
};

// Subject API
export const subjectAPI = {
  getAll: (tutorId?: string) =>
    fetchAPI<Subject[]>(`/subjects${tutorId ? `?tutorId=${tutorId}` : ""}`),

  getById: (id: string) => fetchAPI<Subject>(`/subjects/${id}`),

  create: (data: {
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    tutorId: string;
    topics?: string[];
  }) =>
    fetchAPI<Subject>("/subjects", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (
    id: string,
    data: { name?: string; description?: string; icon?: string; color?: string }
  ) =>
    fetchAPI<Subject>(`/subjects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI<{ success: boolean }>(`/subjects/${id}`, {
      method: "DELETE",
    }),

  addTopic: (subjectId: string, name: string) =>
    fetchAPI<Topic>(`/subjects/${subjectId}/topics`, {
      method: "POST",
      body: JSON.stringify({ name }),
    }),

  deleteTopic: (subjectId: string, topicId: string) =>
    fetchAPI<{ success: boolean }>(`/subjects/${subjectId}/topics/${topicId}`, {
      method: "DELETE",
    }),
};

// Assignment API
export const assignmentAPI = {
  getAll: (filters?: { tutorId?: string; subjectId?: string; status?: string }) => {
    const params = new URLSearchParams();
    if (filters?.tutorId) params.append("tutorId", filters.tutorId);
    if (filters?.subjectId) params.append("subjectId", filters.subjectId);
    if (filters?.status) params.append("status", filters.status);
    const query = params.toString();
    return fetchAPI<Assignment[]>(`/assignments${query ? `?${query}` : ""}`);
  },

  getById: (id: string) => fetchAPI<Assignment>(`/assignments/${id}`),

  create: (data: {
    title: string;
    description?: string;
    dueDate?: string;
    status?: string;
    tutorId: string;
    subjectId: string;
    problems?: Array<{
      question: string;
      answer?: string;
      difficulty?: string;
      topicId?: string;
    }>;
  }) =>
    fetchAPI<Assignment>("/assignments", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (
    id: string,
    data: { title?: string; description?: string; dueDate?: string; status?: string }
  ) =>
    fetchAPI<Assignment>(`/assignments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI<{ success: boolean }>(`/assignments/${id}`, {
      method: "DELETE",
    }),

  addProblems: (
    id: string,
    problems: Array<{
      question: string;
      answer?: string;
      difficulty?: string;
      topicId?: string;
    }>
  ) =>
    fetchAPI<{ count: number }>(`/assignments/${id}/problems`, {
      method: "POST",
      body: JSON.stringify({ problems }),
    }),
};
