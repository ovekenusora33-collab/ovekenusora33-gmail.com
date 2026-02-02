
import React, { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { HomeTab, Language, FilterState } from '../types';
import { SUGGESTIONS, ROAST_COLORS, TRANSLATIONS } from '../constants';
import ImageWithSkeleton from './ImageWithSkeleton';

interface HeaderProps {
  lang: Language;
  activeTab: HomeTab;
  onTabChange: (tab: HomeTab) => void;
  isSearching: boolean;
  setIsSearching: (val: boolean) => void;
  onProfileClick: () => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  userAvatar: string;
}

const Header: React.FC<HeaderProps> = ({ 
  lang, activeTab, onTabChange, isSearching, setIsSearching, onProfileClick,
  filters, onFilterChange, userAvatar
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const t = TRANSLATIONS[lang];

  // 本地临时状态，确认后提交给父组件
  const [tempFilters, setTempFilters] = useState<FilterState>(filters);

  const toggleSelection = <T,>(item: T, list: T[], key: keyof FilterState) => {
    let newList;
    if (list.includes(item)) {
      newList = list.filter(i => i !== item);
    } else {
      newList = [...list, item];
    }
    setTempFilters({ ...tempFilters, [key]: newList });
  };

  const handleConfirm = () => {
    onFilterChange(tempFilters);
    setShowFilters(false);
  };

  const handleClear = () => {
    const cleared = { roasts: [], methods: [], regions: [] };
    setTempFilters(cleared);
    onFilterChange(cleared); // 实时清空
  };
  
  // 检查是否有激活的过滤器
  const hasActiveFilters = filters.roasts.length > 0 || filters.methods.length > 0 || filters.regions.length > 0;

  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b border-beige/40">
      <div className="px-5 py-4 flex items-center justify-between">
        {isSearching ? (
          <div className="flex-1 flex flex-col relative">
            <div className="flex items-center bg-beige/40 rounded-full px-4 py-2 border border-beige z-20 relative">
              <Search size={18} className="text-mocha/40 mr-2" />
              <input 
                autoFocus 
                type="text" 
                placeholder="..." 
                className="bg-transparent border-none outline-none text-sm w-full text-mocha font-sans font-bold" 
              />
              <button 
                onClick={() => setShowFilters(!showFilters)} 
                className={`p-1.5 ml-1 rounded-lg transition-all ${showFilters || hasActiveFilters ? 'bg-caramel text-white shadow-md' : 'text-mocha/30'}`}
              >
                <Filter size={16} />
              </button>
              <button onClick={() => {setIsSearching(false); setShowFilters(false);}} className="ml-2 text-mocha/30 hover:text-mocha"><X size={18} /></button>
            </div>
            
            {showFilters && (
              <div className="absolute top-full left-0 right-0 mt-4 bg-cream rounded-[32px] p-6 shadow-2xl border border-beige/60 animate-in slide-in-from-top-4 duration-300 z-10 w-[calc(100vw-40px)] -ml-1">
                <div className="space-y-6">
                  {/* 烘焙度筛选 */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-mocha/30 uppercase tracking-[0.2em]">{t.filter_roast}</h4>
                    <div className="flex justify-between items-center px-2">
                      {[1, 2, 3, 4, 5].map(l => (
                        <button 
                          key={l} 
                          onClick={() => toggleSelection(l, tempFilters.roasts, 'roasts')}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${tempFilters.roasts.includes(l) ? 'scale-110 ring-2 ring-caramel ring-offset-2' : 'hover:scale-110 opacity-60'}`}
                        >
                           <div className="w-5 h-5 rounded-full shadow-sm" style={{backgroundColor: ROAST_COLORS[l]}} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 冲泡方式筛选 */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-mocha/30 uppercase tracking-[0.2em]">{t.filter_method}</h4>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTIONS.methods.map(m => (
                        <button 
                          key={m} 
                          onClick={() => toggleSelection(m, tempFilters.methods, 'methods')}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${tempFilters.methods.includes(m) ? 'bg-caramel text-white border-caramel shadow-md' : 'bg-white border-beige text-mocha/50'}`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 区域筛选 */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-mocha/30 uppercase tracking-[0.2em]">{t.filter_region}</h4>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTIONS.regions.map(r => (
                        <button 
                          key={r} 
                          onClick={() => toggleSelection(r, tempFilters.regions, 'regions')}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${tempFilters.regions.includes(r) ? 'bg-caramel text-white border-caramel shadow-md' : 'bg-white border-beige text-mocha/50'}`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 底部操作栏 */}
                  <div className="flex items-center space-x-4 pt-4 border-t border-beige/40">
                    <button 
                      onClick={handleClear}
                      className="flex-1 py-3 rounded-2xl text-xs font-bold text-mocha/40 hover:bg-beige/30 transition-colors"
                    >
                      {t.clear}
                    </button>
                    <button 
                      onClick={handleConfirm}
                      className="flex-[2] py-3 bg-mocha text-white rounded-2xl text-xs font-bold shadow-lg shadow-mocha/20 active:scale-95 transition-all"
                    >
                      {t.confirm}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <button onClick={onProfileClick} className="w-9 h-9 rounded-full overflow-hidden border border-beige shadow-sm active:scale-90 transition-transform">
              <ImageWithSkeleton src={userAvatar} className="w-full h-full object-cover" />
            </button>
            <div className="flex items-center space-x-8">
              {[
                { id: HomeTab.FOLLOWING, label: t.following },
                { id: HomeTab.DISCOVER, label: t.discover },
                { id: HomeTab.LOCAL, label: t.local }
              ].map(tab => (
                <button key={tab.id} onClick={() => onTabChange(tab.id)} className={`text-base transition-all font-sans relative pb-1.5 ${activeTab === tab.id ? 'font-black text-mocha' : 'text-mocha/20 font-medium'}`}>
                  {tab.label}
                  {activeTab === tab.id && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-1 bg-caramel rounded-full" />}
                </button>
              ))}
            </div>
            <button onClick={() => setIsSearching(true)} className={`p-2 hover:scale-110 active:scale-95 transition-all ${hasActiveFilters ? 'text-caramel' : 'text-mocha'}`}>
              <div className="relative">
                 <Search size={22} strokeWidth={2} />
                 {hasActiveFilters && <div className="absolute top-0 right-0 w-2 h-2 bg-caramel rounded-full border border-white" />}
              </div>
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
