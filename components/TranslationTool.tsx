
import React, { useState, useEffect } from 'react';
import { Languages, Mic, Sparkles, Copy, Check, Trash2, History, RotateCcw, Volume2, ArrowRightLeft, Settings } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { TranslationRecord } from '../types';

const LANGUAGES = [
  { code: 'zh-TW', name: '繁體中文', voice: 'zh-TW' },
  { code: 'ja', name: '日文', voice: 'ja-JP' },
  { code: 'en', name: '英文', voice: 'en-US' },
  { code: 'ko', name: '韓文', voice: 'ko-KR' },
  { code: 'th', name: '泰文', voice: 'th-TH' },
];

const TranslationTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<TranslationRecord[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const [sourceLang, setSourceLang] = useState('zh-TW'); // Default source
  const [targetLang, setTargetLang] = useState('ja');    // Default target
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');

  const currentSource = LANGUAGES.find(l => l.code === sourceLang) || LANGUAGES[0];
  const currentTarget = LANGUAGES.find(l => l.code === targetLang) || LANGUAGES[1];

  useEffect(() => {
    // Check if API key is missing on mount
    if (!geminiService.isConfigured()) {
      // Only show if strictly necessary or maybe let user discover it via error?
      // Let's rely on error handling to show it, or check local storage
    }
  }, []);

  const handleTranslate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const translation = await geminiService.translate(input, currentSource.name, currentTarget.name);
      const newRecord: TranslationRecord = {
        id: Date.now().toString(),
        original: input,
        translated: translation,
        timestamp: Date.now()
      };
      setHistory([newRecord, ...history]);
      // setInput(''); // Keep input for corrections
    } catch (error: any) {
      if (error.message === 'API_KEY_MISSING' || error.message === 'INVALID_API_KEY') {
        setShowApiKeyInput(true);
        alert("請輸入有效的 Google Gemini API Key 以使用翻譯功能。");
      } else {
        alert("翻譯失敗，請稍後再試。");
      }
    } finally {
      setLoading(false);
    }
  };

  const saveApiKey = () => {
    if (!apiKeyInput.trim()) return;
    geminiService.initialize(apiKeyInput.trim());
    setShowApiKeyInput(false);
    alert("API Key 已儲存！請重新嘗試翻譯。");
  };

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("此瀏覽器不支持語音識別，請使用 Chrome 瀏覽器。");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = currentSource.voice; // Use selected source language voice
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
  };

  const speak = (text: string, langVoice: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langVoice;
    window.speechSynthesis.speak(utterance);
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  };

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-500">
      <div className="bg-white rounded-[2.5rem] p-6 shadow-soft border border-gray-100 relative">
        {/* Settings / API Key Button */}
        <button
          onClick={() => setShowApiKeyInput(!showApiKeyInput)}
          className="absolute top-6 right-6 text-gray-300 hover:text-primary transition-colors"
        >
          <Settings size={20} />
        </button>

        {showApiKeyInput && (
          <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-200 animate-in slide-in-from-top-2">
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">API Key 設定</label>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="貼上您的 Gemini API Key"
                className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary"
              />
              <button
                onClick={saveApiKey}
                className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20"
              >
                儲存
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-2">Key 會儲存在瀏覽器中。如果翻譯出現錯誤，請檢查 Key 是否正確。</p>
          </div>
        )}

        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary/10 p-4 rounded-3xl text-primary">
            <Languages size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-800 font-serif tracking-tight">多國語言翻譯</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">AI 智慧翻譯助手</p>
          </div>
        </div>

        {/* Language Selectors */}
        <div className="flex items-center justify-between gap-2 mb-6 bg-gray-50 p-2 rounded-[2rem] border border-gray-100">
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="flex-1 bg-transparent text-center font-bold text-gray-700 py-3 appearance-none focus:outline-none cursor-pointer hover:bg-white rounded-xl transition-all"
          >
            {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>

          <button
            onClick={swapLanguages}
            className="p-3 bg-white text-primary rounded-full shadow-md hover:scale-110 active:rotate-180 transition-all border border-gray-100"
          >
            <ArrowRightLeft size={18} />
          </button>

          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="flex-1 bg-transparent text-center font-bold text-secondary py-3 appearance-none focus:outline-none cursor-pointer hover:bg-white rounded-xl transition-all"
          >
            {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
        </div>

        <div className="relative mb-4">
          <textarea
            rows={5}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-gray-50 rounded-[2rem] p-6 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all border-none leading-relaxed resize-none"
            placeholder={`請輸入${currentSource.name}...`}
          />
          <button
            onClick={startVoiceInput}
            className={`absolute right-4 bottom-4 p-4 rounded-full shadow-2xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-primary hover:scale-110 active:scale-95'}`}
          >
            <Mic size={24} />
          </button>
        </div>

        <button
          disabled={loading || !input.trim()}
          onClick={handleTranslate}
          className={`w-full py-5 rounded-[2rem] font-black text-white shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 transition-all active:scale-95 ${loading ? 'bg-gray-300' : 'bg-primary'}`}
        >
          {loading ? (
            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <><Sparkles size={20} /> 開始翻譯</>
          )}
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-3">
          <h3 className="text-xs font-black text-gray-400 flex items-center gap-2 uppercase tracking-widest">
            <History size={16} /> 歷史紀錄
          </h3>
          <button onClick={() => setHistory([])} className="text-[10px] font-black text-gray-300 hover:text-red-400">清空紀錄</button>
        </div>

        <div className="space-y-4">
          {history.map(record => (
            <div key={record.id} className="bg-white rounded-[2rem] p-6 shadow-soft group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black text-gray-300">
                  {new Date(record.timestamp).toLocaleTimeString()}
                </span>
                <div className="flex gap-4">
                  <button onClick={() => speak(record.translated, currentTarget.voice)} className="text-gray-300 hover:text-secondary"><Volume2 size={16} /></button>
                  <button onClick={() => setHistory(history.filter(h => h.id !== record.id))} className="text-gray-200 hover:text-red-400">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] font-black text-gray-400 mb-1">原文 ({currentSource.name})</div>
                  <p className="text-sm text-gray-500 font-medium">{record.original}</p>
                </div>
                <div className="pt-4 border-t border-gray-50">
                  <div className="text-[10px] font-black text-secondary mb-1">翻譯結果 ({currentTarget.name})</div>
                  <div className="flex justify-between items-end gap-4">
                    <p className="text-lg font-black text-gray-800 leading-relaxed font-serif flex-1">{record.translated}</p>
                    <button
                      onClick={() => { navigator.clipboard.writeText(record.translated); setCopiedId(record.id); setTimeout(() => setCopiedId(null), 2000); }}
                      className={`p-3 rounded-2xl transition-all ${copiedId === record.id ? 'bg-green-50 text-green-500' : 'bg-gray-50 text-gray-400'}`}
                    >
                      {copiedId === record.id ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TranslationTool;
