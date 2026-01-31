
import React, { useState, useEffect } from 'react';
import { ShieldAlert, Bell, Volume2, HardHat, Hammer, Trash2, Save, Sparkles, TriangleAlert, Settings as SettingsIcon, Crown, Star } from 'lucide-react';
import { soundService } from '../services/soundService';

interface Props {
  isPremium: boolean;
  onTogglePremium: () => void;
}

const SettingsView: React.FC<Props> = ({ isPremium, onTogglePremium }) => {
  const [safetyLevel, setSafetyLevel] = useState(20);
  const [notifications, setNotifications] = useState(true);
  const [volume, setVolume] = useState(80);
  const [audioEnabled, setAudioEnabled] = useState(true);

  useEffect(() => {
    soundService.setEnabled(audioEnabled);
  }, [audioEnabled]);

  const handleToggleAudio = () => {
    const newVal = !audioEnabled;
    setAudioEnabled(newVal);
    if (newVal) soundService.playPop();
  };

  const handlePremiumToggle = () => {
    if (!isPremium) {
      soundService.playSparkle();
    } else {
      soundService.playPop();
    }
    onTogglePremium();
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pb-4">
      
      {/* Premium Upgrade Banner */}
      <div className={`rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-2xl border-4 transition-all duration-500 relative overflow-hidden ${isPremium ? 'bg-amber-500 border-amber-600 text-white' : 'bg-slate-900 border-slate-800 text-white'}`}>
        <div className="absolute top-0 right-0 opacity-10 -rotate-12 translate-x-4 translate-y-4">
          <Crown size={150} />
        </div>
        
        <div className={`p-5 rounded-3xl shrink-0 ${isPremium ? 'bg-white text-amber-600 shadow-xl' : 'bg-amber-500 text-white animate-pulse'}`}>
          <Crown size={48} />
        </div>

        <div className="flex-1 text-center md:text-left relative z-10">
          <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter">
            {isPremium ? 'Royal Premium Active' : 'Upgrade to Royal Premium'}
          </h2>
          <p className={`font-medium text-sm md:text-base opacity-80 mt-1`}>
            {isPremium ? 'You have access to Gold Blueprints and Laboratory Overclocking.' : 'Unlock the King\'s private forge and exclusive Season 2 archives.'}
          </p>
        </div>

        <button 
          onClick={handlePremiumToggle}
          className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all active:scale-95 whitespace-nowrap relative z-10 ${isPremium ? 'bg-amber-700 text-white hover:bg-amber-800' : 'bg-amber-500 hover:bg-amber-400 text-white'}`}
        >
          {isPremium ? 'Downgrade' : 'Get Pass'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg border border-slate-100">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <ShieldAlert className="text-green-500" size={20} />
            <h3 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">Safety</h3>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-bold text-slate-500 uppercase">OSHA Compliance</label>
                <span className="text-xs font-black text-green-600">{safetyLevel}%</span>
              </div>
              <input 
                type="range" 
                value={safetyLevel}
                onChange={(e) => setSafetyLevel(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-green-500" 
              />
            </div>
            <div className="flex items-center justify-between p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100">
              <div className="flex flex-col pr-4">
                <span className="text-xs md:text-sm font-bold text-slate-700">Audio Feedback</span>
              </div>
              <button 
                onClick={handleToggleAudio}
                className={`w-12 md:w-14 h-7 md:h-8 rounded-full transition-colors relative shrink-0 ${audioEnabled ? 'bg-green-500' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-5 md:w-6 h-5 md:h-6 bg-white rounded-full shadow-md transition-transform ${audioEnabled ? 'translate-x-6 md:translate-x-7' : 'translate-x-1'}`}></div>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg border border-slate-100">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <Bell className="text-blue-500" size={20} />
            <h3 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">Alerts</h3>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100">
              <div className="flex flex-col pr-4">
                <span className="text-xs md:text-sm font-bold text-slate-700">Proclamations</span>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`w-12 md:w-14 h-7 md:h-8 rounded-full transition-colors relative shrink-0 ${notifications ? 'bg-blue-500' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-5 md:w-6 h-5 md:h-6 bg-white rounded-full shadow-md transition-transform ${notifications ? 'translate-x-6 md:translate-x-7' : 'translate-x-1'}`}></div>
              </button>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Volume2 size={16} className="text-slate-400" />
                <label className="text-xs font-bold text-slate-500 uppercase">Worker Volume</label>
              </div>
              <input 
                type="range" 
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-500" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button className="w-full md:w-auto flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 md:px-10 py-4 rounded-2xl font-black text-base md:text-lg transition-all shadow-xl shadow-green-100 active:scale-95">
          <Sparkles size={20} />
          SAVE CHANGES
        </button>
      </div>
    </div>
  );
};

export default SettingsView;
