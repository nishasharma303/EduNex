const GEMINI_API_KEY = 'AIzaSyA-PJusKiLgSgRo8pYOOCVfBs3mwrX23pc';

export const askGeminiAI = async (question, hintStep = 0) => {
  const prompt = `Provide hint number ${hintStep + 1} for the question: "${question}". Keep it concise and helpful. Guide the student to think critically rather than giving direct answers.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      }
    );

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    const candidates = data.candidates;
    let hint = 'No hint available at the moment.';
    
    if (candidates && candidates.length > 0 && candidates[0].content && candidates[0].content.parts.length > 0) {
      hint = candidates[0].content.parts[0].text;
    }
    
    return { 
      hint, 
      nextHintStep: hintStep + 1,
      isFinalHint: hintStep >= 2 // You can adjust this logic
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return { 
      hint: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.', 
      nextHintStep: hintStep,
      isFinalHint: false
    };
  }
};