
import React from 'react';
import { PigWorker } from '../types';
import { HardHat, Coffee, AlertTriangle, Moon, Utensils } from 'lucide-react';
import { soundService } from '../services/soundService';

interface Props {
  worker: PigWorker;
  onSnackBreak: () => void;
}

const PigWorkerCard: React.FC<Props> = ({ worker, onSnackBreak }) => {
  const isSnacking = worker.status === 'Snacking';

  const handleSnack = () => {
    soundService.playMunch();
    onSnackBreak();
  };

  const getStatusIcon = () => {
    switch (worker.status) {
      case 'Working': return <HardHat className="text-yellow-400" size={18} />;
      case 'Snacking': return (
        <div className="relative">
          <Coffee className="text-blue-400" size={18} />
          {isSnacking && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none">
              <div className="w-1 h-3 bg-blue-200/40 rounded-full animate-steam" style={{ animationDelay: '0s' }}></div>
              <div className="w-1 h-4 bg-blue-200/40 rounded-full animate-steam" style={{ animationDelay: '0.4s' }}></div>
              <div className="w-1 h-3 bg-blue-200/40 rounded-full animate-steam" style={{ animationDelay: '0.8s' }}></div>
            </div>
          )}
        </div>
      );
      case 'Confused': return <AlertTriangle className="text-orange-400" size={18} />;
      case 'Sleeping': return <Moon className="text-purple-400" size={18} />;
      default: return null;
    }
  };

  const getStatusColor = () => {
    switch (worker.status) {
      case 'Working': return 'bg-green-100 text-green-700 border-green-200';
      case 'Snacking': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Confused': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Sleeping': return 'bg-purple-100 text-purple-700 border-purple-200';
    }
  };

  return (
    <div className="group perspective-1000 h-[340px] w-full">
      <div className={`relative h-full w-full transition-all duration-500 preserve-3d group-hover:[transform:rotateY(8deg)_translateY(-4px)]`}>
        <div className="absolute inset-0 bg-white rounded-[1.5rem] shadow-xl p-6 border-b-4 border-r-4 border-slate-100 flex flex-col items-center justify-between group-hover:border-green-200 transition-colors">
          <div className="relative">
            {/* Crumbs Particles */}
            {isSnacking && (
              <div className="absolute inset-0 z-20 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-amber-700 rounded-sm crumb"
                    style={{
                      left: '50%',
                      top: '70%',
                      '--cx': `${(Math.random() - 0.5) * 100}px`,
                      '--cy': `${(Math.random() - 0.5) * 100}px`,
                      animationDelay: `${i * 0.1}s`,
                    } as any}
                  />
                ))}
              </div>
            )}
            
            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full pig-gradient flex items-center justify-center p-1 shadow-xl relative z-10 ${isSnacking ? 'animate-chew' : ''}`}>
               <img 
                src={worker.avatar} 
                alt={worker.name}
                className="w-full h-full rounded-full object-cover border-2 border-white/30"
              />
            </div>
            
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-2 shadow-lg border border-slate-50 z-20">
              {getStatusIcon()}
            </div>
          </div>

          <div className="text-center mt-3">
            <h3 className="text-lg md:text-xl font-black text-slate-800 tracking-tight">{worker.name}</h3>
            <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mt-0.5">{worker.role}</p>
          </div>

          <div className={`mt-2 px-4 py-1 rounded-xl text-[10px] font-black tracking-wider border shadow-sm ${getStatusColor()}`}>
            {worker.status.toUpperCase()}
          </div>

          <div className="w-full mt-4 grid grid-cols-2 gap-3">
            <div className={`bg-slate-50/80 rounded-xl p-2.5 text-center border border-slate-100 transition-all ${isSnacking ? 'scale-95 opacity-60' : ''}`}>
              <span className="block text-[9px] text-slate-400 font-black uppercase tracking-tighter">Efficiency</span>
              <span className="text-sm font-black text-slate-700">{worker.efficiency}%</span>
            </div>
            <div className="bg-slate-50/80 rounded-xl p-2.5 text-center border border-slate-100">
              <span className="block text-[9px] text-slate-400 font-black uppercase tracking-tighter">Accidents</span>
              <span className="text-sm font-black text-red-500">{worker.accidents}</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="w-full mt-4">
            <button 
              onClick={handleSnack}
              disabled={isSnacking}
              className={`w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md active:shadow-none active:translate-y-0.5 ${
                isSnacking 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-green-500 text-white hover:bg-green-600 shadow-[0_4px_0_rgb(21,128,61)]'
              }`}
            >
              <Utensils size={14} />
              {isSnacking ? 'Eating...' : 'Take Snack Break'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PigWorkerCard;
