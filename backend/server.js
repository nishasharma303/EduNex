const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(bodyParser.json());
app.use(express.json());

// --- MongoDB Connection ---
console.log('🔌 Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edunex')
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// --- User Schema ---
const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  firstName: String,
  lastName: String,
  profileImage: String,
  points: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// --- Gemini Config ---
const GEMINI_API_URL = process.env.GEMINI_API_URL;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// --- Helper function to call Gemini API ---
async function callGemini(prompt) {
  try {
    console.log("📞 Calling Gemini API...");
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const candidates = response.data.candidates;
    if (
      candidates &&
      candidates.length > 0 &&
      candidates[0].content.parts.length > 0
    ) {
      console.log("✅ Gemini API response received");
      return candidates[0].content.parts[0].text;
    }
    console.log("⚠️ No content in Gemini response");
    return null;
  } catch (error) {
    console.error("❌ Gemini API Error:", error.response?.data || error.message);
    throw error;
  }
}

// --- MongoDB API Routes ---

// Create or get user
app.post('/api/users', async (req, res) => {
  try {
    console.log('📥 POST /api/users - Request received');
    const { clerkId, email, firstName, lastName, profileImage } = req.body;
    
    if (!clerkId) {
      return res.status(400).json({ error: 'clerkId is required' });
    }
    
    let user = await User.findOne({ clerkId });
    
    if (user) {
      console.log('✅ User already exists');
      return res.json(user);
    }
    
    user = new User({
      clerkId,
      email,
      firstName,
      lastName,
      profileImage,
      points: 0
    });
    
    await user.save();
    console.log('✅ New user created');
    
    res.json(user);
  } catch (error) {
    console.error('❌ Error creating/getting user:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Get user by Clerk ID
app.get('/api/users/:clerkId', async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.params.clerkId });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Debug endpoint
app.get('/api/users/debug/all', async (req, res) => {
  try {
    const users = await User.find({});
    res.json({
      totalUsers: users.length,
      users: users
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Gemini API Routes ---

// API Route: Ask Hints (2 hints then complete answer)
app.post("/api/ask", async (req, res) => {
  console.log("📝 /api/ask called");
  const { question, hintStep } = req.body;
  const step = hintStep || 0;
  
  let prompt;
  
  if (step === 0) {
    // First hint
    prompt = `You are a helpful AI tutor. A student asked: "${question}"

Provide ONLY the FIRST HINT to guide them toward understanding this concept.
- Don't give the complete answer
- Focus on one key aspect or starting point
- Keep it short and encouraging (2-3 sentences max)
- Help them think about the concept

Example: "Think about how parent and child classes relate in programming. What properties or methods might they share?"`;

  } else if (step === 1) {
    // Second hint
    prompt = `You are a helpful AI tutor. A student asked: "${question}"

They already got the first hint. Now provide the SECOND HINT that goes deeper.
- Give more specific guidance but DON'T reveal the full answer yet
- Build on the first hint
- Keep it short (2-3 sentences)
- Guide them closer to the answer

Example: "Consider the relationship between a general 'Vehicle' class and a specific 'Car' class. The Car inherits properties from Vehicle."`;

  } else {
    // Complete answer (step 2+)
    prompt = `You are a helpful AI tutor. A student asked: "${question}"

They've received 2 hints. Now provide a COMPLETE, CLEAR EXPLANATION.

Structure your answer:
1. **Definition**: Clear explanation of the concept
2. **Key Points**: 3-4 important aspects
3. **Example**: Simple, practical example
4. **Summary**: Brief takeaway

Be thorough, clear, and educational. Use simple language.`;
  }

  try {
    const hint = await callGemini(prompt);
    res.json({
      hint: hint || "No hint available.",
      nextHintStep: step + 1,
      isComplete: step >= 2
    });
  } catch (error) {
    res.status(500).json({
      hint: "Failed to fetch hint, please try again.",
      nextHintStep: step
    });
  }
});

// API Route: Extract Concepts for Mind Map
app.post("/api/extract-concepts", async (req, res) => {
  console.log("🧠 /api/extract-concepts called");
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        error: "Question is required",
        concepts: [],
        relations: []
      });
    }

    const prompt = `You are an educational AI that creates concept maps for learning.

Student's Question: "${question}"

Your task: Create a concept map that explains this topic and related concepts.

Return ONLY valid JSON (no markdown, no code blocks):
{
  "concepts": [
    {
      "id": "main-concept",
      "label": "Main Topic",
      "level": 0,
      "description": "Central concept being asked about"
    },
    {
      "id": "sub-concept-1",
      "label": "Subtopic 1",
      "level": 1,
      "description": "Related concept"
    },
    {
      "id": "sub-concept-2",
      "label": "Subtopic 2",
      "level": 1,
      "description": "Another related concept"
    },
    {
      "id": "foundation-1",
      "label": "Prerequisite",
      "level": 2,
      "description": "Foundation concept needed"
    }
  ],
  "relations": [
    { "from": "main-concept", "to": "sub-concept-1", "type": "relates" },
    { "from": "main-concept", "to": "sub-concept-2", "type": "relates" },
    { "from": "sub-concept-1", "to": "foundation-1", "type": "requires" }
  ]
}

EXAMPLE - If question is "What is inheritance?":
{
  "concepts": [
    {
      "id": "inheritance",
      "label": "Inheritance",
      "level": 0,
      "description": "Mechanism to create new classes from existing ones"
    },
    {
      "id": "parent-class",
      "label": "Parent Class",
      "level": 1,
      "description": "Base class that is inherited from"
    },
    {
      "id": "child-class",
      "label": "Child Class",
      "level": 1,
      "description": "Derived class that inherits properties"
    },
    {
      "id": "code-reuse",
      "label": "Code Reusability",
      "level": 1,
      "description": "Benefit of using inheritance"
    },
    {
      "id": "oop",
      "label": "OOP Concepts",
      "level": 2,
      "description": "Object-oriented programming fundamentals"
    },
    {
      "id": "classes",
      "label": "Classes & Objects",
      "level": 2,
      "description": "Building blocks of OOP"
    }
  ],
  "relations": [
    { "from": "inheritance", "to": "parent-class", "type": "relates" },
    { "from": "inheritance", "to": "child-class", "type": "relates" },
    { "from": "inheritance", "to": "code-reuse", "type": "relates" },
    { "from": "parent-class", "to": "oop", "type": "requires" },
    { "from": "child-class", "to": "classes", "type": "requires" }
  ]
}

RULES:
- Create 5-8 concepts
- Level 0 = main topic being asked about
- Level 1 = subtopics and related concepts (3-5 concepts)
- Level 2 = prerequisites and foundations (2-3 concepts)
- Use kebab-case for IDs
- Keep labels SHORT (2-4 words max)
- Use "relates" for related concepts, "requires" for prerequisites
- Focus on explaining the CONCEPT, not solving a problem`;

    console.log("🤖 Calling Gemini for concept extraction...");
    const responseText = await callGemini(prompt);

    if (!responseText) {
      return res.json({
        concepts: [],
        relations: []
      });
    }

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      try {
        const conceptMap = JSON.parse(jsonMatch[0]);
        console.log("✅ Concepts extracted:", conceptMap.concepts?.length || 0);
        res.json(conceptMap);
      } catch (parseError) {
        console.error("❌ JSON Parse Error:", parseError);
        res.json({ concepts: [], relations: [] });
      }
    } else {
      console.log("⚠️ No JSON found in response");
      res.json({ concepts: [], relations: [] });
    }
  } catch (error) {
    console.error("❌ Concept extraction error:", error);
    res.status(500).json({ concepts: [], relations: [] });
  }
});

// API Route: Verify Peer Answer
app.post("/api/verify-answer", async (req, res) => {
  console.log("🔍 /api/verify-answer called");
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        verified: false,
        message: "Question and answer are required.",
        score: 0,
        issues: ["Missing question or answer"],
        suggestions: ["Please provide both question and answer"],
        missingPoints: [],
      });
    }

    const prompt = `You are an educational AI assistant verifying student answers.

Question: ${question}

Student's Answer: ${answer}

Evaluate and respond ONLY with valid JSON:
{
  "verified": true,
  "message": "Overall feedback",
  "score": 85,
  "issues": ["issue 1"],
  "suggestions": ["suggestion 1"],
  "missingPoints": ["missing point 1"]
}

Criteria (100 points total):
- Accuracy (25 points): Factually correct?
- Completeness (25 points): Fully answers question?
- Clarity (25 points): Well-explained?
- Educational Value (25 points): Helps learning?

Minimum score to verify: 70/100`;

    const responseText = await callGemini(prompt);

    if (!responseText) {
      return res.status(500).json({
        verified: false,
        message: "No response from AI.",
        score: 0,
        issues: [],
        suggestions: [],
        missingPoints: [],
      });
    }

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      try {
        const aiResponse = JSON.parse(jsonMatch[0]);
        res.json({
          verified: aiResponse.verified || false,
          message: aiResponse.message || "Answer processed.",
          score: aiResponse.score || 0,
          issues: Array.isArray(aiResponse.issues) ? aiResponse.issues : [],
          suggestions: Array.isArray(aiResponse.suggestions) ? aiResponse.suggestions : [],
          missingPoints: Array.isArray(aiResponse.missingPoints) ? aiResponse.missingPoints : [],
        });
      } catch (parseError) {
        console.error("❌ JSON Parse Error:", parseError);
        return res.status(500).json({
          verified: false,
          message: "Could not parse response.",
          score: 0,
          issues: [],
          suggestions: [],
          missingPoints: [],
        });
      }
    } else {
      return res.status(500).json({
        verified: false,
        message: "Invalid response format.",
        score: 0,
        issues: [],
        suggestions: [],
        missingPoints: [],
      });
    }
  } catch (error) {
    console.error("❌ Verification error:", error);
    res.status(500).json({
      verified: false,
      message: "Error during verification.",
      score: 0,
      issues: [],
      suggestions: [],
      missingPoints: [],
    });
  }
});

