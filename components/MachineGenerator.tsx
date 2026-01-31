
import React, { useState, useRef } from 'react';
import { generateWackyMachine } from '../services/geminiService';
import { WackyMachine } from '../types';
import { Hammer, Sparkles, Loader2, Info, ChevronRight, TriangleAlert, RefreshCcw, AlertOctagon, Bomb, Zap, Crown, Star, Coins } from 'lucide-react';
import { soundService } from '../services/soundService';

interface Props {
  isPremium?: boolean;
}

const MachineGenerator: React.FC<Props> = ({ isPremium = false }) => {
  const [loading, setLoading] = useState(false);
  const [machine, setMachine] = useState<WackyMachine | null>(null);
  const [theme, setTheme] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showCoins, setShowCoins] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const triggerGoldRush = () => {
    setShowCoins(true);
    setTimeout(() => setShowCoins(false), 2000);
  };

  const handleGenerate = async () => {
    soundService.playPop();

    if (!theme && !loading) {
       setError("PROMPT REQUIRED: Our pigs need at least one word to start building!");
       return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await generateWackyMachine(theme, isPremium);
      setMachine(result);
      
      const isRoyal = result.rarity === 'Royal Gold' || result.rarity === 'Legendary';
      
      if (isRoyal) {
        soundService.playSparkle();
        triggerGoldRush();
      } else {
        soundService.playSuccess();
      }
      
      if (result.hazardLevel === 'Literal Explosion' || result.hazardLevel === 'Extreme') {
        soundService.playImpact();
      }
    } catch (err: any) {
      console.error(err);
      setError("CONSTRUCTION MALFUNCTION: Try again!");
      soundService.playSqueak();
    } finally {
      setLoading(false);
    }
  };

  const isLiteralExplosion = machine?.hazardLevel === 'Literal Explosion';
  const isRoyal = machine?.rarity === 'Royal Gold' || machine?.rarity === 'Legendary';

  return (
    <div ref={containerRef} className={`rounded-[2rem] p-6 md:p-10 shadow-2xl relative overflow-hidden h-full flex flex-col justify-center min-h-[400px] transition-all duration-700 ${isPremium ? 'bg-amber-500 bg-[linear-gradient(45deg,#f59e0b,#fbbf24)]' : 'bg-blue-600'}`}>
      
      {/* Gold Rush Coins */}
      {showCoins && [...Array(30)].map((_, i) => (
        <div 
          key={i}
          className="coin-particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.5}s`,
            color: '#fef3c7'
          }}
        >
          <Coins size={Math.random() * 16 + 12} fill="#fbbf24" stroke="#d97706" />
        </div>
      ))}

      {isPremium && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <Star 
              key={i} 
              size={Math.random() * 20 + 10} 
              className="absolute text-yellow-200 opacity-20 animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6 md:mb-10">
          <div className="bg-white/20 p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-lg border border-white/10 backdrop-blur-md">
            {isPremium ? <Crown className="text-white" size={28} /> : <Hammer className="text-white" size={28} />}
          </div>
          <div>
            <h2 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase italic">
              {isPremium ? 'Royal Vault Forge' : 'Blueprint Forge'}
            </h2>
            <p className="text-xs md:text-base text-blue-100 opacity-80 font-medium">
              {isPremium ? 'Golden Standard Engineering' : 'Powered by Piggy-Mind AI'}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-8 md:mb-10">
          <input 
            type="text" 
            placeholder={isPremium ? "Command a Royal Gold invention..." : "Describe an invention..."}
            className={`flex-1 bg-white/10 border-2 rounded-2xl px-5 py-4 text-white focus:outline-none transition-all font-bold text-sm md:text-lg backdrop-blur-sm ${isPremium ? 'border-yellow-200 placeholder:text-yellow-100' : 'border-white/20 placeholder:text-blue-200'}`}
            value={theme}
            disabled={loading}
            onChange={(e) => {
              setTheme(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className={`font-black px-8 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 text-sm md:text-lg uppercase tracking-tight ${isPremium ? 'bg-white text-amber-600 hover:bg-yellow-50' : 'bg-yellow-400 text-yellow-900 hover:bg-yellow-300'}`}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (isPremium ? <Coins size={20} /> : <Sparkles size={20} />)}
            {loading ? 'Forging Gold...' : 'Generate'}
          </button>
        </div>

        {machine && !error && (
          <div className={`bg-white rounded-3xl p-6 md:p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-500 border relative overflow-hidden ${isLiteralExplosion ? 'animate-shake' : ''} ${isRoyal ? 'border-amber-400 ring-4 ring-amber-100' : 'border-white/20'}`}>
            
            {isRoyal && (
              <div className="absolute top-0 right-0 p-4">
                <Crown className="text-amber-500 animate-bounce" size={24} />
              </div>
            )}

            <div className={`flex flex-col md:flex-row gap-6 md:gap-10`}>
              <div className={`md:w-1/3 border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-inner transition-colors ${
                isRoyal ? 'bg-amber-50 border-amber-200' : isLiteralExplosion ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-slate-400 mb-1 font-mono text-[10px] uppercase tracking-[0.2em] font-black">Registry ID</div>
                <div className={`text-xl md:text-3xl font-black font-mono mb-4 ${isRoyal ? 'text-amber-600' : isLiteralExplosion ? 'text-red-600' : 'text-slate-800'}`}>
                  {machine.blueprintCode}
                </div>
                <div className={`px-5 py-2.5 rounded-xl font-black flex items-center gap-2 text-xs md:text-sm tracking-tight shadow-sm transition-all ${
                  isRoyal ? 'bg-amber-500 text-white' : isLiteralExplosion ? 'bg-red-600 text-white animate-pulse' : 'bg-orange-100 text-orange-700'
                }`}>
                  {isRoyal ? <Coins size={18} /> : isLiteralExplosion ? <Bomb size={18} /> : <TriangleAlert size={16} />}
                  {machine.rarity?.toUpperCase() || machine.hazardLevel.toUpperCase()}
                </div>
              </div>

              <div className="md:w-2/3 flex flex-col justify-center">
                <h3 className={`text-xl md:text-3xl font-black leading-tight tracking-tight uppercase italic flex items-center gap-3 ${isRoyal ? 'text-amber-700' : isLiteralExplosion ? 'text-red-700' : 'text-blue-900'}`}>
                  {machine.name}
                  {isRoyal && <Sparkles size={24} className="text-amber-400" />}
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed italic text-sm md:text-base font-medium">"{machine.description}"</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {machine.components.map((comp, idx) => (
                    <div key={idx} className={`flex items-center gap-3 text-[12px] md:text-[14px] font-black px-4 py-2.5 rounded-xl border transition-all ${
                      isRoyal ? 'text-amber-900 bg-amber-100/30 border-amber-100 hover:bg-amber-100' : 'text-slate-700 bg-slate-100/50 border-slate-100 hover:bg-blue-50'
                    }`}>
                      <ChevronRight size={16} className={isRoyal ? 'text-amber-500' : 'text-blue-500'} />
                      {comp}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MachineGenerator;
