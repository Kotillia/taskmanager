import React from 'react';
import { Layout, Plus, LogOut } from 'lucide-react';

const Sidebar = ({ projects, selectedProject, onSelectProject, onOpenProjectModal, user, onLogout }) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-slate-100 flex items-center gap-2 font-bold text-indigo-600 text-xl">
        <Layout size={24} /> TaskMaster
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">Your Projects</p>
        
        {projects.map((project) => (
          <button 
            key={project.id}
            onClick={() => onSelectProject(project)}
            className={`w-full text-left p-2 rounded-lg transition text-sm flex items-center gap-2 ${
              selectedProject?.id === project.id 
                ? 'bg-indigo-50 text-indigo-700 font-bold' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="opacity-50">#</span> {project.name}
          </button>
        ))}

        <button 
          onClick={onOpenProjectModal}
          className="w-full flex items-center gap-2 p-2 mt-4 text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition text-sm"
        >
          <Plus size={18} /> New Project
        </button>
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-slate-700 truncate">{user?.username}</span>
        </div>
        <button onClick={onLogout} className="w-full flex items-center gap-2 p-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition">
          <LogOut size={16} /> Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;