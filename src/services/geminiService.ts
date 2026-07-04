import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getMascotFeedback(context: string, isCorrect: boolean): Promise<string> {
  const prompt = `You are "SchlauEichi" (Smart Squirrel), a friendly and helpful mascot for a German primary school learning app. 
  A child just completed an exercise. 
  Context: ${context}
  Was the answer correct? ${isCorrect ? 'Yes' : 'No'}
  
  Write a short, encouraging message in German (max 2 sentences). 
  If correct, be very celebratory and proud. 
  If incorrect, be gentle, supportive, and maybe give a tiny hint or say "Probiere es gleich nochmal!".
  Use a childlike, playfully energetic squirrel-like tone. Use "du".`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text?.trim() || (isCorrect ? "Super gemacht! Das war richtig!" : "Nicht aufgeben! Versuch es noch einmal.");
  } catch (error) {
    console.error("Gemini Error:", error);
    return isCorrect ? "Toll gemacht! Weiter so!" : "Versuch es noch einmal, du schaffst das!";
  }
}
