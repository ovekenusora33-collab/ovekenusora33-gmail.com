
import React, { useState } from 'react';
import { Coffee, Search, Zap, ChevronRight } from 'lucide-react';

interface OnboardingViewProps {
  onComplete: () => void;
}

const STEPS = [
  {
    icon: <Coffee size={48} className="text-caramel" />,
    title: "精准记录",
    desc: "捕捉每一滴香气，构建专属风味轮，留住此刻醇厚。"
  },
  {
    icon: <Search size={48} className="text-caramel" />,
    title: "全城探索",
    desc: "发掘隐藏在街角的好店，避开平庸，直达心仪之作。"
  },
  {
    icon: <Zap size={48} className="text-caramel" />,
    title: "赏味进阶",
    desc: "累积赏味值 (Palate Score)，从爱好者进阶为社区老饕。"
  }
];

const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else onComplete();
  };

  return (
    <div className="fixed inset-0 bg-cream flex flex-col items-center justify-center p-8 animate-in fade-in duration-500 font-sans">
      <div key={step} className="flex flex-col items-center text-center animate-in slide-in-from-right-8 duration-500">
        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-xl border border-beige mb-8">
          {STEPS[step].icon}
        </div>
        <h2 className="text-3xl font-bold text-mocha mb-4">{STEPS[step].title}</h2>
        <p className="text-mocha/50 leading-relaxed max-w-[240px] mb-12">
          {STEPS[step].desc}
        </p>
      </div>

      <div className="flex space-x-2 mb-12">
        {STEPS.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-caramel' : 'w-1.5 bg-beige'}`} />
        ))}
      </div>

      <button 
        onClick={next}
        className="flex items-center space-x-2 bg-mocha text-white px-8 py-4 rounded-full font-bold shadow-xl active:scale-95 transition-all"
      >
        <span>{step === STEPS.length - 1 ? '开启旅程' : '下一步'}</span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default OnboardingView;
