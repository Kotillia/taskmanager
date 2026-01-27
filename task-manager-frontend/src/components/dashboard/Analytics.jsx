import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { BarChart2, PieChart, AlertCircle, CheckCircle2, Clock, ListChecks } from 'lucide-react';

const Analytics = ({ projectId }) => {
  const [workload, setWorkload] = useState([]);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    if (projectId) fetchAnalytics();
  }, [projectId]);

  const fetchAnalytics = async () => {
    try {
      const [wRes, pRes] = await Promise.all([
        api.get(`/dashboard/${projectId}/workload`),
        api.get(`/dashboard/${projectId}/progress`)
      ]);
      setWorkload(wRes.data);
      setProgress(pRes.data);
    } catch (err) {
      console.error("Erroro", err);
    }
  };

  if (!progress) return <div className="p-10 text-center text-slate-400 font-medium">Loading analytics...</div>;

  return (
    <div className="animate-page-entry">
      

      <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <PieChart className="text-indigo-600" size={20} /> How we going so far
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {progress.stats.map(s => (
            <div key={s.status} className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{s.status}</p>
              <p className="text-2xl font-black text-slate-800">{s.count}</p>
              <p className="text-xs font-bold text-indigo-600">{s.percentage}%</p>
            </div>
          ))}
        </div>


        <div className="mt-8 h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
          {progress.stats.map(s => (
            <div 
              key={s.status}
              style={{ width: `${s.percentage}%` }}
              className={`h-full transition-all duration-500 ${
                s.status === 'DONE' ? 'bg-green-500' :
                s.status === 'BLOCKED' ? 'bg-red-500' :
                s.status === 'IN_PROGRESS' ? 'bg-indigo-500' : 'bg-slate-300'
              }`}
              title={`${s.status}: ${s.percentage}%`}
            />
          ))}
        </div>
        <div className="mt-4 flex justify-center gap-4 text-[10px] font-bold text-slate-400 uppercase">
             <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-500"/> In Progress</span>
             <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"/> Done</span>
             <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"/> Blocked</span>
        </div>
      </section>


      <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <BarChart2 className="text-indigo-600" size={20} /> Team load (Active tasks)
        </h3>
        
        <div className="space-y-6">
          {workload.map(person => (
            <div key={person.userId} className="space-y-2">
              <div className="flex justify-between items-end">
                <p className="font-bold text-sm text-slate-700">{person.username}</p>
                <p className={`text-xs font-black ${person.isOverloaded ? 'text-red-500' : 'text-slate-400'}`}>
                  {person.activeTasksCount} tasks {person.isOverloaded && "(kinda a lot)"}
                </p>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${Math.min(person.activeTasksCount * 10, 100)}%` }}
                  className={`h-full transition-all duration-500 ${
                    person.isOverloaded ? 'bg-red-500' : 'bg-indigo-600'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Analytics;