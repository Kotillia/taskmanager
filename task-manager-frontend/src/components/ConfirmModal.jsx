import React from 'react';
import Modal from '../components/Modal';
import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-4 bg-red-50 text-red-500 rounded-full">
          <AlertTriangle size={32} />
        </div>
        <p className="text-slate-600 font-medium">{message}</p>
        
        <div className="flex gap-3 w-full pt-4">
          <button 
            onClick={onClose}
            className="flex-1 p-4 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 p-4 rounded-2xl text-white font-bold transition shadow-lg ${
              isLoading ? 'bg-slate-400' : 'bg-red-500 hover:bg-red-600 shadow-red-100'
            }`}
          >
            {isLoading ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;