// API Route: Analyze Topics
app.post("/api/analyze-topics", async (req, res) => {
  console.log("📊 /api/analyze-topics called");
  try {
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.json({ topics: [] });
    }

    const questionsText = questions
      .map((q, idx) => `${idx + 1}. ${q.question}`)
      .join("\n");

    const prompt = `Analyze these student questions and group by topic:

${questionsText}

Return JSON with topics that have 4+ questions.`;

    const responseText = await callGemini(prompt);

    if (!responseText) {
      return res.json({ topics: [] });
    }

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      try {
        const aiResponse = JSON.parse(jsonMatch[0]);
        res.json(aiResponse);
      } catch (parseError) {
        res.json({ topics: [] });
      }
    } else {
      res.json({ topics: [] });
    }
  } catch (error) {
    res.status(500).json({ topics: [] });
  }
});

// API Route: Analyze Focus
app.post("/api/analyze-focus", async (req, res) => {
  console.log("🎯 /api/analyze-focus called");
  try {
    const { sessionData, history } = req.body;

    if (!sessionData) {
      return res.status(400).json({
        success: false,
        message: "Session data required",
      });
    }

    const totalTime = sessionData.duration;
    const distractions = sessionData.distractions || 0;
    const completed = sessionData.completed;

    let score = 100;
    score -= distractions * 5;
    score -= sessionData.timeAway * 0.1;
    if (!completed) score -= 20;
    score = Math.max(0, Math.min(100, Math.round(score)));

    const historyText = history && history.length > 0
      ? history.map((s, i) => `Session ${i + 1}: ${s.score}`).join(", ")
      : "No previous sessions";

    const prompt = `Analyze this focus session (${Math.round(totalTime / 60)}min, ${distractions} distractions, score: ${score}/100).

Previous: ${historyText}

Return JSON with: score, grade, strengths[], weaknesses[], tips[], pattern, encouragement`;

    const responseText = await callGemini(prompt);

    if (!responseText) {
      return res.json({
        success: false,
        score: score,
      });
    }

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      try {
        const aiResponse = JSON.parse(jsonMatch[0]);
        res.json({
          success: true,
          ...aiResponse,
          rawScore: score,
        });
      } catch (parseError) {
        res.json({
          success: false,
          score: score,
        });
      }
    } else {
      res.json({
        success: false,
        score: score,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
    });
  }
});

// --- Health Check ---
app.get("/", (req, res) => {
  res.json({
    status: "✅ Server is running",
    mongodb: mongoose.connection.readyState === 1 ? "✅ Connected" : "❌ Disconnected",
    endpoints: [
      "POST /api/users",
      "GET /api/users/:clerkId",
      "POST /api/ask (2 hints → answer)",
      "POST /api/extract-concepts (concept map)",
      "POST /api/verify-answer",
      "POST /api/analyze-topics",
      "POST /api/analyze-focus",
    ],
  });
});

// --- Test Endpoint ---
app.get("/test", async (req, res) => {
  try {
    const testPrompt = "Say 'Hello from Gemini!'";
    const result = await callGemini(testPrompt);
    res.json({ success: true, response: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log("🚀 =======================================");
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log("📡 Endpoints:");
  console.log("   - POST /api/ask (2 hints → full answer)");
  console.log("   - POST /api/extract-concepts (concept map)");
  console.log("   - POST /api/verify-answer");
  console.log("🚀 =======================================");
});