
import React from 'react';
import { Heart, UserPlus, MessageCircle, Bell, ChevronRight, MessageSquare, ShieldAlert } from 'lucide-react';
import { ChatSession, Language, NotificationStats } from '../types';
import { MOCK_CHATS, TRANSLATIONS } from '../constants';
import ImageWithSkeleton from './ImageWithSkeleton';
import { triggerHaptic } from '../utils';

interface MessagesViewProps {
  lang: Language;
  onChatClick: (chat: ChatSession) => void;
  stats: NotificationStats;
}

const MessagesView: React.FC<MessagesViewProps> = ({ lang, onChatClick, stats }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="pb-24 pt-4 px-4 font-sans animate-in fade-in duration-500">
      <h1 className="text-2xl font-black text-mocha px-2 mb-6">{t.messages}</h1>

      {/* 顶部三个核心通知入口 */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { icon: <Heart size={20} className="fill-white" />, label: t.msg_likes, count: stats.likes, color: 'bg-red-400' },
          { icon: <UserPlus size={20} />, label: t.msg_followers, count: stats.followers, color: 'bg-blue-400' },
          { icon: <MessageCircle size={20} />, label: t.msg_comments, count: stats.comments, color: 'bg-green-400' }
        ].map((item, i) => (
          <button 
            key={i} 
            className="flex flex-col items-center justify-center p-4 bg-white rounded-[24px] border border-beige shadow-sm active:scale-95 transition-transform"
            onClick={() => triggerHaptic('light')}
          >
            <div className={`w-10 h-10 ${item.color} rounded-2xl flex items-center justify-center text-white shadow-md mb-2 relative`}>
              {item.icon}
              {item.count > 0 && (
                 <div className="absolute -top-1 -right-1 bg-mocha text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white">
                   {item.count}
                 </div>
              )}
            </div>
            <span className="text-[10px] font-bold text-mocha/60">{item.label}</span>
          </button>
        ))}
      </div>

      {/* 消息列表标题 */}
      <div className="flex items-center justify-between px-2 mb-4">
        <h2 className="text-sm font-black text-mocha/40 uppercase tracking-[0.2em]">{t.msg_system}</h2>
      </div>

      {/* 官方/系统消息 */}
      <div className="space-y-4 mb-8">
        {MOCK_CHATS.filter(c => c.user.isOfficial).map(chat => (
           <ChatRow key={chat.id} chat={chat} onClick={() => onChatClick(chat)} />
        ))}
      </div>

      {/* 陌生人/其他消息 */}
       <div className="flex items-center justify-between px-2 mb-4">
        <h2 className="text-sm font-black text-mocha/40 uppercase tracking-[0.2em]">{t.msg_stranger}</h2>
      </div>

      <div className="space-y-4">
        {MOCK_CHATS.filter(c => !c.user.isOfficial).map(chat => (
           <ChatRow key={chat.id} chat={chat} onClick={() => onChatClick(chat)} />
        ))}
      </div>
    </div>
  );
};

const ChatRow: React.FC<{ chat: ChatSession, onClick: () => void }> = ({ chat, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center space-x-4 p-4 bg-white rounded-[28px] border border-beige/40 shadow-sm active:bg-beige/20 transition-colors"
  >
    <div className="relative">
      <ImageWithSkeleton src={chat.user.avatar} containerClassName="w-12 h-12 rounded-full" className="w-12 h-12 rounded-full object-cover border border-beige" />
      {chat.user.isOfficial && (
        <div className="absolute -bottom-1 -right-1 bg-caramel text-white p-0.5 rounded-full border border-white">
          <ShieldAlert size={10} fill="currentColor" />
        </div>
      )}
      {chat.unreadCount > 0 && (
         <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
      )}
    </div>
    
    <div className="flex-1 text-left min-w-0">
       <div className="flex justify-between items-center mb-1">
         <span className="text-sm font-black text-mocha truncate">{chat.user.name}</span>
         <span className="text-[10px] font-bold text-mocha/30">{chat.time}</span>
       </div>
       <p className={`text-xs truncate ${chat.unreadCount > 0 ? 'text-mocha font-bold' : 'text-mocha/50 font-medium'}`}>
         {chat.isStranger && !chat.hasReplied ? '[陌生人消息请求] ' : ''}
         {chat.lastMessage}
       </p>
    </div>
  </button>
);

export default MessagesView;
