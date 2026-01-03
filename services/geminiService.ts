/**
 * Service for handling translations using the free Google Translate API (GTX)
 * Replaces the previous Gemini AI implementation.
 */
export class GeminiService {
  // Keeping the class name as GeminiService to minimize refactoring in components,
  // even though it now uses Google Translate API.

  constructor() {
    // No initialization needed for this public API
  }

  isConfigured(): boolean {
    return true; // Always configured as it doesn't need a key
  }

  /**
   * Translates text using the Google Translate `gtx` endpoint.
   * @param text The text to translate
   * @param sourceLang The source language code (e.g., 'zh-TW', 'en', or 'auto')
   * @param targetLang The target language code (e.g., 'ja', 'en')
   */
  async translate(text: string, sourceLang: string, targetLang: string): Promise<string> {
    try {
      // Map display names or codes if necessary. 
      // Assuming the UI passes standard codes like 'zh-TW', 'ja', 'en'.
      // If the UI passes full names, we might need a mapper, but TranslationTool currently uses codes for state 
      // and passes names to the old service. 

      // WAIT: TranslationTool.tsx passes NAMES ("繁體中文") to the service currently!
      // I need to check TranslationTool.tsx. Use view_file to be sure what is passed.
      // Based on previous reads: 
      // const translation = await geminiService.translate(input, currentSource.name, currentTarget.name);
      // currentSource.name is "繁體中文", .code is "zh-TW".

      // I should update TranslationTool.tsx to pass CODES, OR map them here.
      // Updating TranslationTool.tsx is cleaner. 

      // For now, I'll write this service to expect CODES. 
      // I will update TranslationTool.tsx in the next step to pass codes.

      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // The result structure is [[["Translated Text", "Source Text", ...], ...], ...]
      // We join the parts because long text is split into multiple chunks
      if (data && data[0]) {
        return data[0].map((chunk: any) => chunk[0]).join('');
      } else {
        return "Translation failed (No data).";
      }

    } catch (error: any) {
      console.error("Translation error:", error);
      return `Translation Error: ${error.message}`;
    }
  }
}

export const geminiService = new GeminiService();
