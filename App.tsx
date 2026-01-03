
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Calendar, Wallet, ShoppingBag, CheckSquare, 
  Languages, Plus, Menu, Settings as SettingsIcon, X, UserPlus, Trash2
} from 'lucide-react';
import { TripSettings } from './types';
import Itinerary from './components/Itinerary';
import ExpenseManager from './components/ExpenseManager';
import ListManager from './components/ListManager';
import TranslationTool from './components/TranslationTool';

const Navigation = () => {
  const location = useLocation();
  const navItems = [
    { path: '/', icon: Calendar, label: '行程' },
    { path: '/expenses', icon: Wallet, label: '記帳' },
    { path: '/shopping', icon: ShoppingBag, label: '購物' },
    { path: '/todo', icon: CheckSquare, label: '待辦' },
    { path: '/translate', icon: Languages, label: '翻譯' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-gray-100 px-4 pt-3 pb-8 z-50 flex justify-around items-center rounded-t-[2.5rem] shadow-2xl">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`flex flex-col items-center px-4 py-2 rounded-2xl transition-all duration-300 ${
              isActive ? 'text-primary bg-primary/5 scale-110' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] mt-1 font-black tracking-wider">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

const App: React.FC = () => {
  // 全域旅程設定
  const [tripSettings, setTripSettings] = useState<TripSettings>({
    startDate: '2024-11-15',
    endDate: '2024-11-20',
    members: ['小明', '小美', '大壯']
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newMember, setNewMember] = useState('');

  const addMember = () => {
    if (newMember && !tripSettings.members.includes(newMember)) {
      setTripSettings({ ...tripSettings, members: [...tripSettings.members, newMember] });
      setNewMember('');
    }
  };

  const removeMember = (name: string) => {
    setTripSettings({ ...tripSettings, members: tripSettings.members.filter(m => m !== name) });
  };

  return (
    <Router>
      <div className="min-h-screen pb-24 max-w-md mx-auto shadow-2xl bg-[#F4F1EA] relative overflow-x-hidden border-x border-gray-100">
        {/* Header */}
        <header className="pt-10 pb-6 px-8 bg-white/40 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-primary tracking-tighter font-serif">KyotoTrip</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">嵐山旅遊助手</p>
            </div>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-10 h-10 rounded-2xl bg-white shadow-soft flex items-center justify-center text-gray-400 hover:text-primary transition-colors"
          >
            <SettingsIcon size={20} />
          </button>
        </header>

        {/* Content */}
        <main className="px-6 pt-8">
          <Routes>
            <Route path="/" element={<Itinerary tripSettings={tripSettings} />} />
            <Route path="/expenses" element={<ExpenseManager tripSettings={tripSettings} />} />
            <Route path="/shopping" element={<ListManager type="SHOPPING" />} />
            <Route path="/todo" element={<ListManager type="TODO" />} />
            <Route path="/translate" element={<TranslationTool />} />
          </Routes>
        </main>

        <Navigation />

        {/* 設定彈窗 */}
        {isSettingsOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-primary font-serif">旅程總設定</h3>
                <button onClick={() => setIsSettingsOpen(false)} className="text-gray-300 hover:text-gray-500"><X size={24} /></button>
              </div>

              <div className="space-y-6">
                {/* 日期設定 */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">旅遊期間</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 mb-1 block">開始日期</label>
                      <input 
                        type="date" 
                        value={tripSettings.startDate}
                        onChange={e => setTripSettings({...tripSettings, startDate: e.target.value})}
                        className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm border-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 mb-1 block">結束日期</label>
                      <input 
                        type="date" 
                        value={tripSettings.endDate}
                        onChange={e => setTripSettings({...tripSettings, endDate: e.target.value})}
                        className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm border-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>

                {/* 旅伴設定 */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">旅伴名單</h4>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="新增成員姓名..."
                      value={newMember}
                      onChange={e => setNewMember(e.target.value)}
                      className="flex-1 bg-gray-50 rounded-2xl px-4 py-3 text-sm border-none"
                    />
                    <button onClick={addMember} className="bg-primary text-white p-3 rounded-2xl"><UserPlus size={20} /></button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {tripSettings.members.map(name => (
                      <div key={name} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 group">
                        {name}
                        <button onClick={() => removeMember(name)} className="text-gray-300 hover:text-red-500"><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="w-full mt-10 bg-primary text-white py-5 rounded-[1.5rem] font-black shadow-xl shadow-primary/20 active:scale-95 transition-all"
              >
                儲存並關閉
              </button>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
