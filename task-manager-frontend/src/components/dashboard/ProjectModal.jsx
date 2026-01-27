import React, { useState } from 'react';
import Modal from '../Modal';

const ProjectModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onCreate(name);
    setIsSubmitting(false);
    setName('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a new project.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Name your project..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-indigo-700 transition">
          Create Project
        </button>
      </form>
    </Modal>
  );
};

export default ProjectModal;