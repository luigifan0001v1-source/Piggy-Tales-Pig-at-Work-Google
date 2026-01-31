
import React, { useState, useEffect } from 'react';
import { AppTab, PigWorker } from './types';
import PigWorkerCard from './components/PigWorkerCard';
import MachineGenerator from './components/MachineGenerator';
import StatsOverview from './components/StatsOverview';
import IntroSplash from './components/IntroSplash';
import SettingsView from './components/SettingsView';
import LoginView from './components/LoginView';
import { LayoutDashboard, Hammer, FlaskConical, Utensils, Construction, Settings, LogOut, Bell, Search, PlayCircle, Star, Sparkles, Monitor, Scan, History, Radio, RefreshCw, Crown, Coins } from 'lucide-react';
import { soundService } from './services/soundService';

const INITIAL_WORKERS: PigWorker[] = [
  { id: '1', name: 'Corporal Pig', role: 'Season 2 Foreman', efficiency: 15, accidents: 42, status: 'Confused', avatar: 'https://picsum.photos/seed/pig1/200' },
  { id: '2', name: 'Minion Pig #42', role: 'Chief Architect', efficiency: 88, accidents: 2, status: 'Working', avatar: 'https://picsum.photos/seed/pig2/200' },
  { id: '3', name: 'Chef Pig', role: 'Snack Manager', efficiency: 5, accidents: 12, status: 'Snacking', avatar: 'https://picsum.photos/seed/pig3/200' },
  { id: '4', name: 'Sleepy Pig', role: 'Safety Inspector', efficiency: 0, accidents: 0, status: 'Sleeping', avatar: 'https://picsum.photos/seed/pig4/200' },
];

const SEASON_2_EPISODES = [
  { id: 'DwEsxJ_ZrPo', title: 'The Gold', desc: 'Episode 4: King Pig\'s obsession with shiny wealth leads to mechanical greed.', thumbnail: 'https://img.youtube.com/vi/DwEsxJ_ZrPo/mqdefault.jpg' },
  { id: 'PdaYnCAWkqU', title: 'The Driller', desc: 'Episode 21: High-speed excavation via over-engineered mechanics.', thumbnail: 'https://img.youtube.com/vi/PdaYnCAWkqU/mqdefault.jpg' },
  { id: 'hA-FodRX3OE', title: 'Pigs at Work: Collection', desc: 'The definitive Season 2 workshop archive compilation.', thumbnail: 'https://img.youtube.com/vi/hA-FodRX3OE/mqdefault.jpg' },
  { id: 'hK-e-mK_U3c', title: 'The Plane', desc: 'Episode 1: Mastering flight with wooden planks and hope.', thumbnail: 'https://img.youtube.com/vi/hK-e-mK_U3c/mqdefault.jpg' },
  { id: 'Jz_x0-zUvSw', title: 'The Bath', desc: 'Automated sanitation systems for the modern pig.', thumbnail: 'https://img.youtube.com/vi/Jz_x0-zUvSw/mqdefault.jpg' },
  { id: '5Ew-G6X8y1Q', title: 'The Picnic', desc: 'Episode 10: Precision condiment delivery systems.', thumbnail: 'https://img.youtube.com/vi/5Ew-G6X8y1Q/mqdefault.jpg' },
];

