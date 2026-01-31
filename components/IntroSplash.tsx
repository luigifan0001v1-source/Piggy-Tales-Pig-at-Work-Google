
import React, { useEffect, useState, useRef } from 'react';
import { Hammer, Play, HardHat, Wrench, AlertTriangle, Drill, Paintbrush, Scissors, Construction, Star } from 'lucide-react';
import { soundService } from '../services/soundService';

interface Props {
  onComplete: () => void;
}

type IntroStyle = 'industrial_pipes' | 'wooden_chains' | 'caution_tape' | 'stop_sign' | 'blueprints_tape';

const ALL_STYLES: IntroStyle[] = ['industrial_pipes', 'wooden_chains', 'caution_tape', 'stop_sign', 'blueprints_tape'];
const ONOMATOPOEIA = ['THWACK!', 'BANG!', 'ZIP!', 'SLAM!', 'POW!', 'CRUNCH!', 'WHAM!'];

const IntroSplash: React.FC<Props> = ({ onComplete }) => {
  const [style, setStyle] = useState<IntroStyle>('industrial_pipes');
  const [phase, setPhase] = useState<'logo' | 'impact' | 'ready'>('logo');
  const [isImpacted, setIsImpacted] = useState(false);
  const [impactText, setImpactText] = useState('');
  const [montageCount, setMontageCount] = useState(0);
  const [showLogo, setShowLogo] = useState(false);

  // Use refs to track values for the animation sequence to avoid stale closures
  const montageRef = useRef(0);
  
  // Lift isVisible to component scope so it's accessible in both the helper and the return block.
  const isVisible = phase === 'impact' || phase === 'ready';

  useEffect(() => {
    soundService.playIntroMusic();
    
    // Step 1: Show the logo first
    const logoTimer = setTimeout(() => setShowLogo(true), 100);

    // Step 2: Start the slamming montage
    const startMontage = async () => {
      // Small delay for initial build up
      await new Promise(resolve => setTimeout(resolve, 800));

      const runSlam = async (isLast: boolean) => {
        const nextStyle = ALL_STYLES[Math.floor(Math.random() * ALL_STYLES.length)];
        const nextText = ONOMATOPOEIA[Math.floor(Math.random() * ONOMATOPOEIA.length)];
        
        setStyle(nextStyle);
        setImpactText(nextText);
        setPhase('impact');
        setIsImpacted(true);
        soundService.playImpact();

        // Screen shake duration
        await new Promise(resolve => setTimeout(resolve, 400));
        setIsImpacted(false);

        if (!isLast) {
          // Time between slams
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      };

      // Run 3 rapid slams
      await runSlam(false);
      await runSlam(false);
      await runSlam(true);

      setPhase('ready');
    };

    startMontage();

    return () => {
      clearTimeout(logoTimer);
      soundService.stopIntroMusic();
    };
  }, []);

  const handleStart = () => {
    soundService.playPop();
    soundService.stopIntroMusic();
    onComplete();
  };

  const renderSign = () => {
    // isVisible is now accessed from the component scope.
    switch (style) {
      case 'industrial_pipes':
        return (
          <div className={`relative transition-all duration-150 transform ${isVisible ? 'scale-100 opacity-100 rotate-0' : 'scale-150 opacity-0 rotate-12'}`}>
            <div className="bg-slate-300 border-[8px] border-slate-500 px-8 md:px-16 py-6 md:py-8 shadow-2xl relative rounded-sm group overflow-hidden">
               <div className="flex items-center gap-4 relative z-10">
                 <h2 className="text-3xl md:text-6xl font-black text-slate-800 tracking-tighter uppercase font-sans whitespace-nowrap">PIGS AT WORK</h2>
               </div>
               <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-0.5 rounded rotate-12 shadow-sm border border-yellow-600">SEASON 2</div>
               <div className="absolute top-3 left-3 w-4 h-4 bg-slate-500 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"></div>
               <div className="absolute bottom-3 left-3 w-4 h-4 bg-slate-500 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"></div>
               <div className="absolute bottom-3 right-3 w-4 h-4 bg-slate-500 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"></div>
            </div>
          </div>
        );
      case 'wooden_chains':
        return (
          <div className={`relative transition-all duration-150 transform ${isVisible ? 'translate-y-0 opacity-100 rotate-1' : '-translate-y-full opacity-0 -rotate-12'}`}>
            <div className="wood-texture border-[6px] border-amber-950 px-8 md:px-16 py-6 md:py-10 shadow-2xl relative rounded-lg drop-shadow-[0_15px_15px_rgba(0,0,0,0.4)]">
               <h2 className="text-3xl md:text-6xl font-black text-yellow-100 tracking-tighter uppercase font-sans drop-shadow-[0_6px_0_rgba(0,0,0,0.6)] whitespace-nowrap italic">PIGS AT WORK</h2>
               <div className="absolute -top-4 -right-4 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full -rotate-12 shadow-lg border-2 border-white">S2</div>
            </div>
          </div>
        );
      case 'caution_tape':
        return (
          <div className={`relative transition-all duration-150 transform ${isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
            <div className="bg-yellow-400 border-[10px] border-yellow-600 p-2 shadow-2xl relative">
               <div className="absolute inset-0 opacity-20" 
                    style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000, #000 30px, transparent 30px, transparent 60px)' }}></div>
               <div className="bg-yellow-400 border-[6px] border-yellow-600 px-8 md:px-16 py-6 relative z-10">
                  <h2 className="text-3xl md:text-6xl font-black text-yellow-950 tracking-tighter uppercase font-sans whitespace-nowrap italic">PIGS AT WORK</h2>
                  <div className="text-center font-black text-yellow-900 text-xs tracking-[0.4em] mt-2 border-t border-yellow-600 pt-2">SEASON TWO</div>
               </div>
            </div>
          </div>
        );
      case 'stop_sign':
        return (
          <div className={`relative transition-all duration-150 transform ${isVisible ? 'scale-100 opacity-100 rotate-0' : 'scale-[2] opacity-0 -rotate-45'}`}>
            <div className="bg-red-600 border-[10px] border-white w-[300px] h-[300px] md:w-[450px] md:h-[450px] flex items-center justify-center shadow-2xl relative" style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}>
               <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase font-sans text-center leading-tight drop-shadow-lg">PIGS<br/>AT WORK</h2>
               <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white text-red-600 px-4 py-1 font-black text-xl rounded">S2</div>
            </div>
          </div>
        );
      case 'blueprints_tape':
        return (
          <div className={`relative transition-all duration-150 transform ${isVisible ? 'scale-100 opacity-100 rotate-2' : 'scale-0 opacity-0'}`}>
            <div className="bg-blue-600 border-[8px] border-blue-800 p-1 shadow-2xl">
               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
               <div className="px-10 md:px-20 py-8 md:py-12 border-2 border-white/30">
                 <h2 className="text-3xl md:text-6xl font-black text-white tracking-tighter uppercase font-sans whitespace-nowrap italic drop-shadow-md">PIGS AT WORK</h2>
                 <div className="text-right text-blue-200 font-black text-sm italic mt-2">v2.0 (YouTube Series)</div>
               </div>
            </div>
          </div>
        );
    }
  };

  const getDebrisColor = () => {
    switch(style) {
      case 'wooden_chains': return 'bg-amber-900';
      case 'stop_sign': return 'bg-red-500';
      case 'caution_tape': return 'bg-yellow-500';
      case 'industrial_pipes': return 'bg-slate-400';
      default: return 'bg-blue-400';
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] bg-[#2d7a31] flex flex-col items-center justify-center overflow-hidden px-6 transition-transform ${isImpacted ? 'animate-shake' : ''}`}>
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-10 left-10 -rotate-12"><Wrench size={300} /></div>
        <div className="absolute bottom-10 right-10 rotate-45"><Hammer size={350} /></div>
      </div>

      {/* VFX: Impact Flash Overlay */}
      {isImpacted && <div className="absolute inset-0 z-[110] impact-flash pointer-events-none" />}

      {/* VFX: Action Lines / Speed Lines */}
      {isImpacted && Array.from({ length: 8 }).map((_, i) => (
        <div 
          key={`line-${i}`}
          className="absolute z-[108] h-1 bg-white/40 animate-speed-line"
          style={{ 
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
            transformOrigin: 'left center'
          }}
        />
      ))}

      {/* VFX: Smoke Clouds */}
      {isImpacted && Array.from({ length: 4 }).map((_, i) => (
        <div 
          key={`smoke-${i}`}
          className="absolute z-[112] w-20 h-20 bg-white/20 rounded-full blur-xl animate-smoke"
          style={{ 
            left: `${40 + Math.random() * 20}%`,
            top: `${40 + Math.random() * 20}%`,
            animationDelay: `${i * 0.05}s`
          }}
        />
      ))}

      {/* Decorative Slamming Tool */}
      {phase === 'impact' && isImpacted && (
        <div className="absolute z-[105] animate-tool-slam">
          <Hammer size={180} className="text-yellow-400 drop-shadow-2xl fill-yellow-600" />
        </div>
      )}

      {/* Onomatopoeia Text */}
      {isImpacted && (
        <div className="absolute z-[120] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="text-white text-5xl md:text-9xl font-black italic tracking-tighter scale-150 animate-bounce drop-shadow-[0_15px_0_rgba(0,0,0,0.5)]">
            {impactText}
          </div>
        </div>
      )}

      {/* VFX: Material Debris */}
      {isImpacted && Array.from({ length: 20 }).map((_, i) => (
        <div 
          key={`debris-${i}`}
          className={`absolute z-[115] w-3 h-3 md:w-5 md:h-5 ${getDebrisColor()} debris-particle rounded-sm shadow-md border border-black/10`}
          style={{ 
            '--tx': `${(Math.random() - 0.5) * 800}px`,
            '--ty': `${(Math.random() - 0.5) * 800}px`,
            left: '50%',
            top: '50%'
          } as any}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center gap-12 text-center w-full max-sm:gap-8 max-w-sm md:max-w-none">
        
        {/* Logo Section */}
        <div className={`transition-all duration-1000 transform ${showLogo ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-20'} ${isImpacted ? 'scale-110' : ''} flex flex-col items-center select-none`}>
          {!isVisible && (
             <div className="absolute -top-32 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="text-white/20 text-6xl md:text-9xl font-black animate-pulse italic">AAAHHH!</span>
             </div>
          )}
          
          <div className="relative">
             <div className="flex flex-col items-center">
                <div className="text-7xl md:text-9xl font-black piggy-logo-text tracking-tighter leading-none italic flex">
                   PIGGY
                </div>
                <div className="text-5xl md:text-7xl tales-logo-text -mt-8 md:-mt-12 -mr-4 md:-mr-6 self-end z-10">
                  tales
                </div>
             </div>
             <div className="absolute -top-10 -left-10 md:-top-14 md:-left-14 transform -rotate-12 transition-transform hover:scale-110 active:rotate-12">
               <div className="bg-yellow-400 p-2 md:p-3 rounded-xl md:rounded-2xl border-4 md:border-6 border-yellow-600 shadow-2xl">
                 <HardHat className="text-yellow-900" size={40} />
               </div>
             </div>
             {/* YouTube Season 2 Subtitle */}
             <div className="bg-red-600 text-white font-black px-4 py-1 rounded-full text-lg mt-4 shadow-xl border-2 border-white animate-pulse">
                YouTube SEASON 2
             </div>
          </div>
        </div>

        {/* Dynamic Sign Section - The Center Stage */}
        <div className="min-h-[160px] md:min-h-[300px] flex items-center justify-center w-full relative">
          {renderSign()}
        </div>

        {/* Action Button */}
        <div className={`transition-all duration-500 transform ${phase === 'ready' ? 'scale-100 opacity-100' : 'scale-0 opacity-0 translate-y-10'} w-full`}>
          <button 
            onClick={handleStart}
            className="group relative bg-[#4ade80] hover:bg-[#34d399] text-green-950 font-black px-12 py-6 md:px-20 md:py-10 rounded-[40px] text-2xl md:text-5xl shadow-[0_15px_0_rgb(21,128,61)] active:shadow-none active:translate-y-[15px] transition-all flex items-center justify-center gap-6 border-4 border-white/20 w-full md:w-auto mx-auto"
          >
            <Play size={32} fill="currentColor" className="md:w-16 md:h-16 group-hover:scale-110 transition-transform" />
            START WORK
          </button>
          <div className="flex flex-col gap-2 mt-10">
             <p className="text-white/80 font-black animate-pulse text-sm md:text-2xl tracking-widest uppercase italic">"Pigs at Work Era"</p>
             <div className="flex justify-center gap-4 text-white/30">
               <Star size={24} className="fill-current" />
               <Drill size={24} />
               <Scissors size={24} />
               <Paintbrush size={24} />
               <Construction size={24} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroSplash;
