import React, { useState } from 'react';
import Modal from '../Modal';
import toast from 'react-hot-toast';

const BlockModal = ({ isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return toast.error("Provide a reason!");
    setIsSubmitting(true);
    onConfirm(reason);
    setIsSubmitting(false);
    setReason('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Provide a reason.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-slate-500 text-center">
          A reason is needed for the team to understand the block.
        </p>
        <textarea 
          className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-red-500 min-h-[100px]"
          placeholder="I don't know what to do..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 bg-slate-100 text-slate-600 p-3 rounded-xl font-bold"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="flex-1 bg-red-600 text-white p-3 rounded-xl font-bold hover:bg-red-700 transition"
          >
            Block Task
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BlockModal;