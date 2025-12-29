"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input, Textarea } from "./ui/Input";
import { Select } from "./ui/Select";

interface GeneratedProblem {
  id: number;
  question: string;
  difficulty: string;
  topic: string;
  answer?: string;
}

const mathTopics = [
  { value: "algebra", label: "Algebra" },
  { value: "geometry", label: "Geometry" },
  { value: "trigonometry", label: "Trigonometry" },
  { value: "calculus", label: "Calculus" },
  { value: "statistics", label: "Statistics & Probability" },
  { value: "number-theory", label: "Number Theory" },
];

const physicsTopics = [
  { value: "mechanics", label: "Mechanics" },
  { value: "thermodynamics", label: "Thermodynamics" },
  { value: "electromagnetism", label: "Electromagnetism" },
  { value: "optics", label: "Optics" },
  { value: "waves", label: "Waves & Sound" },
  { value: "modern-physics", label: "Modern Physics" },
];

const difficultyOptions = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
  { value: "mixed", label: "Mixed Difficulty" },
];

const mockMathProblems: GeneratedProblem[] = [
  {
    id: 1,
    question: "Solve the quadratic equation: x² + 5x + 6 = 0",
    difficulty: "Easy",
    topic: "Algebra",
    answer: "x = -2 or x = -3",
  },
  {
    id: 2,
    question: "Find the derivative of f(x) = 3x³ - 2x² + 5x - 7",
    difficulty: "Medium",
    topic: "Calculus",
    answer: "f'(x) = 9x² - 4x + 5",
  },
  {
    id: 3,
    question: "Calculate the area of a triangle with sides 5, 12, and 13 units.",
    difficulty: "Easy",
    topic: "Geometry",
    answer: "30 square units",
  },
  {
    id: 4,
    question: "If sin(θ) = 3/5 and θ is in the first quadrant, find cos(θ).",
    difficulty: "Medium",
    topic: "Trigonometry",
    answer: "cos(θ) = 4/5",
  },
  {
    id: 5,
    question: "Evaluate the integral: ∫(2x + 3)dx from 0 to 4",
    difficulty: "Hard",
    topic: "Calculus",
    answer: "28",
  },
];

const mockPhysicsProblems: GeneratedProblem[] = [
  {
    id: 1,
    question: "A car accelerates from rest at 2 m/s². How far does it travel in 5 seconds?",
    difficulty: "Easy",
    topic: "Mechanics",
    answer: "25 meters",
  },
  {
    id: 2,
    question: "Calculate the work done when a force of 10N moves an object 5m in the direction of the force.",
    difficulty: "Easy",
    topic: "Mechanics",
    answer: "50 Joules",
  },
  {
    id: 3,
    question: "A 2kg object is heated from 20°C to 80°C. If specific heat capacity is 500 J/kg·K, find the heat energy required.",
    difficulty: "Medium",
    topic: "Thermodynamics",
    answer: "60,000 Joules",
  },
  {
    id: 4,
    question: "Calculate the focal length of a convex lens that forms an image at 30cm when the object is at 15cm.",
    difficulty: "Hard",
    topic: "Optics",
    answer: "10 cm",
  },
  {
    id: 5,
    question: "Find the electric field at a distance of 2m from a point charge of 4μC.",
    difficulty: "Medium",
    topic: "Electromagnetism",
    answer: "9 × 10³ N/C",
  },
];

export function HomeworkGenerator() {
  const [subject, setSubject] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [problemCount, setProblemCount] = useState<string>("5");
  const [customInstructions, setCustomInstructions] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProblems, setGeneratedProblems] = useState<GeneratedProblem[]>([]);
  const [showAnswers, setShowAnswers] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedProblems([]);

    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Return mock problems based on subject
    const problems = subject === "math" ? mockMathProblems : mockPhysicsProblems;
    const count = parseInt(problemCount) || 5;
    setGeneratedProblems(problems.slice(0, count));
    setIsGenerating(false);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case "easy":
        return "bg-green-500/10 text-green-600";
      case "medium":
        return "bg-yellow-500/10 text-yellow-600";
      case "hard":
        return "bg-red-500/10 text-red-600";
      default:
        return "bg-muted/10 text-muted";
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Generate Homework</h1>
          <p className="text-muted mt-2">
            Create customized homework problems for your students using AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
                <CardDescription>
                  Set up your homework parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Subject Selection */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Subject
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setSubject("math");
                        setTopic("");
                      }}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        subject === "math"
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-border hover:border-muted"
                      }`}
                    >
                      <span className="text-2xl mb-2 block">📐</span>
                      <span className="font-medium text-foreground">Mathematics</span>
                    </button>
                    <button
                      onClick={() => {
                        setSubject("physics");
                        setTopic("");
                      }}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        subject === "physics"
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-border hover:border-muted"
                      }`}
                    >
                      <span className="text-2xl mb-2 block">⚛️</span>
                      <span className="font-medium text-foreground">Physics</span>
                    </button>
                  </div>
                </div>

                {/* Topic Selection */}
                {subject && (
                  <Select
                    label="Topic"
                    options={subject === "math" ? mathTopics : physicsTopics}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Select a topic..."
                  />
                )}

                {/* Difficulty */}
                <Select
                  label="Difficulty Level"
                  options={difficultyOptions}
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  placeholder="Select difficulty..."
                />

                {/* Number of Problems */}
                <Input
                  label="Number of Problems"
                  type="number"
                  min="1"
                  max="20"
                  value={problemCount}
                  onChange={(e) => setProblemCount(e.target.value)}
                  helperText="Generate between 1-20 problems"
                />

                {/* Custom Instructions */}
                <Textarea
                  label="Custom Instructions (Optional)"
                  placeholder="E.g., Focus on word problems, include step-by-step solutions, use metric units..."
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  rows={3}
                />

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  isLoading={isGenerating}
                  disabled={!subject || !difficulty}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? "Generating Problems..." : "Generate Homework"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Generated Problems Panel */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Generated Problems</CardTitle>
                    <CardDescription>
                      {generatedProblems.length > 0
                        ? `${generatedProblems.length} problems generated`
                        : "Your problems will appear here"}
                    </CardDescription>
                  </div>
                  {generatedProblems.length > 0 && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAnswers(!showAnswers)}
                      >
                        {showAnswers ? "Hide Answers" : "Show Answers"}
                      </Button>
                      <Button variant="secondary" size="sm">
                        Export PDF
                      </Button>
                      <Button size="sm">Assign</Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                    <p className="text-muted">Generating problems with AI...</p>
                    <p className="text-sm text-muted/70 mt-1">This may take a few seconds</p>
                  </div>
                ) : generatedProblems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
                      <span className="text-4xl">📝</span>
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No Problems Yet
                    </h3>
                    <p className="text-muted max-w-sm">
                      Configure your homework settings on the left and click
                      &quot;Generate Homework&quot; to create problems.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {generatedProblems.map((problem, index) => (
                      <div
                        key={problem.id}
                        className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                                {problem.difficulty}
                              </span>
                              <span className="text-xs text-muted">
                                {problem.topic}
                              </span>
                            </div>
                            <p className="text-foreground">{problem.question}</p>
                            {showAnswers && problem.answer && (
                              <div className="mt-3 p-3 rounded-lg bg-accent/10 border border-accent/20">
                                <p className="text-sm font-medium text-accent">
                                  Answer: {problem.answer}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
