import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Layout, Plus, CheckCircle, Clock, AlertCircle, Users } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/tasks'); 
      } catch (err) {
        console.error("Something went wrong...");
      }
    };
    fetchProjects();
  }, []);


  const fetchProjectData = async (projectId) => {
    try {
      const tasksRes = await api.get(`/tasks?projectId=${projectId}`);
      const statsRes = await api.get(`/dashboard/${projectId}/progress`);
      setTasks(tasksRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Something went wrong..");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar - Pasek boczny */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2 font-bold text-indigo-600 text-xl">
          <Layout size={24} /> TaskMaster
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">Twoje Projekty</p>
          
          <button className="w-full flex items-center gap-2 p-2 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition">
            <Plus size={18} /> New project
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="text-sm font-medium text-slate-700">{user?.username}</span>
          </div>
          <button onClick={logout} className="w-full text-left p-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition">
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content - Główna sekcja */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Main view</h1>
            <p className="text-slate-500">Welcome back! What's new with your projects?</p>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
            <Plus size={20} /> New Task
          </button>
        </header>

        {/* Stats Grid (UC 11) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="TOTAL" count={stats?.totalTasks || 0} icon={<Layout className="text-blue-500" />} />
          <StatCard title="TO DO" count={tasks.filter(t => t.status === 'TODO').length} icon={<Clock className="text-slate-500" />} />
          <StatCard title="DONE" count={tasks.filter(t => t.status === 'DONE').length} icon={<CheckCircle className="text-green-500" />} />
          <StatCard title="BLOCKED" count={tasks.filter(t => t.status === 'BLOCKED').length} icon={<AlertCircle className="text-red-500" />} />
        </div>

        {/* Task List (UC 9) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Task list</h3>
            <button className="text-sm text-indigo-600 font-semibold">Show me everything</button>
          </div>
          <div className="divide-y divide-slate-50">
            {tasks.length > 0 ? tasks.map(task => (
              <div key={task.id} className="p-4 hover:bg-slate-50 flex items-center justify-between transition">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`} />
                  <div>
                    <p className="font-medium text-slate-700">{task.title}</p>
                    <p className="text-xs text-slate-400">{task.description || 'Brak opisu'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 text-xs font-bold rounded ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            )) : (
              <div className="p-12 text-center text-slate-400">
                No tasks to show. Choose a project or add one.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};


const StatCard = ({ title, count, icon }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      <span className="text-2xl font-bold text-slate-800">{count}</span>
    </div>
    <p className="text-sm text-slate-500 font-medium">{title}</p>
  </div>
);

const getStatusColor = (status) => {
  switch(status) {
    case 'DONE': return 'bg-green-500';
    case 'BLOCKED': return 'bg-red-500';
    case 'IN_PROGRESS': return 'bg-blue-500';
    default: return 'bg-slate-300';
  }
};

const getPriorityColor = (priority) => {
  switch(priority) {
    case 'HIGH': return 'bg-red-50 text-red-600';
    case 'MEDIUM': return 'bg-orange-50 text-orange-600';
    default: return 'bg-blue-50 text-blue-600';
  }
};

export default Dashboard;