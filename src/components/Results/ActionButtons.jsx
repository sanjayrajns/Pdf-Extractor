import React from "react";
import { Upload, Printer } from "lucide-react";

const ActionButtons = ({ onUploadNew, onPrint, isDarkMode }) => {
  return (
    <div className="flex flex-wrap gap-3 mb-6 print:hidden">
      <button
        onClick={onUploadNew}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] ${isDarkMode ? 'bg-gray-900 hover:bg-gray-800 text-white border border-gray-800 shadow-md' : 'bg-white hover:bg-gray-50 text-gray-900 shadow-lg border border-gray-200'}`}
      >
        <Upload className="w-4 h-4" />
        Upload New Report
      </button>
      <button
        onClick={onPrint}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] ${isDarkMode ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md' : 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg'}`}
      >
        <Printer className="w-4 h-4" />
        Print/Export PDF
      </button>
    </div>
  );
};

export default ActionButtons;