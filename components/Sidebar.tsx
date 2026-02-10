
import React, { useState } from 'react';
import { Project } from '../types';
import { Plus, Folder, LayoutGrid, Clock, Settings, Search, Zap, Moon, Sun, Trash2, X, AlertCircle, Check } from 'lucide-react';

interface SidebarProps {
  projects: Project[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onNewProject: () => void;
  onOpenSettings: () => void;
  onDeleteProject: (id: string) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  projects, 
  currentId, 
  onSelect, 
  onNewProject, 
  onOpenSettings,
  onDeleteProject,
  theme,
  onToggleTheme
}) => {
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeletingProjectId(id);
    setDeleteConfirmation('');
  };

  const confirmDelete = () => {
    if (deleteConfirmation === 'DELETE' && deletingProjectId) {
      onDeleteProject(deletingProjectId);
      setDeletingProjectId(null);
    }
  };

  const cancelDelete = () => {
    setDeletingProjectId(null);
    setDeleteConfirmation('');
  };

  const deletingProject = projects.find(p => p.id === deletingProjectId);

  return (
    <aside className="w-64 bg-surface-light dark:bg-[#080a0f] border-r border-slate-200 dark:border-white/5 flex flex-col z-50 transition-colors duration-300 relative">
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
            {projects.slice(0, 20).map((project) => (
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
                
                {/* Delete Button - Only shown on hover */}
                <div 
                  onClick={(e) => handleDeleteClick(e, project.id)}
                  className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-10"
                >
                  <Trash2 size={14} />
                </div>

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

      {/* Delete Confirmation Modal */}
      {deletingProjectId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#0d1017] border border-slate-200 dark:border-white/10 w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl p-8 space-y-6 animate-fade-in-up">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                <AlertCircle size={32} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Confirm Deletion</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-2 leading-relaxed">
                  You are about to permanently erase <span className="text-red-500 font-black">"{deletingProject?.name}"</span>. 
                  This action is irreversible and all artifacts will be lost.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-indigo-400/60 uppercase tracking-widest text-center block w-full">
                  Type <span className="text-slate-900 dark:text-white font-black">DELETE</span> to confirm
                </label>
                <input 
                  type="text" 
                  autoFocus
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="Type here..."
                  className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-center text-sm text-slate-900 dark:text-white focus:outline-none focus:border-red-500 transition-colors font-black tracking-widest uppercase placeholder:normal-case placeholder:font-bold placeholder:text-slate-300 dark:placeholder:text-slate-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={cancelDelete}
                  className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  disabled={deleteConfirmation !== 'DELETE'}
                  className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer ${
                    deleteConfirmation === 'DELETE' 
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20 active:scale-95' 
                    : 'bg-slate-200 dark:bg-white/5 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
