
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, ShieldAlert, Image as ImageIcon, Mic, MoreVertical } from 'lucide-react';
import { ChatSession, ChatMessage, Language } from '../types';
import { TRANSLATIONS, MOCK_USER } from '../constants';
import ImageWithSkeleton from './ImageWithSkeleton';
import { triggerHaptic } from '../utils';

interface ChatOverlayProps {
  lang: Language;
  session: ChatSession;
  onClose: () => void;
}

const ChatOverlay: React.FC<ChatOverlayProps> = ({ lang, session, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(session.messages);
  const [inputText, setInputText] = useState('');
  const [hasReplied, setHasReplied] = useState(session.hasReplied);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    triggerHaptic('success');
    
    const newMsg: ChatMessage = {
        id: `new_${Date.now()}`,
        isMe: true,
        text: inputText,
        time: '刚刚',
        type: 'text'
    };
    
    setMessages([...messages, newMsg]);
    setInputText('');
    setHasReplied(true); // 解锁陌生人限制
  };

  // 陌生人限制逻辑：如果是陌生人且我未回复，显示提示栏，点击回复按钮后才允许输入
  const isRestricted = session.isStranger && !hasReplied;

  return (
    <div className="fixed inset-0 z-[70] bg-cream flex flex-col animate-in slide-in-from-right duration-300">
      {/* 顶部导航 */}
      <div className="px-4 py-4 flex items-center justify-between bg-cream/90 backdrop-blur-md border-b border-beige/40">
        <div className="flex items-center space-x-3">
            <button onClick={onClose} className="p-2 -ml-2 text-mocha/40 active:scale-90 transition-transform">
                <ArrowLeft size={22} />
            </button>
            <div className="relative">
                <ImageWithSkeleton src={session.user.avatar} containerClassName="w-9 h-9 rounded-full" className="w-9 h-9 rounded-full object-cover" />
                 {session.user.isOfficial && (
                    <div className="absolute -bottom-1 -right-1 bg-caramel text-white p-0.5 rounded-full border border-white">
                    <ShieldAlert size={8} fill="currentColor" />
                    </div>
                )}
            </div>
            <div>
                <h3 className="text-sm font-black text-mocha">{session.user.name}</h3>
                {session.user.isOfficial && <p className="text-[9px] text-caramel font-bold uppercase tracking-wider">Official</p>}
            </div>
        </div>
        <button className="text-mocha/20"><MoreVertical size={20} /></button>
      </div>

      {/* 聊天内容 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
         <div className="text-center py-4">
            <span className="text-[10px] text-mocha/20 font-bold bg-beige/30 px-3 py-1 rounded-full">{session.time}</span>
         </div>
         
         {messages.map((msg) => (
             <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[70%] p-3.5 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${
                     msg.isMe 
                     ? 'bg-mocha text-white rounded-tr-none' 
                     : 'bg-white text-mocha border border-beige rounded-tl-none'
                 }`}>
                     {msg.type === 'text' && msg.text}
                     {msg.type === 'image' && (
                         <img src={msg.text} className="rounded-lg w-full" />
                     )}
                 </div>
             </div>
         ))}
      </div>

      {/* 底部输入区 */}
      <div className="p-4 bg-white border-t border-beige/40 pb-8">
        {isRestricted ? (
            <div className="flex flex-col items-center space-y-3 py-2 animate-in fade-in">
                <p className="text-xs text-mocha/40 font-bold">{t.stranger_tip}</p>
                <button 
                    onClick={() => { triggerHaptic('medium'); setHasReplied(true); }}
                    className="bg-caramel text-white px-6 py-2.5 rounded-full text-xs font-black shadow-md active:scale-95 transition-transform"
                >
                    回复以开启对话
                </button>
            </div>
        ) : (
            <div className="flex items-center space-x-3 bg-beige/30 p-2 rounded-[24px]">
                <button className="p-2 text-mocha/30"><Mic size={20} /></button>
                <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="发送消息..."
                    className="flex-1 bg-transparent text-sm font-bold text-mocha outline-none placeholder-mocha/20"
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    autoFocus
                />
                <button className="p-2 text-mocha/30"><ImageIcon size={20} /></button>
                <button 
                    onClick={handleSend}
                    disabled={!inputText.trim()}
                    className={`p-2 rounded-full transition-all ${inputText.trim() ? 'bg-mocha text-white shadow-md' : 'bg-beige text-mocha/10'}`}
                >
                    <Send size={16} />
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default ChatOverlay;
