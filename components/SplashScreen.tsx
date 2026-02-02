
import React, { useEffect, useState } from 'react';

const SplashScreen: React.FC = () => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 2000); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-cream flex items-center justify-center transition-opacity duration-700 pointer-events-none ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h1 className="font-brand text-8xl font-bold text-mocha tracking-normal px-4">
          Crema
        </h1>
        <div className="mt-4 flex flex-col items-center space-y-4">
            <p className="text-xs text-caramel uppercase tracking-[0.4em] font-medium font-sans animate-pulse">
              Brew Your Life
            </p>
            <div className="h-[1px] w-24 bg-beige relative overflow-hidden">
                <div className="absolute inset-0 bg-caramel animate-shimmer" style={{
                    backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(198,156,109,1) 50%, transparent 100%)',
                    backgroundSize: '200% 100%'
                }} />
            </div>
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer { animation: shimmer 2s infinite; }
      `}</style>
    </div>
  );
};

export default SplashScreen;
