
import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

interface AuthViewProps {
  onLogin: () => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [phone, setPhone] = useState('');

  return (
    <div className="fixed inset-0 bg-cream flex flex-col items-center justify-center p-8 animate-in fade-in duration-500 font-sans">
      <div className="mb-12 text-center">
        <h1 className="font-brand text-7xl text-mocha mb-2">Crema</h1>
        <p className="text-caramel tracking-[0.2em] text-[10px] uppercase font-bold">连接每一份醇厚</p>
      </div>

      <div className="w-full space-y-4 max-w-xs">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-beige">
          <input 
            type="tel" 
            placeholder="手机号" 
            className="w-full bg-transparent outline-none text-mocha placeholder-mocha/30"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-beige flex justify-between">
          <input 
            type="text" 
            placeholder="验证码" 
            className="w-full bg-transparent outline-none text-mocha placeholder-mocha/30"
          />
          <button className="text-xs text-caramel font-bold whitespace-nowrap">获取验证码</button>
        </div>

        <button 
          onClick={onLogin}
          className="w-full bg-caramel text-white py-4 rounded-2xl font-bold shadow-lg shadow-caramel/20 active:scale-95 transition-all mt-4"
        >
          进入 Crema
        </button>

        <div className="pt-8 flex flex-col items-center">
          <p className="text-[10px] text-mocha/30 mb-4 tracking-widest uppercase font-bold">第三方快捷登录</p>
          <button onClick={onLogin} className="w-12 h-12 rounded-full border border-beige flex items-center justify-center text-mocha/40 hover:text-mocha transition-colors">
            <MessageSquare size={20} />
          </button>
        </div>
      </div>
      
      <p className="absolute bottom-10 text-[10px] text-mocha/30 px-12 text-center leading-relaxed">
        登录即代表您同意 <span className="text-mocha underline underline-offset-2">社区公约</span> 与 <span className="text-mocha underline underline-offset-2">隐私条款</span>
      </p>
    </div>
  );
};

export default AuthView;
