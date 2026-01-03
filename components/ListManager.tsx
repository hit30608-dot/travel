
import React, { useState } from 'react';
import { 
  CheckCircle2, Circle, Link as LinkIcon, Plus, 
  ShoppingBag, CheckSquare, StickyNote, Trash2, 
  ChevronDown, ChevronUp, MapPin, PlusCircle, ExternalLink,
  ChevronRight, X, Map as MapIcon
} from 'lucide-react';
import { ListType, TodoItem, NoteItem } from '../types';
import Modal from './Modal';

const ListManager: React.FC<{ type: 'SHOPPING' | 'TODO' }> = ({ type }) => {
  const [items, setItems] = useState<TodoItem[]>([
    { id: '1', date: '2024-11-14', content: '購買宇治抹茶', location: '祇園辻利', mapsUrl: 'https://maps.app.goo.gl/giion', isCompleted: false, type: ListType.SHOPPING },
    { id: '2', date: '2024-11-14', content: '更換日幣', isCompleted: true, type: ListType.TODO },
    { id: '3', date: '2024-11-15', content: '相機電池充電', isCompleted: false, type: ListType.TODO }
  ]);

  const [notes, setNotes] = useState<NoteItem[]>([
    { id: '1', content: '抵達機場後記得領取 JR Pass，參考連結：https://www.westjr.co.jp/', date: '2024-11-10' }
  ]);

  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({ '2024-11-14': true, '2024-11-15': true });
  
  // 新增項目的表單狀態
  const [contentInput, setContentInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [linkInput, setLinkInput] = useState('');
  
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, isCompleted: !item.isCompleted } : item));
  };

  const addItem = () => {
    if (!contentInput.trim()) return;
    const newItem: TodoItem = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      content: contentInput,
      location: locationInput || undefined,
      mapsUrl: linkInput || undefined,
      isCompleted: false,
      type: type as ListType
    };
    setItems([newItem, ...items]);
    
    // 重置輸入
    setContentInput('');
    setLocationInput('');
    setLinkInput('');
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const renderTextWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-xl font-black text-[10px] hover:bg-primary/20 transition-all">
            開啟連結 <ExternalLink size={10} />
          </a>
        );
      }
      return part;
    });
  };

  const grouped = items.filter(i => i.type === type).reduce((acc, i) => {
    if (!acc[i.date]) acc[i.date] = [];
    acc[i.date].push(i);
    return acc;
  }, {} as Record<string, TodoItem[]>);

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-primary font-serif">
          {type === 'SHOPPING' ? '購物清單' : '行前準備'}
        </h2>
        <div className="text-[10px] font-black text-secondary bg-secondary/5 px-4 py-1 rounded-full uppercase tracking-widest">
          {items.filter(i => i.type === type && i.isCompleted).length} / {items.filter(i => i.type === type).length} 已完成
        </div>
      </div>

      {/* 新增項目區塊 */}
      <div className="bg-white rounded-[2.5rem] p-6 shadow-soft border border-gray-100 space-y-4">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={contentInput}
            onChange={(e) => setContentInput(e.target.value)}
            placeholder={type === 'SHOPPING' ? "要做什麼/買什麼？" : "新增待辦項目..."}
            className="flex-1 bg-gray-50 rounded-2xl px-5 py-4 text-sm border-none focus:ring-2 focus:ring-primary/20 transition-all"
            onKeyPress={(e) => e.key === 'Enter' && type === 'TODO' && addItem()}
          />
          {type === 'TODO' && (
            <button onClick={addItem} className="bg-primary text-white p-4 rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-transform">
              <Plus size={24} />
            </button>
          )}
        </div>
        
        {type === 'SHOPPING' && (
          <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                  type="text" 
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="地點 (如：金閣寺店)"
                  className="w-full bg-gray-50 rounded-2xl pl-10 pr-4 py-3 text-xs border-none"
                />
              </div>
              <div className="relative">
                <LinkIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                  type="text" 
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder="Google 地圖網址"
                  className="w-full bg-gray-50 rounded-2xl pl-10 pr-4 py-3 text-xs border-none"
                />
              </div>
            </div>
            <button 
              onClick={addItem}
              className="w-full bg-primary text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={18} /> 加入清單
            </button>
          </div>
        )}
      </div>

      {/* 列表內容 */}
      <div className="space-y-4">
        {Object.entries(grouped).sort().reverse().map(([date, dayItems]) => (
          <div key={date} className="bg-white rounded-[2rem] overflow-hidden shadow-soft border border-gray-50">
            <button 
              onClick={() => setExpandedDates(p => ({...p, [date]: !p[date]}))}
              className="w-full flex justify-between items-center p-5 bg-gray-50/30"
            >
              <span className="font-black text-[10px] text-gray-400 uppercase tracking-widest">{date}</span>
              {expandedDates[date] ? <ChevronUp size={16} className="text-gray-300" /> : <ChevronDown size={16} className="text-gray-300" />}
            </button>
            {expandedDates[date] && (
              <div className="p-4 space-y-3">
                {dayItems.map(item => (
                  <div 
                    key={item.id} 
                    className={`relative flex items-start gap-4 p-5 rounded-[2rem] transition-all group ${item.isCompleted ? 'bg-gray-50 opacity-60' : 'bg-white shadow-sm border border-gray-100 hover:border-primary/20'}`}
                  >
                    <button 
                      onClick={() => toggleItem(item.id)}
                      className="mt-1"
                    >
                      {item.isCompleted ? <CheckCircle2 className="text-primary" /> : <Circle className="text-gray-200" />}
                    </button>
                    
                    <div className="flex-1">
                      <p className={`text-sm font-black transition-all ${item.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {item.content}
                      </p>
                      
                      {(item.location || item.mapsUrl) && (
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {item.location && (
                            <div className="flex items-center gap-1 text-[10px] text-primary font-bold bg-primary/5 px-3 py-1 rounded-full">
                              <MapPin size={10} /> {item.location}
                            </div>
                          )}
                          {item.mapsUrl && (
                            <a 
                              href={item.mapsUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="flex items-center gap-1 text-[10px] text-secondary font-bold bg-secondary/5 px-3 py-1 rounded-full hover:bg-secondary/10 transition-colors"
                            >
                              <MapIcon size={10} /> 查看地圖
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => { setItemToDelete(item.id); setIsDelModalOpen(true); }}
                      className="text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400 p-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 備忘錄區塊 (僅在 TODO 頁面顯示) */}
      {type === 'TODO' && (
        <section className="pt-6 space-y-4">
          <div className="flex items-center gap-2 text-primary font-black border-b border-primary/5 pb-2 ml-2">
            <StickyNote size={18} /> 個人備忘錄
          </div>
          <div className="space-y-4">
            {notes.map(note => (
              <div key={note.id} className="bg-white rounded-[2rem] p-6 shadow-soft relative group">
                <div className="text-[10px] font-black text-gray-300 mb-3">{note.date}</div>
                <div className="text-sm text-gray-700 leading-relaxed font-medium">
                  {renderTextWithLinks(note.content)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <Modal 
        isOpen={isDelModalOpen}
        onClose={() => setIsDelModalOpen(false)}
        onConfirm={() => { if(itemToDelete) deleteItem(itemToDelete); setItemToDelete(null); }}
        title="確認刪除"
        message="確定要從清單中移除這個項目嗎？"
        type="warning"
      />
    </div>
  );
};

export default ListManager;
