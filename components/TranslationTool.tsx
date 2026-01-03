
import React, { useState } from 'react';
import { Languages, Mic, Sparkles, Copy, Check, Trash2, History, RotateCcw, Volume2 } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { TranslationRecord } from '../types';

const TranslationTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<TranslationRecord[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const handleTranslate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const translation = await geminiService.translate(input);
    const newRecord: TranslationRecord = {
      id: Date.now().toString(),
      original: input,
      translated: translation,
      timestamp: Date.now()
    };
    setHistory([newRecord, ...history]);
    setInput(''); // 自動清空
    setLoading(false);
  };

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("此瀏覽器不支持語音識別，請使用 Chrome 瀏覽器。");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'ja-JP';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-500">
      <div className="bg-white rounded-[2.5rem] p-6 shadow-soft border border-gray-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary/10 p-4 rounded-3xl text-primary">
            <Languages size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-800 font-serif tracking-tight">京都即時翻譯</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">AI 智慧翻譯助手</p>
          </div>
        </div>

        <div className="relative mb-4">
          <textarea 
            rows={5}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-gray-50 rounded-[2rem] p-6 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all border-none leading-relaxed"
            placeholder="請輸入文字或使用語音輸入..."
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
                  <button onClick={() => speak(record.translated)} className="text-gray-300 hover:text-secondary"><Volume2 size={16} /></button>
                  <button onClick={() => setHistory(history.filter(h => h.id !== record.id))} className="text-gray-200 hover:text-red-400">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] font-black text-gray-400 mb-1">原文</div>
                  <p className="text-sm text-gray-500 font-medium">{record.original}</p>
                </div>
                <div className="pt-4 border-t border-gray-50">
                  <div className="text-[10px] font-black text-secondary mb-1">翻譯結果</div>
                  <div className="flex justify-between items-end gap-4">
                    <p className="text-lg font-black text-gray-800 leading-relaxed font-serif flex-1">{record.translated}</p>
                    <button 
                      onClick={() => { navigator.clipboard.writeText(record.translated); setCopiedId(record.id); setTimeout(()=>setCopiedId(null), 2000); }}
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
