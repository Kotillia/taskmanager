import React, { useState } from 'react';
import Modal from '../Modal';

const TaskModal = ({ isOpen, onClose, onCreate, selectedProject }) => {
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'MEDIUM' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onCreate(formData);
    setIsSubmitting(false);
    setFormData({ title: '', description: '', priority: 'MEDIUM' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`New task for: ${selectedProject?.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Title</label>
          <input 
            className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>




        <div>
          <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Description</label>
          <textarea 
            className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] resize-none"
            placeholder="Add some details..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>


        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Priority</label>
          <select 
            className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.priority}
            onChange={(e) => setFormData({...formData, priority: e.target.value})}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        <button className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
          Create a task
        </button>
      </form>
    </Modal>
  );
};

export default TaskModal;