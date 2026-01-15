import { useState } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Send, Sparkles, Bot, User, Network, MessageSquare, Loader2, Brain, Lightbulb, CheckCircle } from "lucide-react";
import { askHint } from "../services/gemini";
import { MindMap } from "../components/MindMap";
import { extractConcepts, ConceptMap } from "../services/conceptMapService";
import { motion, AnimatePresence } from "framer-motion";

const AskAI = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Hey there! I'm your AI Tutor. Ask any question — I'll show you a concept map and give you 2 hints, then the complete answer!",
    },
  ]);
  const [input, setInput] = useState("");
  const [hintsGiven, setHintsGiven] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "mindmap">("chat");
  const [conceptMap, setConceptMap] = useState<ConceptMap | null>(null);
  const [loadingConcepts, setLoadingConcepts] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answerShown, setAnswerShown] = useState(false);
  const [mapCreated, setMapCreated] = useState(false); // Track if map was already created

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setCurrentQuestion(userMessage);
    setInput("");
    setIsLoading(true);
    setHintsGiven(0);
    setAnswerShown(false);

    // Create concept map ONLY ONCE from the question
    if (!mapCreated) {
      setLoadingConcepts(true);
      extractConcepts(userMessage)
        .then((concepts) => {
          setConceptMap(concepts);
          setLoadingConcepts(false);
          setMapCreated(true); // Mark as created, never create again
        })
        .catch((error) => {
          console.error("Failed to extract concepts:", error);
          setLoadingConcepts(false);
        });
    }

    // Get first hint
    try {
      const data = await askHint(userMessage, 0);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `💡 Hint:\n\n${data.hint}`,
        },
      ]);

      setHintsGiven(1);
    } catch (error) {
      console.error("Error getting hint:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Oops, something went wrong! Try again." },
      ]);
    }
    setIsLoading(false);
  };

  const handleGetNextHint = async () => {
    if (!currentQuestion) return;

    setIsLoading(true);

    try {
      if (hintsGiven === 1) {
        // Get second hint
        const data = await askHint(currentQuestion, 1);

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `💡 Hint:\n\n${data.hint}`,
          },
        ]);

        setHintsGiven(2);
      } else if (hintsGiven === 2) {
        // Get complete answer
        const data = await askHint(currentQuestion, 2);

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `✅ Correct Answer:\n\n${data.hint}`,
          },
        ]);

        setAnswerShown(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Oops, something went wrong! Try again." },
      ]);
    }
    setIsLoading(false);
  };

  const getHintsLeftText = () => {
    if (answerShown) return "✓";
    return 2 - hintsGiven;
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-accent/10 p-6 border border-primary/20"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-lg">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-purple-600 bg-clip-text text-transparent">
                  AI Tutor
                </h1>
                <p className="text-muted-foreground">
                  2 hints → Correct answer + Concept map
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {messages.filter(m => m.role === "user").length}
                </div>
                <div className="text-xs text-muted-foreground">Questions</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${answerShown ? 'text-green-500' : 'text-purple-500'}`}>
                  {getHintsLeftText()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {answerShown ? 'Complete' : 'Hints Left'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-2 border-2">
            <div className="flex gap-2">
              <Button
                variant={activeTab === "chat" ? "default" : "ghost"}
                onClick={() => setActiveTab("chat")}
                className={`flex-1 gap-2 ${
                  activeTab === "chat"
                    ? "bg-gradient-to-r from-primary to-purple-600"
                    : ""
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                Chat
              </Button>
              <Button
                variant={activeTab === "mindmap" ? "default" : "ghost"}
                onClick={() => setActiveTab("mindmap")}
                className={`flex-1 gap-2 ${
                  activeTab === "mindmap"
                    ? "bg-gradient-to-r from-primary to-purple-600"
                    : ""
                }`}
              >
                <Network className="h-4 w-4" />
                Concept Map
                {loadingConcepts && (
                  <Loader2 className="h-3 w-3 animate-spin ml-1" />
                )}
                {conceptMap && !loadingConcepts && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-500 text-xs font-semibold">
                    {conceptMap.concepts.length}
                  </span>
                )}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeTab === "chat" ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="overflow-hidden border-2">
                <div className="bg-gradient-to-b from-muted/30 to-background p-6 min-h-[600px] flex flex-col">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto mb-6 space-y-6 pr-2">
                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex gap-3 ${
                          msg.role === "user" ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        {/* Avatar */}
                        <div
                          className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center shadow-md ${
                            msg.role === "user"
                              ? "bg-gradient-to-br from-blue-500 to-blue-600"
                              : "bg-gradient-to-br from-purple-500 to-primary"
                          }`}
                        >
                          {msg.role === "user" ? (
                            <User className="h-5 w-5 text-white" />
                          ) : (
                            <Bot className="h-5 w-5 text-white" />
                          )}
                        </div>

                        {/* Message Bubble */}
                        <div
                          className={`group max-w-[75%] ${
                            msg.role === "user" ? "items-end" : "items-start"
                          } flex flex-col gap-1`}
                        >
                          <span className="text-xs font-medium text-muted-foreground px-1">
                            {msg.role === "user" ? "You" : "AI Tutor"}
                          </span>
                          <div
                            className={`rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 ${
                              msg.role === "user"
                                ? "bg-gradient-to-br from-primary to-blue-600 text-white rounded-tr-sm"
                                : msg.content.startsWith("✅")
                                ? "bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 text-foreground rounded-tl-sm"
                                : "bg-card border-2 border-primary/20 text-foreground rounded-tl-sm hover:border-primary/40"
                            }`}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {msg.content}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Loading Animation */}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3"
                      >
                        <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-primary shadow-md">
                          <Bot className="h-5 w-5 text-white" />
                        </div>
                        <div className="bg-card border-2 border-primary/20 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-2">
                          <div className="flex gap-1">
                            <span className="h-2.5 w-2.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                            <span className="h-2.5 w-2.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                            <span className="h-2.5 w-2.5 rounded-full bg-primary animate-bounce" />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            AI is thinking...
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Get Next Hint/Answer Button */}
                  {currentQuestion && hintsGiven > 0 && !answerShown && !isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4"
                    >
                      <Button
                        onClick={handleGetNextHint}
                        className={`w-full ${
                          hintsGiven === 2
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                            : "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                        }`}
                      >
                        {hintsGiven === 2 ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Show Correct Answer
                          </>
                        ) : (
                          <>
                            <Lightbulb className="h-4 w-4 mr-2" />
                            Get Another Hint
                          </>
                        )}
                      </Button>
                    </motion.div>
                  )}

                  {/* View Concept Map Button */}
                  {conceptMap && !loadingConcepts && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4"
                    >
                      <Button
                        onClick={() => setActiveTab("mindmap")}
                        variant="outline"
                        className="w-full border-2 border-primary/30 hover:border-primary/60 hover:bg-primary/5"
                      >
                        <Network className="h-4 w-4 mr-2" />
                        View Concept Map ({conceptMap.concepts.length} concepts)
                      </Button>
                    </motion.div>
                  )}

                  {/* Input Area */}
                  <div className="relative">
                    <div className="flex gap-3 p-4 bg-card rounded-xl border-2 border-primary/20 shadow-lg focus-within:border-primary/50 transition-colors">
                      <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          !e.shiftKey &&
                          (e.preventDefault(), handleSend())
                        }
                        placeholder="Ask anything... (What is inheritance? How does photosynthesis work?)"
                        className="min-h-[56px] max-h-[120px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                        disabled={isLoading}
                      />
                      <Button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        size="icon"
                        className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 ml-1 flex items-center gap-1">
                      <Brain className="h-3 w-3" />
                      Concept map from question → 2 hints → Correct answer
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="mindmap"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border-2 p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Network className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">
                          Concept Map
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Based on: "{currentQuestion || 'your question'}"
                        </p>
                      </div>
                    </div>
                    {loadingConcepts && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Building map...
                      </div>
                    )}
                  </div>
                </div>

                {loadingConcepts ? (
                  <div className="flex flex-col items-center justify-center h-[600px] border-2 border-dashed border-primary/20 rounded-xl">
                    <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                    <p className="text-muted-foreground">Analyzing your question...</p>
                  </div>
                ) : conceptMap && conceptMap.concepts.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MindMap conceptMap={conceptMap} />
                    <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-primary/10">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-primary">
                            {conceptMap.concepts.length}
                          </div>
                          <div className="text-xs text-muted-foreground">Concepts</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-500">
                            {conceptMap.relations.length}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Connections
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-500">
                            {Math.max(...conceptMap.concepts.map((c) => c.level)) + 1}
                          </div>
                          <div className="text-xs text-muted-foreground">Levels</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[600px] border-2 border-dashed border-primary/20 rounded-xl">
                    <Network className="h-16 w-16 text-muted-foreground/50 mb-4" />
                    <p className="text-lg font-medium text-foreground mb-2">
                      No Concept Map Yet
                    </p>
                    <p className="text-sm text-muted-foreground max-w-md text-center">
                      Ask a question to see a visual breakdown of the topic
                    </p>
                    <Button
                      onClick={() => setActiveTab("chat")}
                      variant="outline"
                      className="mt-6"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Go to Chat
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend */}
        {activeTab === "mindmap" && conceptMap && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-2 p-6">
              <h3 className="text-sm font-semibold mb-4 text-foreground">
                🎨 Understanding the Map
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 border-2 border-white/30" />
                  <div>
                    <div className="text-sm font-medium">Main Topic</div>
                    <div className="text-xs text-muted-foreground">
                      What you asked about
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-red-500 border-2 border-white/30" />
                  <div>
                    <div className="text-sm font-medium">Related Concepts</div>
                    <div className="text-xs text-muted-foreground">
                      Subtopics to understand
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 border-2 border-white/30" />
                  <div>
                    <div className="text-sm font-medium">Prerequisites</div>
                    <div className="text-xs text-muted-foreground">
                      Foundation knowledge
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AskAI;