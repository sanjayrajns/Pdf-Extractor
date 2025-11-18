import React from "react";
import { FileText, Sun, Moon } from "lucide-react";

const Header = ({ isDarkMode, setIsDarkMode }) => {
  return (
    <div className={`py-6 px-8 shadow-lg transition-colors duration-500 print:hidden ${isDarkMode ? 'bg-gradient-to-r from-gray-900 via-black to-gray-900' : 'bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Medical Report Summarizer</h1>
            <p className="text-sm text-cyan-50">Extract, edit, and print structured data from any lab report</p>
          </div>
        </div>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-white" />
          ) : (
            <Moon className="w-5 h-5 text-white" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Header;