
import React, { useState } from 'react';
import { Camera, X, Coffee, Hash, Save, Sparkles, Globe, MapPin, Navigation, Sliders, Wand2, Loader2, ScanLine, Sprout } from 'lucide-react';
import { Post, PrefillData, Language, FlavorProfile } from '../types';
import { ROAST_COLORS, ROAST_LABELS, SUGGESTIONS, TOPICS, TRANSLATIONS, VARIETALS } from '../constants';
import FlavorRadar from './FlavorRadar';
import { triggerHaptic } from '../utils';
import { GoogleGenAI, Type } from "@google/genai";

interface AddViewProps {
  lang: Language;
  prefillData: PrefillData | null;
  onCancel: () => void;
  onPublish: (post: Partial<Post>) => void;
}

const AddView: React.FC<AddViewProps> = ({ lang, prefillData, onCancel, onPublish }) => {
  const t = TRANSLATIONS[lang];
  const [formData, setFormData] = useState({
    title: '',
    productName: prefillData?.productName || '',
    region: prefillData?.region || '非洲',
    origin: '',
    varietal: prefillData?.varietal || '', // 品种
    location: '',
    images: [] as string[],
    roastLevel: prefillData?.roastLevel || 3,
    process: prefillData?.process || '水洗',
    method: prefillData?.method || '手冲',
    topics: [] as string[],
    content: '',
    flavorProfile: {
      acidity: 3,
      sweetness: 3,
      body: 3,
      bitterness: 2,
      aftertaste: 3
    } as FlavorProfile
  });

  const [isLocating, setIsLocating] = useState(false);
  const [isAnalyzingFlavor, setIsAnalyzingFlavor] = useState(false);
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [customTopic, setCustomTopic] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = `https://picsum.photos/seed/${Math.random()}/800/1000`;
      setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
    }
  };

  const handleGetLocation = () => {
    setIsLocating(true);
    setTimeout(() => {
      setFormData(prev => ({ ...prev, location: '上海市·徐汇滨江' }));
      setIsLocating(false);
    }, 1200);
  };

  const toggleTopic = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.includes(topic) ? prev.topics.filter(x => x !== topic) : [...prev.topics, topic]
    }));
  };

  const updateFlavor = (key: keyof FlavorProfile, val: number) => {
    if (formData.flavorProfile[key] !== val) {
      triggerHaptic('light');
    }
    setFormData(prev => ({
      ...prev,
      flavorProfile: { ...prev.flavorProfile, [key]: val }
    }));
  };

  // 辅助函数：清洗 AI 返回的 JSON 字符串
  const cleanJsonString = (str: string): string => {
    if (!str) return '{}';
    const startIndex = str.indexOf('{');
    const endIndex = str.lastIndexOf('}');
    
    if (startIndex === -1 || endIndex === -1) return '{}';
    return str.substring(startIndex, endIndex + 1);
  };

  const getLanguageName = (l: Language) => {
    switch(l) {
      case 'SC': return 'Simplified Chinese';
      case 'TC': return 'Traditional Chinese';
      case 'EN': return 'English';
      case 'JP': return 'Japanese';
      case 'KR': return 'Korean';
      default: return 'Chinese';
    }
  };

  // --- AI 功能实现 ---

  // 1. AI 润色文案 (Gemini)
  const handleAIGenerateText = async () => {
    if (isGeneratingText) return; 
    setIsGeneratingText(true);
    triggerHaptic('medium');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const varietalName = VARIETALS.find(v => v.id === formData.varietal)?.name || '';
      const context = `
        Product: ${formData.productName || 'Specialty Coffee'}
        Origin: ${formData.origin || formData.region}
        Varietal: ${varietalName}
        Method: ${formData.method}
        Roast: ${ROAST_LABELS[formData.roastLevel]}
        Tags: ${formData.topics.join(', ')}
      `;
      
      const targetLang = getLanguageName(lang);

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-latest',
        contents: `You are a coffee connoisseur. Write a short, poetic, and sensory-rich tasting note (in ${targetLang}, max 80 words) based on these details: ${context}. Focus on flavor, aroma, and mouthfeel. Do not use hashtags. Return ONLY the text.`,
      });

      if (response.text) {
        setFormData(prev => ({ ...prev, content: response.text.trim() }));
        triggerHaptic('success');
      }
    } catch (error) {
      console.error("AI Generation Failed:", error);
      setFormData(prev => ({ ...prev, content: "这杯咖啡口感干净，酸质明亮，带有迷人的花果香气，余韵悠长..." })); 
    } finally {
      setIsGeneratingText(false);
    }
  };

  // 2. AI 提取风味 (Gemini)
  const handleAIAnalyzeFlavor = async () => {
    if (isAnalyzingFlavor || !formData.content) return;
    setIsAnalyzingFlavor(true);
    triggerHaptic('medium');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-latest',
        contents: `Analyze this coffee review and extract a flavor profile on a scale of 1-5 (integer only). Review: "${formData.content}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              acidity: { type: Type.INTEGER },
              sweetness: { type: Type.INTEGER },
              body: { type: Type.INTEGER },
              bitterness: { type: Type.INTEGER },
              aftertaste: { type: Type.INTEGER },
            },
            required: ["acidity", "sweetness", "body", "bitterness", "aftertaste"],
          },
        },
      });

      const jsonStr = cleanJsonString(response.text);
      if (jsonStr) {
        const result = JSON.parse(jsonStr);
        setFormData(prev => ({ ...prev, flavorProfile: result }));
        triggerHaptic('success');
      }
    } catch (error) {
      console.error("AI Analysis Failed:", error);
      const newProfile = { ...formData.flavorProfile };
      newProfile.acidity = 4;
      newProfile.sweetness = 3;
      newProfile.body = 3;
      setFormData(prev => ({ ...prev, flavorProfile: newProfile }));
    } finally {
      setIsAnalyzingFlavor(false);
    }
  };

  return (
    <div className="bg-cream animate-in slide-in-from-bottom duration-500 min-h-full pb-44 font-sans selection:bg-caramel/20">
      {/* 顶栏 */}
      <div className="sticky top-0 z-50 glass-nav px-6 py-6 flex items-center justify-between border-b border-beige/40">
        <button onClick={onCancel} className="text-mocha/40 text-sm font-black tracking-widest uppercase">{t.close}</button>
        <span className="text-lg font-black text-mocha tracking-tighter uppercase">{t.publish}</span>
        <div className="flex items-center space-x-6">
          <button className="text-mocha/40"><Save size={22} /></button>
          <button 
            onClick={() => onPublish(formData)} 
            className="text-white font-black text-xs bg-mocha px-5 py-2.5 rounded-full shadow-lg uppercase tracking-widest active:scale-95 transition-all"
          >
            {t.publish}
          </button>
        </div>
      </div>

      <div className="max-w-screen-sm mx-auto p-6 space-y-12">
        {/* 1. 视觉影像 */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold text-mocha/30 uppercase tracking-[0.2em] px-1">{t.visuals}</h3>
          <div className="flex space-x-4 overflow-x-auto pb-2 hide-scrollbar">
            {formData.images.map((img, i) => (
              <div key={i} className="w-28 h-28 rounded-3xl overflow-hidden flex-shrink-0 relative border-2 border-white shadow-md group">
                <img src={img} className="w-full h-full object-cover" alt="" />
                <button onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))} className="absolute inset-0 bg-mocha/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"><X size={20} /></button>
              </div>
            ))}
            <label className="w-28 h-28 border-2 border-dashed border-beige bg-white/50 rounded-3xl flex flex-col items-center justify-center cursor-pointer text-mocha/20 hover:text-caramel hover:border-caramel/40 transition-all">
              <Camera size={28} strokeWidth={1} />
              <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
            </label>
          </div>
        </section>

        {/* 2. 记录标题 */}
        <section>
          <input 
            type="text" 
            placeholder={t.placeholder_title} 
            className="w-full bg-transparent border-b-2 border-beige/60 py-6 text-2xl focus:outline-none focus:border-caramel font-black text-mocha placeholder-mocha/15 transition-colors" 
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})} 
          />
        </section>

        {/* 3. 产区与产品 */}
        <section className="space-y-5">
           {/* 产区 */}
          <div className="flex items-center justify-between px-1"><h3 className="text-[10px] font-bold text-mocha/30 uppercase tracking-[0.2em]">{t.origin}</h3><Globe size={14} className="text-caramel/40" /></div>
          <div className="flex space-x-3 overflow-x-auto hide-scrollbar">
            {SUGGESTIONS.regions.map(r => (
              <button key={r} onClick={() => setFormData({...formData, region: r, origin: ''})} className={`px-5 py-2.5 rounded-2xl text-[11px] font-black border transition-all ${formData.region === r ? 'bg-caramel text-white border-caramel shadow-md' : 'bg-white border-beige text-mocha/40'}`}>{r}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2.5">
            {(SUGGESTIONS.origins as any)[formData.region]?.map((o: string) => (
              <button key={o} onClick={() => setFormData({...formData, origin: o})} className={`px-3.5 py-1.5 rounded-xl text-[10px] font-bold border transition-all ${formData.origin === o ? 'bg-mocha text-white border-mocha' : 'bg-beige/30 border-transparent text-mocha/50'}`}>{o}</button>
            ))}
          </div>
        
          {/* 产品名称 */}
          <div className="bg-white/40 p-6 rounded-[32px] border border-beige/60 shadow-sm flex items-center space-x-4 mt-6">
            <div className="w-10 h-10 bg-cream rounded-2xl flex items-center justify-center text-caramel border border-beige/60 shadow-inner"><Coffee size={20} /></div>
            <input type="text" placeholder={t.placeholder_product} className="flex-1 bg-transparent text-sm font-black focus:outline-none text-mocha placeholder-mocha/20" value={formData.productName} onChange={e => setFormData({...formData, productName: e.target.value})} />
          </div>
        </section>

        {/* 4. 品种 (解锁核心) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1"><h3 className="text-[10px] font-bold text-mocha/30 uppercase tracking-[0.2em]">{t.varietal}</h3><Sprout size={14} className="text-caramel/40" /></div>
          <div className="flex space-x-4 overflow-x-auto hide-scrollbar pb-2">
            {VARIETALS.map(v => (
              <button 
                key={v.id} 
                onClick={() => setFormData({...formData, varietal: v.id === formData.varietal ? '' : v.id})}
                className={`flex-shrink-0 w-28 p-4 rounded-3xl border transition-all flex flex-col items-center space-y-2 ${formData.varietal === v.id ? 'bg-caramel text-white border-caramel shadow-lg transform scale-105' : 'bg-white border-beige text-mocha/40'}`}
              >
                <span className="text-2xl">{v.icon}</span>
                <span className="text-xs font-black">{v.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 5 & 6. 烘焙 & 冲泡方式 */}
        <section className="grid grid-cols-2 gap-px bg-beige/40 rounded-[32px] overflow-hidden border border-beige/60 shadow-sm">
          <div className="bg-white/60 p-8 space-y-5 text-center">
            <label className="text-[9px] font-black text-mocha/30 uppercase tracking-[0.2em]">{t.roast}</label>
            <div className="flex justify-between items-center px-2">
              {[1, 2, 3, 4, 5].map(l => (
                <button key={l} onClick={() => setFormData({...formData, roastLevel: l})} className={`w-3 h-3 rounded-full transition-all ${formData.roastLevel === l ? 'scale-[2.2] shadow-lg ring-4 ring-white' : 'opacity-20'}`} style={{backgroundColor: ROAST_COLORS[l]}} />
              ))}
            </div>
            <p className="text-[11px] font-black text-mocha/60 uppercase">{ROAST_LABELS[formData.roastLevel]}</p>
          </div>
          <div className="bg-white/60 p-8 space-y-5 text-center flex flex-col items-center">
            <label className="text-[9px] font-black text-mocha/30 uppercase tracking-[0.2em]">{t.method}</label>
            <select value={formData.method} onChange={e => setFormData({...formData, method: e.target.value})} className="bg-transparent text-[12px] font-black text-mocha outline-none appearance-none w-full text-center">
              {SUGGESTIONS.methods.map(m => <option key={m}>{m}</option>)}
            </select>
            <div className="w-1.5 h-1.5 bg-caramel rounded-full mt-2" />
          </div>
        </section>

        {/* 8. 赏味感悟 */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-bold text-mocha/30 uppercase tracking-[0.2em]">{t.feeling}</h3>
            <div className="flex items-center space-x-2">
               <button 
                  onClick={handleAIGenerateText}
                  disabled={isGeneratingText}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-sm transition-all border border-transparent ${isGeneratingText ? 'bg-beige text-mocha/50 cursor-not-allowed' : 'bg-white text-caramel hover:border-caramel/30 active:scale-95'}`}
                >
                  {isGeneratingText ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  <span>{isGeneratingText ? 'AI 思考中...' : 'AI 润色文案'}</span>
                </button>
            </div>
          </div>
          <div className="relative group">
             <div className={`absolute -inset-0.5 bg-gradient-to-r from-caramel/20 to-mocha/20 rounded-[34px] blur opacity-0 transition duration-500 ${isGeneratingText ? 'opacity-100' : ''}`}></div>
             <textarea rows={6} placeholder={t.placeholder_feeling} className="relative w-full bg-white/60 border border-beige/80 rounded-[32px] p-8 text-sm leading-relaxed focus:outline-none focus:border-caramel/40 text-mocha shadow-inner transition-all" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
             {isGeneratingText && <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] rounded-[32px] flex items-center justify-center z-10"><Sparkles className="text-caramel animate-bounce" /></div>}
          </div>
        </section>

        {/* 7. 风味校准 (雷达图) */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-bold text-mocha/30 uppercase tracking-[0.2em]">{t.flavor_calibration}</h3>
             <button 
                onClick={handleAIAnalyzeFlavor}
                disabled={isAnalyzingFlavor || !formData.content}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-sm transition-all border border-transparent ${isAnalyzingFlavor ? 'bg-beige text-mocha/50 cursor-not-allowed' : 'bg-mocha text-white hover:bg-mocha/90 active:scale-95'} ${(formData.content.length === 0 && !isAnalyzingFlavor) ? 'opacity-50' : 'opacity-100'}`}
              >
                {isAnalyzingFlavor ? <Loader2 size={12} className="animate-spin" /> : <ScanLine size={12} />}
                <span>{isAnalyzingFlavor ? 'AI 分析中...' : 'AI 提取风味'}</span>
              </button>
          </div>
          <div className="bg-white/60 rounded-[32px] border border-beige/60 p-6 flex flex-col md:flex-row gap-8 shadow-sm relative overflow-hidden">
             
             {isAnalyzingFlavor && (
               <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-sm flex items-center justify-center flex-col space-y-2 animate-in fade-in duration-300">
                 <Loader2 className="text-mocha animate-spin" size={32} />
                 <span className="text-xs font-bold text-mocha/60 tracking-wider">正在构建风味模型...</span>
               </div>
             )}

             <div className="flex items-center justify-center flex-shrink-0">
               <FlavorRadar data={formData.flavorProfile} lang={lang} size={160} showLabels={true} />
             </div>
             <div className="flex-1 space-y-5 justify-center flex flex-col">
                {(['acidity', 'sweetness', 'body', 'bitterness', 'aftertaste'] as const).map((key) => (
                  <div key={key} className="flex items-center space-x-3">
                    <span className="text-[10px] font-bold text-mocha/40 w-8 text-right uppercase">{t[`radar_${key}`]}</span>
                    <input 
                      type="range" 
                      min="1" 
                      max="5" 
                      step="1"
                      value={formData.flavorProfile[key]} 
                      onChange={(e) => updateFlavor(key, parseInt(e.target.value))}
                      className="flex-1 h-1.5 bg-beige rounded-lg appearance-none cursor-pointer accent-caramel"
                    />
                    <span className="text-[10px] font-black text-mocha w-3">{formData.flavorProfile[key]}</span>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* 9. 话题标签 & 10. 位置 (略，保持不变) */}
        {/* ... (位置代码保持不变，已包含在完整内容中) ... */}
        <section className="space-y-4">
          <div className="flex flex-wrap gap-2.5 px-1">
            {formData.topics.map(topic => (
              <button key={topic} onClick={() => toggleTopic(topic)} className="text-[11px] text-caramel font-black px-3.5 py-1.5 bg-caramel/5 rounded-xl border border-caramel/10 flex items-center group">#{topic} <X size={12} className="ml-2 opacity-30 group-hover:opacity-100" /></button>
            ))}
          </div>
          <div className="flex items-center space-x-3 overflow-x-auto hide-scrollbar px-1">
            <div className="flex items-center space-x-2 bg-white border border-beige rounded-2xl px-4 py-2 shadow-sm">
              <Hash size={16} className="text-caramel/40" />
              <input type="text" placeholder={t.placeholder_topic} className="bg-transparent outline-none text-[11px] font-black text-mocha w-24" value={customTopic} onChange={e => setCustomTopic(e.target.value)} onKeyDown={e => {if(e.key==='Enter' && customTopic.trim()){ toggleTopic(customTopic.trim()); setCustomTopic(''); }}} />
            </div>
            {TOPICS.map(topic => (
              <button key={topic} onClick={() => toggleTopic(topic)} className={`whitespace-nowrap px-4 py-2 rounded-2xl text-[11px] font-black border transition-all ${formData.topics.includes(topic) ? 'bg-caramel text-white border-caramel shadow-md' : 'bg-white border-beige text-mocha/30 hover:border-mocha/60'}`}>{topic}</button>
            ))}
          </div>
        </section>

        <section className="space-y-4 pt-6 border-t border-beige/40">
          <div className="flex items-center justify-between px-1"><h3 className="text-[10px] font-bold text-mocha/30 uppercase tracking-[0.2em]">{t.location}</h3><MapPin size={14} className="text-caramel/40" /></div>
          <button onClick={handleGetLocation} disabled={isLocating} className={`w-full bg-white/40 p-5 rounded-[24px] border border-beige flex items-center justify-between transition-all active:scale-[0.98] ${formData.location ? 'border-caramel/30 bg-caramel/5 shadow-inner' : 'shadow-sm'}`}>
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isLocating ? 'animate-pulse bg-caramel/20' : 'bg-beige/40'}`}><Navigation size={18} className={formData.location ? 'text-caramel' : 'text-mocha/20'} /></div>
              <span className={`text-sm font-black ${formData.location ? 'text-mocha' : 'text-mocha/20'}`}>{isLocating ? '...' : (formData.location || t.placeholder_location)}</span>
            </div>
            {formData.location && <button onClick={e => {e.stopPropagation(); setFormData({...formData, location: ''});}}><X size={16} className="text-mocha/20" /></button>}
          </button>
        </section>

      </div>
    </div>
  );
};

export default AddView;
