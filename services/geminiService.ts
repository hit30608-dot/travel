
import { GoogleGenAI } from "@google/genai";

// Fixed: Check for API Key before initialization
const getApiKey = () => {
  // Priority: 1. Environment Variable (Vite replaces check) 2. LocalStorage
  // Note: Vite replaces process.env.GEMINI_API_KEY with the actual string, so we can access it directly.
  try {
    if (process.env.API_KEY || process.env.GEMINI_API_KEY) {
      return process.env.API_KEY || process.env.GEMINI_API_KEY;
    }
  } catch (e) {
    // Ignore error if process is not defined and replacement didn't happen (unlikely in Vite)
  }

  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('gemini_api_key');
  }
  return null;
};

export class GeminiService {
  private ai: GoogleGenAI | null = null;
  private apiKey: string | null = null;

  constructor() {
    this.initialize();
  }

  initialize(key?: string) {
    const foundKey = key || getApiKey();
    if (foundKey) {
      this.apiKey = foundKey;
      try {
        this.ai = new GoogleGenAI({ apiKey: foundKey });
        if (key && typeof localStorage !== 'undefined') {
          localStorage.setItem('gemini_api_key', key);
        }
      } catch (error) {
        console.error("Failed to initialize GoogleGenAI:", error);
      }
    }
  }

  isConfigured(): boolean {
    return !!this.ai;
  }

  async translate(text: string, sourceLang: string, targetLang: string): Promise<string> {
    if (!this.ai) {
      // Try re-initializing just in case it was set late
      this.initialize();
      if (!this.ai) {
        console.warn("Gemini AI not initialized (Missing API Key)");
        throw new Error("API_KEY_MISSING");
      }
    }

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: `Translate the following text from ${sourceLang} to ${targetLang}. Keep the original tone and context. Only return the translated text, no explanations. Text: "${text}"`,
        config: {
          temperature: 0.3,
        }
      });
      return response.text || "Translation failed.";
    } catch (error: any) {
      console.error("Translation error details:", error);

      const errorMessage = error.message || error.toString();
      const isApiKeyError =
        errorMessage.match(/api key/i) ||
        error.status === 400 ||
        error.statusText === 'Bad Request' ||
        (error.response && error.response.status === 400);

      if (isApiKeyError) {
        throw new Error("INVALID_API_KEY");
      }
      return "Error connecting to AI service.";
    }
  }
} // Ensuring class closes correctly with correct indentation

export const geminiService = new GeminiService();
