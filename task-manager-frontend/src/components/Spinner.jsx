import React from 'react';

const Spinner = () => (
  <div className="flex flex-col items-center justify-center p-10">
    <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    <p className="mt-4 text-slate-400 text-sm font-medium">Loading</p>
  </div>
);

export default Spinner;