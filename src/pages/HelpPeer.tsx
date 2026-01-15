import { useState } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Users, Tag, MessageSquare, Award, HelpCircle, TrendingUp, Send, X, CheckCircle2, XCircle, Loader2, Shield, Sparkles, AlertCircle, Lightbulb, Info } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { verifyPeerAnswer } from "../services/gemini";

interface Question {
  id: number;
  user: string;
  question: string;
  tags: string[];
  time: string;
  points: number;
}

interface VerificationResult {
  verified: boolean;
  message: string;
  score?: number;
  issues?: string[];
  suggestions?: string[];
  missingPoints?: string[];
}

type VerificationStatus = "idle" | "verifying" | "verified" | "rejected";

const HelpPeer = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [answer, setAnswer] = useState("");
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("idle");
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [totalPointsEarned, setTotalPointsEarned] = useState(80);

  const [unansweredQuestions, setUnansweredQuestions] = useState<Question[]>([
    {
      id: 1,
      user: "Emma",
      question: "Can someone explain the concept of derivatives in calculus?",
      tags: ["Mathematics", "Calculus"],
      time: "30m ago",
      points: 10,
    },
    {
      id: 2,
      user: "John",
      question: "How does photosynthesis work in plants?",
      tags: ["Biology", "Photosynthesis"],
      time: "1h ago",
      points: 15,
    },
    {
      id: 3,
      user: "Lisa",
      question: "What's the difference between ionic and covalent bonds?",
      tags: ["Chemistry", "Bonding"],
      time: "2h ago",
      points: 10,
    },
    {
      id: 4,
      user: "Mike",
      question: "Explain Newton's laws of motion with examples?",
      tags: ["Physics", "Motion"],
      time: "3h ago",
      points: 20,
    },
  ]);

  const handleSubmitAnswer = async () => {
    if (!answer.trim() || selectedQuestion === null) return;

    const currentQuestion = unansweredQuestions.find(q => q.id === selectedQuestion);
    if (!currentQuestion) return;

    setVerificationStatus("verifying");
    setVerificationResult(null);

    try {
      const result = await verifyPeerAnswer(currentQuestion.question, answer);
      setVerificationResult(result);

      if (result.verified) {
        setVerificationStatus("verified");

        setTimeout(() => {
          setTotalPointsEarned(prev => prev + currentQuestion.points);
          setAnsweredQuestions([...answeredQuestions, selectedQuestion]);
          setUnansweredQuestions(unansweredQuestions.filter(q => q.id !== selectedQuestion));
          setAnswer("");
          setSelectedQuestion(null);
          setVerificationStatus("idle");
          setVerificationResult(null);
        }, 3000);
      } else {
        setVerificationStatus("rejected");
      }
    } catch (error) {
      setVerificationStatus("rejected");
      setVerificationResult({
        verified: false,
        message: "Error during verification. Please try again.",
        issues: ["Connection error"],
        suggestions: ["Check your internet connection"],
        missingPoints: []
      });
      console.error("Verification error:", error);
    }
  };

  const handleTryAgain = () => {
    setVerificationStatus("idle");
    setVerificationResult(null);
  };

  const handleCancel = () => {
    setSelectedQuestion(null);
    setAnswer("");
    setVerificationStatus("idle");
    setVerificationResult(null);
  };

  const tagColors: Record<string, string> = {
    Mathematics: "bg-blue-500/10 text-blue-600 border-blue-500/30",
    Calculus: "bg-blue-400/10 text-blue-500 border-blue-400/30",
    Biology: "bg-green-500/10 text-green-600 border-green-500/30",
    Photosynthesis: "bg-green-400/10 text-green-500 border-green-400/30",
    Chemistry: "bg-purple-500/10 text-purple-600 border-purple-500/30",
    Bonding: "bg-purple-400/10 text-purple-500 border-purple-400/30",
    Physics: "bg-orange-500/10 text-orange-600 border-orange-500/30",
    Motion: "bg-orange-400/10 text-orange-500 border-orange-400/30",
  };

  const stats = [
    {
      label: "Unanswered Questions",
      value: unansweredQuestions.length,
      icon: HelpCircle,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Your Contributions",
      value: answeredQuestions.length,
      icon: Award,
      color: "from-primary to-purple-600",
      bgColor: "bg-primary/10",
    },
    {
      label: "Points Earned",
      value: totalPointsEarned,
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
      suffix: "pts",
    },
  ];

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
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-lg">
                <Users className="h-7 w-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-purple-600 bg-clip-text text-transparent">
                Help Peers
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                AI-verified answers • Earn rewards 🎯
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden border-2 hover:border-primary/40 transition-all duration-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className="h-5 w-5 text-current" />
                    </div>
                    <div className={`h-20 w-20 rounded-full bg-gradient-to-br ${stat.color} opacity-10 absolute -top-6 -right-6`} />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">
                    {stat.label}
                  </p>
                  <p className={`text-3xl font-bold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                    {stat.suffix && <span className="text-lg ml-1">{stat.suffix}</span>}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Questions Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Questions Waiting for Your Help
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Answer questions and earn points • All answers verified by AI
              </p>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {unansweredQuestions.map((q, index) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Card className="border-2 hover:border-primary/40 transition-all duration-200 overflow-hidden">
                  <div className="p-6">
                    {/* Question Header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-600 text-white font-semibold shadow-md">
                          {q.user[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{q.user}</span>
                            <span className="text-xs text-muted-foreground">
                              • {q.time}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-sm">
                              +{q.points} points
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="mb-4 pl-13">
                      <h3 className="text-lg font-semibold text-foreground mb-3 leading-relaxed">
                        {q.question}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        {q.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className={`text-xs border font-medium ${
                              tagColors[tag] || "bg-gray-500/10 text-gray-600 border-gray-500/30"
                            }`}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Answer Section */}
                    <AnimatePresence>
                      {selectedQuestion === q.id ? (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t pt-4 pl-13"
                        >
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                                Your Answer
                                <Badge variant="outline" className="text-xs">
                                  <Shield className="h-3 w-3 mr-1" />
                                  AI will verify
                                </Badge>
                              </label>
                              <Textarea
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Share your knowledge and help your peer... (Be detailed and clear for AI verification)"
                                className="min-h-[120px] border-2 focus:border-primary/50"
                                disabled={verificationStatus === "verifying"}
                              />
                            </div>

                            {/* Verification Status Display */}
                            <AnimatePresence>
                              {verificationStatus === "verifying" && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="bg-blue-500/10 border-2 border-blue-500/30 rounded-xl p-4"
                                >
                                  <div className="flex items-center gap-3">
                                    <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                                    <div>
                                      <h4 className="font-semibold text-blue-600 flex items-center gap-2">
                                        <Sparkles className="h-4 w-4" />
                                        AI is verifying your answer...
                                      </h4>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        Checking accuracy, clarity, and completeness
                                      </p>
                                    </div>
                                  </div>
                                  <div className="mt-3">
                                    <div className="h-1.5 w-full bg-blue-200 rounded-full overflow-hidden">
                                      <motion.div
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 2.5 }}
                                      />
                                    </div>
                                  </div>
                                </motion.div>
                              )}

                              {verificationStatus === "verified" && verificationResult && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  className="bg-green-500/10 border-2 border-green-500/30 rounded-xl p-4"
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-full bg-green-500/20">
                                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-green-600 flex items-center gap-2 mb-2">
                                        <Sparkles className="h-4 w-4" />
                                        Answer Verified Successfully! 🎉
                                      </h4>
                                      <p className="text-sm text-muted-foreground mb-3">
                                        {verificationResult.message}
                                      </p>
                                      {verificationResult.score && (
                                        <div className="mb-3">
                                          <div className="flex items-center justify-between text-sm mb-1">
                                            <span className="text-muted-foreground">Quality Score</span>
                                            <span className="font-semibold text-green-600">{verificationResult.score}/100</span>
                                          </div>
                                          <div className="h-2 bg-green-200 rounded-full overflow-hidden">
                                            <motion.div
                                              className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                                              initial={{ width: 0 }}
                                              animate={{ width: `${verificationResult.score}%` }}
                                              transition={{ duration: 1 }}
                                            />
                                          </div>
                                        </div>
                                      )}
                                      <div className="flex items-center gap-2 text-sm">
                                        <Award className="h-4 w-4 text-green-500" />
                                        <span className="font-semibold text-green-600">+{q.points} points earned!</span>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}

                              {verificationStatus === "rejected" && verificationResult && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  className="space-y-3"
                                >
                                  {/* Main rejection message */}
                                  <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                      <div className="p-2 rounded-full bg-red-500/20">
                                        <XCircle className="h-6 w-6 text-red-500" />
                                      </div>
                                      <div className="flex-1">
                                        <h4 className="font-semibold text-red-600 mb-2">
                                          Answer Needs Improvement
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                          {verificationResult.message}
                                        </p>
                                        {verificationResult.score !== undefined && (
                                          <div className="mt-3">
                                            <div className="flex items-center justify-between text-sm mb-1">
                                              <span className="text-muted-foreground">Current Score</span>
                                              <span className="font-semibold text-red-600">{verificationResult.score}/100</span>
                                            </div>
                                            <div className="h-2 bg-red-200 rounded-full overflow-hidden">
                                              <div
                                                className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                                                style={{ width: `${verificationResult.score}%` }}
                                              />
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                              Need 70+ to pass verification
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Issues found */}
                                  {verificationResult.issues && verificationResult.issues.length > 0 && (
                                    <div className="bg-orange-500/10 border-2 border-orange-500/30 rounded-xl p-4">
                                      <div className="flex items-start gap-2 mb-3">
                                        <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                                        <h4 className="font-semibold text-orange-600">Issues Found:</h4>
                                      </div>
                                      <ul className="space-y-2 ml-7">
                                        {verificationResult.issues.map((issue, idx) => (
                                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                            <span className="text-orange-500 font-bold">•</span>
                                            <span>{issue}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Suggestions */}
                                  {verificationResult.suggestions && verificationResult.suggestions.length > 0 && (
                                    <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-xl p-4">
                                      <div className="flex items-start gap-2 mb-3">
                                        <Lightbulb className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                        <h4 className="font-semibold text-blue-600">How to Improve:</h4>
                                      </div>
                                      <ul className="space-y-2 ml-7">
                                        {verificationResult.suggestions.map((suggestion, idx) => (
                                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                            <span className="text-blue-500 font-bold">✓</span>
                                            <span>{suggestion}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Missing points */}
                                  {verificationResult.missingPoints && verificationResult.missingPoints.length > 0 && (
                                    <div className="bg-purple-500/10 border-2 border-purple-500/30 rounded-xl p-4">
                                      <div className="flex items-start gap-2 mb-3">
                                        <Info className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                                        <h4 className="font-semibold text-purple-600">Missing Information:</h4>
                                      </div>
                                      <ul className="space-y-2 ml-7">
                                        {verificationResult.missingPoints.map((point, idx) => (
                                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                            <span className="text-purple-500 font-bold">→</span>
                                            <span>{point}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              {verificationStatus === "idle" && (
                                <>
                                  <Button
                                    onClick={handleSubmitAnswer}
                                    disabled={!answer.trim()}
                                    className="bg-gradient-to-br from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                                  >
                                    <Send className="mr-2 h-4 w-4" />
                                    Submit for AI Verification
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                  >
                                    <X className="mr-2 h-4 w-4" />
                                    Cancel
                                  </Button>
                                </>
                              )}

                              {verificationStatus === "rejected" && (
                                <>
                                  <Button
                                    onClick={handleTryAgain}
                                    className="bg-gradient-to-br from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                                  >
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Revise & Resubmit
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                  >
                                    Cancel
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="pl-13">
                          <Button
                            onClick={() => setSelectedQuestion(q.id)}
                            className="bg-gradient-to-br from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-md hover:shadow-lg transition-all"
                          >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Answer Question
                          </Button>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {unansweredQuestions.length === 0 && (
            <Card className="p-12 text-center border-2 border-dashed">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-purple-600/20 mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">All Caught Up! 🎉</h3>
              <p className="text-muted-foreground mb-4">
                You've answered all available questions. Check back later for more!
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-600 font-medium">
                <Award className="h-5 w-5" />
                Great job helping your peers!
              </div>
            </Card>
          )}
        </div>

        {/* AI Verification Info Card */}
        <Card className="border-2 border-green-500/20 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex-shrink-0">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-green-500" />
                  AI Verification Process
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• AI analyzes your answer for accuracy and completeness</li>
                  <li>• Get specific feedback on what to improve if rejected</li>
                  <li>• Score 70+ to pass verification and earn points</li>
                  <li>• Detailed explanations have higher verification rates</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Tips Card */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-purple-600/5">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600 flex-shrink-0">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  💡 Tips for AI-Verified Answers
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Provide step-by-step explanations with clear reasoning</li>
                  <li>• Use examples to illustrate complex concepts</li>
                  <li>• Ensure your answer is accurate and complete</li>
                  <li>• Write detailed responses (100+ characters recommended)</li>
                  <li>• If rejected, read the feedback carefully and improve</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default HelpPeer;