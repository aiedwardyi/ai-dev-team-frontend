import React, { useMemo, useState } from 'react';
import { CodeResponse } from '../types';
import { 
  BarChart, Users, Activity, Globe, Lock, RotateCw, Layout as LayoutIcon, 
  ChevronLeft, ChevronRight, Plus, Monitor, Smartphone, Rocket,
  ShieldCheck, Cpu, HardDrive, LayoutTemplate, MoreVertical, Menu
} from 'lucide-react';

interface LivePreviewProps {
  code: CodeResponse | null;
}

const LivePreview: React.FC<LivePreviewProps> = ({ code }) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  const previewData = useMemo(() => {
    if (!code) return null;
    return { title: "sdf" }; 
  }, [code]);

  if (!code || !previewData) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-600 p-12 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/5 border-dashed">
        <LayoutIcon className="w-16 h-16 mb-4 opacity-20" />
        <p className="font-bold tracking-wide text-slate-400">Preview awaits generation...</p>
      </div>
    );
  }

  const modules = [
    { id: 1, title: 'User authentication & authorization', desc: 'Secure and scalable.', icon: Lock, iconColor: 'text-amber-500' },
    { id: 2, title: 'Real-time data synchronization', desc: 'Instant updates.', icon: Activity, iconColor: 'text-blue-400' },
    { id: 3, title: 'RESTful API endpoints', desc: 'Robust connectivity.', icon: Globe, iconColor: 'text-slate-400' },
    { id: 4, title: 'Responsive dashboard UI', desc: 'Clean aesthetics.', icon: LayoutTemplate, iconColor: 'text-purple-400' },
  ];

  const stats = [
    { label: 'Active Users', value: '2.4k' },
    { label: 'Uptime', value: '99.9%' },
    { label: 'Avg Latency', value: '42ms' },
    { label: 'Modules', value: '4' },
  ];

  const isMobile = viewMode === 'mobile';

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-[#0b0e14] rounded-2xl overflow-hidden shadow-inner">
      {/* Browser/Preview Header */}
      <div className="h-14 border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-4 bg-white dark:bg-[#080a0f] z-20 transition-colors">
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex gap-1.5 mr-4">
            <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-white/5"></div>
            <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-white/5"></div>
            <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-white/5"></div>
          </div>
          <div className="flex items-center bg-slate-100 dark:bg-[#151b28] border border-slate-200 dark:border-white/5 px-3 py-1.5 rounded-lg gap-2 min-w-[120px] md:min-w-[300px] transition-colors">
            <Lock size={10} className="text-slate-400 dark:text-slate-500" />
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-tight truncate max-w-[100px] md:max-w-none font-bold">sdf.ai-dev-team.app</span>
          </div>
          <button className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors">
            <RotateCw size={14} />
          </button>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/5">
          <button 
            onClick={() => setViewMode('desktop')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'desktop' ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-400 hover:text-indigo-400'}`}
          >
            <Monitor size={16} />
          </button>
          <button 
            onClick={() => setViewMode('mobile')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'mobile' ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-400 hover:text-indigo-400'}`}
          >
            <Smartphone size={16} />
          </button>
        </div>
      </div>

      {/* Viewport Container */}
      <div className="flex-1 overflow-auto bg-slate-100 dark:bg-[#0b0e14] flex justify-center p-4 md:p-8 custom-scrollbar relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none"></div>

        <div className={`transition-all duration-500 ease-in-out shadow-2xl relative bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/5 overflow-hidden ${
          isMobile ? 'w-[375px] h-[812px] rounded-[3rem] border-[12px] border-white dark:border-[#151b28]' : 'w-full max-w-5xl rounded-2xl'
        }`}>
          {/* Inner Web Application */}
          <div className="h-full flex flex-col text-slate-900 dark:text-slate-200 font-sans overflow-y-auto custom-scrollbar bg-white dark:bg-[#0b0e14]">
            
            {/* Nav Header */}
            <nav className={`flex items-center justify-between sticky top-0 bg-white/90 dark:bg-[#0b0e14]/90 backdrop-blur-md z-30 ${isMobile ? 'px-6 py-4' : 'px-8 py-6'}`}>
              <div className="text-xl font-black tracking-tighter text-indigo-600 dark:text-indigo-500 flex items-center gap-1">
                sdf
              </div>
              
              {!isMobile && (
                <div className="hidden md:flex items-center gap-6 text-[9px] uppercase tracking-[0.2em] font-black text-slate-400 dark:text-slate-500">
                  <span className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-default">Auth</span>
                  <span className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-default">Real-time</span>
                  <span className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-default">API</span>
                  <span className="text-indigo-600 dark:text-indigo-500 cursor-default">Dashboard</span>
                </div>
              )}

              <div className="flex items-center gap-4">
                {isMobile ? (
                  <Menu size={20} className="text-slate-400" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center border-2 border-white dark:border-[#0b0e14] shadow-lg">
                    <Users size={14} className="text-white" />
                  </div>
                )}
              </div>
            </nav>

            {/* Hero Section */}
            <section className={`text-center mx-auto space-y-6 flex flex-col items-center ${isMobile ? 'px-6 pt-12 pb-8' : 'px-8 pt-20 pb-16 max-w-2xl'}`}>
              <h2 className={`font-black text-slate-900 dark:text-white tracking-tighter ${isMobile ? 'text-4xl' : 'text-5xl md:text-6xl'}`}>
                sdf <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500">Platform</span>
              </h2>
              <p className={`text-slate-500 dark:text-slate-500 font-bold leading-relaxed ${isMobile ? 'text-xs px-4' : 'text-sm md:text-base'}`}>
                AI-generated full-stack application with 4 integrated modules, built by AgentForge's multi-agent pipeline.
              </p>
              <div className="pt-4 w-full">
                <button className={`bg-gradient-to-br from-indigo-600 to-purple-600 hover:brightness-110 text-white rounded-2xl font-bold flex items-center justify-center gap-3 mx-auto shadow-xl shadow-indigo-500/20 transition-all active:scale-95 group ${isMobile ? 'w-full py-4 text-sm' : 'px-8 py-3.5'}`}>
                  <Rocket size={18} className="group-hover:-translate-y-1 transition-transform" />
                  Launch Dashboard
                </button>
              </div>
            </section>

            {/* Stats Grid */}
            <section className={`grid gap-4 max-w-5xl mx-auto w-full ${isMobile ? 'px-6 py-6 grid-cols-2' : 'px-8 py-10 grid-cols-2 lg:grid-cols-4'}`}>
              {stats.map((stat, i) => (
                <div key={i} className="bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 p-5 rounded-3xl flex flex-col items-center justify-center gap-1 group hover:border-indigo-500/30 transition-all">
                  <div className={`font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ${isMobile ? 'text-xl' : 'text-2xl'}`}>{stat.value}</div>
                  <div className="text-[9px] uppercase tracking-widest font-black text-slate-400 dark:text-slate-600 text-center">{stat.label}</div>
                </div>
              ))}
            </section>

            {/* Active Modules Section */}
            <section className={`max-w-5xl mx-auto w-full space-y-6 ${isMobile ? 'px-6 py-8' : 'px-8 py-16'}`}>
              <h3 className="text-[9px] uppercase tracking-[0.4em] font-black text-slate-300 dark:text-slate-700">Active Modules</h3>
              
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                {modules.map((mod) => (
                  <div key={mod.id} className="bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-3xl p-6 space-y-4 hover:bg-white dark:hover:bg-white/[0.04] transition-all group relative overflow-hidden shadow-sm hover:shadow-md">
                    <div className="absolute top-0 right-0 p-4">
                      <MoreVertical size={14} className="text-slate-300 dark:text-slate-800" />
                    </div>
                    
                    <div className="flex flex-col gap-4">
                      <div className={`w-10 h-10 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center shadow-sm ${mod.iconColor}`}>
                        <mod.icon size={20} />
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">
                          {mod.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-500 font-bold">
                          {mod.desc}
                        </p>
                      </div>

                      <div className="pt-2">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                          Online
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Footer */}
            <footer className={`mt-auto border-t border-slate-100 dark:border-white/5 ${isMobile ? 'px-6 py-10' : 'px-8 py-12'}`}>
              <div className={`flex flex-col items-center justify-between gap-6 text-[9px] font-black text-slate-400 dark:text-slate-700 uppercase tracking-widest ${!isMobile && 'md:flex-row'}`}>
                <div>© 2025 ai-dev-team Ecosystem</div>
                <div className="flex gap-6">
                  <span className="hover:text-indigo-600 dark:hover:text-indigo-500 transition-colors cursor-default">Security</span>
                  <span className="hover:text-indigo-600 dark:hover:text-indigo-500 transition-colors cursor-default">Terms</span>
                  <span className="hover:text-indigo-600 dark:hover:text-indigo-500 transition-colors cursor-default">Privacy</span>
                </div>
              </div>
            </footer>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePreview;