
import React, { useState } from 'react';
import { Settings, ArrowLeft, ShieldCheck, X, BookOpen, ChevronRight, Target, Globe, Microscope, Info, MapPin, Heart, Coffee, Mail, UserPlus, MoreHorizontal } from 'lucide-react';
import { User, Language, Post } from '../types';
import { TRANSLATIONS, VARIETALS } from '../constants';
import ImageWithSkeleton from './ImageWithSkeleton';
import { triggerHaptic } from '../utils';

interface ProfileViewProps { 
  lang: Language;
  onLangChange: (l: Language) => void;
  user: User; // 当前查看的用户（可能是自己，也可能是别人）
  isCurrentUser: boolean; // 是否是当前登录用户
  posts: Post[]; // 该用户的帖子
  onBack: () => void; 
  onPostClick: (post: Post) => void; 
}

const ProfileView: React.FC<ProfileViewProps> = ({ lang, onLangChange, user, isCurrentUser, posts, onBack, onPostClick }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showSpecimens, setShowSpecimens] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false); // 访客模式下的关注状态
  const t = TRANSLATIONS[lang];

  const langs: { id: Language; label: string }[] = [
    { id: 'SC', label: '简体中文' },
    { id: 'TC', label: '繁體中文' },
    { id: 'EN', label: 'English' },
    { id: 'JP', label: '日本語' },
    { id: 'KR', label: '한국어' }
  ];

  // 计算等级称号
  const getLevelName = (score: number) => {
      if (score < 20) return '咖啡小白';
      if (score < 50) return '风味探索者';
      if (score < 80) return '资深鉴赏家';
      return '社区老饕';
  };

  return (
    <div className="bg-cream min-h-full pb-20 font-sans selection:bg-caramel/20 relative">
      {/* 顶部背景图 (仅访客模式或增强视觉效果) */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gray-200 overflow-hidden z-0">
          <ImageWithSkeleton 
            src="https://images.unsplash.com/photo-1447933630913-bb796f287e05?auto=format&fit=crop&q=80&w=1000" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-cream"></div>
      </div>

      <div className="px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <button onClick={onBack} className="p-2 -ml-2 text-white drop-shadow-md active:scale-90 transition-transform bg-black/10 backdrop-blur-md rounded-full"><ArrowLeft size={20} /></button>
        {isCurrentUser && (
            <button onClick={() => setShowSettings(true)} className="p-2 -mr-2 text-white drop-shadow-md active:scale-90 transition-transform bg-black/10 backdrop-blur-md rounded-full"><Settings size={20} /></button>
        )}
        {!isCurrentUser && (
            <button className="p-2 -mr-2 text-white drop-shadow-md active:scale-90 transition-transform bg-black/10 backdrop-blur-md rounded-full"><MoreHorizontal size={20} /></button>
        )}
      </div>

      <div className="px-6 space-y-6 pt-4 relative z-10 -mt-2">
        {/* 用户资料卡片 */}
        <div className="flex flex-col items-start">
          <div className="relative p-1 bg-cream rounded-full shadow-lg mb-3">
            <ImageWithSkeleton 
              src={user.avatar} 
              containerClassName="w-24 h-24 rounded-full border-2 border-beige"
              className="w-24 h-24 rounded-full object-cover"
            />
            {user.id === '0' || user.id === 'sys' ? (
                <div className="absolute -bottom-1 -right-1 bg-caramel text-white w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-md"><ShieldCheck size={14} /></div>
            ) : null}
          </div>
          
          <h1 className="text-2xl font-black text-mocha">{user.name}</h1>
          <p className="text-xs text-mocha/50 mt-2 leading-relaxed font-bold">
            {user.bio || '这个用户很懒，什么都没写...'}
          </p>
          
          {/* 关注/粉丝数据 */}
          <div className="flex space-x-6 mt-4">
            <div className="flex items-center space-x-1.5"><span className="text-sm font-black text-mocha">{user.stats.following}</span><span className="text-[10px] text-mocha/40 font-bold">{t.stats_following}</span></div>
            <div className="flex items-center space-x-1.5"><span className="text-sm font-black text-mocha">{user.stats.followers}</span><span className="text-[10px] text-mocha/40 font-bold">{t.stats_followers}</span></div>
            <div className="flex items-center space-x-1.5"><span className="text-sm font-black text-mocha">{posts.length * 12}</span><span className="text-[10px] text-mocha/40 font-bold">获赞与收藏</span></div>
          </div>

          {/* 操作按钮区 (区分本人与访客) */}
          <div className="flex space-x-3 w-full mt-6">
              {isCurrentUser ? (
                  // 本人视角：暂时不放主要按钮，或可放“编辑资料”
                   <button 
                        onClick={() => setShowSettings(true)}
                        className="flex-1 py-2.5 rounded-full bg-white border border-beige text-xs font-black text-mocha shadow-sm active:scale-95 transition-transform"
                    >
                        编辑资料
                    </button>
              ) : (
                  // 访客视角：关注 + 私信
                  <>
                    <button 
                        onClick={() => { triggerHaptic('medium'); setIsFollowing(!isFollowing); }}
                        className={`flex-1 py-2.5 rounded-full text-xs font-black shadow-md active:scale-95 transition-all flex items-center justify-center space-x-1 ${isFollowing ? 'bg-white border border-beige text-mocha/60' : 'bg-caramel text-white'}`}
                    >
                        {isFollowing ? '已关注' : <><UserPlus size={14} /><span>关注</span></>}
                    </button>
                    <button 
                        className="flex-1 py-2.5 rounded-full bg-white border border-beige text-xs font-black text-mocha shadow-sm active:scale-95 transition-transform flex items-center justify-center space-x-1"
                        onClick={() => triggerHaptic('light')}
                    >
                        <Mail size={14} /><span>私信</span>
                    </button>
                  </>
              )}
          </div>
        </div>

        {/* 紧凑型等级卡片 (仅展示，不可点击进入详情如果不是本人 - 可选) */}
        <div className="bg-mocha text-white px-6 py-4 rounded-[24px] shadow-xl relative overflow-hidden flex items-center justify-between group">
          <div className="absolute -right-4 -top-8 w-24 h-24 bg-caramel/20 rounded-full blur-2xl"></div>
          
          <div className="flex items-center space-x-3 z-10">
              <div className="bg-white/10 p-2 rounded-full">
                  <Target size={18} className="text-caramel" />
              </div>
              <div className="flex flex-col">
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">当前等级</span>
                  <span className="text-sm font-bold text-caramel">{getLevelName(user.palateScore)}</span>
              </div>
          </div>

          <div className="flex flex-col items-end z-10">
              <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-black">{user.palateScore}</span>
                  <span className="text-[10px] font-bold opacity-50">EXP</span>
              </div>
              <div className="w-20 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-caramel" style={{ width: `${user.palateScore}%` }} />
              </div>
          </div>
        </div>

        {/* 标本集入口 (如果是访客，仅展示数量) */}
        <button 
            onClick={() => setShowSpecimens(true)}
            className="w-full bg-white px-5 py-4 rounded-[24px] border border-beige/60 flex items-center justify-between shadow-sm active:scale-[0.98] transition-all hover:shadow-md"
        >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-cream rounded-xl flex items-center justify-center text-caramel shadow-inner border border-beige/40">
                <BookOpen size={20} strokeWidth={1.5} />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-mocha">{t.specimen}</h4>
                <p className="text-[10px] text-mocha/30 font-medium">已解锁 {user.unlockedVarietals.length} / {VARIETALS.length} 个品种</p>
              </div>
            </div>
            <div className="flex items-center">
                {user.unlockedVarietals.length > 0 && (
                   <span className="mr-2 text-xl filter grayscale opacity-50">{VARIETALS.find(v => v.id === user.unlockedVarietals[user.unlockedVarietals.length-1])?.icon}</span>
                )}
                <ChevronRight size={18} className="text-mocha/10" />
            </div>
        </button>
      </div>

      {/* 帖子列表 (瀑布流) */}
      <div className="mt-8 px-4">
        <div className="flex items-center space-x-2 mb-4 px-2">
            <Coffee size={16} className="text-caramel" />
            <h3 className="text-xs font-black text-mocha uppercase tracking-widest">{isCurrentUser ? '我的记录' : 'TA的笔记'} ({posts.length})</h3>
        </div>

        {posts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
            {posts.map((post) => (
                <div 
                key={post.id} 
                className="bg-white rounded-[20px] overflow-hidden shadow-sm active:scale-[0.98] transition-transform cursor-pointer border border-beige/30"
                onClick={() => onPostClick(post)}
                >
                    <div className="aspect-square relative overflow-hidden">
                        <ImageWithSkeleton 
                        src={post.images[0]} 
                        className="w-full h-full object-cover" 
                        containerClassName="w-full h-full"
                        />
                        <div className="absolute top-2 right-2 bg-black/20 backdrop-blur-md rounded-full px-1.5 py-0.5 text-[8px] text-white font-bold uppercase z-10">
                            {post.method}
                        </div>
                    </div>
                    <div className="p-3">
                        <h4 className="text-xs font-bold text-mocha line-clamp-1 mb-1">{post.title}</h4>
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] text-mocha/40">{post.date}</span>
                            <div className="flex items-center space-x-1 text-mocha/30">
                                <Heart size={10} className={post.hasLiked ? "fill-red-500 text-red-500" : ""} />
                                <span className="text-[9px] font-bold">{post.likes}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        ) : (
            <div className="text-center py-10 bg-white/50 rounded-[32px] border border-beige/40 mx-2">
                <p className="text-xs text-mocha/30 font-bold">{isCurrentUser ? '暂无发布记录，快去记录第一杯咖啡吧！' : '该用户暂无公开笔记。'}</p>
            </div>
        )}
      </div>

      {/* 标本集浮层 */}
      {showSpecimens && (
        <div className="fixed inset-0 z-[100] bg-cream flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
          <div className="px-6 py-6 flex items-center justify-between border-b border-beige/40 bg-cream/90 backdrop-blur">
            <button onClick={() => setShowSpecimens(false)} className="flex items-center space-x-2 text-mocha/40 font-bold text-sm active:opacity-60">
              <ArrowLeft size={20} />
              <span>{t.back}</span>
            </button>
            <h2 className="text-base font-black text-mocha tracking-tighter uppercase">{t.specimen}</h2>
            <Microscope size={20} className="text-caramel" />
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 hide-scrollbar pb-20">
             {VARIETALS.map(v => {
               const isUnlocked = user.unlockedVarietals.includes(v.id);
               return (
                 <div key={v.id} className={`p-5 rounded-[24px] border transition-all ${isUnlocked ? 'bg-white border-beige shadow-sm' : 'bg-beige/10 border-dashed border-beige/40 grayscale opacity-60'}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{isUnlocked ? v.icon : '🔒'}</div>
                        <div>
                          <h4 className="text-sm font-black text-mocha">{isUnlocked ? v.name : '未知品种'}</h4>
                          <p className="text-[9px] text-mocha/30 font-black italic uppercase tracking-wider">{v.latinName}</p>
                        </div>
                      </div>
                      {isUnlocked && <Info size={14} className="text-caramel/40" />}
                    </div>
                    {isUnlocked ? (
                      <p className="text-xs text-mocha/60 leading-relaxed font-medium">{v.description}</p>
                    ) : (
                      <div className="h-8 flex items-center justify-center bg-beige/10 rounded-lg mt-2">
                        <p className="text-[9px] text-mocha/20 font-bold uppercase tracking-widest">通过记录该品种解锁图鉴</p>
                      </div>
                    )}
                 </div>
               );
             })}
          </div>
        </div>
      )}

      {/* 设置浮层 (仅本人可见) */}
      {showSettings && isCurrentUser && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <div className="absolute inset-0 bg-mocha/20 backdrop-blur-sm" onClick={() => setShowSettings(false)} />
          <div className="relative w-full max-w-md bg-cream rounded-t-[40px] animate-in slide-in-from-bottom duration-500 p-8 shadow-2xl">
            <div className="w-12 h-1.5 bg-beige rounded-full mx-auto mb-8" />
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xl font-black text-mocha">{t.settings}</h2>
              <button onClick={() => setShowSettings(false)} className="p-2 bg-beige/40 rounded-full text-mocha/20"><X size={20} /></button>
            </div>
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="flex items-center space-x-3"><Globe size={18} className="text-caramel" /><span className="text-sm font-black text-mocha">{t.language}</span></div>
                <div className="grid grid-cols-2 gap-3">
                  {langs.map(l => (
                    <button 
                      key={l.id} 
                      onClick={() => { onLangChange(l.id); setShowSettings(false); }} 
                      className={`py-4 px-4 rounded-2xl text-xs font-black border transition-all active:scale-95 ${lang === l.id ? 'bg-caramel text-white border-caramel shadow-md' : 'bg-white border-beige text-mocha/40'}`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-12 text-center pb-6">
               <p className="text-[9px] text-mocha/20 font-bold tracking-[0.3em] uppercase">Crema v2.2.0</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
