import React from 'react';
import { Project } from '../types';
import { Plus, Folder, LayoutGrid, Clock, Settings, Search, Zap, Moon, Sun } from 'lucide-react';

interface SidebarProps {
  projects: Project[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onNewProject: () => void;
  onOpenSettings: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  projects, 
  currentId, 
  onSelect, 
  onNewProject, 
  onOpenSettings,
  theme,
  onToggleTheme
}) => {
  return (
    <aside className="w-64 bg-surface-light dark:bg-[#080a0f] border-r border-slate-200 dark:border-white/5 flex flex-col z-50 transition-colors duration-300">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8 cursor-pointer group" onClick={onNewProject}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
            <Zap size={16} fill="currentColor" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">ai-dev-<span className="text-indigo-600 dark:text-indigo-400">team</span></span>
        </div>

        <button 
          onClick={onNewProject}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 transition-all text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-indigo-200/60 hover:text-indigo-600 dark:hover:text-white"
        >
          <span>New Project</span>
          <Plus size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-8 custom-scrollbar">
        <div>
          <h3 className="px-4 text-[10px] font-bold text-slate-400 dark:text-indigo-400/60 uppercase tracking-[0.2em] mb-4">Navigation</h3>
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-indigo-600/10 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-100 text-sm font-bold border border-indigo-500/20 shadow-lg shadow-indigo-500/5 transition-all">
              <LayoutGrid size={16} className="text-indigo-600 dark:text-indigo-400" />
              Dashboard
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-400 dark:text-indigo-200/50 hover:text-indigo-600 dark:hover:text-indigo-100 text-sm font-bold transition-colors">
              <Search size={16} />
              Browse
            </button>
          </nav>
        </div>

        <div>
          <h3 className="px-4 text-[10px] font-bold text-slate-400 dark:text-indigo-400/60 uppercase tracking-[0.2em] mb-4">Recent Projects</h3>
          <div className="space-y-1">
            {projects.slice(0, 10).map((project) => (
              <button
                key={project.id}
                onClick={() => onSelect(project.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all group relative overflow-hidden ${
                  currentId === project.id 
                  ? 'bg-slate-100 dark:bg-white/10 text-indigo-700 dark:text-indigo-100 border border-slate-200 dark:border-white/5 shadow-inner' 
                  : 'text-slate-400 dark:text-indigo-200/40 hover:text-indigo-600 dark:hover:text-indigo-100 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${
                  project.status === 'RUNNING' ? 'bg-indigo-500 animate-pulse' : 
                  project.status === 'COMPLETED' ? 'bg-indigo-500 dark:bg-indigo-400' : 'bg-slate-300 dark:bg-indigo-900/50'
                }`} />
                <span className="truncate flex-1 text-left font-bold">{project.name}</span>
                {currentId === project.id && (
                  <div className="absolute left-0 w-[2px] h-4 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-white/5 space-y-2">
        <button 
          onClick={onToggleTheme}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-400 dark:text-indigo-200/50 hover:text-indigo-600 dark:hover:text-indigo-100 text-sm transition-all font-bold group"
        >
          {theme === 'dark' ? <Sun size={16} className="group-hover:rotate-45 transition-transform" /> : <Moon size={16} className="group-hover:-rotate-12 transition-transform" />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button 
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-400 dark:text-indigo-200/50 hover:text-indigo-600 dark:hover:text-indigo-100 text-sm transition-colors font-bold group"
        >
          <Settings size={16} className="group-hover:rotate-90 transition-transform" />
          Settings
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;