const API_URL = 'http://localhost:5000/api';

export interface Concept {
  id: string;
  label: string;
  level: number; // 0 = main topic, 1 = subtopic, etc.
  description?: string;
}

export interface ConceptRelation {
  from: string;
  to: string;
  type: 'requires' | 'relates' | 'leads-to';
}

export interface ConceptMap {
  concepts: Concept[];
  relations: ConceptRelation[];
}

// Extract concepts from a question using Gemini
export const extractConcepts = async (question: string): Promise<ConceptMap> => {
  try {
    const response = await fetch(`${API_URL}/extract-concepts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      throw new Error('Failed to extract concepts');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error extracting concepts:', error);
    throw error;
  }
};