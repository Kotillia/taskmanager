import React, { useState, useEffect } from 'react';
import Modal from '../Modal';

const EditTaskModal = ({ isOpen, onClose, onUpdate, task }) => {
  const [formData, setFormData] = useState({ title: '', description: '', priority: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'MEDIUM'
      });
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onUpdate(task.id, formData);
    setIsSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit your task.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Title</label>
          <input 
            type="text" 
            className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Description</label>
          <textarea 
            className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Priority</label>
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
        <div className="flex gap-2 pt-2">
          <button type="button" onClick={onClose} className="flex-1 p-3 rounded-xl bg-slate-100 font-bold text-slate-600">Cancel</button>
          <button type="submit" className="flex-1 p-3 rounded-xl bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-200">Submit</button>
        </div>
      </form>
    </Modal>
  );
};

export default EditTaskModal;