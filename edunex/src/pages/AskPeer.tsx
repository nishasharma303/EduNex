import { useState, useEffect } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { MessageCircle, Plus, Trash2, Send, ThumbsUp, User, TrendingUp, Flame, Users, Tag as TagIcon, Video, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
// import { analyzeTopics } from "../services/gemini"; // Commented out for now

interface Question {
  id: number;
  user: string;
  subject: string;
  question: string;
  answers: Answer[];
  time: string;
  likes: number;
  tags: string[];
}

interface Answer {
  user: string;
  text: string;
  time: string;
}

interface TopicHeat {
  name: string;
  displayName: string;
  count: number;
  questionIndices: number[];
  description: string;
  color: string;
}

const AskPeer = () => {
  const [showForm, setShowForm] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      user: "Alex",
      subject: "Computer Science",
      question: "How can I understand recursion better?",
      answers: [
        { user: "Maya", text: "Think of it as a function calling itself with a smaller problem", time: "1h ago" },
      ],
      time: "2h ago",
      likes: 12,
      tags: ["recursion", "programming"],
    },
    {
      id: 2,
      user: "Sarah",
      subject: "Computer Science",
      question: "Can someone explain recursion with examples?",
      answers: [
        { user: "David", text: "Classic example is factorial: n! = n * (n-1)!", time: "3h ago" },
      ],
      time: "3h ago",
      likes: 8,
      tags: ["recursion", "algorithms"],
    },
    {
      id: 3,
      user: "Mike",
      subject: "Computer Science",
      question: "What is recursion and how does it work?",
      answers: [],
      time: "30m ago",
      likes: 15,
      tags: ["recursion", "programming", "data-structures"],
    },
    {
      id: 4,
      user: "Priya",
      subject: "Computer Science",
      question: "Help! Stuck on recursive functions",
      answers: [
        { user: "Arjun", text: "Start with base case, then recursive case", time: "20m ago" },
      ],
      time: "1h ago",
      likes: 10,
      tags: ["recursion", "functions"],
    },
    {
      id: 5,
      user: "Emma",
      subject: "Computer Science",
      question: "Recursion vs iteration - when to use?",
      answers: [],
      time: "45m ago",
      likes: 9,
      tags: ["recursion", "loops", "algorithms"],
    },
    {
      id: 6,
      user: "John",
      subject: "Mathematics",
      question: "Help with quadratic formula?",
      answers: [
        { user: "Lisa", text: "Remember: x = (-b ± √(b² - 4ac)) / 2a", time: "2h ago" },
      ],
      time: "3h ago",
      likes: 5,
      tags: ["quadratic-equations", "algebra"],
    },
    {
      id: 7,
      user: "Lisa",
      subject: "Mathematics",
      question: "How to solve quadratic equations step by step?",
      answers: [],
      time: "4h ago",
      likes: 7,
      tags: ["quadratic-equations", "algebra", "formulas"],
    },
    {
      id: 8,
      user: "Tom",
      subject: "Mathematics",
      question: "Quadratic equation word problems?",
      answers: [
        { user: "Anna", text: "First identify a, b, c values from the problem", time: "1h ago" },
      ],
      time: "2h ago",
      likes: 6,
      tags: ["quadratic-equations", "word-problems"],
    },
    {
      id: 9,
      user: "Anna",
      subject: "Mathematics",
      question: "Why does the quadratic formula work?",
      answers: [],
      time: "5h ago",
      likes: 8,
      tags: ["quadratic-equations", "algebra"],
    },
    {
      id: 10,
      user: "David",
      subject: "Mathematics",
      question: "Completing the square vs quadratic formula?",
      answers: [],
      time: "1h ago",
      likes: 4,
      tags: ["quadratic-equations", "algebra"],
    },
    {
      id: 11,
      user: "Raj",
      subject: "Physics",
      question: "Explain Newton's second law?",
      answers: [
        { user: "Neha", text: "F = ma, force equals mass times acceleration", time: "2h ago" },
      ],
      time: "3h ago",
      likes: 10,
      tags: ["newtons-laws", "force", "motion"],
    },
    {
      id: 12,
      user: "Neha",
      subject: "Physics",
      question: "How to apply Newton's second law in problems?",
      answers: [],
      time: "4h ago",
      likes: 7,
      tags: ["newtons-laws", "physics-problems"],
    },
    {
      id: 13,
      user: "Karan",
      subject: "Physics",
      question: "Newton's laws real-world examples?",
      answers: [],
      time: "2h ago",
      likes: 9,
      tags: ["newtons-laws", "physics", "examples"],
    },
    {
      id: 14,
      user: "Sneha",
      subject: "Physics",
      question: "Difference between Newton's 3 laws?",
      answers: [
        { user: "Rohan", text: "1st: inertia, 2nd: F=ma, 3rd: action-reaction", time: "1h ago" },
      ],
      time: "5h ago",
      likes: 11,
      tags: ["newtons-laws", "physics"],
    },
    {
      id: 15,
      user: "Rohan",
      subject: "Chemistry",
      question: "What are ionic bonds?",
      answers: [],
      time: "6h ago",
      likes: 5,
      tags: ["chemical-bonding", "ionic-bonds"],
    },
  ]);

  const [newSubject, setNewSubject] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [newTags, setNewTags] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  // HARDCODED TRENDING TOPICS - Shows immediately
  const [trendingTopics, setTrendingTopics] = useState<TopicHeat[]>([
    {
      name: "recursion",
      displayName: "Recursion & Recursive Functions",
      count: 6,
      questionIndices: [0, 1, 2, 3, 4, 5],
      description: "Students struggling with understanding recursive function calls, base cases, and when to use recursion vs iteration",
      color: "from-pink-500 to-rose-500"
    },
    {
      name: "quadratic-equations",
      displayName: "Quadratic Equations",
      count: 5,
      questionIndices: [6, 7, 8, 9, 10],
      description: "Multiple questions about quadratic formula application, completing the square method, and solving word problems",
      color: "from-orange-500 to-pink-500"
    },
    {
      name: "newtons-laws",
      displayName: "Newton's Laws of Motion",
      count: 4,
      questionIndices: [11, 12, 13, 14],
      description: "Common confusion around F=ma, understanding the three laws, and applying them to real-world physics problems",
      color: "from-purple-500 to-pink-500"
    }
  ]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // OPTIONAL: Uncomment this if you want to enable AI analysis later
  /*
  useEffect(() => {
    const analyzeQuestionsSemantics = async () => {
      if (questions.length === 0) {
        setTrendingTopics([]);
        return;
      }

      console.log("🔍 Starting AI analysis of", questions.length, "questions");
      setIsAnalyzing(true);

      try {
        const result = await analyzeTopics(questions);
        console.log("📊 AI Analysis result:", result);

        if (!result || !result.topics || result.topics.length === 0) {
          console.log("⚠️ No hot topics found (all topics have < 4 questions)");
          setTrendingTopics([]);
          setIsAnalyzing(false);
          return;
        }

        const topicsWithColors = result.topics.map((topic: any) => {
          let color = "from-blue-500 to-blue-600";

          if (topic.count >= 6) {
            color = "from-pink-500 to-rose-500";
          } else if (topic.count >= 5) {
            color = "from-orange-500 to-pink-500";
          } else if (topic.count >= 4) {
            color = "from-purple-500 to-pink-500";
          }

          return { ...topic, color };
        });

        console.log("✅ Hot topics with colors:", topicsWithColors);
        setTrendingTopics(topicsWithColors);
      } catch (error) {
        console.error("❌ Failed to analyze topics:", error);
        setTrendingTopics([]);
      } finally {
        setIsAnalyzing(false);
      }
    };

    analyzeQuestionsSemantics();
  }, [questions]);
  */

  const handlePost = () => {
    if (!newSubject.trim() || !newQuestion.trim()) return;

    const tags = newTags
      .split(",")
      .map((tag) => tag.trim().toLowerCase().replace(/\s+/g, "-"))
      .filter((tag) => tag.length > 0);

    const newQ: Question = {
      id: Date.now(),
      user: "You",
      subject: newSubject,
      question: newQuestion,
      answers: [],
      time: "Just now",
      likes: 0,
      tags: tags.length > 0 ? tags : ["general"],
    };
    setQuestions([newQ, ...questions]);
    setNewSubject("");
    setNewQuestion("");
    setNewTags("");
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleLike = (id: number) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, likes: q.likes + 1 } : q))
    );
  };

  const handleReply = (id: number) => {
    if (!replyText.trim()) return;
    setQuestions(
      questions.map((q) =>
        q.id === id
          ? {
              ...q,
              answers: [
                ...q.answers,
                { user: "You", text: replyText, time: "Just now" },
              ],
            }
          : q
      )
    );
    setReplyText("");
    setReplyTo(null);
  };

  const filterByTopic = (topic: TopicHeat) => {
    console.log("Filtering questions for topic:", topic.displayName);
    console.log("Question indices:", topic.questionIndices);
    // You can implement actual filtering logic here
    alert(`Showing ${topic.count} questions about "${topic.displayName}"`);
  };

  const subjectColors: Record<string, string> = {
    Mathematics: "bg-blue-500/10 text-blue-600 border-blue-500/30",
    Physics: "bg-purple-500/10 text-purple-600 border-purple-500/30",
    Chemistry: "bg-green-500/10 text-green-600 border-green-500/30",
    Biology: "bg-pink-500/10 text-pink-600 border-pink-500/30",
    "Computer Science": "bg-indigo-500/10 text-indigo-600 border-indigo-500/30",
  };

  return (
    <DashboardLayout>
      <motion.div
        className="mx-auto max-w-6xl space-y-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-accent/10 p-6 border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-lg">
                  <MessageCircle className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-purple-600 bg-clip-text text-transparent">
                  Ask Peers
                </h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  AI-powered semantic topic detection
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-br from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="mr-2 h-5 w-5" />
              Ask Question
            </Button>
          </div>
        </div>

        {/* AI Analysis Loading State */}
        {isAnalyzing && (
          <Card className="border-2 border-blue-500/20">
            <div className="p-6 flex items-center gap-4">
              <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
              <div>
                <h3 className="font-semibold text-foreground">AI Analyzing Topics...</h3>
                <p className="text-sm text-muted-foreground">
                  Using semantic analysis to identify struggling topics
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Trending Topics Heatmap - ALWAYS VISIBLE NOW */}
        {!isAnalyzing && trendingTopics.length > 0 && (
          <Card className="border-2 border-pink-500/20 overflow-hidden">
            <div className="bg-gradient-to-br from-pink-500/5 via-rose-500/5 to-purple-500/5 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Flame className="h-6 w-6 text-pink-500" />
                    🔥 Hot Topics - AI Detected
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                    <Sparkles className="h-3 w-3" />
                    Semantic analysis • Topics with 4+ similar questions
                  </p>
                </div>
                <Badge className="bg-pink-500/10 text-pink-600 border-pink-500/30 animate-pulse">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {trendingTopics.length} Hot Topics
                </Badge>
              </div>

              {/* Heatmap Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-6">
                {trendingTopics.map((topic, index) => (
                  <motion.div
                    key={topic.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => filterByTopic(topic)}
                    className="cursor-pointer"
                  >
                    <Card
                      className={`relative overflow-hidden border-2 hover:border-opacity-80 transition-all ${
                        topic.count >= 6
                          ? "border-pink-500/40 shadow-lg shadow-pink-500/20"
                          : topic.count >= 5
                          ? "border-orange-500/40 shadow-lg shadow-orange-500/20"
                          : "border-purple-500/40 shadow-lg shadow-purple-500/20"
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${topic.color} opacity-15`} />
                      <div className="relative p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className={`p-2.5 rounded-lg bg-gradient-to-br ${topic.color} bg-opacity-20`}>
                            {topic.count >= 6 ? (
                              <Flame className="h-5 w-5 text-pink-500 animate-pulse" />
                            ) : topic.count >= 5 ? (
                              <TrendingUp className="h-5 w-5 text-orange-500" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-purple-500" />
                            )}
                          </div>
                          <Badge
                            className={`text-xs font-bold ${
                              topic.count >= 6
                                ? "bg-pink-500 text-white"
                                : topic.count >= 5
                                ? "bg-orange-500 text-white"
                                : "bg-purple-500 text-white"
                            }`}
                          >
                            {topic.count} students
                          </Badge>
                        </div>
                        <h3 className="font-bold text-foreground text-base mb-2">
                          {topic.displayName}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {topic.description}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                          <Sparkles className="h-3 w-3 text-purple-400" />
                          <span>AI matched</span>
                        </div>

                        {/* Heat intensity bar */}
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${topic.color}`}
                            initial={{ width: 0 }}
                            animate={{
                              width: `${
                                (topic.count / Math.max(...trendingTopics.map((t) => t.count))) * 100
                              }%`,
                            }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                          />
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Most Critical Topic Alert */}
              {trendingTopics.length > 0 && (
                <div className="flex gap-3 p-5 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-xl border-2 border-pink-500/30">
                  <AlertCircle className="h-6 w-6 text-pink-500 flex-shrink-0 mt-0.5 animate-pulse" />
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground mb-1 flex items-center gap-2">
                      <Flame className="h-4 w-4 text-pink-500" />
                      Critical: High Demand Detected!
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      <span className="font-bold text-pink-600 uppercase">
                        {trendingTopics[0]?.displayName}
                      </span>{" "}
                      is the #1 struggle point with{" "}
                      <span className="font-bold text-pink-600">{trendingTopics[0]?.count} students</span>{" "}
                      asking similar questions.
                    </p>
                    <p className="text-xs text-muted-foreground italic mb-3">
                      "{trendingTopics[0]?.description}"
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Host Help Session
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-pink-500/30 text-pink-600 hover:bg-pink-500/10"
                        onClick={() => filterByTopic(trendingTopics[0])}
                      >
                        View All {trendingTopics[0]?.count} Questions
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 border-2 hover:border-primary/40 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <MessageCircle className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{questions.length}</p>
                <p className="text-xs text-muted-foreground">Total Questions</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-2 hover:border-primary/40 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Users className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {questions.reduce((sum, q) => sum + q.answers.length, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Total Answers</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-2 hover:border-primary/40 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-pink-500/10">
                <Flame className="h-5 w-5 text-pink-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{trendingTopics.length}</p>
                <p className="text-xs text-muted-foreground">Hot Topics</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Question Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-2 border-primary/20 overflow-hidden">
                <div className="bg-gradient-to-b from-muted/30 to-background p-6">
                  <h3 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
                    📝 Post Your Question
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Subject</label>
                      <Input
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        placeholder="e.g., Mathematics, Physics, Chemistry..."
                        className="border-2 focus:border-primary/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Your Question</label>
                      <Textarea
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="Describe your question in detail..."
                        className="min-h-[120px] border-2 focus:border-primary/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Tags (comma-separated)
                      </label>
                      <Input
                        value={newTags}
                        onChange={(e) => setNewTags(e.target.value)}
                        placeholder="e.g., recursion, programming, algorithms"
                        className="border-2 focus:border-primary/50"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Add tags to help AI identify common topics
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handlePost}
                        className="bg-gradient-to-br from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                      >
                        Post Question
                      </Button>
                      <Button variant="outline" onClick={() => setShowForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Questions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Recent Questions</h2>
            <Badge variant="outline" className="text-xs">
              {questions.length} questions
            </Badge>
          </div>

          {questions.map((q, index) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card className="border-2 hover:border-primary/40 transition-all duration-200 overflow-hidden">
                <div className="p-6">
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-600 text-white font-semibold shadow-md">
                        {q.user[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{q.user}</span>
                          <span className="text-xs text-muted-foreground">• {q.time}</span>
                        </div>
                        <span
                          className={`inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full border font-medium ${
                            subjectColors[q.subject] ||
                            "bg-gray-500/10 text-gray-600 border-gray-500/30"
                          }`}
                        >
                          {q.subject}
                        </span>
                      </div>
                    </div>
                    {q.user === "You" && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-400 hover:text-red-500 hover:bg-red-50"
                        onClick={() => handleDelete(q.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Question Content */}
                  <div className="mb-3 pl-13">
                    <p className="text-foreground leading-relaxed mb-3">{q.question}</p>
                    {/* Tags */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {q.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs cursor-pointer hover:bg-primary/10"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 pl-13 mb-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleLike(q.id)}
                      className="gap-2 hover:text-primary"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span className="text-sm font-medium">{q.likes}</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                      className="gap-2 hover:text-primary"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">{q.answers.length} Answers</span>
                    </Button>
                  </div>

                  {/* Answers Section */}
                  <AnimatePresence>
                    {expandedId === q.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t pt-4"
                      >
                        <div className="space-y-3 mb-4">
                          {q.answers.length > 0 ? (
                            q.answers.map((a, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex gap-3 pl-13"
                              >
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-semibold flex-shrink-0">
                                  {a.user[0]}
                                </div>
                                <div className="flex-1 bg-muted/50 rounded-lg p-3 border">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium">{a.user}</span>
                                    <span className="text-xs text-muted-foreground">{a.time}</span>
                                  </div>
                                  <p className="text-sm text-foreground/90">{a.text}</p>
                                </div>
                              </motion.div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground italic pl-13">
                              No answers yet. Be the first to respond!
                            </p>
                          )}
                        </div>

                        {/* Reply Input */}
                        <div className="flex gap-2 pl-13">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-600 text-white text-sm font-semibold flex-shrink-0">
                            <User className="h-4 w-4" />
                          </div>
                          <div className="flex-1 flex gap-2">
                            <Input
                              value={replyTo === q.id ? replyText : ""}
                              onChange={(e) => {
                                setReplyTo(q.id);
                                setReplyText(e.target.value);
                              }}
                              placeholder="Write your answer..."
                              className="border-2 focus:border-primary/50"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleReply(q.id);
                                }
                              }}
                            />
                            <Button
                              size="icon"
                              onClick={() => handleReply(q.id)}
                              disabled={replyTo !== q.id || !replyText.trim()}
                              className="bg-gradient-to-br from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {questions.length === 0 && (
          <Card className="p-12 text-center border-2 border-dashed">
            <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No questions yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to ask a question!</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-br from-primary to-purple-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Ask First Question
            </Button>
          </Card>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default AskPeer;