
import { GoogleGenAI } from "@google/genai";

// Fixed: Use recommended initialization pattern for GoogleGenAI
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export class GeminiService {
  async translate(text: string, targetLang: string = "Traditional Chinese"): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Translate the following text into ${targetLang}. Keep the original tone and context: "${text}"`,
        config: {
          temperature: 0.3,
        }
      });
      // Fixed: response.text is a property, not a method
      return response.text || "Translation failed.";
    } catch (error) {
      console.error("Translation error:", error);
      return "Error connecting to AI service.";
    }
  }
}

export const geminiService = new GeminiService();
