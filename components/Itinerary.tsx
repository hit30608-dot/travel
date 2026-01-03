
import React, { useState, useMemo } from 'react';
import { 
  Clock, MapPin, Building, Plane, Trash2, PlusCircle, Edit3, 
  Calendar, X, Save, ChevronLeft, ChevronRight
} from 'lucide-react';
import { ItineraryItem, ItemType, FlightInfo, Accommodation, TripSettings } from '../types';
import Modal from './Modal';

interface ItineraryProps {
  tripSettings: TripSettings;
}

const Itinerary: React.FC<ItineraryProps> = ({ tripSettings }) => {
  const [items, setItems] = useState<ItineraryItem[]>([
    { id: '1', date: '2024-11-15', startTime: '09:00', type: ItemType.SIGHTSEEING, location: '渡月橋', note: '早上適合散步，風景極佳', mapsUrl: 'https://maps.app.goo.gl/arashiyama' },
    { id: '2', date: '2024-11-15', startTime: '12:00', type: ItemType.FOOD, location: '嵐山 蕎麥麵', note: '需提前排隊', mapsUrl: 'https://maps.app.goo.gl/soba' }
  ]);
  
  const [flights, setFlights] = useState<FlightInfo[]>([
    { id: 'f1', type: '去程', flightNo: 'JX802', time: '11/15 08:30', airport: 'TPE -> KIX' },
    { id: 'f2', type: '回程', flightNo: 'JX803', time: '11/20 15:50', airport: 'KIX -> TPE' }
  ]);

  const [accommodation, setAccommodation] = useState<Accommodation>({
    id: 'h1',
    name: '嵐山溫泉 辨慶',
    address: '京都市右京區嵯峨天龍寺芒之馬場町34',
    mapsUrl: 'https://maps.app.goo.gl/benkei'
  });

  // 當前選取的查看日期
  const [currentDate, setCurrentDate] = useState(tripSettings.startDate);

  // Modal 狀態
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [editType, setEditType] = useState<'NONE' | 'FLIGHT' | 'HOTEL' | 'ITEM_FORM'>('NONE');
  const [selectedFlightIdx, setSelectedFlightIdx] = useState<number>(0);
  const [isEditingItem, setIsEditingItem] = useState(false);

  // 表單暫存
  const [tempHotel, setTempHotel] = useState(accommodation);
  const [tempFlight, setTempFlight] = useState(flights[0]);
  const [itemForm, setItemForm] = useState<Partial<ItineraryItem>>({
    startTime: '10:00',
    type: ItemType.SIGHTSEEING,
    location: '',
    note: '',
    mapsUrl: '',
    date: currentDate
  });

  const filteredItems = useMemo(() => {
    return items
      .filter(i => i.date === currentDate)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [items, currentDate]);

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      setItems(items.filter(i => i.id !== itemToDelete));
      setItemToDelete(null);
    }
  };

  const handleEditItem = (item: ItineraryItem) => {
    setItemForm(item);
    setIsEditingItem(true);
    setEditType('ITEM_FORM');
  };

  const saveItemForm = () => {
    if (!itemForm.location) return;
    if (isEditingItem) {
      setItems(items.map(i => i.id === itemForm.id ? (itemForm as ItineraryItem) : i));
    } else {
      const newItem: ItineraryItem = {
        id: Date.now().toString(),
        date: currentDate,
        startTime: itemForm.startTime || '10:00',
        type: itemForm.type as ItemType,
        location: itemForm.location || '',
        note: itemForm.note || '',
        mapsUrl: itemForm.mapsUrl || ''
      };
      setItems([...items, newItem]);
    }
    setEditType('NONE');
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-700">
      {/* 航班與住宿摘要 */}
      <section className="grid grid-cols-2 gap-3">
        {flights.map((f, idx) => (
          <div 
            key={f.id} 
            onClick={() => { setEditType('FLIGHT'); setSelectedFlightIdx(idx); setTempFlight(f); }}
            className="bg-white rounded-3xl p-4 shadow-soft border border-gray-100 cursor-pointer hover:border-primary/30 transition-all relative group"
          >
            <Edit3 size={12} className="absolute top-3 right-3 text-gray-300 opacity-0 group-hover:opacity-100" />
            <div className="flex items-center gap-2 text-primary font-black text-[10px] mb-2 uppercase tracking-widest">
              <Plane size={12} /> {f.type}
            </div>
            <div className="font-serif font-black text-gray-800 text-sm">{f.flightNo}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">{f.airport}</div>
            <div className="text-[10px] font-bold text-secondary mt-1">{f.time}</div>
          </div>
        ))}
      </section>

      <section 
        onClick={() => { setEditType('HOTEL'); setTempHotel(accommodation); }}
        className="bg-primary text-white rounded-[2rem] p-6 shadow-xl relative overflow-hidden group cursor-pointer"
      >
        <Edit3 size={16} className="absolute top-4 right-4 text-white/40 opacity-0 group-hover:opacity-100" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest opacity-70">
            <Building size={12} /> 住宿飯店
          </div>
          <h3 className="text-xl font-black font-serif mb-1">{accommodation.name}</h3>
          <p className="text-[10px] opacity-80 mb-5 leading-relaxed truncate">{accommodation.address}</p>
          <button className="bg-white text-primary px-5 py-2.5 rounded-2xl text-[10px] font-black shadow-lg">編輯住宿資訊</button>
        </div>
        <Building size={120} className="absolute -right-8 -bottom-8 text-white opacity-5" />
      </section>

      {/* 日期切換器 */}
      <div className="flex items-center justify-between bg-white rounded-full p-2 shadow-soft border border-gray-50">
        <button className="p-2 text-gray-300 hover:text-primary transition-colors"><ChevronLeft size={20} /></button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">目前顯示</span>
          <span className="text-sm font-black text-primary font-serif">{currentDate}</span>
        </div>
        <button className="p-2 text-gray-300 hover:text-primary transition-colors"><ChevronRight size={20} /></button>
      </div>

      {/* 每日行程時間軸 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-black text-primary font-serif flex items-center gap-2">
            <Calendar size={20} /> 每日明細
          </h2>
          <button 
            onClick={() => { setIsEditingItem(false); setItemForm({ date: currentDate, type: ItemType.SIGHTSEEING }); setEditType('ITEM_FORM'); }}
            className="bg-secondary text-white p-3 rounded-2xl shadow-lg shadow-secondary/20 hover:scale-110 transition-all"
          >
            <PlusCircle size={24} />
          </button>
        </div>

        <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-0.5 before:bg-primary/10">
          {filteredItems.map((item) => (
            <div key={item.id} className="relative group">
              <div className="absolute -left-[23px] top-2 w-3 h-3 rounded-full bg-primary ring-4 ring-white z-10 shadow-sm"></div>
              
              <div className="glass-card rounded-[2.5rem] p-6 shadow-soft border-l-4 border-l-secondary hover:translate-x-1 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-primary bg-primary/5 px-3 py-1.5 rounded-full">{item.startTime}</span>
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{item.type}</span>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => handleEditItem(item)} className="text-gray-300 hover:text-primary transition-colors"><Edit3 size={16} /></button>
                    <button onClick={() => { setItemToDelete(item.id); setIsDelModalOpen(true); }} className="text-gray-300 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>

                <h4 className="font-black text-gray-800 text-lg mb-2 font-serif">{item.location}</h4>
                {item.note && <p className="text-xs text-gray-500 mb-5 leading-relaxed italic bg-gray-50 p-3 rounded-2xl border border-gray-100">{item.note}</p>}

                {item.mapsUrl && (
                  <a 
                    href={item.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[10px] font-black text-primary bg-white px-5 py-2.5 rounded-2xl border border-gray-100 hover:border-primary/30 shadow-sm transition-all"
                  >
                    <MapPin size={12} /> Google 地圖連結
                  </a>
                )}
              </div>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div className="text-center py-12 bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
              <p className="text-xs text-gray-300 font-bold uppercase tracking-widest">今日尚無安排行程</p>
            </div>
          )}
        </div>
      </div>

      {/* 行程編輯/新增彈窗 */}
      {editType === 'ITEM_FORM' && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-primary font-serif">{isEditingItem ? '編輯行程' : '新增行程'}</h3>
              <button onClick={() => setEditType('NONE')} className="text-gray-300"><X size={24} /></button>
            </div>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">抵達時間</label>
                  <input 
                    type="time" 
                    value={itemForm.startTime}
                    onChange={e => setItemForm({...itemForm, startTime: e.target.value})}
                    className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm border-none focus:ring-2 focus:ring-primary/20" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">類型標籤</label>
                  <select 
                    value={itemForm.type}
                    onChange={e => setItemForm({...itemForm, type: e.target.value as ItemType})}
                    className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm border-none focus:ring-2 focus:ring-primary/20"
                  >
                    {Object.values(ItemType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">地點名稱</label>
                <input 
                  type="text" 
                  placeholder="輸入景點或餐廳名稱..."
                  value={itemForm.location}
                  onChange={e => setItemForm({...itemForm, location: e.target.value})}
                  className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm border-none" 
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">詳細備註</label>
                <textarea 
                  rows={3}
                  placeholder="想吃什麼？注意什麼？..."
                  value={itemForm.note}
                  onChange={e => setItemForm({...itemForm, note: e.target.value})}
                  className="w-full bg-gray-50 rounded-2xl px-4 py-4 text-sm border-none leading-relaxed" 
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">地圖連結 (選填)</label>
                <input 
                  type="text" 
                  placeholder="https://..."
                  value={itemForm.mapsUrl}
                  onChange={e => setItemForm({...itemForm, mapsUrl: e.target.value})}
                  className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm border-none" 
                />
              </div>
            </div>
            <div className="flex gap-4 mt-10">
              <button onClick={() => setEditType('NONE')} className="flex-1 py-4 text-gray-400 font-bold bg-gray-50 rounded-2xl">取消</button>
              <button onClick={saveItemForm} className="flex-2 py-4 px-8 bg-secondary text-white font-black rounded-2xl shadow-xl shadow-secondary/20 active:scale-95 transition-all">
                {isEditingItem ? '更新行程' : '加入行程'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 航班編輯 Modal */}
      {editType === 'FLIGHT' && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black text-primary font-serif mb-6 flex items-center gap-2"><Plane size={20}/> 編輯航班</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="text" placeholder="航班號" value={tempFlight.flightNo}
                  onChange={e => setTempFlight({...tempFlight, flightNo: e.target.value})}
                  className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm border-none" 
                />
                <input 
                  type="text" placeholder="時間" value={tempFlight.time}
                  onChange={e => setTempFlight({...tempFlight, time: e.target.value})}
                  className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm border-none" 
                />
              </div>
              <input 
                type="text" placeholder="航線" value={tempFlight.airport}
                onChange={e => setTempFlight({...tempFlight, airport: e.target.value})}
                className="w-full bg-gray-50 rounded-2xl px-4 py-3 text-sm border-none" 
              />
            </div>
            <button 
              onClick={() => { const f = [...flights]; f[selectedFlightIdx] = tempFlight; setFlights(f); setEditType('NONE'); }}
              className="w-full mt-8 bg-primary text-white py-4 rounded-2xl font-black shadow-lg shadow-primary/20"
            >
              儲存更改
            </button>
          </div>
        </div>
      )}

      <Modal 
        isOpen={isDelModalOpen}
        onClose={() => setIsDelModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="確認刪除行程"
        message="您即將刪除此項安排，刪除後將無法還原，確定要繼續嗎？"
        type="danger"
      />
    </div>
  );
};

export default Itinerary;
