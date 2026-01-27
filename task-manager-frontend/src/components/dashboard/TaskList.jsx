import React, { useState } from 'react';
import { AlertCircle, Trash2, Edit3, Search, ChevronRight } from 'lucide-react';
import Spinner from '../Spinner';

const TaskList = ({ tasks, onStatusChange, projectMembers, onAssignUsers, onDeleteTask, onEditTask, role }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-600 border-red-200';
      case 'MEDIUM': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'LOW': return 'bg-blue-100 text-blue-600 border-blue-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'DONE': return 'bg-green-500';
      case 'BLOCKED': return 'bg-red-500';
      case 'IN_PROGRESS': return 'bg-blue-500';
      default: return 'bg-slate-300';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search tasks..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="bg-white border border-slate-200 rounded-2xl text-sm px-6 py-3 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-600 shadow-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="BLOCKED">Blocked</option>
            <option value="DONE">Done</option>
          </select>
      </div>

      
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-50">
          {filteredTasks.map(task => (
            <div key={task.id} className="p-6 hover:bg-slate-50/50 flex items-center justify-between group transition-all">
              <div className="flex items-start gap-5 flex-1 min-w-0">
                <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 shadow-sm ${getStatusStyle(task.status)}`} />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-bold text-slate-800 truncate text-lg">{task.title}</p>
                    
                    
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-wider ${getPriorityStyle(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>

                  
                  {task.description && (
                    <p className="text-sm text-slate-400 line-clamp-1 mb-3">{task.description}</p>
                  )}
                  
                  
                  <div className="flex flex-wrap items-center gap-2">
                    {task.assignees?.map(user => (
                      <span key={user.id} className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg text-[10px] font-bold border border-indigo-100">
                        {user.username}
                        {role !== 'WORKER' && (
                          <button onClick={() => onAssignUsers(task.id, task.assignees.filter(a => a.id !== user.id).map(a => a.id))} className="ml-1 hover:text-red-500">×</button>
                        )}
                      </span>
                    ))}
                    {role !== 'WORKER' && (
                    <select 
                      className="text-[10px] text-slate-300 font-bold hover:text-indigo-600 outline-none cursor-pointer bg-transparent"
                      onChange={(e) => onAssignUsers(task.id, [...task.assignees.map(a => a.id), parseInt(e.target.value)])}
                      value=""
                    >
                      <option value="" disabled>+ ASSIGN</option>
                      {projectMembers.map(m => <option key={m.user.id} value={m.user.id}>{m.user.username}</option>)}
                    </select>
                    )}
                  </div>
                  
                  {task.status === 'BLOCKED' && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-xs font-bold animate-pulse">
                      <AlertCircle size={14} /> {task.blockReason}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-6 ml-4">
                {role !== 'WORKER' && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEditTask(task)} className="...">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => onDeleteTask(task.id)} className="...">
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}

                <select 
                  value={task.status} 
                  onChange={(e) => onStatusChange(task.id, e.target.value)}
                  className="text-xs font-bold border-slate-200 rounded-xl p-2 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-500 bg-slate-50 cursor-pointer"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="BLOCKED">Blocked</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
            </div>
          ))}
          {filteredTasks.length === 0 && (
            <div className="p-20 text-center text-slate-400 font-medium">No tasks found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskList;