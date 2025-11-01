// src/services/gemini.js

const API_URL = "http://localhost:5000";

export async function askHint(question, hintStep) {
  try {
    const response = await fetch(`${API_URL}/api/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, hintStep }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Ask hint error:", error);
    throw new Error("Failed to connect to backend. Is the server running?");
  }
}

export async function verifyPeerAnswer(question, answer) {
  try {
    const response = await fetch(`${API_URL}/api/verify-answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, answer }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Verify answer error:", error);
    throw new Error("Failed to verify answer. Check your connection.");
  }
}

export async function analyzeTopics(questions) {
  try {
    console.log("📤 Sending", questions.length, "questions to backend");
    
    const response = await fetch(`${API_URL}/api/analyze-topics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questions }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("📥 Received response:", data);
    return data;
  } catch (error) {
    console.error("Analyze topics error:", error);
    throw new Error("Failed to analyze topics. Check backend connection.");
  }
}

// ... existing code ...

export async function analyzeFocusSession(sessionData, history) {
  try {
    console.log("📊 Analyzing focus session...");
    
    const response = await fetch(`${API_URL}/api/analyze-focus`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionData, history }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("📈 Focus analysis received:", data);
    return data;
  } catch (error) {
    console.error("Focus analysis error:", error);
    throw new Error("Failed to analyze focus session.");
  }
}