
import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, ChevronDown, ChevronUp, Plus, Trash2, 
  ArrowRight, X, UserPlus, Users
} from 'lucide-react';
import { Expense, Currency, TripSettings } from '../types';
import { calculateMinCashFlow } from '../services/expenseLogic';

interface ExpenseProps {
  tripSettings: TripSettings;
}

const ExpenseManager: React.FC<ExpenseProps> = ({ tripSettings }) => {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', payer: '小明', amount: 3000, currency: Currency.JPY, description: '嵐山晚餐', date: '2024-11-15', isShared: true, participants: tripSettings.members },
    { id: '2', payer: '小美', amount: 500, currency: Currency.TWD, description: '機場接送', date: '2024-11-15', isShared: true, participants: tripSettings.members }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({ '2024-11-15': true });

  const [newExp, setNewExp] = useState({
    description: '',
    amount: '',
    payer: tripSettings.members[0] || '無成員',
    currency: Currency.JPY,
    date: new Date().toISOString().split('T')[0]
  });

  const settlements = useMemo(() => {
    return calculateMinCashFlow(expenses);
  }, [expenses]);

  const grouped = expenses.reduce((acc, e) => {
    if (!acc[e.date]) acc[e.date] = [];
    acc[e.date].push(e);
    return acc;
  }, {} as Record<string, Expense[]>);

  const addExpense = () => {
    if (!newExp.description || !newExp.amount) return;
    const exp: Expense = {
      id: Date.now().toString(),
      payer: newExp.payer,
      amount: parseFloat(newExp.amount),
      currency: newExp.currency,
      description: newExp.description,
      date: newExp.date,
      isShared: true,
      participants: tripSettings.members
    };
    setExpenses([exp, ...expenses]);
    setIsAddModalOpen(false);
    setNewExp({ ...newExp, description: '', amount: '' });
  };

  return (
    <div className="space-y-6 pb-24">
      {/* 總結卡片 */}
      <div className="bg-white rounded-[2.5rem] p-7 shadow-soft border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-black text-primary flex items-center gap-2">
            <TrendingUp size={16} /> 帳務摘要
          </h3>
          <div className="flex -space-x-2">
            {tripSettings.members.map(m => (
              <div key={m} className="w-7 h-7 rounded-full bg-primary border-2 border-white text-white text-[8px] flex items-center justify-center font-black shadow-sm">
                {m[0]}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary/5 p-4 rounded-3xl border border-primary/10">
            <div className="text-[10px] font-black text-primary mb-1 uppercase opacity-50">台幣總支出</div>
            <div className="text-xl font-black text-primary font-serif">
              ${expenses.filter(e => e.currency === Currency.TWD).reduce((s, e) => s + e.amount, 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-secondary/5 p-4 rounded-3xl border border-secondary/10">
            <div className="text-[10px] font-black text-secondary mb-1 uppercase opacity-50">日幣總支出</div>
            <div className="text-xl font-black text-secondary font-serif">
              ¥{expenses.filter(e => e.currency === Currency.JPY).reduce((s, e) => s + e.amount, 0).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest border-b border-gray-50 pb-2">結算建議方案</div>
          {settlements.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs bg-gray-50 p-4 rounded-2xl animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-3 font-black text-gray-700">
                <span className="text-primary">{s.from}</span>
                <ArrowRight size={12} className="text-gray-300" />
                <span className="text-gray-800">{s.to}</span>
              </div>
              <span className={`font-black ${s.currency === Currency.JPY ? 'text-secondary' : 'text-primary'}`}>
                {s.currency === Currency.JPY ? '¥' : '$'}{s.amount.toLocaleString()}
              </span>
            </div>
          ))}
          {settlements.length === 0 && <p className="text-center py-4 text-xs text-gray-300 italic">目前收支平衡</p>}
        </div>
      </div>

      {/* 明細清單 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-lg font-black text-primary font-serif">支出明細</h2>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-secondary text-white px-6 py-3 rounded-2xl text-xs font-black shadow-lg shadow-secondary/20 flex items-center gap-2 active:scale-95 transition-all"
          >
            <Plus size={16} /> 新增記錄
          </button>
        </div>

        {Object.entries(grouped).sort().reverse().map(([date, items]) => (
          <div key={date} className="bg-white rounded-[2rem] overflow-hidden shadow-soft border border-gray-100">
            <button 
              onClick={() => setExpandedDates(p => ({...p, [date]: !p[date]}))}
              className="w-full flex justify-between items-center p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="font-black text-gray-800 font-serif">{date}</span>
                <span className="bg-primary/5 text-primary text-[10px] px-3 py-1 rounded-full font-black">{items.length} 筆</span>
              </div>
              {expandedDates[date] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expandedDates[date] && (
              <div className="px-6 pb-6 space-y-3">
                {items.map(item => (
                  <div key={item.id} className="bg-gray-50/50 p-5 rounded-[2rem] flex justify-between items-center group transition-all">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary font-black text-xs uppercase">
                        {item.payer[0]}
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-gray-800">{item.description}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-gray-400">平均分攤</span>
                          <span className="w-1 h-1 rounded-full bg-gray-200" />
                          <span className="text-[10px] font-bold text-primary">{item.payer} 代墊</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-black ${item.currency === Currency.JPY ? 'text-secondary' : 'text-primary'}`}>
                        {item.currency === Currency.JPY ? '¥' : '$'}{item.amount.toLocaleString()}
                      </div>
                      <button onClick={() => setExpenses(expenses.filter(e => e.id !== item.id))} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-400 mt-1">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 新增支出彈窗 */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-primary font-serif">新增旅遊支出</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-300 hover:text-gray-500"><X size={24} /></button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block ml-1">項目名稱</label>
                <input 
                  type="text" placeholder="例如：超商零食"
                  value={newExp.description} onChange={e => setNewExp({...newExp, description: e.target.value})}
                  className="w-full bg-gray-50 rounded-2xl px-5 py-4 border-none text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block ml-1">金額</label>
                  <input 
                    type="number" value={newExp.amount}
                    onChange={e => setNewExp({...newExp, amount: e.target.value})}
                    className="w-full bg-gray-50 rounded-2xl px-5 py-4 border-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block ml-1">幣別</label>
                  <select 
                    value={newExp.currency} onChange={e => setNewExp({...newExp, currency: e.target.value as Currency})}
                    className="w-full bg-gray-50 rounded-2xl px-5 py-4 border-none text-sm"
                  >
                    <option value={Currency.JPY}>JPY (¥)</option>
                    <option value={Currency.TWD}>TWD ($)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block ml-1">付款人</label>
                <div className="flex flex-wrap gap-2">
                  {tripSettings.members.map(m => (
                    <button 
                      key={m} onClick={() => setNewExp({...newExp, payer: m})}
                      className={`px-5 py-3 rounded-xl text-xs font-black transition-all ${newExp.payer === m ? 'bg-primary text-white' : 'bg-gray-50 text-gray-400'}`}
                    >
                      {m}
                    </button>
                  ))}
                  {tripSettings.members.length === 0 && <p className="text-[10px] text-red-400 italic">請先在設定中新增成員</p>}
                </div>
              </div>
            </div>
            <button 
              onClick={addExpense}
              className="w-full mt-10 bg-primary text-white py-5 rounded-[1.5rem] font-black shadow-xl shadow-primary/20 active:scale-95 transition-all"
            >
              送出記錄
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseManager;