const PLAYLIST_ID = 'PLTR8zrKWyBqiZVEewfy4ax0RulJUN9JQf';

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.WORKSHOP);
  const [workers, setWorkers] = useState<PigWorker[]>(INITIAL_WORKERS);
  const [selectedEpId, setSelectedEpId] = useState(SEASON_2_EPISODES[0].id);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [antennaSignal, setAntennaSignal] = useState(100);
  const [isFlickering, setIsFlickering] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab(AppTab.WORKSHOP);
    setIsPremium(false);
  };

  const handleSnackBreak = (workerId: string) => {
    setWorkers(prev => prev.map(w => {
      if (w.id === workerId) {
        return { 
          ...w, 
          status: 'Snacking', 
          efficiency: Math.max(0, w.efficiency - 10) 
        };
      }
      return w;
    }));

    setTimeout(() => {
      setWorkers(prev => prev.map(w => {
        if (w.id === workerId) {
          return { 
            ...w, 
            status: 'Working', 
            efficiency: Math.min(100, w.efficiency + 10) 
          };
        }
        return w;
      }));
    }, 5000);
  };

  const handleAnalyzeArchive = () => {
    setIsAnalyzing(true);
    if (isPremium) {
      soundService.playSparkle();
    } else {
      soundService.playPop();
    }
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setActiveTab(AppTab.WORKSHOP);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, isPremium ? 1200 : 2500);
  };

  const handleRecalibrate = () => {
    setIsFlickering(true);
    soundService.playImpact();
    setAntennaSignal(0);
    setTimeout(() => {
      setAntennaSignal(100);
      setIsFlickering(false);
      soundService.playSuccess();
    }, 1000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.WORKSHOP:
        return (
          <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
              <div className="lg:col-span-8">
                <MachineGenerator isPremium={isPremium} />
              </div>
              <div className="hidden lg:block lg:col-span-4">
                <StatsOverview />
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Active Workforce</h2>
                  <p className="text-xs md:text-sm text-slate-400 font-medium tracking-tight">Managing {workers.length} Season 2 employees.</p>
                </div>
                <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${isPremium ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                   {isPremium ? 'Royal Gold Workshop' : 'Workshop Active'}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
                {workers.map(worker => (
                  <PigWorkerCard 
                    key={worker.id} 
                    worker={worker} 
                    onSnackBreak={() => handleSnackBreak(worker.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      case AppTab.LABORATORY:
        const currentEp = SEASON_2_EPISODES.find(e => e.id === selectedEpId) || SEASON_2_EPISODES[0];
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const videoUrl = `https://www.youtube.com/embed/${selectedEpId}?enablejsapi=1&origin=${encodeURIComponent(origin)}&rel=0&list=${PLAYLIST_ID}`;

        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-12">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <div className={`rounded-[2.5rem] p-4 md:p-8 shadow-2xl relative overflow-hidden group transition-all duration-300 ${isPremium ? 'bg-amber-600' : 'bg-slate-900'} ${isFlickering ? 'animate-shake' : ''}`}>
                  <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
                  
                  <div className={`relative aspect-video rounded-[1.5rem] overflow-hidden border-8 shadow-inner crt-overlay bg-black ${isPremium ? 'border-amber-400 ring-4 ring-amber-300 ring-opacity-30' : 'border-slate-800'}`}>
                    {antennaSignal < 50 ? (
                      <div className="absolute inset-0 z-40 bg-slate-800 flex items-center justify-center">
                        <div className="text-white font-black text-xl animate-pulse uppercase">Syncing Royal Feed...</div>
                      </div>
                    ) : (
                      <>
                        {isAnalyzing && (
                          <div className={`absolute inset-0 z-30 backdrop-blur-[2px] flex flex-col items-center justify-center blueprint-scan animate-flicker pointer-events-none ${isPremium ? 'bg-amber-500/30' : 'bg-blue-500/20'}`}>
                            {isPremium ? <Coins size={80} className="text-white mb-4 animate-bounce" /> : <Scan size={80} className="text-white mb-4 animate-pulse" />}
                            <span className="text-white font-black text-2xl tracking-[0.5em] uppercase italic text-center px-6">
                              {isPremium ? 'Extracting Gold Blueprints...' : 'Analysing S2 Tech...'}
                            </span>
                          </div>
                        )}
                        <iframe 
                          key={`${selectedEpId}-${antennaSignal}`}
                          className="w-full h-full"
                          src={videoUrl}
                          title="Pigs at Work Archive Player" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                          allowFullScreen
                        ></iframe>
                      </>
                    )}
                  </div>

                  <div className="mt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <Monitor size={16} className={isPremium ? 'text-yellow-200' : 'text-blue-400'} />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${isPremium ? 'text-yellow-200' : 'text-blue-400'}`}>
                            {isPremium ? 'Royal Treasury Feed' : 'S2 Archive Stream'}
                          </span>
                        </div>
                        <div className="h-4 w-px bg-white/20"></div>
                        <button onClick={handleRecalibrate} className="flex items-center gap-2 text-[10px] font-black text-white/50 hover:text-white transition-colors uppercase tracking-widest">
                          <RefreshCw size={14} className={isFlickering ? 'animate-spin' : ''} />
                          Repair Link
                        </button>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black text-white italic tracking-tight uppercase leading-tight">{currentEp.title}</h3>
                      <p className="text-white/60 font-medium text-sm md:text-base mt-1 italic">"{currentEp.desc}"</p>
                    </div>
                    <button 
                      onClick={handleAnalyzeArchive}
                      disabled={isAnalyzing || antennaSignal < 100}
                      className={`group font-black px-10 py-5 rounded-2xl flex items-center gap-4 transition-all shadow-xl active:scale-95 whitespace-nowrap ${isPremium ? 'bg-white text-amber-600 hover:bg-yellow-50 shadow-amber-900/40' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40'}`}
                    >
                      {isAnalyzing ? <Loader2 className="animate-spin" /> : (isPremium ? <Coins className="group-hover:rotate-12 transition-transform" /> : <FlaskConical className="group-hover:rotate-12 transition-transform" />)}
                      {isPremium ? 'COIN ANALYSIS' : 'SCAN ARCHIVE'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                    <History className="text-slate-400" size={20} />
                    <h4 className="font-black text-slate-800 uppercase tracking-tight italic">Registry: The Gold</h4>
                  </div>
                  <div className="space-y-4 custom-scrollbar overflow-y-auto max-h-[500px] xl:max-h-none pr-2 flex-1">
                    {SEASON_2_EPISODES.map(ep => (
                      <button key={ep.id} onClick={() => { setSelectedEpId(ep.id); soundService.playPop(); }} className={`w-full text-left p-3 rounded-2xl border-2 transition-all flex gap-4 group ${selectedEpId === ep.id ? 'bg-amber-50 border-amber-200 shadow-md translate-x-1' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`}>
                        <div className="w-24 shrink-0 aspect-video rounded-lg overflow-hidden relative shadow-sm bg-slate-200">
                           <img src={ep.thumbnail} alt={ep.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 py-1">
                          <h5 className={`text-[11px] font-black uppercase mb-1 leading-tight ${selectedEpId === ep.id ? 'text-amber-600' : 'text-slate-700'}`}>{ep.title}</h5>
                          <p className="text-[10px] font-medium text-slate-400 line-clamp-2 italic leading-tight">{ep.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case AppTab.SETTINGS:
        return <SettingsView isPremium={isPremium} onTogglePremium={() => setIsPremium(!isPremium)} />;
      default:
        return <div className="flex items-center justify-center min-h-[50vh] text-slate-400"><p className="text-xl font-bold">Workshop Loading...</p></div>;
    }
  };

  if (showIntro) return <IntroSplash onComplete={handleIntroComplete} />;
  if (!isLoggedIn) return <LoginView onLogin={handleLogin} />;

  return (
    <div className="min-h-screen flex bg-[#f8fafc] flex-col md:flex-row animate-in fade-in duration-700 overflow-hidden">
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-100 flex-col shrink-0 z-50">
        <div className="p-6 flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg cursor-pointer transition-transform hover:scale-105 ${isPremium ? 'royal-gradient' : 'pig-gradient'}`} onClick={() => setActiveTab(AppTab.WORKSHOP)}>
              {isPremium ? <Crown size={22} className="text-white" /> : <Hammer className="text-white" size={22} />}
            </div>
            <div className="flex flex-col -space-y-1.5">
              <span className={`text-2xl font-black italic tracking-tighter ${isPremium ? 'text-amber-500' : 'text-green-500'}`}>PIGGY</span>
              <span className={`text-lg tales-logo-text self-end scale-90 translate-x-1 ${isPremium ? 'text-amber-600' : 'text-green-600'}`}>tales</span>
            </div>
          </div>
          <div className="mt-4 px-2">
            <div className={`${isPremium ? 'bg-amber-600' : 'bg-red-600'} text-white text-[10px] font-black py-1 px-3 rounded-full flex items-center justify-center gap-2 shadow-sm border border-black/10 uppercase tracking-[0.1em]`}>
              {isPremium ? <Coins size={10} fill="currentColor" /> : <Star size={10} fill="currentColor" />}
              {isPremium ? 'ROYAL TREASURY' : 'YouTube Season 2'}
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Workshop" active={activeTab === AppTab.WORKSHOP} onClick={() => setActiveTab(AppTab.WORKSHOP)} />
          <SidebarItem icon={<Construction size={20} />} label="Blueprints" active={activeTab === AppTab.BLUEPRINTS} onClick={() => setActiveTab(AppTab.BLUEPRINTS)} />
          <SidebarItem icon={<FlaskConical size={20} />} label="Laboratory" active={activeTab === AppTab.LABORATORY} onClick={() => setActiveTab(AppTab.LABORATORY)} />
          <SidebarItem icon={<Utensils size={20} />} label="Cafeteria" active={activeTab === AppTab.CAFETERIA} onClick={() => setActiveTab(AppTab.CAFETERIA)} />
        </nav>

        <div className="p-4 space-y-1 border-t border-slate-50">
          <SidebarItem icon={<Settings size={18} />} label="Config" active={activeTab === AppTab.SETTINGS} onClick={() => setActiveTab(AppTab.SETTINGS)} />
          <SidebarItem icon={<LogOut size={18} />} label="Log Out" color="text-red-400" onClick={handleLogout} />
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 md:h-20 bg-white/90 backdrop-blur-md border-b border-slate-100 px-5 md:px-10 flex items-center justify-between shrink-0 z-40">
          <div className="flex items-center gap-3 md:hidden">
             <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md ${isPremium ? 'royal-gradient' : 'pig-gradient'}`}>
                {isPremium ? <Crown className="text-white" size={18} /> : <Hammer className="text-white" size={18} />}
             </div>
             <span className={`text-xl font-black italic tracking-tighter ${isPremium ? 'text-amber-500' : 'text-green-500'}`}>PIGGY S2</span>
          </div>

          <div className="hidden md:flex items-center gap-4 bg-slate-100/50 px-5 py-2.5 rounded-2xl w-full max-w-md">
            <Search size={18} className="text-slate-400" />
            <input type="text" placeholder="Search archives..." className="bg-transparent border-none focus:outline-none text-sm font-semibold w-full" />
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-800 leading-none">King Pig</p>
                <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${isPremium ? 'text-amber-500' : 'text-green-600'}`}>
                  {isPremium ? 'PREMIUM GOLD BOSS' : 'Royal S2 Boss'}
                </p>
              </div>
              <div className="relative">
                <img src="https://picsum.photos/seed/king/100" alt="Profile" className={`w-9 h-9 md:w-11 md:h-11 rounded-xl border-2 shadow-sm object-cover transition-colors ${isPremium ? 'border-amber-400' : 'border-green-100'}`} />
                {isPremium && <Coins size={14} className="absolute -top-1.5 -right-1.5 text-amber-500 drop-shadow-sm" fill="currentColor" />}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 md:p-10 pb-28 md:pb-12 custom-scrollbar">
          <div className="max-w-7xl mx-auto w-full">
            <div className="mb-8 md:mb-12">
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter capitalize flex items-center gap-4">
                {activeTab === AppTab.WORKSHOP ? 'Invention Central' : activeTab === AppTab.LABORATORY ? 'Royal Archive' : activeTab}
                {isPremium && <Coins className="text-amber-500 animate-bounce" size={32} />}
              </h1>
              <p className="text-sm md:text-lg text-slate-400 font-semibold italic mt-1">
                {isPremium ? '"Gold Fever is in full effect. Proceed with luxury."' : '"Syncing with the royal Pigs at Work footage."'}
              </p>
            </div>
            {renderContent()}
          </div>
        </main>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 flex justify-around items-center h-20 px-4 z-50 shadow-lg">
          <MobileNavItem icon={<LayoutDashboard size={22} />} label="Work" active={activeTab === AppTab.WORKSHOP} onClick={() => setActiveTab(AppTab.WORKSHOP)} />
          <MobileNavItem icon={<FlaskConical size={22} />} label="Archives" active={activeTab === AppTab.LABORATORY} onClick={() => setActiveTab(AppTab.LABORATORY)} />
          <MobileNavItem icon={<Settings size={22} />} label="Config" active={activeTab === AppTab.SETTINGS} onClick={() => setActiveTab(AppTab.SETTINGS)} />
        </nav>
      </div>
    </div>
  );
};

const SidebarItem: React.FC<{ icon: React.ReactNode, label: string, active?: boolean, color?: string, onClick?: () => void }> = ({ icon, label, active, color = 'text-slate-500', onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${active ? 'bg-green-600 text-white shadow-xl scale-[1.02]' : `hover:bg-slate-50 ${color}`}`}>
    <span className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-green-500'}`}>{icon}</span>
    <span className="font-black text-sm tracking-tight uppercase">{label}</span>
  </button>
);

const MobileNavItem: React.FC<{ icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center w-full h-full gap-1.5 transition-all ${active ? 'text-green-600 scale-110' : 'text-slate-400'}`}>
    <div className={`p-2 rounded-xl transition-all ${active ? 'bg-green-50 text-green-600' : ''}`}>{icon}</div>
    <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
  </button>
);

const Loader2: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={`animate-spin h-5 w-5 ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default App;
