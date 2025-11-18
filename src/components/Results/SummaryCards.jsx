import React from "react";
import { FileText, Layers } from "lucide-react";

const SummaryCards = ({ totalEntries, totalSections, isDarkMode }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 print:hidden">
      <div className={`rounded-xl p-6 transition-colors duration-500 ${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white shadow-lg'}`}>
        <div className="flex items-center gap-4">
          <div className="bg-cyan-500 p-4 rounded-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Entries</p>
            <p className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{totalEntries}</p>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Extracted test results</p>
          </div>
        </div>
      </div>

      <div className={`rounded-xl p-6 transition-colors duration-500 ${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white shadow-lg'}`}>
        <div className="flex items-center gap-4">
          <div className="bg-cyan-500 p-4 rounded-lg">
            <Layers className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sections Found</p>
            <p className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{totalSections}</p>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Data categories (e.g., Lipid, CBC)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;