import React, { useEffect, useState, useRef } from 'react';
import { backend } from '../services/orchestrator';
import { Project, Artifact, LogEntry } from '../types';
import ArtifactViewer from '../components/ArtifactViewer';
import StageStepper from '../components/StageStepper';
import LivePreview from '../components/LivePreview';
import { 
  Play, RefreshCw, Terminal, Download, Monitor, Code2, Send, 
  Sparkles, Activity, FileText, Layout, Share2, MoreHorizontal,
  ClipboardList, Milestone, BookOpen, Layers, Check, Bot, Globe, Smartphone, Palette
} from 'lucide-react';

interface ProjectDetailPageProps {
  projectId: string;
  onBack: () => void;
}

const AgentStatusMessage: React.FC<{ project: Project; name: string }> = ({ project, name }) => {
  const [textIndex, setTextIndex] = useState(0);
  const statuses = [
    "Analyzing requirements...",
    "Planning architecture...",
    "Generating components...",
    "Writing business logic...",
    "Assembling preview..."
  ];

  useEffect(() => {
    if (project.status === 'RUNNING') {
      const interval = setInterval(() => {
        setTextIndex((prev) => (prev + 1) % statuses.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [project.status]);

  if (project.status === 'RUNNING') {
    return (
      <div className="flex gap-2.5 items-start animate-fade-in mb-4">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shrink-0">
          <Bot size={16} />
        </div>
        <div className="bg-white dark:bg-[#121620] border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3 flex items-center gap-3 min-w-[200px] shadow-sm">
          <div className="w-4 h-4 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin shrink-0"></div>
          <span key={textIndex} className="text-[11px] text-slate-800 dark:text-indigo-100 font-bold animate-fade-in">
            {statuses[textIndex]}
          </span>
        </div>
      </div>
    );
  }

  if (project.status === 'COMPLETED') {
    return (
      <div className="flex gap-2.5 items-start animate-fade-in mb-4">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shrink-0">
          <Bot size={16} />
        </div>
        <div className="bg-white dark:bg-[#121620] border border-slate-200 dark:border-white/5 rounded-2xl p-5 space-y-4 w-full shadow-lg dark:shadow-indigo-500/10">
          <div className="text-[11px] text-slate-900 dark:text-indigo-100 font-bold leading-relaxed">
            I've built <span className="text-indigo-600 dark:text-indigo-400 font-black italic">"{name}"</span> for you. The preview is ready — check it out on the right!
          </div>
          <div className="h-[1px] bg-slate-100 dark:bg-white/5 w-full"></div>
          <div className="space-y-2">
            {statuses.map((s, i) => (
              <div key={i} className="flex items-center gap-2.5 text-[10px] text-slate-600 dark:text-indigo-200 font-bold animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <Check size={12} className="text-indigo-600 dark:text-indigo-400" />
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const chatSuggestions = [
  { label: 'Add dark mode', icon: Activity },
  { label: 'Improve UI', icon: Palette },
  { label: 'Add charts', icon: Activity },
  { label: 'Mobile fix', icon: Smartphone }
];

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ projectId }) => {
  const [project, setProject] = useState<Project | undefined>(undefined);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'preview' | 'brief' | 'prd' | 'architecture' | 'code' | 'terminal'>('preview');
  const [chatInput, setChatInput] = useState('');
  const [progress, setProgress] = useState(0);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const p = backend.getProject(projectId);
      setProject(p);
      setArtifacts(backend.getArtifacts(projectId));
      setLogs(backend.getLogs(projectId));
    };
    update();
    const unsubscribe = backend.subscribe(update);
    return unsubscribe;
  }, [projectId]);

  useEffect(() => {
    if (project?.status !== 'RUNNING') {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        let target = 0;
        switch(project.currentStage) {
          case 'pm': target = 33; break;
          case 'planner': target = 66; break;
          case 'engineer': target = 95; break;
          default: target = 100;
        }

        if (prev < target) return prev + 1;
        if (prev < 99) return prev + 0.1;
        return prev;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [project?.status, project?.currentStage]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  if (!project) return <div className="flex items-center justify-center h-full bg-background-light dark:bg-[#0b0e14] text-indigo-500 font-mono text-xs animate-pulse font-bold">INITIALIZING ENVIRONMENT...</div>;

  const prdArtifact = artifacts.find(a => a.type === 'PRD');
  const planArtifact = artifacts.find(a => a.type === 'PLAN');
  const codeArtifact = artifacts.find(a => a.type === 'CODE');
  const hasCode = !!codeArtifact;

  const getStatusText = () => {
    switch(project.currentStage) {
      case 'pm': return 'Analyzing requirements...';
      case 'planner': return 'Architecting solution...';
      case 'engineer': return 'Assembling preview...';
      default: return 'Initializing...';
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    backend.addLog(projectId, `User: ${chatInput}`, 'info');
    setChatInput('');
  };

  const filteredLogs = logs.filter(l => {
    if (l.type !== 'info') return false;
    const isInternalAgentLog = l.message.includes('Agent:') || l.message.includes('Analyzing requirements') || l.message.includes('Architecting') || l.message.includes('Writing code');
    return !isInternalAgentLog;
  });

  const getTechColor = (tech: string) => {
    const lower = tech.toLowerCase();
    if (lower.includes('frontend')) return 'text-blue-600 dark:text-blue-400';
    if (lower.includes('styling')) return 'text-pink-600 dark:text-pink-400';
    if (lower.includes('backend')) return 'text-emerald-600 dark:text-emerald-400';
    if (lower.includes('database')) return 'text-amber-600 dark:text-amber-400';
    if (lower.includes('state')) return 'text-violet-600 dark:text-violet-400';
    return 'text-indigo-600 dark:text-indigo-400';
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-[#0b0e14] relative transition-colors duration-300">
      <header className="h-14 border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-5 bg-white/80 dark:bg-[#080a0f]/80 backdrop-blur-xl z-30">
        <div className="flex items-center gap-3">
          <div className="text-[11px] font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span className="text-slate-400 dark:text-indigo-400/60 font-bold uppercase text-[9px] pt-0.5">Projects /</span>
            {project.name}
          </div>
          <div className={`px-2 py-0.5 rounded-lg text-[8px] uppercase tracking-widest font-black border ${
            project.status === 'RUNNING' ? 'border-indigo-500/40 text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 animate-pulse' : 'border-slate-200 dark:border-slate-800 text-slate-400'
          }`}>
            {project.status}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 p-1">
            {[
              { id: 'preview', icon: Monitor, label: 'Preview' },
              { id: 'brief', icon: BookOpen, label: 'Brief' },
              { id: 'prd', icon: ClipboardList, label: 'PRD' },
              { id: 'architecture', icon: Milestone, label: 'Plan' },
              { id: 'code', icon: Code2, label: 'Code' },
              { id: 'terminal', icon: Terminal, label: 'Logs' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20' 
                    : 'text-slate-500 dark:text-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-50 cursor-pointer'
                }`}
              >
                <tab.icon size={13} />
                <span className="hidden xl:inline">{tab.label}</span>
              </button>
            ))}
          </div>
          
          <div className="w-[1px] h-4 bg-slate-200 dark:bg-white/10 mx-1"></div>
          
          <button className="bg-gradient-to-br from-indigo-600 to-violet-600 hover:brightness-110 text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 cursor-pointer">
            Deploy
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-72 lg:w-[320px] border-r border-slate-200 dark:border-white/5 flex flex-col bg-slate-50 dark:bg-[#080a0f] relative z-20">
          <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
            <div className="bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-[11px] leading-relaxed text-slate-800 dark:text-indigo-50 font-bold shadow-sm">
              <div className="text-indigo-600 dark:text-indigo-400 font-black mb-2 uppercase tracking-widest flex items-center gap-1.5 text-[9px]">
                <Sparkles size={11} />
                PROMPT
              </div>
              {project.description}
            </div>

            <div className="space-y-4">
              {(project.status === 'RUNNING' || project.status === 'COMPLETED') && (
                <AgentStatusMessage project={project} name={project.name} />
              )}

              {filteredLogs.map(log => (
                <div key={log.id} className={`flex gap-3 ${log.message.startsWith('User:') ? 'flex-row-reverse' : ''}`}>
                  {!log.message.startsWith('User:') && (
                     <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shrink-0">
                       <Bot size={16} />
                     </div>
                  )}
                  <div className={`max-w-[90%] rounded-2xl p-4 text-[11px] leading-relaxed font-bold ${
                    log.message.startsWith('User:') 
                    ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white self-end shadow-md shadow-indigo-500/10' 
                    : 'bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 text-slate-800 dark:text-indigo-50 shadow-sm'
                  }`}>
                    {log.message.replace('User: ', '')}
                  </div>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-[#0a0d14] border-t border-slate-200 dark:border-white/5 space-y-3">
            <div className="flex gap-2 overflow-x-auto custom-scrollbar no-scrollbar pb-1">
              {chatSuggestions.map((s, idx) => (
                <button 
                  key={idx}
                  onClick={() => setChatInput(s.label)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 text-[9px] font-bold text-slate-600 dark:text-indigo-100/40 whitespace-nowrap hover:bg-indigo-50 dark:hover:bg-white/10 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all uppercase tracking-tighter cursor-pointer"
                >
                  <s.icon size={11} className="text-indigo-500/50" />
                  {s.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="relative">
              <textarea 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask for changes..."
                className="w-full bg-slate-50 dark:bg-[#121620] border border-slate-200 dark:border-white/10 rounded-2xl pl-4 pr-10 py-3 text-[11px] text-slate-900 dark:text-indigo-50 focus:outline-none focus:border-indigo-500/40 min-h-[48px] max-h-[120px] resize-none font-bold placeholder:text-slate-400 dark:placeholder:text-indigo-400/30 shadow-inner"
              />
              <button 
                type="submit"
                disabled={!chatInput.trim()}
                className="absolute right-3 bottom-3 p-1.5 text-indigo-500 hover:text-indigo-700 dark:hover:text-white transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden flex flex-col bg-slate-100 dark:bg-[#0b0e14]">
          {project.status === 'RUNNING' && (
            <div className="absolute inset-0 z-40 bg-slate-50 dark:bg-[#0b0e14] flex flex-col items-center justify-center animate-fade-in p-10 text-center">
              <div className="w-full max-w-[400px] flex flex-col items-center gap-10">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <div className="absolute inset-0 border-[2px] border-indigo-500/20 rounded-[2rem] rotate-45 animate-spin-slow shadow-[0_0_30px_rgba(99,102,241,0.05)]"></div>
                  <div className="absolute inset-2 border border-violet-500/10 rounded-[1.6rem] -rotate-45 animate-spin-slow duration-[8s] opacity-50"></div>
                  <div className="w-14 h-14 rounded-full border-[3px] border-indigo-500/10 border-t-indigo-500 animate-spin relative shadow-[0_0_25px_rgba(99,102,241,0.2)]"></div>
                </div>
                
                <div className="w-full space-y-6">
                  <div className="text-slate-800 dark:text-white font-black text-sm tracking-wide uppercase">
                    {getStatusText()}
                  </div>
                  
                  <div className="w-full h-2 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden shadow-inner border border-slate-300/50 dark:border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-[#a855f7] via-[#6366f1] via-[#3b82f6] to-[#2dd4bf] transition-all duration-300 ease-out shadow-[0_0_15px_rgba(45,212,191,0.1)]"
                      style={{ width: `${Math.floor(progress)}%` }}
                    ></div>
                  </div>
                  
                  <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400/50 uppercase tracking-[0.2em] font-black">
                    {Math.floor(progress)}%
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none"></div>
            </div>
          )}

          <div className={`flex-1 p-6 overflow-hidden transition-opacity duration-500 ${project.status === 'RUNNING' ? 'opacity-0' : 'opacity-100'}`}>
            {activeTab === 'preview' && (
              <div className="h-full animate-fade-in">
                <LivePreview code={codeArtifact?.content} />
              </div>
            )}

            {activeTab === 'brief' && (
              <div className="h-full overflow-y-auto custom-scrollbar animate-fade-in">
                <div className="max-w-4xl mx-auto py-6">
                  {prdArtifact ? (
                    <div className="space-y-12">
                      <div className="text-center space-y-3 mb-16">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{prdArtifact.content.title}</h2>
                        <div className="flex items-center justify-center gap-3 text-slate-400 dark:text-indigo-400/40 text-[9px] font-mono uppercase tracking-[0.2em]">
                          <span>Status: Finalized</span>
                          <span className="w-1 h-1 bg-slate-300 dark:bg-indigo-900 rounded-full"></span>
                          <span>Version: 1.0.0-Stable</span>
                        </div>
                      </div>

                      <section className="space-y-6">
                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-[0.2em] text-[9px]">
                          <BookOpen size={14} />
                          Overview
                        </div>
                        <div className="text-base text-slate-800 dark:text-indigo-50 leading-relaxed font-bold bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-indigo-500/5">
                          {prdArtifact.content.summary}
                        </div>
                      </section>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className="space-y-6">
                          <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 font-bold uppercase tracking-[0.2em] text-[9px]">
                            <Sparkles size={14} />
                            Key Components
                          </div>
                          <div className="space-y-2.5">
                            {prdArtifact.content.features.map((f: string, i: number) => (
                              <div key={i} className="flex gap-3.5 p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 group hover:border-indigo-500/20 transition-all cursor-default shadow-sm hover:shadow-md">
                                <div className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[9px] font-black shrink-0">
                                  {i + 1}
                                </div>
                                <span className="text-xs text-slate-800 dark:text-indigo-100 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors font-bold">{f}</span>
                              </div>
                            ))}
                          </div>
                        </section>

                        <section className="space-y-6">
                          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-[0.2em] text-[9px]">
                            <Layers size={14} />
                            Technology Map
                          </div>
                          <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-3xl p-6 divide-y divide-slate-100 dark:divide-white/5 shadow-sm">
                            {prdArtifact.content.techStackRecommendation.map((t: string, i: number) => (
                              <div key={i} className="py-3.5 first:pt-0 last:pb-0 text-[11px] flex items-center justify-between font-bold group">
                                <span className="text-slate-500 dark:text-indigo-200/40 uppercase tracking-tighter group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{t.split(':')[0]}</span>
                                <span className={`text-[10px] font-mono ${getTechColor(t.split(':')[0])} group-hover:brightness-125 transition-all`}>{t.split(':')[1]}</span>
                              </div>
                            ))}
                          </div>
                        </section>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-indigo-900 font-mono gap-3 uppercase tracking-[0.2em] text-[9px] min-h-[300px] font-bold">
                      <BookOpen size={24} className="opacity-20" />
                      GENERATING ARCHITECTURE BRIEF...
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'prd' && (
              <div className="h-full overflow-y-auto custom-scrollbar animate-fade-in pr-2">
                <div className="max-w-4xl mx-auto py-2">
                  {prdArtifact ? (
                    <ArtifactViewer artifact={prdArtifact} />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-indigo-900 font-mono gap-3 uppercase tracking-[0.2em] text-[9px] min-h-[300px] font-bold">
                      <ClipboardList size={24} className="opacity-20" />
                      AWAITING PRD SYNCHRONIZATION...
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'architecture' && (
              <div className="h-full overflow-y-auto custom-scrollbar animate-fade-in pr-2">
                <div className="max-w-4xl mx-auto py-2">
                  {planArtifact ? (
                    <ArtifactViewer artifact={planArtifact} />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-indigo-900 font-mono gap-3 uppercase tracking-[0.2em] text-[9px] min-h-[300px] font-bold">
                      <Milestone size={24} className="opacity-20" />
                      DESIGNING INFRASTRUCTURE ROADMAP...
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'code' && (
              <div className="h-full overflow-hidden bg-white dark:bg-[#080a0f] rounded-3xl border border-slate-200 dark:border-white/5 shadow-2xl animate-fade-in">
                {hasCode ? (
                  <ArtifactViewer artifact={codeArtifact} />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-indigo-900 font-mono gap-3 uppercase tracking-[0.2em] text-[9px] font-bold">
                     <Code2 size={24} className="opacity-20" />
                     SYNTHESIZING CODEBASE...
                  </div>
                )}
              </div>
            )}

            {activeTab === 'terminal' && (
              <div className="h-full overflow-hidden bg-slate-50 dark:bg-black rounded-3xl border border-slate-200 dark:border-white/5 shadow-2xl animate-fade-in flex flex-col font-mono text-[11px]">
                 <div className="p-3 bg-white dark:bg-[#111] border-b border-slate-200 dark:border-white/5 text-[9px] text-indigo-600 dark:text-indigo-800 uppercase tracking-widest font-black flex items-center gap-2">
                    <Terminal size={14} />
                    Runtime Environment Logs
                 </div>
                 <div className="flex-1 p-6 overflow-y-auto custom-scrollbar relative bg-white dark:bg-black">
                    <div className="absolute inset-0 scanlines opacity-5 dark:opacity-20 pointer-events-none"></div>
                    {logs.map(log => (
                      <div key={log.id} className="mb-2 flex gap-5 items-start">
                        <span className="text-slate-400 dark:text-slate-600 shrink-0 font-mono text-[10px] pt-0.5">{new Date(log.timestamp).toLocaleTimeString([], {hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit'})}</span>
                        <span className={`font-bold ${
                          log.type === 'error' ? 'text-red-600 dark:text-red-400' : 
                          log.type === 'success' ? 'text-emerald-600 dark:text-indigo-300' : 
                          log.type === 'system' ? 'text-indigo-600 dark:text-indigo-400 font-black' : 'text-slate-700 dark:text-slate-100'
                        }`}>{log.message}</span>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;