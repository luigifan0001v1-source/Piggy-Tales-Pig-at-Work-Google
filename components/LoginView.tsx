
import React, { useState } from 'react';
import { Hammer, HardHat, ShieldCheck, User, ArrowRight, Loader2 } from 'lucide-react';
import { soundService } from '../services/soundService';

interface Props {
  onLogin: () => void;
}

const LoginView: React.FC<Props> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'foreman' | 'architect' | 'king' | null>(null);

  const handleRoleSelect = (role: 'foreman' | 'architect' | 'king') => {
    setSelectedRole(role);
    soundService.playPop();
  };

  const handleLogin = () => {
    if (!selectedRole) return;
    setIsLoading(true);
    soundService.playSuccess();
    // Simulate a themed authentication delay
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#2d7a31] flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
      
      <div className="max-w-md w-full animate-in zoom-in-95 fade-in duration-500 relative z-10">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border-b-[12px] border-r-[12px] border-black/10">
          
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mb-6 rotate-3 shadow-lg border-2 border-green-200">
               <ShieldCheck size={40} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2 italic">Employee Check-in</h1>
            <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Select your permit type</p>
          </div>

          <div className="space-y-4 mb-10">
            <RoleOption 
               id="king"
               icon={<User size={24} />} 
               title="Royal Boss" 
               desc="Access to all royal blueprints."
               active={selectedRole === 'king'}
               onClick={() => handleRoleSelect('king')}
            />
            <RoleOption 
               id="foreman"
               icon={<Hammer size={24} />} 
               title="Foreman" 
               desc="Manage worker efficiency."
               active={selectedRole === 'foreman'}
               onClick={() => handleRoleSelect('foreman')}
            />
            <RoleOption 
               id="architect"
               icon={<HardHat size={24} />} 
               title="Architect" 
               desc="Design wacky inventions."
               active={selectedRole === 'architect'}
               onClick={() => handleRoleSelect('architect')}
            />
          </div>

          <button 
            disabled={!selectedRole || isLoading}
            onClick={handleLogin}
            className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 ${
              selectedRole && !isLoading
                ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-100'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : 'PUNCH IN'}
            {!isLoading && <ArrowRight size={24} />}
          </button>

          <p className="text-center mt-6 text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">
            By punching in, you agree to mandatory lunch breaks.
          </p>
        </div>
      </div>

      {/* Visual Accent */}
      <div className="absolute top-10 left-10 rotate-12 opacity-20 pointer-events-none hidden md:block">
        <div className="text-9xl font-black text-white/50 tracking-tighter italic select-none">PIGGY</div>
      </div>
    </div>
  );
};

interface RoleProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  active: boolean;
  onClick: () => void;
}

const RoleOption: React.FC<RoleProps> = ({ icon, title, desc, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-4 transition-all text-left ${
      active 
        ? 'bg-green-50 border-green-500 scale-[1.02]' 
        : 'bg-slate-50 border-transparent hover:bg-slate-100'
    }`}
  >
    <div className={`p-3 rounded-xl transition-colors ${active ? 'bg-green-500 text-white' : 'bg-white text-slate-400'}`}>
      {icon}
    </div>
    <div className="flex-1">
      <h3 className={`font-black text-sm uppercase tracking-tight ${active ? 'text-green-900' : 'text-slate-700'}`}>{title}</h3>
      <p className={`text-[11px] font-bold ${active ? 'text-green-700/70' : 'text-slate-400'}`}>{desc}</p>
    </div>
    {active && (
       <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
       </div>
    )}
  </button>
);

export default LoginView;
