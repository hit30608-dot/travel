
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'warning' | 'danger' | 'info';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, title, message, type = 'warning' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className={`p-6 flex flex-col items-center text-center ${type === 'danger' ? 'bg-red-50' : 'bg-amber-50'}`}>
          <div className={`p-3 rounded-full mb-4 ${type === 'danger' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-xl font-black text-gray-800 mb-2 font-serif">{title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
        </div>
        <div className="p-4 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-2xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            取消
          </button>
          <button 
            onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 py-3 px-4 rounded-2xl font-bold text-white shadow-lg transition-transform active:scale-95 ${type === 'danger' ? 'bg-red-500 shadow-red-200' : 'bg-primary shadow-primary/20'}`}
          >
            確定
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
