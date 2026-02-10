import React, { useEffect, useState, useRef } from 'react';
import { backend } from '../services/orchestrator';
import { Project, Artifact, LogEntry } from '../types';
import ArtifactViewer from '../components/ArtifactViewer';
import LivePreview from '../components/LivePreview';
import { 
  Play, RefreshCw, Terminal, Download, Monitor, Code2, Send, 
  Sparkles, Activity, FileText, Layout, Share2, MoreHorizontal,
  ClipboardList, Milestone, BookOpen, Layers, Check, Bot, Globe, Smartphone, Palette, AlertTriangle, Bug, Wrench, Loader2
} from 'lucide-react';

interface ProjectDetailPageProps {
  projectId: string;
  onBack: () => void;
}

const FaultMonitor: React.FC<{ logs: LogEntry[]; projectId: string; onDismiss: () => void }> = ({ logs, projectId, onDismiss }) => {
  const [fixingIds, setFixingIds] = useState<Set<string>>(new Set());
  const errors = logs.filter(l => l.type === 'error');
  
  if (errors.length === 0) return null;

  const handleFix = async (logId: string) => {
    setFixingIds(prev => new Set(prev).add(logId));
    await backend.fixError(projectId, logId);
    setFixingIds(prev => {
      const next = new Set(prev);
      next.delete(logId);
      return next;
    });
  };

  return (
    <div className="mb-6 p-5 bg-red-500/10 border border-red-500/30 rounded-2xl animate-fade-in relative overflow-hidden group/monitor">
      <div className="absolute top-0 right-0 p-2 z-50">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className="text-red-500/40 hover:text-red-500 transition-all cursor-pointer p-2 rounded-xl hover:bg-red-500/10 active:scale-90"
          title="Dismiss All Faults"
        >
          <X size={18} />
        </button>
      </div>
      <div className="flex items-center gap-2 mb-5 text-red-500 text-[10px] font-black uppercase tracking-[0.2em]">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
        Critical Fault Monitor
      </div>
      <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar pr-2">
        {errors.map(err => {
          const isFixing = fixingIds.has(err.id);
          return (
            <div key={err.id} className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-2xl p-4 group hover:bg-red-500/[0.03] transition-all">
              <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                <AlertTriangle size={14} />
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="text-[9px] font-mono text-red-500/50 uppercase tracking-widest font-bold">
                  {new Date(err.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
                <div className="text-[11px] font-bold text-slate-800 dark:text-red-200 leading-relaxed">
                  {err.message}
                </div>
              </div>

              <button 
                onClick={() => handleFix(err.id)}
                disabled={isFixing}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
                  isFixing 
                  ? 'bg-slate-500/20 text-slate-400 cursor-not-allowed' 
                  : 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/20 cursor-pointer active:scale-95'
                }`}
              >
                {isFixing ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Wrench size={12} />
                )}
                {isFixing ? 'Fixing...' : 'Fix Now'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const X = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

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

const ChatMessage: React.FC<{ log: LogEntry }> = ({ log }) => {
  const isUser = log.message.startsWith('User:');
  const isSuccess = log.type === 'success';
  const cleanMessage = log.message.replace('User: ', '');

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 transition-all duration-500 ${
          isSuccess 
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
          : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500'
        }`}>
          {isSuccess ? <Check size={14} className="animate-fade-in" /> : <Bot size={16} />}
        </div>
      )}
      <div className={`max-w-[90%] rounded-2xl p-4 text-[11px] leading-relaxed font-bold shadow-sm transition-all duration-500 ${
        isUser 
        ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white self-end shadow-md shadow-indigo-500/10' 
        : isSuccess
        ? 'bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 animate-fade-in-up'
        : 'bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 text-slate-800 dark:text-indigo-50'
      }`}>
        {cleanMessage}
        {isSuccess && <Check size={10} className="inline-block ml-1.5 mb-0.5 text-emerald-500" />}
      </div>
    </div>
  );
};

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
    if (logsEndRef.current) {
        logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  if (!project) return <div className="flex items-center justify-center h-full bg-background-light dark:bg-[#0b0e14] text-indigo-500 font-mono text-xs animate-pulse font-bold">INITIALIZING ENVIRONMENT...</div>;

  const prdArtifact = artifacts.find(a => a.type === 'PRD');
  const planArtifact = artifacts.find(a => a.type === 'PLAN');
  const codeArtifact = artifacts.find(a => a.type === 'CODE');
  const hasCode = !!codeArtifact;
  const errorCount = logs.filter(l => l.type === 'error').length;

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
    if (l.type === 'info' || l.type === 'success') {
      const isInternalNoisy = (l.message.includes('Analyzing requirements') || 
                               l.message.includes('Architecting') || 
                               l.message.includes('Writing code') ||
                               l.message.includes('Starting execution pipeline')) && !l.message.includes('User:');
      
      if (l.message.includes('Agent patching:') || l.message.includes('Recovery Successful:')) return true;
      
      return !isInternalNoisy;
    }
    return false;
  });

  const completionLog = logs.find(l => l.message === "Workflow completed successfully.");
  const completionTime = completionLog ? completionLog.timestamp : Infinity;

  const buildLogs = filteredLogs.filter(l => l.timestamp <= completionTime);
  const followUpLogs = filteredLogs.filter(l => l.timestamp > completionTime);

  const handleInjectError = () => {
    backend.injectSimulatedError(projectId);
  };

  const handleDismissFaults = () => {
    backend.clearErrors(projectId);
  };

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
              { id: 'terminal', icon: Terminal, label: 'Logs', badge: errorCount }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20' 
                    : 'text-slate-500 dark:text-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-50 cursor-pointer'
                } ${tab.id === 'terminal' && errorCount > 0 ? 'shadow-[0_0_15px_rgba(239,68,68,0.2)]' : ''}`}
              >
                <tab.icon size={13} />
                <span className="hidden xl:inline">{tab.label}</span>
                {tab.id === 'terminal' && errorCount > 0 && (
                  <span className="absolute -top-1.5 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] flex items-center justify-center font-black animate-pulse border-2 border-white dark:border-[#080a0f]">
                    {errorCount}
                  </span>
                )}
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
              {buildLogs.map(log => (
                <ChatMessage key={log.id} log={log} />
              ))}

              {(project.status === 'RUNNING' || project.status === 'COMPLETED') && (
                <AgentStatusMessage project={project} name={project.name} />
              )}

              {followUpLogs.map(log => (
                <ChatMessage key={log.id} log={log} />
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

            <form onSubmit={handleSendChat} className="relative group/form">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 rounded-[1.25rem] opacity-0 group-focus-within/form:opacity-100 blur transition-opacity duration-700 pointer-events-none"></div>
              <textarea 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask for changes..."
                className="w-full bg-slate-50 dark:bg-[#121620] border border-slate-200 dark:border-white/10 rounded-2xl pl-4 pr-12 py-3.5 text-[11px] text-slate-900 dark:text-indigo-50 focus:outline-none focus:border-indigo-500/40 focus:ring-4 focus:ring-indigo-500/5 focus:bg-white dark:focus:bg-[#1a1f2e] min-h-[48px] max-h-[160px] resize-none font-bold placeholder:text-slate-400 dark:placeholder:text-indigo-400/30 shadow-inner transition-all overflow-y-auto custom-scrollbar relative z-10"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendChat(e);
                  }
                }}
              />
              <button 
                type="submit"
                disabled={!chatInput.trim()}
                className="absolute right-3.5 bottom-3.5 p-1.5 text-indigo-500 hover:text-indigo-700 dark:hover:text-white transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 z-20 hover:scale-110 active:scale-90"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden flex flex-col bg-slate-100 dark:bg-[#0b0e14]">
          {project.status === 'RUNNING' && (
            <div className="absolute inset-0 z-40 bg-slate-50 dark:bg-[#0b0e14] flex flex-col items-center justify-center animate-fade-in p-10 text-center">
              <div className="w-full max-w-4xl flex flex-col items-center gap-8">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <div className="absolute inset-0 border-[2px] border-indigo-500/20 rounded-[2rem] rotate-45 animate-spin-slow shadow-[0_0_30px_rgba(99,102,241,0.05)]"></div>
                  <div className="absolute inset-2 border border-violet-500/10 rounded-[1.6rem] -rotate-45 animate-spin-slow duration-[8s] opacity-50"></div>
                  <div className="w-12 h-12 rounded-full border-[3px] border-indigo-500/10 border-t-indigo-500 animate-spin relative shadow-[0_0_25px_rgba(99,102,241,0.2)]"></div>
                </div>
                
                <div className="w-full max-w-md space-y-6">
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
                <LivePreview code={codeArtifact?.content} projectName={project.name} />
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
              <div className="h-full overflow-auto custom-scrollbar animate-fade-in pr-2">
                <div className="max-w-5xl mx-auto py-2">
                  {hasCode ? (
                    <ArtifactViewer artifact={codeArtifact} />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-indigo-900 font-mono gap-3 uppercase tracking-[0.2em] text-[9px] min-h-[300px] font-bold">
                       <Code2 size={24} className="opacity-20" />
                       SYNTHESIZING CODEBASE...
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'terminal' && (
              <div className="h-full overflow-hidden bg-slate-50 dark:bg-black rounded-3xl border border-slate-200 dark:border-white/5 shadow-2xl animate-fade-in flex flex-col font-mono text-[11px]">
                 <div className="p-3 bg-white dark:bg-[#111] border-b border-slate-200 dark:border-white/5 text-[9px] text-indigo-600 dark:text-indigo-800 uppercase tracking-widest font-black flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal size={14} />
                      Runtime Environment Logs
                    </div>
                    <div className="flex items-center gap-4">
                      {errorCount > 0 && (
                        <div className="flex items-center gap-2 text-red-500 animate-pulse">
                          <AlertTriangle size={12} />
                          <span>{errorCount} FAULT(S) DETECTED</span>
                        </div>
                      )}
                      <button 
                        onClick={handleInjectError}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all cursor-pointer group active:scale-95 ${
                          errorCount > 0 
                          ? 'bg-red-500 text-white border-red-400 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.6)] hover:brightness-110' 
                          : 'bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/20'
                        }`}
                      >
                        {errorCount > 0 ? (
                          <AlertTriangle size={12} className="animate-bounce" />
                        ) : (
                          <Bug size={12} className="group-hover:rotate-12 transition-transform" />
                        )}
                        Simulate Fault
                      </button>
                    </div>
                 </div>
                 <div className="flex-1 p-6 overflow-y-auto custom-scrollbar relative bg-white dark:bg-black">
                    <div className="absolute inset-0 scanlines opacity-5 dark:opacity-20 pointer-events-none"></div>
                    <FaultMonitor logs={logs} projectId={projectId} onDismiss={handleDismissFaults} />
                    <div className="space-y-2">
                      {logs.map(log => (
                        <div key={log.id} className="mb-2 flex gap-5 items-start">
                          <span className="text-slate-400 dark:text-slate-600 shrink-0 font-mono text-[10px] pt-0.5">{new Date(log.timestamp).toLocaleTimeString([], {hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit'})}</span>
                          <span className={`font-bold ${
                            log.type === 'error' ? 'text-red-600 dark:text-red-400' : 
                            log.type === 'success' ? 'text-emerald-600 dark:text-emerald-400 font-black' : 
                            log.type === 'system' ? 'text-indigo-600 dark:text-indigo-400 font-black' : 'text-slate-700 dark:text-slate-100'
                          }`}>{log.message}</span>
                        </div>
                      ))}
                    </div>
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