
import React from 'react';
import { Home, Plus, User, MessageSquare } from 'lucide-react';
import { ViewType, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface BottomNavProps {
  lang: Language;
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ lang, activeView, onViewChange }) => {
  const t = TRANSLATIONS[lang];
  return (
    <nav className="fixed bottom-6 left-6 right-6 h-16 glass-nav rounded-full shadow-2xl border border-white/40 flex items-center justify-between px-6 z-40">
      <button 
        onClick={() => onViewChange(ViewType.HOME)}
        className={`flex flex-col items-center justify-center space-y-1 transition-all ${activeView === ViewType.HOME ? 'text-mocha scale-110' : 'text-mocha/30'}`}
      >
        <Home size={22} fill={activeView === ViewType.HOME ? "currentColor" : "none"} />
        <span className="text-[9px] font-black uppercase tracking-widest">{t.discover}</span>
      </button>

      <button 
        onClick={() => onViewChange(ViewType.MESSAGES)}
        className={`flex flex-col items-center justify-center space-y-1 transition-all relative ${activeView === ViewType.MESSAGES ? 'text-mocha scale-110' : 'text-mocha/30'}`}
      >
        <div className="relative">
             <MessageSquare size={22} fill={activeView === ViewType.MESSAGES ? "currentColor" : "none"} />
             <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-cream rounded-full"></div>
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest">{t.messages}</span>
      </button>

      <button 
        onClick={() => onViewChange(ViewType.ADD)}
        className="w-12 h-12 bg-caramel rounded-full flex items-center justify-center text-white shadow-lg shadow-caramel/40 -mt-8 hover:scale-110 active:scale-95 transition-all ring-4 ring-cream"
      >
        <Plus size={28} />
      </button>

      <div className="w-8" /> {/* Spacer for symmetry if needed, or just standard flex */}

      <button 
        onClick={() => onViewChange(ViewType.PROFILE)}
        className={`flex flex-col items-center justify-center space-y-1 transition-all ${activeView === ViewType.PROFILE ? 'text-mocha scale-110' : 'text-mocha/30'}`}
      >
        <User size={22} fill={activeView === ViewType.PROFILE ? "currentColor" : "none"} />
        <span className="text-[9px] font-black uppercase tracking-widest">{t.mine}</span>
      </button>
    </nav>
  );
};

export default BottomNav;
