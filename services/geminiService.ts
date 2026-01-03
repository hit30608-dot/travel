
import { GoogleGenAI } from "@google/genai";

// Fixed: Check for API Key before initialization
const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
  }
} else {
  console.warn("GoogleGenAI API Key is missing. Translations will not work. Please set GEMINI_API_KEY in .env");
}

export class GeminiService {
  async translate(text: string, targetLang: string = "Traditional Chinese"): Promise<string> {
    if (!ai) {
      console.warn("Gemini AI not initialized (Missing API Key)");
      return "AI Unavailable (Check API Key)";
    }
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash', // Updated to stable model if available, or keep preview
        contents: `Translate the following text into ${targetLang}. Keep the original tone and context: "${text}"`,
        config: {
          temperature: 0.3,
        }
      });
      return response.text || "Translation failed.";
    } catch (error) {
      console.error("Translation error:", error);
      return "Error connecting to AI service.";
    }
  }
}

export const geminiService = new GeminiService();
